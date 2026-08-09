// Blueprint/circuit-style backdrop — fine grid lines + a couple of drifting
// "trace node" dots, faded at the edges. Reads as engineering schematic
// rather than generic decoration, fitting the tech-stack section.
export const CircuitBackground = ({ className = "" }) => (
  <div
    className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
    aria-hidden
  >
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "linear-gradient(rgba(204,255,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(204,255,0,0.06) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
        maskImage: "radial-gradient(ellipse 75% 65% at 50% 35%, black 30%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse 75% 65% at 50% 35%, black 30%, transparent 80%)",
      }}
    />
    <div
      className="absolute -top-24 right-0 h-[420px] w-[420px] rounded-full blur-[100px]"
      style={{ background: "radial-gradient(circle, rgba(204,255,0,0.10), transparent 70%)" }}
    />
    <div
      className="absolute bottom-0 left-10 h-[320px] w-[320px] rounded-full blur-[90px]"
      style={{ background: "radial-gradient(circle, rgba(10,37,64,0.5), transparent 70%)" }}
    />
  </div>
);
