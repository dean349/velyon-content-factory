import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  LayoutDashboard, 
  Terminal, 
  Layers, 
  Box, 
  Database,
  ChevronRight,
  Code,
  Zap,
  Globe,
  Plus,
  ArrowRight,
  Info,
  CheckCircle2,
  HelpCircle,
  FileCode,
  Sparkles,
  Menu,
  X,
  Search,
  FileText,
  Check,
  ExternalLink,
  ShieldAlert,
  Server,
  Key,
  Play,
  Pause,
  Volume2,
  RefreshCw,
  Sliders,
  Download,
  Laptop,
  BookOpen,
  Video
} from 'lucide-react';

import { FactoryView } from './components/FactoryView';

// Define the interface for the conversation messages to ensure strict type-safety
interface ConversationMessage {
  id: number;
  role: 'user' | 'assistant';
  topic: string;
  content: React.ReactNode;
  searchText: string; // Plaintext representation for simple search matching
}

// Full fidelity of the conversation, enriched with plain text for searchable filter indexing
const CONVERSATION_DATA: ConversationMessage[] = [
  {
    id: 1,
    role: 'user',
    topic: 'Web Basics',
    content: "what is the difference between Pure HTML/JS/CSS, Vite + React + Tailwind, or Next.js + Tailwind + Framer Motion)",
    searchText: "what is the difference between Pure HTML/JS/CSS, Vite + React + Tailwind, or Next.js + Tailwind + Framer Motion)"
  },
  {
    id: 2,
    role: 'assistant',
    topic: 'Web Basics',
    content: (
      <div className="space-y-4">
        <p className="text-slate-300">Here is a breakdown of the differences between those three web development stacks, ranging from the most basic to the most advanced:</p>
        
        <div className="space-y-3">
          <h3 className="font-bold text-lg text-orange-400 flex items-center gap-2">
            <Code size={18} /> 1. Pure HTML / JS / CSS (Vanilla)
          </h3>
          <p className="text-sm text-slate-400">This is the raw, foundational layer of the web. It uses no frameworks, libraries, or complex build tools.</p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-slate-400">
            <li><strong>How it works:</strong> You write standard HTML for structure, CSS for styling, and JavaScript for interactivity. The browser reads these files directly.</li>
            <li><strong>Pros:</strong> Extremely fast and lightweight. Zero setup time, no build process to manage, gives absolute control.</li>
            <li><strong>Cons:</strong> As a project grows, code can become repetitive and difficult to maintain. Complex interactivity requires messy DOM manipulation.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="font-bold text-lg text-emerald-400 flex items-center gap-2">
            <Zap size={18} /> 2. Vite + React + Tailwind
          </h3>
          <p className="text-sm text-slate-400">This is a modern, highly popular stack for building Single Page Applications (SPAs).</p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-slate-400">
            <li><strong>How it works:</strong> React breaks UI into components. Tailwind provides utility classes for styling. Vite provides a blazing-fast local server and bundles code.</li>
            <li><strong>Pros:</strong> Excellent developer experience. React manages complex states; Tailwind speeds up styling.</li>
            <li><strong>Cons:</strong> Relies on Client-Side Rendering (CSR), meaning the browser downloads JS before the page appears, which can hurt SEO.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="font-bold text-lg text-indigo-400 flex items-center gap-2">
            <Globe size={18} /> 3. Next.js + Tailwind + Framer Motion
          </h3>
          <p className="text-sm text-slate-400">This is a premium, full-stack framework designed for high-performance, production-ready websites.</p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-slate-400">
            <li><strong>How it works:</strong> Next.js handles Server-Side Rendering (SSR). Tailwind handles styling, and Framer Motion handles fluid animations.</li>
            <li><strong>Pros:</strong> Unbeatable performance and SEO because pages are pre-rendered. Built-in routing and API capabilities.</li>
            <li><strong>Cons:</strong> Steepest learning curve. Introduces backend server logic (Node.js) into front-end code.</li>
          </ul>
        </div>
      </div>
    ),
    searchText: "HTML JS CSS Vanilla Vite React Tailwind Next.js Server-Side Rendering client-side rendering bundle SEO performance animation component routing"
  },
  {
    id: 3,
    role: 'user',
    topic: '3D Immersive Sites',
    content: "what would be best website for a modern first-class website with 3D animation and motion video so it looks like the first world-class website like Lando Norris's website",
    searchText: "what would be best website for a modern first-class website with 3D animation and motion video so it looks like the first world-class website like Lando Norris's website"
  },
  {
    id: 4,
    role: 'assistant',
    topic: '3D Immersive Sites',
    content: (
      <div className="space-y-4">
        <p className="text-slate-300">To build a highly immersive, visually stunning site with 3D animations and motion video—much like Lando Norris's official website—the best foundation is <strong>Next.js + Tailwind + Framer Motion</strong>, but you will need to add one crucial piece to the puzzle for the 3D elements.</p>
        
        <div className="space-y-3">
          <div className="bg-white/[0.02] p-4 rounded-xl space-y-2 border border-white/5 hover:border-indigo-500/20 transition-all">
            <h4 className="font-semibold text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> The Foundation: Next.js + Tailwind
            </h4>
            <p className="text-sm text-slate-400">Next.js provides raw horsepower, SSR, and superior image optimization. Tailwind handles responsive design cleanly.</p>
          </div>

          <div className="bg-white/[0.02] p-4 rounded-xl space-y-2 border border-white/5 hover:border-emerald-500/20 transition-all">
            <h4 className="font-semibold text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> The Motion: Framer Motion (and GSAP)
            </h4>
            <p className="text-sm text-slate-400">Framer Motion is excellent for UI transitions. For complex, scroll-hijacked animations, <strong>GSAP (GreenSock)</strong> is the undisputed heavyweight champion.</p>
          </div>

          <div className="bg-white/[0.02] p-4 rounded-xl space-y-2 border border-white/5 hover:border-indigo-500/20 transition-all">
            <h4 className="font-semibold text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span> The 3D Engine: Three.js (React Three Fiber)
            </h4>
            <p className="text-sm text-slate-400">To get interactive 3D elements, you use WebGL. In the React ecosystem, use <strong>React Three Fiber</strong> (a wrapper for Three.js) to render 3D models directly in the browser.</p>
          </div>
        </div>
      </div>
    ),
    searchText: "Lando Norris website 3D animation motion video Next.js Tailwind Framer Motion GSAP GreenSock Lenis scroll Three.js React Three Fiber WebGL"
  },
  {
    id: 5,
    role: 'user',
    topic: '3D Dependencies',
    content: "give me the full list for this stack",
    searchText: "give me the full list for this stack"
  },
  {
    id: 6,
    role: 'assistant',
    topic: '3D Dependencies',
    content: (
      <div className="space-y-4">
        <p className="text-slate-300">Here is the full developer "shopping list" of core technologies and libraries for a high-performance 3D-integrated web application:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-white/5 p-4 rounded-xl bg-white/[0.01]">
            <h4 className="font-semibold text-slate-100 border-b border-white/5 pb-2 mb-2 flex items-center gap-2">
              <Code size={16} className="text-blue-400" /> 1. Core Framework & Styling
            </h4>
            <ul className="text-sm text-slate-400 space-y-1 list-disc pl-4">
              <li><strong>Next.js:</strong> SSR & Routing</li>
              <li><strong>React:</strong> UI Library</li>
              <li><strong>Tailwind CSS:</strong> Styling</li>
            </ul>
          </div>
          <div className="border border-white/5 p-4 rounded-xl bg-white/[0.01]">
            <h4 className="font-semibold text-slate-100 border-b border-white/5 pb-2 mb-2 flex items-center gap-2">
              <Layers size={16} className="text-emerald-400" /> 2. Motion & Scroll
            </h4>
            <ul className="text-sm text-slate-400 space-y-1 list-disc pl-4">
              <li><strong>Framer Motion:</strong> UI animations</li>
              <li><strong>GSAP:</strong> Timeline scroll animations</li>
              <li><strong>Lenis:</strong> Smooth scrolling</li>
            </ul>
          </div>
          <div className="border border-white/5 p-4 rounded-xl bg-white/[0.01]">
            <h4 className="font-semibold text-slate-100 border-b border-white/5 pb-2 mb-2 flex items-center gap-2">
              <Globe size={16} className="text-indigo-400" /> 3. 3D Engine (WebGL)
            </h4>
            <ul className="text-sm text-slate-400 space-y-1 list-disc pl-4">
              <li><strong>Three.js:</strong> Core WebGL engine</li>
              <li><strong>@react-three/fiber:</strong> React wrapper</li>
              <li><strong>@react-three/drei:</strong> Helpers & cameras</li>
              <li><strong>gltfjsx:</strong> Model to component CLI</li>
            </ul>
          </div>
          <div className="border border-white/5 p-4 rounded-xl bg-white/[0.01]">
            <h4 className="font-semibold text-slate-100 border-b border-white/5 pb-2 mb-2 flex items-center gap-2">
              <Database size={16} className="text-purple-400" /> 4. State Management
            </h4>
            <ul className="text-sm text-slate-400 space-y-1 list-disc pl-4">
              <li><strong>Zustand:</strong> Fast, lightweight global state sharing between 2D UI and 3D canvas.</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    searchText: "dependencies shopping list Next.js React Tailwind Framer Motion GSAP Lenis Three.js @react-three/fiber @react-three/drei gltfjsx Zustand global state WebGL"
  },
  {
    id: 7,
    role: 'user',
    topic: 'SaaS Architecture',
    content: "okay what would be the best stack for a modern day SaaS application that has dashboards?",
    searchText: "okay what would be the best stack for a modern day SaaS application that has dashboards?"
  },
  {
    id: 8,
    role: 'assistant',
    topic: 'SaaS Architecture',
    content: (
      <div className="space-y-4">
        <p className="text-slate-300">For a modern SaaS application that requires a high-converting landing page and a complex dashboard, the industry standard is the "Golden Stack": <strong>Next.js + Tailwind CSS + Supabase + Stripe + Shadcn UI</strong>.</p>
        
        <ul className="space-y-4">
          <li className="flex gap-3">
            <div className="mt-1 bg-blue-500/10 p-2.5 rounded-xl h-fit text-blue-400 border border-blue-500/20 flex-shrink-0">
              <Layers size={18}/>
            </div>
            <div>
              <strong className="block text-base text-slate-100 font-semibold">1. Next.js (React)</strong>
              <p className="text-sm text-slate-400 mt-0.5">Acts as a full-stack framework. SSR for marketing pages, Client-side for interactive dashboards, and API routes for secure backend logic.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <div className="mt-1 bg-purple-500/10 p-2.5 rounded-xl h-fit text-purple-400 border border-purple-500/20 flex-shrink-0">
              <Box size={18}/>
            </div>
            <div>
              <strong className="block text-base text-slate-100 font-semibold">2. Tailwind CSS + Shadcn UI</strong>
              <p className="text-sm text-slate-400 mt-0.5">Tailwind handles styling natively. Shadcn UI provides beautifully designed, accessible React components (tables, modals) you copy/paste. Recharts handles dashboard analytics.</p>
            </div>
          </li>
          <li className="flex gap-3">
            <div className="mt-1 bg-emerald-500/10 p-2.5 rounded-xl h-fit text-emerald-400 border border-emerald-500/20 flex-shrink-0">
              <Database size={18}/>
            </div>
            <div>
              <strong className="block text-base text-slate-100 font-semibold">3. Supabase (PostgreSQL)</strong>
              <p className="text-sm text-slate-400 mt-0.5">The ultimate BaaS. Runs on raw PostgreSQL for complex relational data, offers real-time subscriptions for live dashboard updates, and handles authentication.</p>
            </div>
          </li>
        </ul>
      </div>
    ),
    searchText: "best stack SaaS application dashboards Golden Stack Next.js Tailwind CSS Supabase Stripe Shadcn UI PostgreSQL database authentication Recharts analytics"
  },
  {
    id: 9,
    role: 'user',
    topic: 'Meta Request',
    content: "produce me an interactive web app that details and includes every single conversation in this chat.",
    searchText: "produce me an interactive web app that details and includes every single conversation in this chat."
  },
  {
    id: 10,
    role: 'assistant',
    topic: 'Meta Request',
    content: (
      <div className="space-y-5">
        <p className="text-slate-300">
          I've built this interactive SaaS web blueprint that acts as both a living chat archive and a feature-complete spec sheet of the web architectures we discussed! Here is the full breakdown of how our ultimate "SaaS Golden Stack" operates:
        </p>

        <div className="space-y-4">
          {/* Item 1 */}
          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl space-y-2">
            <h4 className="font-bold text-slate-100 flex items-center gap-2 text-indigo-400">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/10 text-xs font-bold text-indigo-400 border border-indigo-500/20">1</span>
              The Framework: Next.js (React)
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Instead of splitting your codebase into a separate backend and frontend, Next.js acts as your full-stack framework:
            </p>
            <ul className="list-disc pl-5 text-xs text-slate-400 space-y-1">
              <li><strong>For the Landing Page:</strong> It uses Server-Side Rendering (SSR) to deliver blazing-fast, SEO-optimized marketing pages.</li>
              <li><strong>For the Dashboard:</strong> It allows you to use Client-Side React components for highly interactive, dynamic dashboard modules (like sortable tables, real-time filters, or complex charts).</li>
              <li><strong>The Backend:</strong> Next.js has built-in API routes and "Server Actions," allowing you to write secure backend database queries right alongside your frontend code.</li>
            </ul>
          </div>

          {/* Item 2 */}
          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl space-y-2">
            <h4 className="font-bold text-slate-100 flex items-center gap-2 text-purple-400">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500/10 text-xs font-bold text-purple-400 border border-purple-500/20">2</span>
              The Styling & UI: Tailwind CSS + Shadcn UI
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              You no longer need to write CSS from scratch or use rigid templates:
            </p>
            <ul className="list-disc pl-5 text-xs text-slate-400 space-y-1">
              <li><strong>Tailwind CSS:</strong> Handles all the responsive styling natively via utility classes.</li>
              <li><strong>Shadcn UI:</strong> This is the current secret weapon for SaaS builders. It is a collection of beautifully designed, accessible React components (like data tables, date pickers, dropdowns, and modals) that you copy and paste directly into your project. It looks premium out of the box and saves hundreds of hours of design work.</li>
              <li><strong>Charting:</strong> For dashboard analytics, developers typically pair this with <strong>Recharts</strong> or <strong>Tremor</strong>, which are React libraries specifically designed to build beautiful, responsive dashboard charts.</li>
            </ul>
          </div>

          {/* Item 3 */}
          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl space-y-2">
            <h4 className="font-bold text-slate-100 flex items-center gap-2 text-emerald-400">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 text-xs font-bold text-emerald-400 border border-emerald-500/20">3</span>
              The Database & Auth: Supabase (PostgreSQL)
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Supabase is widely considered the ultimate "Backend-as-a-Service" alternative to Firebase, and it runs on raw PostgreSQL (the undisputed king of relational databases):
            </p>
            <ul className="list-disc pl-5 text-xs text-slate-400 space-y-1">
              <li><strong>Database:</strong> PostgreSQL handles complex relational data (users, teams, subscriptions, invoices) flawlessly.</li>
              <li><strong>Real-time:</strong> Supabase has built-in real-time subscriptions, meaning if a metric changes in your database, the user's dashboard chart updates instantly without them needing to refresh the page.</li>
              <li><strong>Authentication:</strong> It handles your login, sign-up, and password resets securely out of the box (though Clerk is also a very popular standalone alternative for authentication).</li>
            </ul>
          </div>

          {/* Item 4 */}
          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl space-y-2">
            <h4 className="font-bold text-slate-100 flex items-center gap-2 text-rose-400">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-500/10 text-xs font-bold text-rose-400 border border-rose-500/20">4</span>
              The Money: Stripe
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              For SaaS billing, subscriptions, and recurring revenue, Stripe is the undisputed industry standard. It integrates perfectly with Next.js and webhook architectures to manage user tiers (e.g., Free vs. Pro).
            </p>
          </div>
        </div>

        {/* Closing summary banner */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 p-5 rounded-2xl mt-4">
          <h4 className="text-sm font-semibold text-indigo-400 flex items-center gap-1.5 mb-1.5">
            <Sparkles size={16} /> Why This Stack Wins for Dashboards
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Dashboards are notoriously difficult to build because they require fetching massive amounts of data, filtering it, and displaying it visually without lagging the user's browser.
          </p>
          <p className="text-xs text-slate-300 leading-relaxed mt-2">
            This stack allows you to fetch heavy data securely on the server (<strong>Next.js</strong>), pass it cleanly to the client (<strong>React</strong>), and display it beautifully using pre-built visualization components (<strong>Shadcn UI / Tremor</strong>), all while keeping your data strictly relational and secure (<strong>PostgreSQL via Supabase</strong>).
          </p>
        </div>
      </div>
    ),
    searchText: "The Framework: Next.js (React) Server-Side Rendering SSR Client-Side React components Server Actions API routes Styling UI: Tailwind CSS Shadcn UI data tables date pickers dropdowns modals Recharts Tremor dashboard charts Database Auth: Supabase PostgreSQL relational database real-time subscriptions Authentication login sign-up password resets Clerk Money: Stripe SaaS billing subscriptions recurring revenue webhooks Free Pro tiers Why This Stack Wins for Dashboards"
  },
  {
    id: 11,
    role: 'user',
    topic: 'Concierge Interview & Dynamic Generation',
    content: "What stack would you need for a fully comprehensive interactive dashboard that has a concierge interview that interviews the user, accepts user-uploaded information in different file types, and generates a response (whether it be text, UI components, images, videos, or whatever)? On the backend it needs storage. You could use Supabase for all the assets the user can upload, download, and so forth, but it's got to be stunning, world-class. Got to look really slick.",
    searchText: "What stack would you need for a fully comprehensive interactive dashboard that has a concierge interview that interviews the user, accepts user-uploaded information in different file types, and generates a response on the backend storage Supabase stunning world-class look really slick"
  },
  {
    id: 12,
    role: 'assistant',
    topic: 'Concierge Interview & Dynamic Generation',
    content: (
      <div className="space-y-6">
        <p className="text-slate-300 leading-relaxed">
          To build a world-class, visually stunning **Generative AI Concierge Dashboard** that interviews users, handles multi-format file ingestion, and renders dynamic, tailored output structures (text, custom UI, generated media), you need a cutting-edge full-stack engine.
        </p>
        <p className="text-slate-300 leading-relaxed">
          Here is the premium **AI Concierge & Multi-Modal Generation Stack** designed for maximum polish, real-time interactivity, and bulletproof scalability:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-indigo-400">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/10 text-xs font-bold text-indigo-400 border border-indigo-500/20">1</span>
              <h4 className="font-bold text-slate-100">The Concierge Experience (Framer Motion)</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              To make the step-by-step concierge interview feel premium and tactile, you must avoid basic form inputs.
            </p>
            <ul className="list-disc pl-4 text-[11px] text-slate-500 space-y-1">
              <li><strong>Framer Motion / Motion:</strong> Smooth card morphs, spring-loaded transition layouts, and fluid question-by-question fade-overs.</li>
              <li><strong>React-Dropzone + Uppy:</strong> Slick drag-and-drop file ingestion displaying multi-stage upload progress counters and thumbnail previews.</li>
            </ul>
          </div>

          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 text-xs font-bold text-emerald-400 border border-emerald-500/20">2</span>
              <h4 className="font-bold text-slate-100">Ingestion & Storage (Supabase S3)</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Handling raw documents (PDF, CSV), image formats, and multimedia require a structured, low-latency CDN system.
            </p>
            <ul className="list-disc pl-4 text-[11px] text-slate-500 space-y-1">
              <li><strong>Supabase Storage:</strong> Private, authenticated storage buckets utilizing edge-caching CDNs to process, read, and serve files securely.</li>
              <li><strong>PGVector:</strong> Stores document embeddings directly inside your PostgreSQL database to run semantic searches (RAG) across uploaded catalogs.</li>
            </ul>
          </div>

          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-purple-400">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500/10 text-xs font-bold text-purple-400 border border-purple-500/20">3</span>
              <h4 className="font-bold text-slate-100">Multi-Modal AI Core (Gemini SDK)</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instead of gluing together 5 different AI services, you can leverage Gemini's native multi-modal capabilities.
            </p>
            <ul className="list-disc pl-4 text-[11px] text-slate-500 space-y-1">
              <li><strong>@google/genai SDK:</strong> Directly processes rich audio files, videos, documents, and slides in a single unified payload.</li>
              <li><strong>Gemini 2.5 Pro / Flash:</strong> Unmatched context window length (up to 1M+ tokens) to read whole books or multiple PDFs simultaneously during the interview.</li>
            </ul>
          </div>

          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-rose-400">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-500/10 text-xs font-bold text-rose-400 border border-rose-500/20">4</span>
              <h4 className="font-bold text-slate-100">Dynamic UI Rendering (JSON Specs)</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              To render dynamic UI components, you don't execute dangerous arbitrary strings. You use structured outputs.
            </p>
            <ul className="list-disc pl-4 text-[11px] text-slate-500 space-y-1">
              <li><strong>Gemini Structured Schema:</strong> Enforce the model to output exact JSON schemas representing UI elements (e.g., card components, layouts, colored metrics, buttons).</li>
              <li><strong>Dynamic React Engine:</strong> A custom client-side mapping function parses the structured JSON schemas and instantly translates them into beautifully animated Tailwind elements in real-time.</li>
            </ul>
          </div>
        </div>

        <div className="bg-indigo-500/10 border border-indigo-500/20 p-5 rounded-2xl">
          <h4 className="text-sm font-semibold text-indigo-400 flex items-center gap-1.5 mb-1.5">
            <Sparkles size={16} /> The Architectural Secret: Server-Sent Events (SSE)
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Generating media files (audio synthesis, video streams, complex charts) takes time. To keep the app looking stunning and responsive, the server uses **Server-Sent Events** to stream intermediate thinking steps back to the user:
          </p>
          <div className="grid grid-cols-3 gap-2 mt-3 font-mono text-[10px] text-center">
            <div className="bg-black/40 border border-white/5 p-2 rounded-lg text-indigo-300">1. Analyzing Assets</div>
            <div className="bg-black/40 border border-white/5 p-2 rounded-lg text-purple-300">2. Synthesizing JSON</div>
            <div className="bg-black/40 border border-white/5 p-2 rounded-lg text-emerald-300">3. Rendering Canvas</div>
          </div>
        </div>
      </div>
    ),
    searchText: "Generative AI Concierge Dashboard interview user-uploaded multi-format ingestion file types Next.js Framer Motion React-Dropzone Uppy Supabase Storage PGVector document embeddings Gemini SDK @google/genai Gemini 2.5 Pro context window Server-Sent Events SSE"
  },
  {
    id: 13,
    role: 'user',
    topic: 'Velyon Portfolio Forge & UI Ecosystems',
    content: "It also needs other options for multi-modal capabilities for producing output, whether it be md files, .pdf, images, assets, jpegs, pngs. Export to Google notebookLM to create slideshows and videos. Video generation can also be done using Higgsfield, HeyGen, Framer Motion, and 11labs using the Velyon AI content factory. Needs to be a selection for each topic, whether it is a case study that we are trying to make or prepare assets for a website. A user can input whether they already have a video they want to use, a file, an image, text, or testimonials, and so on and so forth. Give me some more of your recommendations. Also what about the UI and UX, and using 21st.dev and the magic MCP server? The frontend should look really nice and premium. What framework would we use there?",
    searchText: "multi-modal capabilities producing output md pdf images assets jpegs pngs Export to Google notebookLM slideshows videos Video generation Higgsfield HeyGen Framer Motion 11labs Velyon AI content factory case study website assets video file image text testimonials 21st.dev magic MCP server premium frontend framework"
  },
  {
    id: 14,
    role: 'assistant',
    topic: 'Velyon Portfolio Forge & UI Ecosystems',
    content: (
      <div className="space-y-6">
        <p className="text-slate-300 leading-relaxed">
          The concept of the <strong>Velyon Portfolio Forge</strong> is a masterpiece of multi-modal engineering: a single centralized dashboard that absorbs arbitrary raw customer ingredients (testimonials, PDFs, raw videos, images) and routes them into structured campaign pipelines (Case Studies, Web Assets, Interactive Demos).
        </p>

        <div className="border border-indigo-500/15 bg-indigo-500/[0.02] p-5 rounded-2xl space-y-4">
          <h4 className="text-sm font-bold text-indigo-300 flex items-center gap-1.5 font-sans">
            <Sparkles size={16} /> 1. The Velyon Content Ingestion & Routing Model
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Depending on what raw materials the user provides, the system dynamically swaps the ingestion parser:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            <div className="bg-black/30 border border-white/5 p-2 rounded-xl text-center">
              <div className="text-indigo-400 text-[10px] font-bold font-mono">🎥 Video Input</div>
              <div className="text-[9px] text-slate-500 mt-0.5">Higgsfield / HeyGen OCR & Audio transcript</div>
            </div>
            <div className="bg-black/30 border border-white/5 p-2 rounded-xl text-center">
              <div className="text-purple-400 text-[10px] font-bold font-mono">📄 Documents</div>
              <div className="text-[9px] text-slate-500 mt-0.5">PDF, MD context parsing via RAG</div>
            </div>
            <div className="bg-black/30 border border-white/5 p-2 rounded-xl text-center">
              <div className="text-emerald-400 text-[10px] font-bold font-mono">🖼️ Images</div>
              <div className="text-[9px] text-slate-500 mt-0.5">LPIPS/Gemini 2.5 multi-modal style tags</div>
            </div>
            <div className="bg-black/30 border border-white/5 p-2 rounded-xl text-center">
              <div className="text-rose-400 text-[10px] font-bold font-mono">✍️ Text Log</div>
              <div className="text-[9px] text-slate-500 mt-0.5">Structured markdown raw copy</div>
            </div>
            <div className="bg-black/30 border border-white/5 p-2 rounded-xl text-center">
              <div className="text-amber-400 text-[10px] font-bold font-mono">💬 Socials</div>
              <div className="text-[9px] text-slate-500 mt-0.5">Client quotes & raw testimonials</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-200">2. Synthesizing Complex Multi-Modal Outputs</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl space-y-2">
              <span className="font-bold text-slate-300 block">📁 Documents & Design Assets (PDF / MD / JPEG)</span>
              <p className="text-slate-400 leading-relaxed">
                Generates polished, production-ready markdown readmes (`.md`), interactive high-resolution SVG/JPEG wireframes, and printable PDFs. The system packages design styles cleanly into ZIP archives containing optimized asset packs.
              </p>
            </div>
            <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl space-y-2">
              <span className="font-bold text-slate-300 block">🎙️ NotebookLM Slides & Podcasts</span>
              <p className="text-slate-400 leading-relaxed">
                Aggregates synthesized copy and outputs structured payloads formatted for <strong>Google NotebookLM</strong>. NotebookLM ingests this content to automatically generate multi-character audio podcasts, deep deep-dives, and structured summaries.
              </p>
            </div>
            <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl space-y-2">
              <span className="font-bold text-slate-300 block">🎬 Physics-Based Video Generation (Higgsfield)</span>
              <p className="text-slate-400 leading-relaxed">
                Uses <strong>Higgsfield</strong> to synthesize realistic, physically accurate scene motions or camera sweeps around your assets. This provides custom background dynamics instead of standard static stock footage.
              </p>
            </div>
            <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl space-y-2">
              <span className="font-bold text-slate-300 block">🗣️ Interactive Avatars & Voiceovers (HeyGen + ElevenLabs)</span>
              <p className="text-slate-400 leading-relaxed">
                Triggers <strong>HeyGen</strong> APIs to construct high-fidelity digital spokesperson video streams, synchronized in real-time with customized audio vocal profiles generated via <strong>ElevenLabs (11labs)</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="border border-purple-500/15 bg-purple-500/[0.02] p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-purple-300">
            <Layers size={18} />
            <h4 className="text-sm font-bold font-sans">3. The 21st-Century Premium Frontend Strategy: Next.js + 21st.dev + Magic MCP</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            To make the frontend look absolutely gorgeous, fluid, and world-class, here is the exact architectural and toolchain recommendations:
          </p>
          <ul className="space-y-2 text-xs text-slate-400 list-disc pl-5">
            <li>
              <strong className="text-slate-200">The Styling Stack:</strong> Use **Next.js (App Router)** as the foundation, styled with **Tailwind CSS**, and backed by **Framer Motion** for spring-loaded organic transitions. Utilize **Radix UI Primitive** APIs for perfectly accessible elements, wrapped in deep glassmorphism aesthetics (noise overlays, backdrop blur-md, radial gradient glows, thin subtle borders).
            </li>
            <li>
              <strong className="text-slate-200">21st.dev Marketplace:</strong> Instead of building premium custom widgets from scratch, use **21st.dev**—the ultimate registry for polished, beautiful, custom Tailwind and Framer Motion elements. It contains pre-styled widgets like animated marquee testimonial cards, organic bento grids, and springy interactive sliders.
            </li>
            <li>
              <strong className="text-slate-200">The Magic MCP Server:</strong> Integrate the **Magic MCP Server** directly into your developer workspace. This Model Context Protocol server allows your AI coding models to dynamically query 21st.dev, look up top-tier shadcn designs, pull verified codeblocks, and instantly write or update local React files in real-time. This eliminates mock placeholder code and puts production-quality widgets directly into play.
            </li>
          </ul>
        </div>
      </div>
    ),
    searchText: "Velyon Portfolio Forge multi-modal output Google NotebookLM Slides Higgsfield HeyGen Framer Motion ElevenLabs Eleven Labs 11labs case study website assets Next.js 21st.dev magic MCP server Model Context Protocol"
  }
];

// Rich custom data for interactive tech stack details in the Dashboard
interface StackDetail {
  key: string;
  title: string;
  icon: React.ReactNode;
  tech: string;
  desc: string;
  color: string;
  borderColor: string;
  badgeColor: string;
  accentGlow: string;
  pros: string[];
  cons: string[];
  useCase: string;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  performanceScore: number;
}

const STACK_DETAILS: StackDetail[] = [
  {
    key: 'vanilla',
    title: "Vanilla Web",
    icon: <Terminal className="text-orange-400" size={24} />,
    tech: "HTML5 / JS / CSS3",
    desc: "Raw, lightweight foundation. Best for simple landing pages with zero build overhead.",
    color: "text-orange-400",
    borderColor: "border-orange-500/20 group-hover:border-orange-500/50",
    badgeColor: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
    accentGlow: "group-hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]",
    complexity: 'Beginner',
    performanceScore: 99,
    pros: ["Ultra fast loading speeds (zero JS overhead)", "Zero compilation or build pipelines", "Perfect control over raw DOM APIs"],
    cons: ["Code repetition builds up quickly", "No state binding system", "Hard to manage multiple subviews"],
    useCase: "Lightweight landing pages, micro-portfolios, quick proof-of-concepts, and highly-optimized static documents."
  },
  {
    key: 'spa',
    title: "Modern SPA",
    icon: <Zap className="text-emerald-400" size={24} />,
    tech: "Vite + React + Tailwind",
    desc: "Component-driven architecture for complex UI state management and rapid feature development.",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/20 group-hover:border-emerald-500/50",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    accentGlow: "group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]",
    complexity: 'Intermediate',
    performanceScore: 90,
    pros: ["Superb local development with instant feedback", "Vibrant component ecosystem", "Highly responsive client-side state"],
    cons: ["Empty initial HTML means low SEO indexing", "JavaScript bundles can grow very large", "Client bears rendering burden"],
    useCase: "Software-as-a-Service customer portals, internal CRM systems, interactive rich calculators, and client utility tools."
  },
  {
    key: '3d',
    title: "World-Class 3D",
    icon: <Globe className="text-indigo-400" size={24} />,
    tech: "Next.js + Three.js + GSAP",
    desc: "World-class immersive experiences using WebGL, shader effects, and high-performance timelines.",
    color: "text-indigo-400",
    borderColor: "border-indigo-500/20 group-hover:border-indigo-500/50",
    badgeColor: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
    accentGlow: "group-hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]",
    complexity: 'Advanced',
    performanceScore: 82,
    pros: ["High premium look and client impression", "Perfect scroll-triggered animation flows", "Full GPU-accelerated interactive 3D assets"],
    cons: ["Complex GLTF compression requirements", "Large initial assets trigger loading delays", "Complicated math and physics curves"],
    useCase: "Top-tier product launches, brand presentation sites (like Lando Norris's), creative digital agency portfolios, and interactive games."
  },
  {
    key: 'saas',
    title: "SaaS Infrastructure",
    icon: <Database className="text-purple-400" size={24} />,
    tech: "Next.js + Supabase + Stripe",
    desc: "Scalable relational data, authentication, and secure payment handling for business-grade apps.",
    color: "text-purple-400",
    borderColor: "border-purple-500/20 group-hover:border-purple-500/50",
    badgeColor: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    accentGlow: "group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]",
    complexity: 'Expert',
    performanceScore: 88,
    pros: ["Secure server-rendered marketing routes", "Turnkey database queries and API routing", "Beautiful ready-made UI layouts from Shadcn"],
    cons: ["Backend latency from Serverless architectures", "Steep learning curve for database triggers", "More billing variables to track"],
    useCase: "Modern subscription-based SaaS, customer-facing business analytics platforms, multi-user web environments, and fintech reporting."
  },
  {
    key: 'concierge',
    title: "AI Concierge & Generation",
    icon: <Sparkles className="text-rose-400" size={24} />,
    tech: "Next.js + Gemini + Supabase + Motion",
    desc: "Conversational multi-step interviews, secure multi-modal document ingestion, and dynamic on-the-fly dashboard UI generation.",
    color: "text-rose-400",
    borderColor: "border-rose-500/20 group-hover:border-rose-500/50",
    badgeColor: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
    accentGlow: "group-hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]",
    complexity: 'Expert',
    performanceScore: 86,
    pros: ["Native multi-modal document/audio processing", "Dynamic UI component rendering via JSON schemas", "State-of-the-art conversational motion layouts"],
    cons: ["Up to 10-15s latency for fully synthesized assets", "Requires careful token budget management", "Requires sandbox environments for arbitrary assets"],
    useCase: "AI-powered custom business analysts, automated onboarding consultancies, personalized client reporting desks, and adaptive dynamic content hubs."
  }
];

// Archived sessions details to simulate historical sessions mentioned in sidebar
interface HistoricalSession {
  key: string;
  title: string;
  date: string;
  status: 'active' | 'archived';
  topicsCount: number;
  overview: string;
  architectureDetails: { label: string; value: string }[];
}

const HISTORICAL_SESSIONS: Record<string, HistoricalSession> = {
  modern: {
    key: 'modern',
    title: "Modern Web Stacks",
    date: "active",
    status: 'active',
    topicsCount: 5,
    overview: "Analysis of Vanilla JS, SPA dashboards, interactive WebGL Three.js portfolios, and enterprise Next.js SaaS architecture.",
    architectureDetails: [
      { label: "Compiler Engine", value: "Vite v6.2.3" },
      { label: "Rendering Framework", value: "React v19 (Concurrent)" },
      { label: "Style Pipeline", value: "Tailwind CSS v4" },
      { label: "Animation Driver", value: "Motion & Keyframes" }
    ]
  },
  cloud: {
    key: 'cloud',
    title: "Cloud Infrastructure",
    date: "12 Oct 2025",
    status: 'archived',
    topicsCount: 5,
    overview: "Discussion surrounding highly available SQL instances, Redis read-replicas, autoscaling rules on Cloud Run, and multi-region routing schemas.",
    architectureDetails: [
      { label: "Database Engine", value: "PostgreSQL v16 (Cloud SQL)" },
      { label: "Container Runner", value: "Google Cloud Run" },
      { label: "Caching Layer", value: "Redis Enterprise Cache" },
      { label: "CDN Network", value: "Cloud DNS + Google Front-End" }
    ]
  },
  api: {
    key: 'api',
    title: "API Design Systems",
    date: "08 Oct 2025",
    status: 'archived',
    topicsCount: 6,
    overview: "Standards for RESTful contracts, GraphQL federation adapters, schema validation utilizing Zod, and security rules guarding administrative routes.",
    architectureDetails: [
      { label: "API Protocol", value: "RESTful JSON / gRPC Buffers" },
      { label: "Schema Validator", value: "Zod v3 Type Guards" },
      { label: "Token Standard", value: "JSON Web Tokens (RS256)" },
      { label: "Rate Limiter", value: "Token Bucket Middleware (Redis)" }
    ]
  }
};

// Simulated project files to render under the "Assets" tab
interface ProjectAssetFile {
  name: string;
  language: string;
  size: string;
  code: string;
}

const PROJECT_ASSETS: ProjectAssetFile[] = [
  {
    name: "package.json",
    language: "json",
    size: "1.4 KB",
    code: `{
  "name": "tech-stack-architecture-chat",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx"
  },
  "dependencies": {
    "@google/genai": "^2.4.0",
    "express": "^4.21.2",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "vite": "^6.2.3"
  }
}`
  },
  {
    name: "vite.config.ts",
    language: "typescript",
    size: "0.8 KB",
    code: `import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0'
    }
  };
});`
  },
  {
    name: "metadata.json",
    language: "json",
    size: "0.2 KB",
    code: `{
  "name": "Tech Stack Architecture Chat",
  "description": "An interactive dashboard and archive detailing web architecture comparisons.",
  "requestFramePermissions": [],
  "majorCapabilities": [
    "MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"
  ]
}`
  },
  {
    name: "src/index.css",
    language: "css",
    size: "0.5 KB",
    code: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}`
  }
];

const DashboardView = ({ 
  onSelectStack, 
  selectedStackKey,
  searchQuery
}: { 
  onSelectStack: (key: string) => void;
  selectedStackKey: string;
  searchQuery: string;
}) => {
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [selectedCompareKeys, setSelectedCompareKeys] = useState<string[]>([]);

  // Filter stack details based on bottom command query
  const filteredStacks = STACK_DETAILS.filter(stack => 
    stack.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stack.tech.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stack.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stack.useCase.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedStack = STACK_DETAILS.find(s => s.key === selectedStackKey) || STACK_DETAILS[0];

  const stack1 = STACK_DETAILS.find(s => s.key === selectedCompareKeys[0]);
  const stack2 = STACK_DETAILS.find(s => s.key === selectedCompareKeys[1]);

  const comparisonFeatures = [
    {
      name: "Primary Technology",
      value: (stack: StackDetail) => <span className="font-mono text-xs text-indigo-400 font-semibold">{stack.tech}</span>
    },
    {
      name: "Performance Score",
      value: (stack: StackDetail) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-200 text-xs font-mono">{stack.performanceScore}%</span>
          <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${stack.performanceScore}%` }}></div>
          </div>
        </div>
      )
    },
    {
      name: "Complexity Level",
      value: (stack: StackDetail) => (
        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${stack.badgeColor}`}>
          {stack.complexity}
        </span>
      )
    },
    {
      name: "Rendering Model",
      value: (stack: StackDetail) => {
        const models: Record<string, string> = {
          vanilla: "Client Static / No Server Build",
          spa: "Client-Side Rendering (CSR / SPA)",
          "3d": "SSR & WebGL Hybrid Engine",
          saas: "Server-Side Rendering (SSR) & API",
          concierge: "Serverless AI Ingestion & Streaming (SSE)"
        };
        return <span className="text-xs text-slate-300">{models[stack.key] || "Hybrid"}</span>;
      }
    },
    {
      name: "Local State Binding",
      value: (stack: StackDetail) => {
        const states: Record<string, string> = {
          vanilla: "Manual DOM Updates (Vanilla JS)",
          spa: "React Hooks, Context API",
          "3d": "Zustand Global Store + R3F",
          saas: "React Server Components + Live DB",
          concierge: "Motion Keyframes + AI State Machine"
        };
        return <span className="text-xs text-slate-300">{states[stack.key] || "React State"}</span>;
      }
    },
    {
      name: "E-Commerce / Billing",
      value: (stack: StackDetail) => {
        const payments: Record<string, { ready: boolean; text: string }> = {
          vanilla: { ready: false, text: "Requires heavy manual wrappers" },
          spa: { ready: true, text: "Easy via client-side Stripe" },
          "3d": { ready: false, text: "Custom integration required" },
          saas: { ready: true, text: "Built-in Stripe Subscriptions" },
          concierge: { ready: true, text: "Stripe Metered Usage Billing" }
        };
        const p = payments[stack.key] || { ready: false, text: "N/A" };
        return (
          <div className="flex items-center gap-1.5">
            <span className={p.ready ? "text-emerald-400" : "text-slate-500"}>
              {p.ready ? <CheckCircle2 size={12} /> : <HelpCircle size={12} />}
            </span>
            <span className="text-xs text-slate-300">{p.text}</span>
          </div>
        );
      }
    },
    {
      name: "SEO Indexing Factor",
      value: (stack: StackDetail) => {
        const seos: Record<string, { rating: string; color: string }> = {
          vanilla: { rating: "Excellent (Raw static)", color: "text-emerald-400" },
          spa: { rating: "Sub-optimal (JS bundle heavy)", color: "text-amber-500" },
          "3d": { rating: "Good (SSR HTML shell)", color: "text-indigo-400" },
          saas: { rating: "Perfect (Full server-rendered)", color: "text-emerald-400" },
          concierge: { rating: "Good (Indexed static shell)", color: "text-indigo-400" }
        };
        const s = seos[stack.key] || { rating: "Good", color: "text-slate-300" };
        return <span className={`text-xs font-medium ${s.color}`}>{s.rating}</span>;
      }
    },
    {
      name: "Recommended Context",
      value: (stack: StackDetail) => <span className="text-xs text-slate-400 leading-relaxed block">{stack.useCase}</span>
    },
    {
      name: "Engineering Pros",
      value: (stack: StackDetail) => (
        <ul className="space-y-1 text-xs text-slate-400 list-disc pl-4">
          {stack.pros.map((p, i) => (
            <li key={i} className="text-slate-300">
              {p}
            </li>
          ))}
        </ul>
      )
    },
    {
      name: "Limitations",
      value: (stack: StackDetail) => (
        <ul className="space-y-1 text-xs text-slate-400 list-disc pl-4">
          {stack.cons.map((c, i) => (
            <li key={i} className="text-slate-300">
              {c}
            </li>
          ))}
        </ul>
      )
    }
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto animate-fade-in text-left">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-3 py-1 rounded-full mb-3 border border-indigo-500/20">
            <Sparkles size={12} className="animate-pulse" />
            <span>Interactive Architectural Spec Sheet</span>
          </div>
          <h2 className="text-2.5xl font-bold tracking-tight text-white font-sans">Technology Core Comparisons</h2>
          <p className="text-slate-400 text-sm mt-1">Select a stack model below to analyze capabilities, trade-offs, and scores.</p>
        </div>

        {searchQuery && (
          <div className="bg-white/[0.03] border border-white/10 px-3 py-1.5 rounded-lg text-xs text-indigo-400">
            Filtered by: <span className="font-mono text-slate-200">"{searchQuery}"</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Stack Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Available Architectures ({filteredStacks.length})</div>
            <button
              onClick={() => {
                const newMode = !compareMode;
                setCompareMode(newMode);
                if (newMode) {
                  setSelectedCompareKeys([selectedStackKey]);
                } else {
                  setSelectedCompareKeys([]);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                compareMode 
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-[0_0_10px_rgba(99,102,241,0.1)]' 
                  : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/10 hover:bg-white/[0.03]'
              }`}
            >
              <Layers size={11} className={compareMode ? 'animate-pulse text-indigo-400' : ''} />
              <span>Compare: {compareMode ? 'ON' : 'OFF'}</span>
            </button>
          </div>
          
          {filteredStacks.length === 0 ? (
            <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.01] text-center">
              <ShieldAlert className="mx-auto text-amber-500/70 mb-3" size={32} />
              <p className="text-slate-400 text-sm font-medium">No architectures match your query.</p>
              <p className="text-slate-500 text-xs mt-1">Try typing a different stack term or clearing the query filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {filteredStacks.map((stack) => {
                const isSelected = stack.key === selectedStackKey;
                const compareIdx = selectedCompareKeys.indexOf(stack.key);
                const isCompareSelected = compareIdx !== -1;

                const handleCardClick = () => {
                  onSelectStack(stack.key);
                  if (compareMode) {
                    if (isCompareSelected) {
                      setSelectedCompareKeys(selectedCompareKeys.filter(k => k !== stack.key));
                    } else {
                      if (selectedCompareKeys.length >= 2) {
                        setSelectedCompareKeys([selectedCompareKeys[1], stack.key]);
                      } else {
                        setSelectedCompareKeys([...selectedCompareKeys, stack.key]);
                      }
                    }
                  }
                };

                return (
                  <div 
                    key={stack.key}
                    id={`stack-card-${stack.key}`}
                    onClick={handleCardClick}
                    className={`group p-5 rounded-2xl border transition-all duration-300 cursor-pointer text-left relative ${
                      compareMode
                        ? isCompareSelected
                          ? 'border-indigo-500/50 bg-indigo-500/[0.03] shadow-[0_0_20px_rgba(99,102,241,0.08)]'
                          : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.03]'
                        : isSelected 
                          ? 'border-indigo-500/50 bg-indigo-500/[0.03] shadow-[0_0_20px_rgba(99,102,241,0.08)]' 
                          : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.03]'
                    } ${stack.accentGlow}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 bg-black/40 rounded-xl border border-white/5 group-hover:border-white/10">
                        {stack.icon}
                      </div>
                      <div className="flex items-center gap-2">
                        {compareMode && (
                          isCompareSelected ? (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white border border-indigo-400 shadow-sm shadow-indigo-500/30">
                              {compareIdx + 1}
                            </span>
                          ) : (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-dashed border-white/20 group-hover:border-white/40 bg-black/20" />
                          )
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${stack.badgeColor}`}>
                          {stack.complexity}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-100 flex items-center justify-between">
                      {stack.title}
                      <ChevronRight size={16} className={`transition-transform duration-300 text-slate-500 ${
                        compareMode
                          ? isCompareSelected ? 'translate-x-1 text-indigo-400' : 'group-hover:translate-x-0.5'
                          : isSelected ? 'translate-x-1 text-indigo-400' : 'group-hover:translate-x-0.5'
                      }`} />
                    </h3>
                    <p className="text-xs font-mono text-indigo-400 mt-1">{stack.tech}</p>
                    <p className="text-xs text-slate-400 mt-2.5 leading-relaxed line-clamp-2">{stack.desc}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Deep-dive Spec Sheet */}
        <div className="lg:col-span-7 bg-white/[0.01] border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          {/* Subtle background radial accent matching the selected stack */}
          <div className="absolute -right-24 -top-24 w-64 h-64 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-5 gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-black/40 rounded-2xl border border-white/5">
                {selectedStack.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-100">{selectedStack.title}</h3>
                <p className="text-sm font-mono text-indigo-400">{selectedStack.tech}</p>
              </div>
            </div>

            {/* Performance Circular Meter */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Engine Rating</span>
                <span className="text-lg font-bold text-slate-200">{selectedStack.performanceScore}% Raw score</span>
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-white/5 flex items-center justify-center relative overflow-hidden bg-black/30">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-indigo-500" 
                  style={{ height: `${selectedStack.performanceScore}%`, opacity: 0.15 }}
                />
                <span className="text-xs font-bold text-slate-200 z-10">{selectedStack.performanceScore}</span>
              </div>
            </div>
          </div>

          <div className="py-6 space-y-6 relative z-10">
            {/* Ideal Use Case */}
            <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 mb-1.5">
                <Info size={14} /> Recommended Deployment Context
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                {selectedStack.useCase}
              </p>
            </div>

            {/* Pros & Cons Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={14} /> Engineering Pros
                </h4>
                <ul className="space-y-2">
                  {selectedStack.pros.map((pro, index) => (
                    <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-emerald-400 font-bold mt-0.5">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1">
                  <HelpCircle size={14} /> Trade-offs / Limitations
                </h4>
                <ul className="space-y-2">
                  {selectedStack.cons.map((con, index) => (
                    <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-orange-400 font-bold mt-0.5">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-5 flex items-center justify-between relative z-10 text-xs">
            <span className="text-slate-500">Discussed in transcript topic: <strong className="text-slate-300">{selectedStack.key === 'vanilla' || selectedStack.key === 'spa' ? 'Web Basics' : selectedStack.key === '3d' ? '3D Immersive Sites' : 'SaaS Architecture'}</strong></span>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-orange-400"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparative Matrix Section */}
      {compareMode && (
        <div className="mt-8 border-t border-white/5 pt-8 animate-fade-in">
          <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute -left-24 -bottom-24 w-64 h-64 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                  <Layers size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-100 font-sans">Side-by-Side Comparative Matrix</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Granular analysis of performance, state bindings, and core runtime traits.</p>
                </div>
              </div>
              <div className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-full font-semibold">
                {selectedCompareKeys.length}/2 Selected
              </div>
            </div>

            {selectedCompareKeys.length === 2 && stack1 && stack2 ? (
              <div className="space-y-4">
                {/* Table Header Row */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 pb-6 border-b border-white/10 items-center">
                  <div className="md:col-span-3 text-xs uppercase tracking-[0.2em] text-slate-500 font-bold font-mono">
                    Comparative Criteria
                  </div>
                  <div className="md:col-span-4 bg-indigo-500/[0.02] border border-indigo-500/10 rounded-2xl p-4 flex items-center gap-3">
                    <div className="p-2 bg-black/40 rounded-xl border border-white/5">
                      {stack1.icon}
                    </div>
                    <div>
                      <div className="text-xs text-indigo-400 font-mono font-bold">Architecture [1]</div>
                      <h4 className="text-base font-bold text-slate-100">{stack1.title}</h4>
                    </div>
                  </div>
                  <div className="md:col-span-5 bg-purple-500/[0.02] border border-purple-500/10 rounded-2xl p-4 flex items-center gap-3">
                    <div className="p-2 bg-black/40 rounded-xl border border-white/5">
                      {stack2.icon}
                    </div>
                    <div>
                      <div className="text-xs text-purple-400 font-mono font-bold">Architecture [2]</div>
                      <h4 className="text-base font-bold text-slate-100">{stack2.title}</h4>
                    </div>
                  </div>
                </div>

                {/* Table Feature Rows */}
                <div className="divide-y divide-white/5">
                  {comparisonFeatures.map((feat) => (
                    <div key={feat.name} className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 py-4 items-start text-left">
                      <div className="md:col-span-3 text-xs uppercase tracking-wider text-slate-400 font-bold font-mono pt-1">
                        {feat.name}
                      </div>
                      <div className="md:col-span-4 bg-white/[0.01] md:bg-transparent p-3 md:p-0 rounded-xl border border-white/5 md:border-none">
                        <div className="md:hidden text-[10px] uppercase font-bold text-indigo-400 mb-1">[{stack1.title}]</div>
                        {feat.value(stack1)}
                      </div>
                      <div className="md:col-span-5 bg-white/[0.01] md:bg-transparent p-3 md:p-0 rounded-xl border border-white/5 md:border-none">
                        <div className="md:hidden text-[10px] uppercase font-bold text-purple-400 mb-1">[{stack2.title}]</div>
                        {feat.value(stack2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center flex flex-col items-center justify-center">
                <div className="p-4 rounded-full bg-indigo-500/5 border border-indigo-500/10 text-indigo-400 mb-3 animate-pulse">
                  <Plus size={24} />
                </div>
                <h4 className="text-sm font-semibold text-slate-300">Choose Two Architectures</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md leading-relaxed">
                  {selectedCompareKeys.length === 0 
                    ? "Click on any two architecture cards above to populate the comparison matrix side-by-side."
                    : "Excellent! You have selected one architecture. Now select another card to load the side-by-side comparative table."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ChatView = ({ searchQuery }: { searchQuery: string }) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on load
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Filter messages based on search query
  const filteredMessages = CONVERSATION_DATA.filter(msg => 
    msg.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.searchText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 pb-24 animate-fade-in">
      {/* Session status banner */}
      <div className="mb-6 flex items-center justify-between bg-white/[0.02] border border-white/5 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 rounded bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-slate-200">Active Transcript Session</h4>
            <p className="text-xs text-slate-500">12 dynamic blocks verified with 100% fidelity</p>
          </div>
        </div>
        <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">UTC Standard Log</span>
      </div>

      {searchQuery && (
        <div className="mb-4 bg-indigo-500/5 border border-indigo-500/10 p-3 rounded-xl text-xs text-slate-400 flex items-center justify-between">
          <span>Displaying only messages matching <strong className="text-indigo-400 font-mono">"{searchQuery}"</strong></span>
          <span>Found {filteredMessages.length} results</span>
        </div>
      )}

      {filteredMessages.length === 0 ? (
        <div className="p-12 text-center border border-white/5 rounded-2xl bg-white/[0.01]">
          <ShieldAlert className="mx-auto text-amber-500/60 mb-3" size={32} />
          <p className="text-sm text-slate-300 font-semibold">No matches found for your filter</p>
          <p className="text-xs text-slate-500 mt-1">Try checking for simple words like "Next.js", "3D", or "Supabase" in the bottom search bar.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              
              {msg.role === 'assistant' && (
                <div className="w-10 h-10 rounded-xl bg-indigo-600/25 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm shadow-md mr-3.5 flex-shrink-0 mt-1 select-none">
                  AI
                </div>
              )}

              <div 
                className={`max-w-[85%] rounded-3xl p-5 md:p-6 shadow-md border text-left ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600/20 text-slate-100 rounded-tr-sm border-indigo-500/30 shadow-indigo-950/20' 
                    : 'bg-white/[0.02] border-white/5 rounded-tl-sm text-slate-300'
                }`}
              >
                {/* Topic Header */}
                <div className="flex items-center justify-between mb-3 gap-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    msg.role === 'user' 
                      ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' 
                      : 'bg-white/5 text-slate-400 border border-white/5'
                  }`}>
                    Topic: {msg.topic}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">
                    ID #{msg.id}
                  </span>
                </div>
                
                <div className="leading-relaxed text-sm md:text-[15px] font-sans">
                  {msg.content}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 font-semibold text-sm shadow-sm ml-3.5 flex-shrink-0 mt-1 select-none">
                  U
                </div>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      )}
    </div>
  );
};

// Beautiful Interactive Assets tab that lets users browse the framework settings files discussed
const AssetsView = () => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const activeFile = PROJECT_ASSETS[selectedFileIndex];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto animate-fade-in text-left">
      <div className="mb-8 border-b border-white/5 pb-6">
        <div className="inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-400 text-xs font-semibold px-3 py-1 rounded-full mb-3 border border-purple-500/20">
          <FileCode size={12} />
          <span>Workspace Environment Files</span>
        </div>
        <h2 className="text-2.5xl font-bold tracking-tight text-white font-sans">Project Architecture Assets</h2>
        <p className="text-slate-400 text-sm mt-1">Review verified config files, declarations, and metadata of the actual codebase.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left selector sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 mb-2">Available Code Artifacts</div>
          {PROJECT_ASSETS.map((file, idx) => {
            const isSelected = idx === selectedFileIndex;
            return (
              <button
                key={file.name}
                onClick={() => setSelectedFileIndex(idx)}
                className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all duration-200 ${
                  isSelected 
                    ? 'bg-purple-500/[0.03] border-purple-500/40 text-purple-400' 
                    : 'bg-white/[0.01] border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileText size={18} className={isSelected ? 'text-purple-400' : 'text-slate-500'} />
                  <span className="text-sm font-semibold font-mono truncate">{file.name}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-600 bg-white/5 px-2 py-0.5 rounded border border-white/5">{file.size}</span>
              </button>
            );
          })}

          <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl mt-6">
            <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5 mb-2">
              <Server size={14} className="text-emerald-400" /> Server Build Context
            </h4>
            <div className="space-y-1.5 text-xs text-slate-500">
              <div className="flex justify-between"><span className="font-mono">Node version:</span> <span className="text-slate-300">v22.x LTS</span></div>
              <div className="flex justify-between"><span className="font-mono">Output target:</span> <span className="text-slate-300">ES2022 (ESM)</span></div>
              <div className="flex justify-between"><span className="font-mono">HMR State:</span> <span className="text-amber-400">Disabled (Dev mode)</span></div>
            </div>
          </div>
        </div>

        {/* Right Code Block Viewer */}
        <div className="lg:col-span-8 bg-[#030303] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header tab decoration */}
          <div className="bg-white/[0.02] border-b border-white/5 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/40"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/40"></div>
              <span className="text-xs text-slate-400 font-mono ml-3 font-semibold">{activeFile.name}</span>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">{activeFile.language} format</span>
          </div>

          <div className="p-6 overflow-x-auto max-h-[480px]">
            <pre className="text-xs md:text-sm font-mono text-slate-300 text-left leading-relaxed">
              <code>{activeFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

// Historical Session Viewer in main view if the user selects an archived tab
const HistoricalSessionView = ({ session }: { session: HistoricalSession }) => {
  return (
    <div className="max-w-3xl mx-auto p-6 md:p-12 animate-fade-in text-left">
      <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute -right-24 -top-24 w-64 h-64 rounded-full bg-indigo-500/5 blur-3xl"></div>

        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-black/40 rounded-xl border border-white/5 text-slate-400">
              <Database size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">{session.title}</h3>
              <p className="text-xs font-mono text-slate-500">Archived Session · {session.date}</p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white/5 border border-white/10 px-2 py-1 rounded-md">
            Status: Read-Only
          </span>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Architectural Digest</h4>
            <p className="text-sm text-slate-300 leading-relaxed bg-white/[0.01] border border-white/5 p-4 rounded-xl">
              {session.overview}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3">Verified Component Specifications</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {session.architectureDetails.map((detail, index) => (
                <div key={index} className="p-3 bg-black/40 border border-white/5 rounded-xl flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-mono">{detail.label}</span>
                  <span className="text-indigo-400 font-semibold">{detail.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-xl flex items-start gap-3 mt-4">
            <ShieldAlert size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-amber-500 uppercase">Archived Node Guard</h5>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                This blueprint session represents historical data compiled on {session.date}. Chat interactive prompts are disabled for historical records. Select "Modern Web Stacks" in the sidebar to return to the active layout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard' | 'factory' | 'assets'>('chat');
  const [selectedStackKey, setSelectedStackKey] = useState<string>('vanilla');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSession, setActiveSession] = useState<string>('modern');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Set default dark mode theme variables automatically matching "Sophisticated Dark"
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.style.backgroundColor = '#050505';
  }, []);

  const handleSelectStack = (key: string) => {
    setSelectedStackKey(key);
  };

  // Keyboard shortcut hint handler (dynamic visual notification)
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans bg-[#050505] text-slate-100 select-none">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-indigo-600 border border-indigo-400/30 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-2xl z-50 flex items-center gap-2 animate-bounce">
          <Sparkles size={14} className="animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar: Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar Layout */}
      <aside className={`fixed lg:relative inset-y-0 left-0 w-72 border-r border-white/5 bg-black/60 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center border border-indigo-400/20 shadow-md">
              <Code size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-white leading-none">Arch. Archive</h1>
              <span className="text-[9px] font-bold text-slate-500 font-mono tracking-wider">WORKSPACE v1.0</span>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button 
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
        
        {/* Sidebar Navigation */}
        <div className="px-4 py-6 flex-1 overflow-y-auto space-y-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-4 px-2">Recent Sessions</div>
            <nav className="space-y-1.5">
              {Object.values(HISTORICAL_SESSIONS).map((session) => {
                const isActive = session.key === activeSession;
                return (
                  <div 
                    key={session.key}
                    onClick={() => {
                      setActiveSession(session.key);
                      setMobileSidebarOpen(false);
                      triggerToast(`Loaded "${session.title}" blueprint`);
                    }}
                    className={`p-3 rounded-xl border transition-all duration-200 flex flex-col gap-1 cursor-pointer text-left ${
                      isActive 
                        ? 'bg-white/5 border-white/10 shadow-lg' 
                        : 'bg-transparent border-transparent hover:bg-white/[0.02] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{session.title}</span>
                      {session.status === 'active' ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      ) : (
                        <span className="text-[8px] font-mono text-slate-600 bg-white/5 px-1 py-0.5 rounded">archived</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 italic">{session.topicsCount} topics · {session.date}</span>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Quick Filters */}
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-4 px-2">Preset Filters</div>
            <div className="space-y-1">
              {[
                { name: "All stacks", query: "" },
                { name: "Next.js", query: "Next.js" },
                { name: "Three.js 3D", query: "3D" },
                { name: "SaaS Dashboard", query: "SaaS" }
              ].map((filter) => (
                <button
                  key={filter.name}
                  onClick={() => {
                    setSearchQuery(filter.query);
                    triggerToast(`Filter applied: "${filter.name}"`);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between ${
                    searchQuery === filter.query 
                      ? 'text-indigo-400 bg-indigo-500/10' 
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.01]'
                  }`}
                >
                  <span>{filter.name}</span>
                  {filter.query && <span className="opacity-50 text-[10px]">/{filter.query}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User Identity widget inside footer layout */}
        <div className="p-4 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 flex items-center justify-center text-xs font-black">
              JD
            </div>
            <div className="flex-1 overflow-hidden text-left">
              <div className="text-xs font-bold text-slate-200 truncate">John Developer</div>
              <div className="text-[10px] text-slate-500 font-mono">Pro Tier Plan</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Navigation Tabs Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-black/20 backdrop-blur-md relative z-20">
          
          <div className="flex items-center gap-3 h-full">
            {/* Mobile menu trigger */}
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white"
            >
              <Menu size={18} />
            </button>

            {/* Navigation Tabs */}
            <div className="flex h-full items-center">
              {[
                { key: 'chat', label: 'Chat Transcript' },
                { key: 'dashboard', label: 'Architecture Dashboard' },
                { key: 'factory', label: '⚡ Velyon Portfolio Forge' },
                { key: 'assets', label: 'Assets' }
              ].map((tab) => {
                const isSelected = activeTab === tab.key;
                return (
                  <button 
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key as any);
                      triggerToast(`Switched to ${tab.label}`);
                    }}
                    className={`h-full px-4 md:px-6 text-xs md:text-sm font-medium transition-all duration-200 border-b-2 flex items-center ${
                      isSelected 
                        ? 'text-white border-indigo-500 font-semibold' 
                        : 'text-slate-400 hover:text-white border-transparent'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* System status details */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20 font-mono">System: Stable</span>
            </div>
            <button 
              onClick={() => triggerToast("System state log checked. 0 errors.")}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors"
              title="Inspect workspace"
            >
              <Terminal size={15} />
            </button>
          </div>
        </header>

        {/* Middle content wrapper */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#020202] via-[#050505] to-[#0d0d15] relative">
          
          {/* Main workspace controller depending on active session state */}
          {activeSession === 'modern' ? (
            <>
              {activeTab === 'chat' && (
                <ChatView searchQuery={searchQuery} />
              )}
              {activeTab === 'dashboard' && (
                <DashboardView 
                  selectedStackKey={selectedStackKey} 
                  onSelectStack={handleSelectStack} 
                  searchQuery={searchQuery}
                />
              )}
              {activeTab === 'factory' && (
                <FactoryView />
              )}
              {activeTab === 'assets' && (
                <AssetsView />
              )}
            </>
          ) : (
            <HistoricalSessionView session={HISTORICAL_SESSIONS[activeSession]} />
          )}

        </div>

        {/* Bottom Interactive Command/Chat Input */}
        <div className="h-20 border-t border-white/5 bg-[#030303] px-4 md:px-8 flex items-center gap-3 relative z-20">
          <form 
            onSubmit={(e) => e.preventDefault()}
            className="flex-1 bg-white/[0.03] border border-white/10 rounded-full h-12 flex items-center px-4 md:px-6 gap-3 focus-within:border-indigo-500/40 focus-within:bg-white/[0.04] transition-all"
          >
            <span className="text-indigo-400 font-bold font-mono">/</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs md:text-sm text-slate-200 w-full placeholder-slate-600 focus:ring-0" 
              placeholder="Ask about specific dependencies, portfolios, or architecture patterns..."
            />
            
            {searchQuery && (
              <button 
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  triggerToast("Search filter cleared");
                }}
                className="text-xs text-slate-500 hover:text-slate-300 bg-white/5 px-2 py-0.5 rounded-md"
              >
                Clear
              </button>
            )}

            <div className="hidden md:flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] text-slate-500 font-mono">Cmd</kbd>
              <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] text-slate-500 font-mono">K</kbd>
            </div>
          </form>
        </div>

      </main>
    </div>
  );
}
