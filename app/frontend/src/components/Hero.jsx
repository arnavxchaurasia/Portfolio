import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { MaskText } from "./Reveal";
import { Magnetic } from "./Magnetic";
import { GlitchWord, GlitchCycle } from "./Glitch";
import { useSection } from "../lib/useContent";

// Splits the tagline into: everything up to and including "across" (static),
// and everything after it (each word gets its own ambient glitch ripple).
// Falls back to only glitching the last line if "across" isn't found, so
// this stays safe if the tagline is edited from the Studio.
const splitTagline = (lines) => {
  const acrossLineIdx = lines.findIndex((l) => /\bacross\b/i.test(l));
  if (acrossLineIdx === -1) {
    return { staticLines: lines.slice(0, -1), glitchLines: [lines[lines.length - 1]] };
  }
  const staticLines = lines.slice(0, acrossLineIdx);
  const acrossLine = lines[acrossLineIdx];
  const match = acrossLine.match(/^(.*?\bacross\b)(.*)$/i);
  const prefix = match ? match[1] : acrossLine;
  const rest = match ? match[2].trim() : "";
  return {
    staticLines,
    acrossPrefix: prefix,
    glitchLines: [rest, ...lines.slice(acrossLineIdx + 1)].filter(Boolean),
  };
};

export const Hero = ({ onNavigate }) => {
  const PROFILE = useSection("PROFILE");
  const { staticLines, acrossPrefix, glitchLines } = splitTagline(PROFILE.tagline);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative min-h-screen w-full overflow-hidden flex flex-col justify-center" data-testid="hero-section">
      {/* Aurora blurs */}
      <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [0, -120]) }} className="aurora w-[42vw] h-[42vw] -left-[8vw] top-[8vh]" aria-hidden>
        <div className="w-full h-full rounded-full" style={{ background: "#0A2540" }} />
      </motion.div>
      <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [0, 160]) }} className="aurora w-[38vw] h-[38vw] right-[-6vw] bottom-[4vh]" aria-hidden>
        <div className="w-full h-full rounded-full" style={{ background: "#092E20" }} />
      </motion.div>
      <div className="aurora w-[22vw] h-[22vw] left-[38vw] bottom-[20vh]" aria-hidden>
        <div className="w-full h-full rounded-full" style={{ background: "#3B0918" }} />
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 mx-auto max-w-[1600px] w-full px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="mb-8 flex items-center gap-4"
        >
          <span className="h-px w-12 bg-neon" />
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-neon">{PROFILE.role} — {PROFILE.year}</span>
        </motion.div>

        <h1 className="font-display font-black uppercase leading-[0.9] tracking-tighter text-white text-5xl sm:text-7xl md:text-8xl lg:text-[9rem]">
          <MaskText lines={staticLines} delay={0.4} />
          {acrossPrefix !== undefined ? (
            (() => {
              let globalIdx = 0;
              return glitchLines.map((line, li) => {
                const words = line.split(" ");
                return (
                  <span key={li} className="block overflow-hidden">
                    <motion.span
                      className="block"
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      transition={{ duration: 1, delay: 0.4 + (staticLines.length + li) * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {li === 0 && <>{acrossPrefix} </>}
                      {words.map((word, wi) => {
                        const idx = globalIdx++;
                        return (
                          <span key={wi}>
                            <GlitchWord word={word} index={idx} />
                            {wi < words.length - 1 ? " " : ""}
                          </span>
                        );
                      })}
                    </motion.span>
                  </span>
                );
              });
            })()
          ) : (
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1, delay: 0.4 + staticLines.length * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                <GlitchCycle words={glitchLines} />
              </motion.span>
            </span>
          )}
        </h1>

        <div className="mt-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.8 }}
            className="max-w-md font-light text-base md:text-lg text-dim leading-relaxed"
          >
            {PROFILE.bio}
          </motion.p>
          <Magnetic>
            <button
              onClick={() => onNavigate("#work")}
              className="group flex items-center gap-4 border border-white/20 rounded-full pl-6 pr-2 py-2 hover:border-neon transition-colors"
              data-testid="hero-view-work"
            >
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-white">View Selected Work</span>
              <span className="grid place-items-center h-10 w-10 rounded-full bg-neon text-void group-hover:rotate-90 transition-transform duration-300">
                <ArrowDown size={18} />
              </span>
            </button>
          </Magnetic>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
        className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-dim">Scroll</span>
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
          <ArrowDown size={16} className="text-neon" />
        </motion.span>
      </motion.div>
    </section>
  );
};
