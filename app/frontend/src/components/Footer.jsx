import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSection } from "../lib/useContent";

export const Footer = () => {
  const PROFILE = useSection("PROFILE");
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const t = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" });
      setTime(t);
    };
    tick();
    const id = setInterval(tick, 1000 * 30);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="relative border-t border-white/10 bg-void" data-testid="footer">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-14">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div>
            <span className="font-display text-3xl font-black text-white">{PROFILE.name}<span className="text-neon">.</span></span>
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-dim">{PROFILE.location} — {time} IST</p>
          </div>
          <div className="flex flex-wrap gap-8">
            {PROFILE.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="font-mono text-xs uppercase tracking-[0.2em] text-dim hover:text-neon transition-colors" data-testid={`footer-${s.label.split(" ")[0].toLowerCase()}`}>
                {s.label}
              </a>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col md:flex-row justify-between gap-4 border-t border-white/10 pt-6">
          <span className="font-mono text-[11px] uppercase tracking-wider text-dim">
            <Link to="/studio" className="hover:text-dim/60 transition-colors" aria-hidden="true" tabIndex={-1} data-testid="footer-studio-link">©</Link>
            {" "}{new Date().getFullYear()} — Built with intent.
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-dim">Available for opportunities</span>
        </div>
      </div>
    </footer>
  );
};
