import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { playHover, playClick } from "../lib/fx";

// Neon dot + trailing ring with blend mode. Expands over interactive elements.
export const Cursor = () => {
  const [hovering, setHovering] = useState(false);
  const [hidden, setHidden] = useState(false);
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { stiffness: 300, damping: 30, mass: 0.5 });
  const ringY = useSpring(dotY, { stiffness: 300, damping: 30, mass: 0.5 });
  const raf = useRef(null);
  const wasHovering = useRef(false);

  useEffect(() => {
    document.body.classList.add("custom-cursor-active");
    return () => document.body.classList.remove("custom-cursor-active");
  }, []);

  useEffect(() => {
    const move = (e) => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        dotX.set(e.clientX);
        dotY.set(e.clientY);
        const el = e.target;
        const interactive = !!el.closest("a, button, input, textarea, [data-cursor='hover']");
        setHovering(interactive);
        if (interactive && !wasHovering.current) playHover();
        wasHovering.current = interactive;
      });
    };
    const click = (e) => {
      if (e.target.closest("a, button, [data-cursor='hover']")) playClick();
    };
    const leave = () => setHidden(true);
    const enter = () => setHidden(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", click);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", click);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
    };
  }, [dotX, dotY]);

  return (
    <>
      <motion.div
        className="cursor-dot hidden md:block"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: hovering ? 0.4 : 1, opacity: hidden ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="cursor-ring hidden md:block"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: hovering ? 1.8 : 1, opacity: hidden ? 0 : hovering ? 1 : 0.5 }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
};
