import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Magnetic } from "./Magnetic";
import { isMusicPlaying, toggleMusic, onMusicChange } from "../lib/music";
import { MusicOrb } from "./MusicOrb";

const LINKS = [
  { label: "About", id: "#about" },
  { label: "Skills", id: "#skills" },
  { label: "Work", id: "#work" },
  { label: "Experience", id: "#experience" },
  { label: "Journal", id: "#journal" },
];

export const Nav = ({ onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [musicOn, setMusicOn] = useState(isMusicPlaying());

  const handleToggleMusic = () => {
    toggleMusic();
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => onMusicChange(setMusicOn), []);

  const go = (id) => { setOpen(false); onNavigate(id); };

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${scrolled ? "backdrop-blur-xl bg-surface/60 border-b border-white/10" : "bg-transparent"}`}
      data-testid="main-nav"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 h-20 flex items-center justify-between">
        <button onClick={() => go("#top")} className="font-display text-xl font-black tracking-tight text-white" data-testid="nav-logo">
          Arnavvv<span className="text-neon">.</span>
        </button>

        <nav className="hidden md:flex items-center gap-10">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="font-mono text-xs uppercase tracking-[0.2em] text-dim hover:text-white transition-colors"
              data-testid={`nav-${l.label.toLowerCase()}`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <span className="hidden md:block">
            <MusicOrb on={musicOn} onClick={handleToggleMusic} />
          </span>
          <Magnetic className="hidden md:block">
            <button
              onClick={() => go("#contact")}
              className="rounded-full bg-neon px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.15em] text-void hover:scale-105 transition-transform"
              data-testid="nav-contact-cta"
            >
              Let's Talk
            </button>
          </Magnetic>
          <button className="md:hidden text-white" onClick={() => setOpen(!open)} data-testid="nav-mobile-toggle">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-surface/95 backdrop-blur-xl border-t border-white/10"
          >
            <div className="flex flex-col px-6 py-6 gap-5">
              {[...LINKS, { label: "Contact", id: "#contact" }].map((l) => (
                <button key={l.id} onClick={() => go(l.id)} className="text-left font-display text-2xl font-bold text-white" data-testid={`nav-mobile-${l.label.toLowerCase()}`}>
                  {l.label}
                </button>
              ))}
              <button onClick={handleToggleMusic} className="flex items-center gap-3 pt-2 border-t border-white/10 w-fit" data-testid="nav-mobile-music">
                <MusicOrb on={musicOn} onClick={handleToggleMusic} />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-dim">{musicOn ? "Pause Music" : "Play Music"}</span>
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
