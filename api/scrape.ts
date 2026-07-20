import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptionsWithName } from '@supabase/ssr';

function createSupabaseServerClient(supabaseUrl: string, anonKey: string, cookies: { name: string; value: string }[]) {
  return createServerClient(supabaseUrl, anonKey, {
    cookies: {
      get(name: string) {
        const cookie = cookies.find(c => c.name === name);
        return cookie?.value;
      },
      set(_name: string, _value: string, _options: CookieOptionsWithName) {},
      remove(_name: string, _options: CookieOptionsWithName) {},
    },
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { targetUrl, supabaseUrl, supabaseAnonKey, supabaseEmail, supabasePassword, middlewareUser, middlewarePass } = req.body;

  if (!targetUrl) {
    return res.status(400).json({ error: 'targetUrl is required' });
  }

  // Step 1: Try middleware Basic Auth first
  if (middlewareUser && middlewarePass) {
    try {
      const authHeader = 'Basic ' + Buffer.from(`${middlewareUser}:${middlewarePass}`).toString('base64');
      const response = await fetch(targetUrl, {
        headers: { Authorization: authHeader },
        redirect: 'follow',
      });
      if (response.ok) {
        const html = await response.text();
        return res.status(200).json({ html, authMethod: 'middleware-basic' });
      }
    } catch {}
  }

  // Step 2: Try Supabase Auth
  if (supabaseUrl && supabaseAnonKey && supabaseEmail && supabasePassword) {
    try {
      // Login to Supabase Auth
      const authResp = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: supabaseAnonKey },
        body: JSON.stringify({ email: supabaseEmail, password: supabasePassword }),
      });

      if (authResp.ok) {
        const session = await authResp.json();
        const accessToken = session.access_token;
        const refreshToken = session.refresh_token;

        // Create the cookie in @supabase/ssr format
        const cookieData = JSON.stringify({
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_in: session.expires_in,
          expires_at: session.expires_at,
          token_type: session.token_type || 'bearer',
        });
        const cookieB64 = Buffer.from(cookieData).toString('base64');
        const cookieName = `sb-${new URL(supabaseUrl).hostname.split('.')[0]}-auth-token`;

        // Fetch the target page with the cookie
        const response = await fetch(targetUrl, {
          headers: { Cookie: `${cookieName}=${cookieB64}` },
          redirect: 'follow',
        });

        const html = await response.text();

        // Check if we got past the auth wall (not redirected to /auth)
        if (!html.includes('/auth?redirect=') && response.ok) {
          return res.status(200).json({ html, authMethod: 'supabase-cookie' });
        }

        // If cookie didn't work, try Bearer token
        const response2 = await fetch(targetUrl, {
          headers: { Authorization: `Bearer ${accessToken}` },
          redirect: 'follow',
        });

        const html2 = await response2.text();
        if (!html2.includes('/auth?redirect=') && response2.ok) {
          return res.status(200).json({ html: html2, authMethod: 'supabase-bearer' });
        }

        // Try the Supabase SSR approach: use the session to create an authenticated client
        // and fetch the page through Supabase's edge functions or API
        const supabaseClient = createClient(supabaseUrl, anonKey, {
          global: {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        });

        // Try fetching through the Supabase client
        const { data, error } = await supabaseClient.rpc('ping' as any).maybeSingle();
        if (!error) {
          // If we can reach Supabase, try fetching the page with the session
          const response3 = await fetch(targetUrl, {
            headers: {
              Cookie: `${cookieName}=${cookieB64}; sb-access-token=${accessToken}; sb-refresh-token=${refreshToken}`,
            },
            redirect: 'follow',
          });
          const html3 = await response3.text();
          if (!html3.includes('/auth?redirect=') && response3.ok) {
            return res.status(200).json({ html: html3, authMethod: 'supabase-ssr-cookies' });
          }
        }

        // All Supabase methods failed - return metadata fallback
        return res.status(200).json({
          html: '',
          authMethod: 'supabase-failed',
          message: 'Supabase auth succeeded but could not bypass middleware. MFA may be required.',
        });
      }
    } catch {}
  }

  // Step 3: No auth worked - return empty
  return res.status(200).json({ html: '', authMethod: 'none', message: 'No auth method succeeded' });
}
