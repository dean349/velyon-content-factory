// devtoolbar-bridge.mjs
// Dev-only local HTTP bridge: receives UI Change Requests from the DevToolbar,
// saves git checkpoints before every AI edit, and auto-injects into Antigravity IDE.
// Run alongside Vite: npm run dev:bridge
// ─────────────────────────────────────────────────────────────────────────────

import http             from 'node:http';
import { writeFile, readFile } from 'node:fs/promises';
import { exec, execSync }      from 'node:child_process';
import path             from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT             = 7331;
const ORIGIN           = '*';
// IMPORTANT: these MUST live OUTSIDE the project root. The Vite dev server
// watches the entire project root, and writing files here on every click
// (via /inject) triggers a full-page reload — wiping all React state and
// making the devtoolbar look like it "closes" after every Send/Ask.
const BRIDGE_DATA_DIR  = path.join(process.env.PROGRAMDATA || 'C:\\ProgramData', 'AntigravityBridge', 'data');
const TMP_FILE         = path.join(BRIDGE_DATA_DIR, '.devtoolbar_tmp.txt');
const PS_SCRIPT        = path.join(__dirname, 'inject-interactive.ps1');
const CHECKPOINTS_FILE = path.join(BRIDGE_DATA_DIR, '.devtoolbar-checkpoints.json');
const PROJECT_ROOT     = __dirname; // bridge lives at project root; cwd fallback below

try { const { mkdirSync } = await import('node:fs'); mkdirSync(BRIDGE_DATA_DIR, { recursive: true }); } catch {}
const MAX_CHECKPOINTS  = 20;

// ─── Component extraction (no external dependencies) ─────────────────────────
// Scans the source file backwards from targetLine to find the nearest React
// component / function definition, then uses brace-depth tracking to find its
// closing brace. Returns the extracted code + line range.

function extractComponent(source, targetLine) {
  const lines = source.split('\n');
  const total = lines.length;
  const target0 = Math.max(0, Math.min(targetLine - 1, total - 1)); // 0-indexed

  // Patterns that mark the START of a React component or function
  const starters = [
    /^\s*(export\s+)?(default\s+)?function\s+[A-Z]/,           // function ComponentName
    /^\s*(export\s+)?(default\s+)?function\s+\w+\s*\(/,        // any exported function
    /^\s*(export\s+)?const\s+[A-Z]\w*\s*(:\s*[\w.<>|&, ]+)?\s*=/, // const Component =
    /^\s*(export\s+)?const\s+[a-z]\w*\s*=\s*(\([^)]*\)|\w+)\s*=>/, // const fn = () =>
    /^\s*export\s+default\s+function/,                          // export default function
  ];

  // Walk backwards from targetLine to find the function start
  let startIdx = -1;
  for (let i = target0; i >= 0; i--) {
    if (starters.some(p => p.test(lines[i]))) { startIdx = i; break; }
  }

  if (startIdx === -1) {
    // Fallback: ±40 lines context window
    const from = Math.max(0, target0 - 20);
    const to   = Math.min(total - 1, target0 + 20);
    return { code: lines.slice(from, to + 1).join('\n'), startLine: from + 1, endLine: to + 1, method: 'context-window' };
  }

  // Track brace depth to find the matching closing brace.
  // We do a simplified scan (skips string/template-literal contents — good enough for a dev tool).
  let depth = 0;
  let opened = false;
  let endIdx = startIdx;
  const MAX_LINES = 300;

  for (let i = startIdx; i < Math.min(total, startIdx + MAX_LINES); i++) {
    const line = lines[i];
    // Simple scan — treats all { and } as structural (acceptable trade-off)
    for (const ch of line) {
      if (ch === '{') { depth++; opened = true; }
      else if (ch === '}') { depth--; }
    }
    if (opened && depth === 0) { endIdx = i; break; }
    endIdx = i; // keep advancing so we always have a valid end
  }

  return {
    code: lines.slice(startIdx, endIdx + 1).join('\n'),
    startLine: startIdx + 1,
    endLine: endIdx + 1,
    method: 'heuristic',
  };
}


// ─── Git helpers ─────────────────────────────────────────────────────────────

function gitAvailable() {
  try { execSync('git rev-parse --is-inside-work-tree', { cwd: PROJECT_ROOT, stdio: 'pipe' }); return true; }
  catch { return false; }
}

const GIT_OK = gitAvailable();
if (GIT_OK) {
  console.log('[Bridge] Git detected — checkpoints enabled');
} else {
  console.warn('[Bridge] ⚠ No git repo found — checkpoints disabled');
}

async function loadCheckpoints() {
  try { return JSON.parse(await readFile(CHECKPOINTS_FILE, 'utf8')); }
  catch { return []; }
}

async function saveCheckpoints(list) {
  await writeFile(CHECKPOINTS_FILE, JSON.stringify(list.slice(0, MAX_CHECKPOINTS), null, 2), 'utf8');
}

async function doCheckpoint(label = 'AI edit') {
  if (!GIT_OK) return null;
  try {
    // git stash create: non-destructive snapshot — working tree is NEVER modified.
    // Returns the stash object SHA, or empty string if tree is clean.
    const sha = execSync('git stash create', { cwd: PROJECT_ROOT, stdio: 'pipe' })
      .toString().trim();
    if (!sha) return { ok: true, sha: null, message: 'clean tree — nothing to snapshot' };

    // Register the stash so it won't be garbage-collected
    const safeLabel = label.replace(/"/g, "'").slice(0, 60);
    execSync(`git stash store --message "devtoolbar: ${safeLabel}" ${sha}`,
      { cwd: PROJECT_ROOT, stdio: 'pipe' });

    const entry = { sha, label: safeLabel, timestamp: new Date().toISOString() };
    const list = await loadCheckpoints();
    list.unshift(entry);
    await saveCheckpoints(list);

    console.log(`[Bridge] ✓ Checkpoint saved: ${sha.slice(0, 8)} — "${safeLabel}"`);
    return { ok: true, ...entry };
  } catch (err) {
    console.warn('[Bridge] Checkpoint failed (non-fatal):', err.message);
    return { ok: false, error: err.message };
  }
}

async function doRestore(sha) {
  if (!GIT_OK) throw new Error('No git repo — cannot restore');
  // Apply the stash over the current working tree.
  // Any uncommitted changes are preserved where possible; git reports conflicts.
  execSync(`git stash apply ${sha}`, { cwd: PROJECT_ROOT, stdio: 'pipe' });
  console.log(`[Bridge] ✓ Restored checkpoint: ${sha.slice(0, 8)}`);
  return { ok: true };
}

// ─── Read body helper ─────────────────────────────────────────────────────────

async function readBody(req) {
  let body = '';
  for await (const chunk of req) body += chunk;
  return JSON.parse(body);
}

// ─── CORS ─────────────────────────────────────────────────────────────────────

function cors(res, methods = 'POST, GET, OPTIONS') {
  res.setHeader('Access-Control-Allow-Origin', ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Private-Network', 'true'); // Chrome PNA
  res.setHeader('Access-Control-Max-Age', '600');
}

function json(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// ─── Server ───────────────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  console.log(`[Bridge] Received ${req.method} ${req.url}`);
  cors(res);
  if (req.method === 'OPTIONS') { res.writeHead(204).end(); return; }

  // ── POST /inject ────────────────────────────────────────────────────────────
  if (req.method === 'POST' && req.url === '/inject') {
    try {
      const { markdown } = await readBody(req);
      if (!markdown?.trim()) { json(res, 400, { ok: false, error: 'No markdown' }); return; }

      // Auto-checkpoint before every AI edit (non-blocking on error)
      const firstLine = markdown.split('\n').find(l =>
        l.startsWith('**Requested change:**') || l.startsWith('**Question:**'));
      const label = firstLine
        ? firstLine.replace(/\*\*/g, '').replace(/^Requested change:|^Question:/, '').trim().slice(0, 50)
        : 'AI edit';
      const cpResult = await doCheckpoint(label);

      // Write to temp file (avoids quoting hell in PowerShell)
      await writeFile(TMP_FILE, markdown, 'utf8');

      // Atomic write to inbox: write to .tmp first, then rename in.
      // This ensures the FileSystemWatcher never sees a half-written file.
      const inboxDir = path.join(process.env.PROGRAMDATA || 'C:\\ProgramData', 'AntigravityBridge', 'inbox');
      const tmpDir = path.join(inboxDir, '.tmp');
      const { mkdirSync, renameSync } = await import('node:fs');
      try { mkdirSync(tmpDir, { recursive: true }); } catch {}
      
      const stamp = new Date().toISOString().replace(/[:.]/g, '-');
      const name = `${stamp}.md`;
      const tmpFile = path.join(tmpDir, name);
      const msgFile = path.join(inboxDir, name);
      await writeFile(tmpFile, markdown, 'utf8');
      renameSync(tmpFile, msgFile);  // atomic on NTFS
      console.log(`[Bridge] Message saved to inbox: ${msgFile}`);

      json(res, 200, { ok: true, checkpoint: cpResult, inbox: msgFile });
    } catch (err) {
      console.error('[Bridge] /inject error:', err.message);
      json(res, 500, { ok: false, error: err.message });
    }
    return;
  }

  // ── GET /checkpoints ────────────────────────────────────────────────────────
  if (req.method === 'GET' && req.url === '/checkpoints') {
    try {
      json(res, 200, { ok: true, checkpoints: await loadCheckpoints(), gitAvailable: GIT_OK });
    } catch (err) {
      json(res, 500, { ok: false, error: err.message });
    }
    return;
  }

  // ── POST /checkpoint ────────────────────────────────────────────────────────
  if (req.method === 'POST' && req.url === '/checkpoint') {
    try {
      const { label } = await readBody(req);
      json(res, 200, await doCheckpoint(label || 'manual snapshot'));
    } catch (err) {
      json(res, 500, { ok: false, error: err.message });
    }
    return;
  }

  // ── POST /restore ────────────────────────────────────────────────────────────
  if (req.method === 'POST' && req.url === '/restore') {
    try {
      const { sha } = await readBody(req);
      if (!sha) { json(res, 400, { ok: false, error: 'No sha provided' }); return; }
      json(res, 200, await doRestore(sha));
    } catch (err) {
      console.error('[Bridge] /restore error:', err.message);
      json(res, 500, { ok: false, error: err.message });
    }
    return;
  }

  // ── GET /source ──────────────────────────────────────────────────────────────
  // Returns the source component surrounding a given file:line.
  // Query params: file (relative path, e.g. src/App.tsx) + line (number)
  if (req.method === 'GET' && req.url?.startsWith('/source')) {
    try {
      const reqUrl = new URL(req.url, `http://127.0.0.1:${PORT}`);
      const file   = reqUrl.searchParams.get('file') ?? '';
      const line   = parseInt(reqUrl.searchParams.get('line') ?? '0', 10);

      if (!file || !line) { json(res, 400, { ok: false, error: 'Missing file or line' }); return; }

      // ── Security: confine reads to project root ────────────────────────────
      const abs = path.resolve(PROJECT_ROOT, file);
      if (!abs.startsWith(PROJECT_ROOT + path.sep) && abs !== PROJECT_ROOT) {
        json(res, 403, { ok: false, error: 'Path traversal denied' }); return;
      }
      if (!/\.[jt]sx?$/.test(abs)) { json(res, 400, { ok: false, error: 'Only JS/TS files allowed' }); return; }

      const source  = await readFile(abs, 'utf8');
      const result  = extractComponent(source, line);
      const linesTotal = source.split('\n').length;
      console.log(`[Bridge] /source ${file}:${line} → lines ${result.startLine}-${result.endLine} (${result.method})`);
      json(res, 200, { ok: true, file, line, linesTotal, ...result });
    } catch (err) {
      console.error('[Bridge] /source error:', err.message);
      json(res, 500, { ok: false, error: err.message });
    }
    return;
  }

  res.writeHead(404).end();
});

server.listen(PORT, () => {
  console.log(`[DevToolbar Bridge] ✓ http://127.0.0.1:${PORT}`);
  console.log('[DevToolbar Bridge] Routes: /inject  /checkpoint  /restore  /checkpoints  /source');
});
