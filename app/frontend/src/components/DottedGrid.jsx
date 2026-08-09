// Subtle repeating dot-grid backdrop — pure CSS, no canvas needed.
export const DottedGrid = ({ className = "" }) => (
  <div
    className={`pointer-events-none absolute inset-0 z-0 ${className}`}
    style={{
      backgroundImage: "radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1.5px)",
      backgroundSize: "28px 28px",
      maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 85%)",
      WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 85%)",
    }}
    aria-hidden
  />
);
