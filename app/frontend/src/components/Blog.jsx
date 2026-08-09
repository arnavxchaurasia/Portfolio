import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { useSection } from "../lib/useContent";

export const Blog = () => {
  const POSTS = useSection("POSTS");
  const CERTIFICATIONS = useSection("CERTIFICATIONS");
  const [active, setActive] = useState(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 150, damping: 20 });
  const y = useSpring(my, { stiffness: 150, damping: 20 });

  const onMove = (e) => { mx.set(e.clientX + 24); my.set(e.clientY - 120); };

  // Once real posts exist in POSTS, they take over this section automatically.
  const hasPosts = POSTS.length > 0;
  const items = hasPosts ? POSTS : CERTIFICATIONS;

  return (
    <section id="journal" className="relative mx-auto max-w-[1600px] px-6 md:px-12 py-24 md:py-32" data-testid="blog-section" onMouseMove={onMove}>
      <Reveal className="mb-10 flex items-end justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-neon">{hasPosts ? "(Writing)" : "(Learning)"}</span>
          <h2 className="mt-6 font-display text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight text-white">{hasPosts ? "Journal" : "Certifications"}</h2>
        </div>
      </Reveal>

      <div className="border-t border-white/15">
        {items.map((item, i) => (
          <Reveal key={i} delay={i * 0.06}>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              data-cursor="hover"
              data-testid={`blog-post-${i}`}
              className="group flex items-center justify-between gap-6 py-8 border-b border-white/15"
            >
              <div className="flex items-baseline gap-6 md:gap-10">
                <span className="font-mono text-xs text-dim">0{i + 1}</span>
                <h3 className="font-display text-xl md:text-4xl font-bold tracking-tight text-white group-hover:text-neon transition-colors duration-300 group-hover:translate-x-2 md:group-hover:translate-x-4">
                  {item.title}
                </h3>
              </div>
              <div className="flex items-center gap-6 shrink-0">
                <span className="hidden md:block font-mono text-xs uppercase tracking-wider text-dim">{item.tag}{hasPosts ? ` · ${item.read}` : ""}</span>
                <span className="font-mono text-xs text-dim">{hasPosts ? item.date : item.org}</span>
                <ArrowUpRight className="text-dim group-hover:text-neon transition-colors" size={20} />
              </div>
            </a>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && hasPosts && (
          <motion.div
            className="pointer-events-none fixed top-0 left-0 z-40 hidden md:block"
            style={{ x, y }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25 }}
          >
            <img src={POSTS[active].img} alt="" className="h-52 w-72 rounded-lg object-cover border border-white/20" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
