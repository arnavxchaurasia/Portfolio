import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lenis from "lenis";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";
import "@/App.css";

import { Cursor } from "@/components/Cursor";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Blog } from "@/components/Blog";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Marquee } from "@/components/Marquee";
import { Studio } from "@/studio/Studio";
import { useSection } from "@/lib/useContent";
import { isMusicEnabled, startMusic } from "@/lib/music";

const Loader = ({ name }) => (
  <motion.div
    className="fixed inset-0 z-[999] grid place-items-center bg-void"
    initial={{ opacity: 1 }}
    exit={{ y: "-100%" }}
    transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
  >
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
      className="flex items-center gap-4 font-display text-2xl md:text-4xl font-black uppercase tracking-tight text-white"
    >
      <span className="h-3 w-3 rounded-full bg-neon animate-pulse" />
      {name}
    </motion.div>
  </motion.div>
);

const Site = () => {
  const lenisRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const PROFILE = useSection("PROFILE");

  useEffect(() => {
    // The browser restores scroll position on reload/back-nav, which can
    // land mid-page (e.g. near Contact). Force every load to start at top.
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true, lerp: 0.09 });
    lenisRef.current = lenis;
    let raf;
    const loop = (time) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    const t = setTimeout(() => setLoading(false), 1600);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); clearTimeout(t); };
  }, []);

  useEffect(() => {
    // Browsers block audio until a real user gesture. Keep retrying on every
    // gesture (not just the first) until playback actually succeeds — some
    // browsers reject the very first attempt even from a real click, and
    // giving up after one try left music permanently stuck off.
    if (!isMusicEnabled()) return;
    let done = false;
    const resume = () => {
      if (done) return;
      startMusic().then((ok) => {
        if (ok) { done = true; cleanup(); }
      });
    };
    const cleanup = () => {
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("touchstart", resume);
      window.removeEventListener("keydown", resume);
    };
    window.addEventListener("pointerdown", resume);
    window.addEventListener("touchstart", resume, { passive: true });
    window.addEventListener("keydown", resume);
    return cleanup;
  }, []);

  const navigate = (id) => {
    if (id === "#top") { lenisRef.current?.scrollTo(0); return; }
    const el = document.querySelector(id);
    if (el) lenisRef.current?.scrollTo(el, { offset: -20 });
  };

  return (
    <div className="App grain bg-void min-h-screen">
      <Cursor />
      <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: "#0A0B10", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontFamily: "JetBrains Mono" } }} />
      <AnimatePresence>{loading && <Loader name={PROFILE.name} />}</AnimatePresence>

      <Nav onNavigate={navigate} />
      <main>
        <Hero onNavigate={navigate} />
        <Marquee />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/studio" element={<Studio />} />
        <Route path="*" element={<Site />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
