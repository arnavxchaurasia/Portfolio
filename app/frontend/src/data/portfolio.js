// ---------------------------------------------------------------------------
// Single source of truth for all portfolio content.
// To add a new item to any section, just push another object into the
// matching array below — every component maps over these arrays, so nothing
// else needs to change. Shapes to follow are shown by the existing entries.
// ---------------------------------------------------------------------------

export const PROFILE = {
  name: "Arnav Chaurasia",
  role: "Software Engineer",
  tagline: ["Building scalable systems", "across cloud, full-stack &", "AI/ML."],
  location: "Kanpur, India",
  year: "B.Tech, Electronics Engineering",
  email: "arnavxchaurasia@gmail.com",
  phone: "+91-9305181099",
  resumeUrl: "/Arnav_Chaurasia_Resume.pdf",
  bio: "I'm a software engineer working across full-stack development, cloud infrastructure, and AI/ML systems. I've built deployment platforms, migrated cloud workloads between AWS and GCP, and shipped internal tools that hold up under real production load. I care about clean systems, fast pipelines, and shipping things that actually run.",
  socials: [
    { label: "GitHub", href: "https://github.com/arnavxchaurasia" },
    { label: "LinkedIn", href: "https://linkedin.com/in/arnav-c-9b407b23b" },
    { label: "Email", href: "mailto:arnavxchaurasia@gmail.com" },
  ],
};

export const MANIFESTO = [
  { n: "01", title: "Ship, don't tinker", body: "From a deployment platform that automates GitHub-to-production in minutes to internal tools used daily inside a live project lifecycle, I build software meant to run in production — not stay in a notebook." },
  { n: "02", title: "Cloud is the substrate", body: "AWS and GCP, Docker, CI/CD, and infrastructure-as-code are how I think about systems. Right now that means migrating real workloads from AWS to GCP at Facets.Cloud — scalability and reliability aren't afterthoughts." },
  { n: "03", title: "AI that's wired in, not bolted on", body: "RAG pipelines, LangChain, and Hugging Face are tools I reach for when they solve a real retrieval or reasoning problem — not because it's trendy. Taste is a feature." },
];

export const SKILLS = [
  { title: "AI / Machine Learning", span: "md:col-span-7 md:row-span-2", tags: ["TensorFlow", "Hugging Face", "LangChain", "LangSmith", "RAG Pipelines"], big: true },
  { title: "Cloud & DevOps", span: "md:col-span-5", tags: ["AWS", "Google Cloud Platform", "Docker", "CI/CD"] },
  { title: "Languages", span: "md:col-span-5", tags: ["Java", "Python", "JavaScript"] },
  { title: "System Design", span: "md:col-span-4", tags: ["Data Structures & Algorithms", "OOP", "Distributed Systems"] },
  { title: "Backend", span: "md:col-span-4", tags: ["Node.js", "Express.js", ".NET", "REST APIs"] },
  { title: "Frontend", span: "md:col-span-4", tags: ["React.js", "Next.js", "Tailwind CSS"] },
];

export const PROJECTS = [
  {
    id: "p1",
    index: "01",
    title: "Deployr",
    cat: "Cloud / Infra",
    year: "2026",
    desc: "A full-stack deployment platform that automates build and deployment of GitHub repositories — cut deployment time by 40% using Docker and AWS ECS, with scalable infra on S3, ECR, and CI/CD pipelines.",
    stack: ["Next.js", "AWS ECS", "AWS ECR", "Docker"],
    img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?crop=entropy&cs=srgb&fm=jpg&q=85",
    href: "https://github.com/arnavxchaurasia",
  },
  {
    id: "p2",
    index: "02",
    title: "Project Lifecycle Management System",
    cat: "Full-Stack / Internal Tools",
    year: "2025",
    desc: "Built for DRDO, Ministry of Defence — a web-based system that digitized the complete project lifecycle, cut manual processing time by over 50% through workflow automation, with role-based access control and real-time tracking.",
    stack: ["Full-Stack", "RBAC", "Workflow Automation"],
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=srgb&fm=jpg&q=85",
  },
];

export const EXPERIENCE = [
  { year: "Jun 2026 — Present", role: "Software Engineering Intern", org: "Facets.Cloud, Bangalore", desc: "Migrating cloud infrastructure and services from AWS to Google Cloud Platform. Developing cloud-native deployment workflows and automation, and contributing to CI/CD pipelines and cloud operations." },
  { year: "Jun 2025 — Aug 2025", role: "Summer Intern", org: "DRDO, Ministry of Defence", desc: "Developed an internal web-based project management system to digitize the complete project lifecycle. Reduced manual processing time by 50%+ and implemented role-based access control. Awarded a Letter of Appreciation under Scientist F." },
  { year: "Aug 2023 — Present", role: "B.Tech, Electronics Engineering", org: "Maharaja Agrasen Institute of Technology", desc: "VLSI Design and Technology — building a foundation in Data Structures, System Design, and distributed systems alongside coursework." },
];

export const CERTIFICATIONS = [
  { title: "Complete Generative AI Course with LangChain and Hugging Face", tag: "Generative AI", org: "Udemy" },
  { title: "Complete Data Science, Machine Learning, Deep Learning & NLP Bootcamp", tag: "Data Science", org: "Udemy" },
];

// Journal / writing is empty for now — add { title, tag, read, date, img } entries here
// whenever there's a real post to publish, and the Journal section will pick it up automatically.
export const POSTS = [];

export const MARQUEE = ["AWS", "GOOGLE CLOUD", "DOCKER", "REACT.JS", "NEXT.JS", "JAVA", "PYTHON", "LANGCHAIN"];
