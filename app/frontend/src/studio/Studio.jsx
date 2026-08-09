import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { ArrowLeft, LogOut, Trash2, Pencil, Plus, ArrowUp, ArrowDown, Download } from "lucide-react";
import { login, logout, isAuthed, googleClientId, loginWithGoogleIdToken } from "../lib/auth";
import { useSection } from "../lib/useContent";
import { addItem, updateItem, deleteItem, reorderItem, updateProfile, setSection, exportJSON, resetAll, hasOverrides } from "../lib/store";

const inputCls = "w-full bg-transparent border border-white/15 rounded-md px-3 py-2 text-sm text-white placeholder:text-dim/50 focus:outline-none focus:border-neon transition-colors";
const btnPrimary = "rounded-full bg-neon px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-void hover:scale-[1.03] transition-transform";
const btnGhost = "rounded-full border border-white/20 px-5 py-2 font-mono text-xs uppercase tracking-wider text-white hover:border-white/40 transition-colors";

const GoogleButton = ({ onSuccess }) => {
  const ref = useRef(null);
  const clientId = googleClientId();

  useEffect(() => {
    if (!clientId) return;

    const handleCredential = async (response) => {
      const ok = await loginWithGoogleIdToken(response.credential);
      if (ok) {
        toast.success("Welcome back.");
        onSuccess();
      } else {
        toast.error("That Google account isn't authorized for the Studio.");
      }
    };

    let cancelled = false;
    const init = () => {
      if (cancelled || !window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({ client_id: clientId, callback: handleCredential });
      if (ref.current) {
        window.google.accounts.id.renderButton(ref.current, { theme: "filled_black", size: "large", shape: "pill", width: 320 });
      }
    };

    if (window.google?.accounts?.id) init();
    else {
      const poll = setInterval(() => { if (window.google?.accounts?.id) { init(); clearInterval(poll); } }, 150);
      setTimeout(() => clearInterval(poll), 8000);
      return () => { cancelled = true; clearInterval(poll); };
    }
  }, [clientId, onSuccess]);

  if (!clientId) return null;
  return <div ref={ref} className="flex justify-center" data-testid="studio-google-button" />;
};

const Login = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const hasGoogle = Boolean(googleClientId());

  const submit = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      toast.success("Welcome back.");
      onSuccess();
    } else {
      toast.error("Incorrect email or password.");
    }
  };

  return (
    <div className="min-h-screen bg-void grid place-items-center px-6">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-neon">(Studio)</span>
          <h1 className="mt-3 font-display text-3xl font-bold text-white">Sign in</h1>
        </div>

        {hasGoogle && (
          <>
            <GoogleButton onSuccess={onSuccess} />
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-white/10" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-dim">or</span>
              <span className="h-px flex-1 bg-white/10" />
            </div>
          </>
        )}

        <form onSubmit={submit} className="flex flex-col gap-6" data-testid="studio-login-form">
          <div>
            <label className="font-mono text-xs uppercase tracking-[0.2em] text-dim">Email</label>
            <input type="email" required className={inputCls + " mt-2"} value={email} onChange={(e) => setEmail(e.target.value)} data-testid="studio-email" />
          </div>
          <div>
            <label className="font-mono text-xs uppercase tracking-[0.2em] text-dim">Password</label>
            <input type="password" required className={inputCls + " mt-2"} value={password} onChange={(e) => setPassword(e.target.value)} data-testid="studio-password" />
          </div>
          <button type="submit" className={btnPrimary} data-testid="studio-login-submit">Enter</button>
        </form>
        <Link to="/" className="text-center font-mono text-xs uppercase tracking-wider text-dim hover:text-white transition-colors">← Back to site</Link>
      </div>
    </div>
  );
};

const Field = ({ f, value, onChange }) => (
  <div>
    <label className="font-mono text-[11px] uppercase tracking-[0.15em] text-dim">{f.label}</label>
    {f.type === "textarea" ? (
      <textarea rows={3} className={inputCls + " mt-1.5"} value={value || ""} onChange={(e) => onChange(e.target.value)} />
    ) : f.type === "bool" ? (
      <input type="checkbox" className="mt-2 h-4 w-4 accent-[#CCFF00]" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
    ) : (
      <input className={inputCls + " mt-1.5"} value={value || ""} onChange={(e) => onChange(e.target.value)} />
    )}
  </div>
);

const emptyDraft = (fields) => Object.fromEntries(fields.map((f) => [f.key, f.type === "bool" ? false : ""]));

const draftFromItem = (fields, item) =>
  Object.fromEntries(fields.map((f) => [f.key, f.type === "list" ? (item[f.key] || []).join(", ") : item[f.key]]));

const buildItem = (fields, draft) => {
  const obj = {};
  fields.forEach((f) => {
    if (f.type === "list") obj[f.key] = draft[f.key] ? draft[f.key].split(",").map((s) => s.trim()).filter(Boolean) : [];
    else if (f.type === "bool") obj[f.key] = !!draft[f.key];
    else obj[f.key] = draft[f.key] || "";
  });
  return obj;
};

const ListEditor = ({ section, fields, label, titleKey, subtitleKey }) => {
  const items = useSection(section);
  const [editing, setEditing] = useState(null); // index or "new"
  const [draft, setDraft] = useState({});

  const startAdd = () => { setEditing("new"); setDraft(emptyDraft(fields)); };
  const startEdit = (i) => { setEditing(i); setDraft(draftFromItem(fields, items[i])); };
  const cancel = () => { setEditing(null); setDraft({}); };

  const save = () => {
    const item = buildItem(fields, draft);
    if (editing === "new") addItem(section, item);
    else updateItem(section, editing, item);
    toast.success("Saved.");
    cancel();
  };

  const remove = (i) => {
    if (window.confirm(`Delete this ${label.toLowerCase()}?`)) {
      deleteItem(section, i);
      toast.success("Deleted.");
    }
  };

  return (
    <div className="flex flex-col gap-6" data-testid={`studio-section-${section.toLowerCase()}`}>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-white">{label} <span className="font-mono text-sm text-dim">({items.length})</span></h2>
        <button onClick={startAdd} className={btnPrimary + " flex items-center gap-1.5"} data-testid={`studio-add-${section.toLowerCase()}`}>
          <Plus size={14} /> Add
        </button>
      </div>

      {editing !== null && (
        <div className="border border-neon/40 rounded-lg p-5 flex flex-col gap-4 bg-white/[0.02]">
          {fields.map((f) => (
            <Field key={f.key} f={f} value={draft[f.key]} onChange={(v) => setDraft({ ...draft, [f.key]: v })} />
          ))}
          <div className="flex gap-3">
            <button onClick={save} className={btnPrimary} data-testid="studio-save-item">Save</button>
            <button onClick={cancel} className={btnGhost}>Cancel</button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <div key={item.id || i} className="flex items-center justify-between gap-4 border border-white/10 rounded-lg p-4">
            <div className="min-w-0">
              <p className="text-white font-bold truncate">{item[titleKey]}</p>
              {subtitleKey && <p className="text-dim text-sm truncate mt-0.5">{item[subtitleKey]}</p>}
            </div>
            <div className="flex items-center gap-3 shrink-0 text-dim">
              <button onClick={() => reorderItem(section, i, -1)} aria-label="Move up" className="hover:text-white"><ArrowUp size={15} /></button>
              <button onClick={() => reorderItem(section, i, 1)} aria-label="Move down" className="hover:text-white"><ArrowDown size={15} /></button>
              <button onClick={() => startEdit(i)} aria-label="Edit" className="hover:text-neon"><Pencil size={15} /></button>
              <button onClick={() => remove(i)} aria-label="Delete" className="hover:text-red-400"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-dim text-sm font-mono">No items yet.</p>}
      </div>
    </div>
  );
};

const ProfileEditor = () => {
  const PROFILE = useSection("PROFILE");
  const [draft, setDraft] = useState(() => ({ ...PROFILE, taglineText: PROFILE.tagline.join("\n") }));
  const [socials, setSocials] = useState(PROFILE.socials);

  const set = (k) => (v) => setDraft({ ...draft, [k]: v });

  const save = () => {
    updateProfile({
      name: draft.name, role: draft.role, location: draft.location, year: draft.year,
      email: draft.email, phone: draft.phone, resumeUrl: draft.resumeUrl, bio: draft.bio,
      tagline: draft.taglineText.split("\n").map((s) => s.trim()).filter(Boolean),
      socials,
    });
    toast.success("Profile saved.");
  };

  const updateSocial = (i, patch) => setSocials(socials.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const addSocial = () => setSocials([...socials, { label: "", href: "" }]);
  const removeSocial = (i) => setSocials(socials.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-6" data-testid="studio-section-profile">
      <h2 className="font-display text-2xl font-bold text-white">Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field f={{ key: "name", label: "Name" }} value={draft.name} onChange={set("name")} />
        <Field f={{ key: "role", label: "Role" }} value={draft.role} onChange={set("role")} />
        <Field f={{ key: "location", label: "Location" }} value={draft.location} onChange={set("location")} />
        <Field f={{ key: "year", label: "Year / Program" }} value={draft.year} onChange={set("year")} />
        <Field f={{ key: "email", label: "Email" }} value={draft.email} onChange={set("email")} />
        <Field f={{ key: "phone", label: "Phone" }} value={draft.phone} onChange={set("phone")} />
        <Field f={{ key: "resumeUrl", label: "Résumé URL" }} value={draft.resumeUrl} onChange={set("resumeUrl")} />
      </div>
      <Field f={{ key: "taglineText", label: "Hero tagline (one line per row)", type: "textarea" }} value={draft.taglineText} onChange={set("taglineText")} />
      <Field f={{ key: "bio", label: "Bio", type: "textarea" }} value={draft.bio} onChange={set("bio")} />

      <div>
        <div className="flex items-center justify-between">
          <label className="font-mono text-[11px] uppercase tracking-[0.15em] text-dim">Socials</label>
          <button onClick={addSocial} className="font-mono text-xs text-dim hover:text-neon flex items-center gap-1"><Plus size={12} /> Add</button>
        </div>
        <div className="mt-2 flex flex-col gap-2">
          {socials.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input className={inputCls} placeholder="Label" value={s.label} onChange={(e) => updateSocial(i, { label: e.target.value })} />
              <input className={inputCls} placeholder="https://..." value={s.href} onChange={(e) => updateSocial(i, { href: e.target.value })} />
              <button onClick={() => removeSocial(i)} className="text-dim hover:text-red-400 shrink-0"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>

      <button onClick={save} className={btnPrimary + " w-fit"} data-testid="studio-save-profile">Save Profile</button>
    </div>
  );
};

const MarqueeEditor = () => {
  const MARQUEE = useSection("MARQUEE");
  const [text, setText] = useState(MARQUEE.join(", "));
  const save = () => {
    setSection("MARQUEE", text.split(",").map((s) => s.trim()).filter(Boolean));
    toast.success("Marquee saved.");
  };
  return (
    <div className="flex flex-col gap-4" data-testid="studio-section-marquee">
      <h2 className="font-display text-2xl font-bold text-white">Marquee</h2>
      <Field f={{ key: "marquee", label: "Words (comma separated)", type: "textarea" }} value={text} onChange={setText} />
      <button onClick={save} className={btnPrimary + " w-fit"}>Save Marquee</button>
    </div>
  );
};

const SECTIONS = [
  { key: "profile", label: "Profile" },
  { key: "manifesto", label: "Manifesto" },
  { key: "skills", label: "Skills" },
  { key: "projects", label: "Projects" },
  { key: "experience", label: "Experience" },
  { key: "certifications", label: "Certifications" },
  { key: "journal", label: "Journal" },
  { key: "marquee", label: "Marquee" },
];

const Dashboard = () => {
  const [tab, setTab] = useState("profile");

  const handleExport = async () => {
    const json = exportJSON();
    try {
      await navigator.clipboard.writeText(json);
      toast.success("Copied JSON — paste it into data/portfolio.js to ship these edits to every visitor.");
    } catch {
      toast.error("Couldn't copy — check the console for the JSON.");
      console.log(json);
    }
  };

  const handleReset = () => {
    if (window.confirm("Reset every section back to the code defaults? This clears all local edits.")) {
      resetAll();
      toast.success("Reset to defaults.");
    }
  };

  return (
    <div className="min-h-screen bg-void text-white">
      <header className="border-b border-white/10 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-dim hover:text-white transition-colors">
            <ArrowLeft size={14} /> Site
          </Link>
          <span className="font-display text-lg font-bold">Studio</span>
        </div>
        <div className="flex items-center gap-3">
          {hasOverrides() && <span className="font-mono text-[10px] uppercase tracking-wider text-neon">Unsaved local edits</span>}
          <button onClick={handleExport} className={btnGhost + " flex items-center gap-1.5"} data-testid="studio-export"><Download size={14} /> Export JSON</button>
          <button onClick={handleReset} className={btnGhost}>Reset</button>
          <button onClick={() => { logout(); window.location.reload(); }} className={btnGhost + " flex items-center gap-1.5"} data-testid="studio-logout"><LogOut size={14} /> Logout</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
        <nav className="border-r border-white/10 p-4 flex md:flex-col gap-1 overflow-x-auto">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setTab(s.key)}
              className={`text-left px-3 py-2.5 rounded-md font-mono text-xs uppercase tracking-wider transition-colors whitespace-nowrap ${tab === s.key ? "bg-neon/10 text-neon" : "text-dim hover:text-white hover:bg-white/5"}`}
              data-testid={`studio-tab-${s.key}`}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <main className="p-6 md:p-10 max-w-3xl">
          {tab === "profile" && <ProfileEditor />}
          {tab === "manifesto" && <ListEditor section="MANIFESTO" label="Manifesto point" titleKey="title" subtitleKey="body" fields={[
            { key: "n", label: "Number" }, { key: "title", label: "Title" }, { key: "body", label: "Body", type: "textarea" },
          ]} />}
          {tab === "skills" && <ListEditor section="SKILLS" label="Skill" titleKey="title" fields={[
            { key: "title", label: "Title" }, { key: "span", label: "Grid span classes (e.g. md:col-span-4)" },
            { key: "tags", label: "Tags (comma separated)", type: "list" }, { key: "big", label: "Feature tile", type: "bool" },
          ]} />}
          {tab === "projects" && <ListEditor section="PROJECTS" label="Project" titleKey="title" subtitleKey="desc" fields={[
            { key: "index", label: "Index" }, { key: "title", label: "Title" }, { key: "cat", label: "Category" }, { key: "year", label: "Year" },
            { key: "desc", label: "Description", type: "textarea" }, { key: "stack", label: "Stack (comma separated)", type: "list" },
            { key: "img", label: "Image URL" }, { key: "href", label: "Link URL (optional)" },
          ]} />}
          {tab === "experience" && <ListEditor section="EXPERIENCE" label="Experience" titleKey="role" subtitleKey="org" fields={[
            { key: "year", label: "Year(s)" }, { key: "role", label: "Role" }, { key: "org", label: "Organization" }, { key: "desc", label: "Description", type: "textarea" },
          ]} />}
          {tab === "certifications" && <ListEditor section="CERTIFICATIONS" label="Certification" titleKey="title" subtitleKey="org" fields={[
            { key: "title", label: "Title" }, { key: "tag", label: "Tag" }, { key: "org", label: "Issuer" },
          ]} />}
          {tab === "journal" && <ListEditor section="POSTS" label="Post" titleKey="title" subtitleKey="tag" fields={[
            { key: "title", label: "Title" }, { key: "tag", label: "Tag" }, { key: "read", label: "Read time" }, { key: "date", label: "Date" }, { key: "img", label: "Image URL" },
          ]} />}
          {tab === "marquee" && <MarqueeEditor />}
        </main>
      </div>
    </div>
  );
};

export const Studio = () => {
  const [authed, setAuthed] = useState(isAuthed());
  useEffect(() => { document.title = "Studio"; }, []);
  return (
    <>
      <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: "#0A0B10", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontFamily: "JetBrains Mono" } }} />
      {authed ? <Dashboard /> : <Login onSuccess={() => setAuthed(true)} />}
    </>
  );
};
