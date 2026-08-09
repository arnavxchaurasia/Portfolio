// Local content store — lets the hidden Studio edit every section of the
// site (profile, manifesto, skills, projects, experience, certifications,
// journal, marquee) without touching code.
//
// There is no backend/database wired up, so edits persist to this browser's
// localStorage only. That's enough to fully preview and manage the site the
// way it'll look, and the Studio has an "Export JSON" button — paste that
// over the contents of `data/portfolio.js` to ship edits to every visitor.

import * as DEFAULTS from "../data/portfolio";

const STORAGE_KEY = "site-content-v1";
const SECTIONS = ["PROFILE", "MANIFESTO", "SKILLS", "PROJECTS", "EXPERIENCE", "CERTIFICATIONS", "POSTS", "MARQUEE"];

const readOverrides = () => {
  if (typeof localStorage === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
};

let overrides = readOverrides();
const listeners = new Set();

const notify = () => listeners.forEach((l) => l());

const persist = () => {
  if (typeof localStorage !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  notify();
};

export const subscribe = (cb) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export const getSection = (section) => overrides[section] ?? DEFAULTS[section];

export const getAll = () => Object.fromEntries(SECTIONS.map((s) => [s, getSection(s)]));

export const setSection = (section, value) => {
  overrides = { ...overrides, [section]: value };
  persist();
};

export const resetSection = (section) => {
  overrides = { ...overrides };
  delete overrides[section];
  persist();
};

export const resetAll = () => {
  overrides = {};
  persist();
};

// List-section helpers (MANIFESTO, SKILLS, PROJECTS, EXPERIENCE, CERTIFICATIONS, POSTS).
export const addItem = (section, item) => {
  const list = [...getSection(section)];
  list.push({ ...item, id: item.id || `${section.toLowerCase()}-${Date.now()}` });
  setSection(section, list);
};

export const updateItem = (section, index, patch) => {
  const list = [...getSection(section)];
  list[index] = { ...list[index], ...patch };
  setSection(section, list);
};

export const deleteItem = (section, index) => {
  const list = [...getSection(section)];
  list.splice(index, 1);
  setSection(section, list);
};

export const reorderItem = (section, index, direction) => {
  const list = [...getSection(section)];
  const target = index + direction;
  if (target < 0 || target >= list.length) return;
  [list[index], list[target]] = [list[target], list[index]];
  setSection(section, list);
};

// PROFILE is a single object, not a list.
export const updateProfile = (patch) => setSection("PROFILE", { ...getSection("PROFILE"), ...patch });

export const exportJSON = () => JSON.stringify(getAll(), null, 2);

export const hasOverrides = () => Object.keys(overrides).length > 0;
