import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ArrowUpRight, Download, Eye, X, ExternalLink } from "lucide-react";
import { Reveal } from "./Reveal";
import { Magnetic } from "./Magnetic";
import { ScrambleIn } from "./Glitch";
import { useSection } from "../lib/useContent";
import { playSuccess, playError } from "../lib/fx";

const ResumeModal = ({ url, onClose }) => (
  <motion.div
    className="fixed inset-0 z-[200] grid place-items-center bg-void/90 backdrop-blur-sm p-6"
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    onClick={onClose}
    data-testid="resume-modal"
  >
    <motion.div
      className="relative w-full max-w-3xl h-[85vh] bg-surface border border-white/15 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-dim">Résumé</span>
        <div className="flex items-center gap-4">
          <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-dim hover:text-neon transition-colors" data-testid="resume-open-tab">
            <ExternalLink size={14} /> Open in new tab
          </a>
          <button onClick={onClose} className="text-dim hover:text-white transition-colors" aria-label="Close" data-testid="resume-modal-close">
            <X size={18} />
          </button>
        </div>
      </div>
      <iframe src={url} title="Résumé" className="w-full h-[calc(100%-45px)] bg-white" />
    </motion.div>
  </motion.div>
);

export const Contact = () => {
  const PROFILE = useSection("PROFILE");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [showResume, setShowResume] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      playError();
      toast.error("Please fill in every field.");
      return;
    }

    const subject = `Let's build something — from ${form.name}`;
    const body = `${form.message}\n\n—\n${form.name}\n${form.email}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(PROFILE.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    playSuccess();
    toast.success("Redirecting to Gmail...");
    setForm({ name: "", email: "", message: "" });
    window.location.href = gmailUrl;
  };

  const inputCls = "w-full bg-transparent border-0 border-b border-white/20 rounded-none px-0 py-4 text-lg text-white placeholder:text-dim/60 focus:outline-none focus:border-neon transition-colors";

  return (
    <section id="contact" className="relative mx-auto max-w-[1600px] px-6 md:px-12 py-24 md:py-40 overflow-hidden" data-testid="contact-section">
      <div className="aurora w-[40vw] h-[40vw] left-[30vw] top-[10vh]" aria-hidden>
        <div className="w-full h-full rounded-full" style={{ background: "#0A2540" }} />
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
        <div className="md:col-span-6 relative">
          <Reveal className="relative z-10">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-neon">(Contact)</span>
            <h2 className="mt-6 font-display text-5xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-white">
              Let's<br />build<br /><ScrambleIn text="something." className="text-stroke" />
            </h2>
            <div className="mt-10 flex flex-col gap-4">
              <a href={`mailto:${PROFILE.email}`} className="font-display text-xl md:text-2xl text-white hover:text-neon transition-colors flex items-center gap-2 w-fit" data-testid="contact-email-link">
                {PROFILE.email} <ArrowUpRight size={20} />
              </a>
              <div className="flex flex-wrap gap-4">
                <Magnetic className="w-fit">
                  <button type="button" onClick={() => setShowResume(true)} className="flex items-center gap-3 border border-white/20 rounded-full px-6 py-3 hover:border-neon transition-colors" data-testid="resume-view">
                    <Eye size={18} className="text-neon" />
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-white">View Résumé</span>
                  </button>
                </Magnetic>
                <Magnetic className="w-fit">
                  <a href={PROFILE.resumeUrl} download className="flex items-center gap-3 border border-white/20 rounded-full px-6 py-3 hover:border-neon transition-colors" data-testid="resume-download">
                    <Download size={18} className="text-neon" />
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-white">Download Résumé</span>
                  </a>
                </Magnetic>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="md:col-span-6">
          <Reveal delay={0.1}>
            <form onSubmit={submit} className="flex flex-col gap-8" data-testid="contact-form">
              <div>
                <label className="font-mono text-xs uppercase tracking-[0.2em] text-dim">01 / Your name</label>
                <input className={inputCls} value={form.name} onChange={update("name")} placeholder="Ada Lovelace" data-testid="contact-name" />
              </div>
              <div>
                <label className="font-mono text-xs uppercase tracking-[0.2em] text-dim">02 / Email</label>
                <input type="email" className={inputCls} value={form.email} onChange={update("email")} placeholder="you@company.com" data-testid="contact-email-input" />
              </div>
              <div>
                <label className="font-mono text-xs uppercase tracking-[0.2em] text-dim">03 / Message</label>
                <textarea rows={4} className={inputCls + " resize-none"} value={form.message} onChange={update("message")} placeholder="Tell me about the project..." data-testid="contact-message" />
              </div>
              <Magnetic strength={0.25} className="w-full">
                <button
                  type="submit"
                  className="w-full rounded-full bg-neon py-5 font-mono text-sm font-bold uppercase tracking-[0.2em] text-void hover:scale-[1.02] transition-transform"
                  data-testid="contact-submit"
                >
                  Send Message
                </button>
              </Magnetic>
            </form>
          </Reveal>
        </div>
      </div>

      <AnimatePresence>
        {showResume && <ResumeModal url={PROFILE.resumeUrl} onClose={() => setShowResume(false)} />}
      </AnimatePresence>
    </section>
  );
};
