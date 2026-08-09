# PRD — Immersive Developer Portfolio

## Original Problem Statement
Build an Awwwards-level personal portfolio for a 4th-year software engineering student (AI/ML, AWS, K8s, Web Dev, System Design, Java). Modern, immersive, premium, studio-grade with bold animations.

## User Choices
- Aesthetic: mix of Brutalist Tech + Immersive Gradient/3D
- Motion: Bold & showy (custom cursor, magnetic buttons, scroll reveals, marquee)
- Sections: all (Hero, About, Skills, Work, Experience, Blog, Contact, Resume)
- Content: polished placeholder (swap later)
- Integration: working front-end contact form (stored in Mongo)

## Architecture
- Frontend: React 19 + Tailwind, framer-motion (reveals/cursor/parallax), Lenis (smooth scroll), sonner (toasts).
- Backend: FastAPI + MongoDB. `POST /api/contact`, `GET /api/contact`.
- Content lives in `/app/frontend/src/data/portfolio.js` (single source to edit later).

## Implemented (2026-08-06)
- On-load masked line-by-line hero reveal + preloader, aurora parallax blurs
- Custom neon blend-mode cursor, magnetic buttons
- Editorial marquee, numbered manifesto About, Bento skills grid
- Projects with grayscale→color parallax imagery, timeline Experience
- Blog list with cursor-following floating preview
- Brutalist contact form (persists to Mongo) + résumé download, live-clock footer
- Fully responsive w/ mobile nav

## Personas
- Recruiters / hiring managers scanning credibility fast
- Peer engineers judging craft

## Backlog
- P1: Wire résumé PDF, real project links/case-study pages
- P1: Email notification on contact submit (Resend)
- P2: Blog CMS / individual post pages, dark/light toggle, admin view of messages

## Next Tasks
- Replace placeholder content with real details when user provides them
