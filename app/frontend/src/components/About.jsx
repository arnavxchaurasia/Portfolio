import { Reveal } from "./Reveal";
import { DottedGrid } from "./DottedGrid";
import { useSection } from "../lib/useContent";

export const About = () => {
  const MANIFESTO = useSection("MANIFESTO");
  const PROFILE = useSection("PROFILE");
  return (
  <section id="about" className="relative mx-auto max-w-[1600px] px-6 md:px-12 py-24 md:py-40" data-testid="about-section">
    <DottedGrid />
    <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
      <div className="md:col-span-4">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-neon">(About)</span>
          <h2 className="mt-6 font-display text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight leading-[0.95] text-white">
            The<br />Manifesto
          </h2>
          <div className="mt-10 overflow-hidden rounded-lg border border-white/10">
            <img
              src={PROFILE.avatar || "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1Mjh8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGRldmVsb3BlciUyMHBvcnRyYWl0JTIwZGFya3xlbnwwfHx8fDE3ODYwMTE1MTB8MA&ixlib=rb-4.1.0&q=85"}
              alt="Portrait"
              className="w-full h-72 md:h-96 object-cover grayscale hover:grayscale-0 transition-all duration-700"
              data-testid="about-portrait"
            />
          </div>
        </Reveal>
      </div>

      <div className="md:col-span-7 md:col-start-6 flex flex-col gap-16 md:gap-24 md:pt-16">
        {MANIFESTO.map((m, i) => (
          <Reveal key={m.n} delay={i * 0.1}>
            <div className="relative border-t border-white/15 pt-8" data-cursor="hover">
              <span className="pointer-events-none absolute -top-8 right-0 font-mono text-7xl md:text-9xl font-bold text-white/5 select-none">{m.n}</span>
              <h3 className="font-display text-2xl md:text-4xl font-bold tracking-tight text-white">{m.title}</h3>
              <p className="mt-4 max-w-xl font-light text-base md:text-lg text-dim leading-relaxed">{m.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
  );
};
