// Synthesized UI sound effects + haptic (vibration) feedback.
// No audio files — every sound is a tiny oscillator blip generated on the fly,
// so there's nothing to download and nothing to license. Always on.

let ctx = null;

const getCtx = () => {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    ctx = new AudioCtx();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
};

export const vibrate = (pattern = 8) => {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    try { navigator.vibrate(pattern); } catch { /* no-op */ }
  }
};

// Quick attack / exponential decay blip. freq can glide to glideTo over duration.
const tone = ({ freq = 600, glideTo, duration = 0.08, type = "sine", gain = 0.05 }) => {
  const audio = getCtx();
  if (!audio) return;
  const osc = audio.createOscillator();
  const amp = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audio.currentTime);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, audio.currentTime + duration);
  amp.gain.setValueAtTime(gain, audio.currentTime);
  amp.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration);
  osc.connect(amp);
  amp.connect(audio.destination);
  osc.start();
  osc.stop(audio.currentTime + duration + 0.02);
};

export const playHover = () => { tone({ freq: 700, glideTo: 900, duration: 0.05, gain: 0.025 }); vibrate(4); };
export const playClick = () => { tone({ freq: 500, glideTo: 220, duration: 0.09, gain: 0.06 }); vibrate(10); };
export const playToggle = () => { tone({ freq: 400, glideTo: 700, duration: 0.07, gain: 0.045 }); vibrate(6); };
export const playSuccess = () => {
  tone({ freq: 520, glideTo: 660, duration: 0.1, gain: 0.05 });
  setTimeout(() => tone({ freq: 780, glideTo: 980, duration: 0.12, gain: 0.05 }), 90);
  vibrate([10, 40, 10]);
};
export const playError = () => { tone({ freq: 220, glideTo: 120, duration: 0.18, gain: 0.06, type: "square" }); vibrate([15, 30, 15]); };
