import { Reveal } from "./Reveal";
import { CircuitBackground } from "./CircuitBackground";
import { useSection } from "../lib/useContent";

export const Skills = () => {
  const SKILLS = useSection("SKILLS");
  return (
  <section id="skills" className="relative mx-auto max-w-[1600px] px-6 md:px-12 py-24 md:py-32 overflow-hidden" data-testid="skills-section">
    <CircuitBackground />
    <div className="relative z-10">
    <Reveal className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-neon">(Capabilities)</span>
        <h2 className="mt-6 font-display text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight text-white">Tech Stack</h2>
      </div>
      <p className="max-w-sm font-light text-dim">A toolkit spanning intelligence, infrastructure, and interface — end to end.</p>
    </Reveal>

    <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[minmax(180px,auto)] gap-4 md:gap-5">
      {SKILLS.map((s, i) => (
        <Reveal key={s.title} delay={i * 0.06} className={s.span}>
          <div
            data-cursor="hover"
            data-testid={`skill-card-${i}`}
            className="group h-full flex flex-col justify-between rounded-lg border border-white/15 p-6 md:p-8 hover:border-neon transition-colors duration-300 relative overflow-hidden bg-void/40 backdrop-blur-sm"
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-neon/0 group-hover:bg-neon/10 blur-2xl transition-colors duration-500" />
            <div className="flex items-start justify-between">
              <span className="font-mono text-xs text-dim">0{i + 1}</span>
              <span className="font-mono text-xs text-dim group-hover:text-neon transition-colors">↗</span>
            </div>
            <div>
              <h3 className={`font-display font-bold tracking-tight text-white ${s.big ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"}`}>{s.title}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span key={t} className="rounded-full border border-white/15 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-dim group-hover:border-white/30 transition-colors">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
    </div>
  </section>
  );
};
