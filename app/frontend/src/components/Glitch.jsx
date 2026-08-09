import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01#$%&/\\";

// Resolves `text` one character at a time from random noise — classic
// hacker-decode effect — calling onFrame as it goes and onDone once settled.
const scramble = (text, onFrame, onDone) => {
  const totalFrames = 12;
  let frame = 0;
  const iv = setInterval(() => {
    frame++;
    const revealCount = Math.floor((frame / totalFrames) * text.length);
    onFrame(
      text
        .split("")
        .map((ch, i) => (ch === " " ? " " : i < revealCount ? ch : CHARS[Math.floor(Math.random() * CHARS.length)]))
        .join("")
    );
    if (frame >= totalFrames) {
      clearInterval(iv);
      onFrame(text);
      onDone?.();
    }
  }, 28);
  return iv;
};

// Cycles through `words`, glitch-scrambling into each one, forever. Used for
// the punchline word in the hero tagline so it keeps changing after the
// initial reveal instead of sitting static.
export const GlitchCycle = ({ words, interval = 3000, startDelay = 0, className = "" }) => {
  const [display, setDisplay] = useState(words[0]);
  const [flicker, setFlicker] = useState(false);
  const idxRef = useRef(0);

  useEffect(() => {
    let scrambleIv;
    let timer;
    const scheduleNext = (delay) => {
      timer = setTimeout(() => {
        idxRef.current = (idxRef.current + 1) % words.length;
        setFlicker(true);
        scrambleIv = scramble(words[idxRef.current], setDisplay, () => setFlicker(false));
        scheduleNext(interval);
      }, delay);
    };
    scheduleNext(startDelay + interval);
    return () => { clearTimeout(timer); clearInterval(scrambleIv); };
  }, [words, interval, startDelay]);

  return (
    <span className={`inline-block ${flicker ? "glitch-flicker" : ""} ${className}`}>
      {display}
    </span>
  );
};

// Re-scrambles its own word back into itself on a staggered, randomized
// loop — a ripple of "digital noise" that moves word-by-word across a line
// instead of a plain static sentence.
export const GlitchWord = ({ word, index = 0, baseInterval = 3200, className = "" }) => {
  const [display, setDisplay] = useState(word);
  const [flicker, setFlicker] = useState(false);

  useEffect(() => {
    let timer, iv;
    const schedule = (delay) => {
      timer = setTimeout(() => {
        setFlicker(true);
        iv = scramble(word, setDisplay, () => setFlicker(false));
        schedule(baseInterval + Math.random() * 1800);
      }, delay);
    };
    schedule(500 + index * 450 + Math.random() * 400);
    return () => { clearTimeout(timer); clearInterval(iv); };
  }, [word, index, baseInterval]);

  return (
    <span className={`inline-block ${flicker ? "glitch-flicker" : ""} ${className}`}>
      {display}
    </span>
  );
};

// One-shot scramble-in, triggered once when it enters the viewport — for
// headings that want a "decode" reveal rather than a plain fade.
export const ScrambleIn = ({ text, className = "", delay = 0 }) => {
  const [display, setDisplay] = useState(text);
  const [flicker, setFlicker] = useState(false);
  const ref = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !done.current) {
          done.current = true;
          setTimeout(() => {
            setFlicker(true);
            scramble(text, setDisplay, () => setFlicker(false));
          }, delay * 1000);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [text, delay]);

  return (
    <span ref={ref} className={`inline-block ${flicker ? "glitch-flicker" : ""} ${className}`}>
      {display}
    </span>
  );
};
