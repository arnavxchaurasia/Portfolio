import { Reveal } from "./Reveal";
import { ExperienceScene } from "./ExperienceScene";
import { useSection } from "../lib/useContent";

export const Experience = () => {
  const EXPERIENCE = useSection("EXPERIENCE");
  return (
  <section id="experience" className="relative mx-auto max-w-[1600px] px-6 md:px-12 py-24 md:py-32 overflow-hidden" data-testid="experience-section">
    <ExperienceScene />
    <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12">
      <div className="md:col-span-4">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-neon">(Trajectory)</span>
          <h2 className="mt-6 font-display text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight leading-[0.95] text-white sticky top-28">
            Where<br />I've Been
          </h2>
        </Reveal>
      </div>

      <div className="md:col-span-7 md:col-start-6">
        <div className="relative border-l border-white/15 pl-8 md:pl-12">
          {EXPERIENCE.map((e, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="group relative pb-14 last:pb-0" data-cursor="hover">
                <span className="absolute -left-[41px] md:-left-[57px] top-1.5 grid place-items-center">
                  <span className="h-3 w-3 rounded-full bg-void border border-white/30 group-hover:bg-neon group-hover:border-neon transition-colors duration-300" />
                </span>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-neon">{e.year}</span>
                <h3 className="mt-2 font-display text-2xl md:text-4xl font-bold tracking-tight text-white">{e.role}</h3>
                <p className="mt-1 font-mono text-sm text-dim">{e.org}</p>
                <p className="mt-3 max-w-lg font-light text-dim leading-relaxed">{e.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
  );
};
