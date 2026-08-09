import { motion } from "framer-motion";

// Music play/pause toggle — a small orb with two particles in true circular
// orbits (opposite directions, different radii/speeds) around a pulsing
// core, plus a slowly rotating conic-gradient ring when active.
export const MusicOrb = ({ on, onClick }) => (
  <button
    onClick={onClick}
    aria-label={on ? "Pause background music" : "Play background music"}
    data-testid="nav-music-toggle"
    data-cursor="hover"
    className="relative grid place-items-center h-9 w-9 shrink-0"
  >
    {/* Rotating conic gradient ring */}
    <motion.span
      className="absolute inset-0 rounded-full"
      style={{
        background: on
          ? "conic-gradient(from 0deg, rgba(204,255,0,0.9), rgba(204,255,0,0) 55%, rgba(204,255,0,0.9) 100%)"
          : "conic-gradient(from 0deg, rgba(255,255,255,0.25), rgba(255,255,255,0) 55%, rgba(255,255,255,0.25) 100%)",
        WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1.5px))",
        mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1.5px))",
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: on ? 5 : 14, repeat: Infinity, ease: "linear" }}
    />

    {/* Inner void fill */}
    <span className="absolute inset-[3px] rounded-full bg-void" />

    {/* Orbiting particles */}
    {on && (
      <>
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
        >
          <span className="absolute top-[2px] left-1/2 -translate-x-1/2 h-[3px] w-[3px] rounded-full bg-neon shadow-[0_0_6px_2px_rgba(204,255,0,0.9)]" />
        </motion.div>
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: -360 }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "linear" }}
        >
          <span className="absolute bottom-[3px] left-1/2 -translate-x-1/2 h-[2px] w-[2px] rounded-full bg-white/90 shadow-[0_0_4px_1px_rgba(255,255,255,0.7)]" />
        </motion.div>
      </>
    )}

    {/* Pulsing core */}
    <motion.span
      className={`relative h-1.5 w-1.5 rounded-full ${on ? "bg-neon" : "bg-dim"}`}
      animate={on ? { scale: [1, 1.6, 1], opacity: [0.9, 1, 0.9] } : { scale: 1, opacity: 0.6 }}
      transition={on ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
      style={on ? { boxShadow: "0 0 8px 2px rgba(204,255,0,0.7)" } : undefined}
    />
  </button>
);
