// Gate for the hidden /studio editor.
//
// IMPORTANT: this is a client-side deterrent, not real security — anything
// shipped to the browser can be read in devtools. It's meant to keep casual
// visitors who stumble onto /studio from poking at your content, not to
// protect secrets.
//
// Credentials live in frontend/.env (not committed):
//   REACT_APP_STUDIO_EMAIL=you@example.com
//   REACT_APP_STUDIO_PASSWORD=something-only-you-know
//   REACT_APP_GOOGLE_CLIENT_ID=...   (optional — enables "Sign in with Google")

const SESSION_KEY = "studio-session";

const EMAIL = (process.env.REACT_APP_STUDIO_EMAIL || "").toLowerCase();
const PASSWORD = process.env.REACT_APP_STUDIO_PASSWORD || "";

export const isConfigured = () => Boolean(EMAIL && PASSWORD);
export const allowedEmail = () => EMAIL;
export const googleClientId = () => process.env.REACT_APP_GOOGLE_CLIENT_ID || "";

const grantSession = () => {
  if (typeof sessionStorage !== "undefined") sessionStorage.setItem(SESSION_KEY, "1");
};

export const login = (email, password) => {
  const ok = isConfigured() && email.trim().toLowerCase() === EMAIL && password === PASSWORD;
  if (ok) grantSession();
  return ok;
};

// Verifies a Google ID token against Google's own tokeninfo endpoint (so the
// signature/expiry is checked server-side by Google, not just decoded
// locally) and confirms it belongs to the allowed studio email.
export const loginWithGoogleIdToken = async (idToken) => {
  const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
  if (!res.ok) return false;
  const claims = await res.json();
  const ok = claims.email_verified === "true" && claims.email?.toLowerCase() === EMAIL;
  if (ok) grantSession();
  return ok;
};

export const logout = () => {
  if (typeof sessionStorage !== "undefined") sessionStorage.removeItem(SESSION_KEY);
};

export const isAuthed = () => typeof sessionStorage !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "1";
