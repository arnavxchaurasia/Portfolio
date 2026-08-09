// Background music — plays /bgm.mp3, always starting at 0:14 and looping
// back to 0:14 (never 0:00) once it reaches the end.

const STORAGE_KEY = "music-enabled";
const START_TIME = 14;

let audio = null;
let playing = false;
const listeners = new Set();

const ensureAudio = () => {
  if (audio) return audio;
  audio = new Audio("/bgm.mp3");
  audio.preload = "auto";
  audio.volume = 0.35;
  audio.addEventListener("timeupdate", () => {
    if (audio.duration && audio.currentTime >= audio.duration - 0.15) {
      audio.currentTime = START_TIME;
    }
  });
  return audio;
};

export const isMusicPlaying = () => playing;
// Defaults to on — only stays off once a visitor explicitly mutes it.
export const isMusicEnabled = () => typeof localStorage === "undefined" || localStorage.getItem(STORAGE_KEY) !== "off";

export const onMusicChange = (cb) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

// Returns true if playback actually started, false if the browser blocked
// it (e.g. this call wasn't tied closely enough to a user gesture) — the
// caller can use that to decide whether to retry on the next gesture.
export const startMusic = () => {
  if (playing) return Promise.resolve(true);
  const el = ensureAudio();

  // .play() must be called synchronously inside the user-gesture handler or
  // browsers silently block it — it must NOT be deferred behind an async
  // "loadedmetadata" callback. Seeking to START_TIME is fine to defer since
  // seeking isn't gated by the autoplay policy.
  const seek = () => { el.currentTime = START_TIME; };
  if (el.readyState >= 1) seek();
  else el.addEventListener("loadedmetadata", seek, { once: true });

  return el.play().then(
    () => {
      // Only now do we consider it actually playing — setting this flag on
      // a failed attempt was the bug: it made every subsequent startMusic()
      // call silently no-op forever (see the `if (playing) return` above),
      // so one blocked autoplay attempt could permanently wedge playback.
      playing = true;
      if (typeof localStorage !== "undefined") localStorage.setItem(STORAGE_KEY, "on");
      listeners.forEach((l) => l(true));
      return true;
    },
    () => false
  );
};

export const stopMusic = () => {
  if (!playing) return;
  if (audio) audio.pause();
  playing = false;
  if (typeof localStorage !== "undefined") localStorage.setItem(STORAGE_KEY, "off");
  listeners.forEach((l) => l(false));
};

export const toggleMusic = () => (playing ? stopMusic() : startMusic());
