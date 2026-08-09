import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { useSection } from "../lib/useContent";

const ProjectCard = ({ p, i }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const flip = i % 2 === 1;

  return (
    <Reveal delay={0.05}>
      <a
        ref={ref}
        href={p.href || "#"}
        target={p.href ? "_blank" : undefined}
        rel={p.href ? "noreferrer" : undefined}
        onClick={(e) => { if (!p.href) e.preventDefault(); }}
        data-cursor="hover"
        data-testid={`project-${p.id}`}
        className="group grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center py-10 border-t border-white/15"
      >
        <div className={`md:col-span-7 ${flip ? "md:order-2" : ""}`}>
          <div className="relative overflow-hidden rounded-lg aspect-[16/10]">
            <motion.img
              style={{ y: imgY, scale: 1.2 }}
              src={p.img}
              alt={p.title}
              className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-void/30 group-hover:bg-void/0 transition-colors duration-500" />
            <div className="absolute top-5 left-5 flex items-center gap-2">
              <span className="rounded-full bg-void/70 backdrop-blur px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-neon">{p.cat}</span>
            </div>
          </div>
        </div>

        <div className={`md:col-span-5 ${flip ? "md:order-1" : ""}`}>
          <div className="flex items-center gap-4">
            <span className="font-mono text-sm text-dim">{p.index}</span>
            <span className="h-px flex-1 bg-white/15" />
            <span className="font-mono text-sm text-dim">{p.year}</span>
          </div>
          <h3 className="mt-5 font-display text-3xl md:text-5xl font-bold tracking-tight text-white flex items-center gap-3">
            {p.title}
            <ArrowUpRight className="text-neon opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" size={32} />
          </h3>
          <p className="mt-4 font-light text-base md:text-lg text-dim leading-relaxed">{p.desc}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {p.stack.map((t) => (
              <span key={t} className="font-mono text-[11px] uppercase tracking-wider text-dim">/ {t}</span>
            ))}
          </div>
        </div>
      </a>
    </Reveal>
  );
};

export const Projects = () => {
  const PROJECTS = useSection("PROJECTS");
  return (
    <section id="work" className="relative mx-auto max-w-[1600px] px-6 md:px-12 py-24 md:py-32" data-testid="projects-section">
      <Reveal className="mb-6 flex items-end justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-neon">(Selected Work)</span>
          <h2 className="mt-6 font-display text-4xl sm:text-5xl md:text-7xl font-bold uppercase tracking-tight text-white">Projects</h2>
        </div>
        <span className="hidden md:block font-mono text-sm text-dim">{PROJECTS.length} / featured</span>
      </Reveal>
      <div>
        {PROJECTS.map((p, i) => <ProjectCard key={p.id || i} p={p} i={i} />)}
      </div>
    </section>
  );
};
