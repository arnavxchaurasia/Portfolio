import { useSection } from "../lib/useContent";

export const Marquee = () => {
  const MARQUEE = useSection("MARQUEE");
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <div
      className="marquee-wrap relative w-full overflow-hidden border-y border-white/10 py-8 mt-6 md:mt-10 bg-void"
      data-testid="tech-marquee"
      data-cursor="hover"
      style={{
        maskImage: "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(ellipse 60% 100% at 50% 50%, rgba(204,255,0,0.06), transparent 70%)" }} aria-hidden />
      <div className="flex flex-col gap-3">
        <div className="marquee-track relative">
          {items.map((item, i) => (
            <span key={i} className="mx-8 flex items-center gap-8 font-display text-4xl md:text-6xl font-black uppercase tracking-tight text-stroke transition-colors duration-300 hover:text-neon hover:[-webkit-text-stroke:0px]">
              {item}
              <span className="text-neon text-3xl md:text-5xl">✦</span>
            </span>
          ))}
        </div>
        <div className="marquee-track-reverse relative opacity-50">
          {items.map((item, i) => (
            <span key={i} className="mx-8 flex items-center gap-6 font-mono text-lg md:text-2xl font-medium uppercase tracking-widest text-dim transition-colors duration-300 hover:text-neon">
              {item}
              <span className="text-neon">/</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
