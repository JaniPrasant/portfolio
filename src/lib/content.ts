/**
 * All portfolio copy lives here, typed, so content edits never touch component logic.
 */

export type Track = "frontend" | "data";
export type Accent = "a1" | "a2" | "a3";

export type ProjectLink = { label: string; href: string; kind: "live" | "code" };

export type Project = {
  slug: string;
  title: string;
  tracks: Track[];
  tags: { label: string; accent?: Accent }[];
  summary: string;
  lead: string;
  points: string[];
  stack: string[];
  stackLine: string;
  links: ProjectLink[];
  cover:
    | { kind: "scroll"; src: string; width: number; height: number; alt: string }
    | { kind: "image"; src: string; width: number; height: number; alt: string }
    | { kind: "art"; art: "analyst-kit" | "job-market" | "weather-cli" };
  size: "wide" | "medium" | "small";
};

const GH = "https://github.com/JaniPrasant/";

export const projects: Project[] = [
  {
    slug: "atmosphere",
    title: "Atmosphere.io Weather Console",
    tracks: ["frontend", "data"],
    tags: [{ label: "FRONTEND", accent: "a1" }, { label: "DATA VIZ", accent: "a3" }, { label: "Live" }],
    summary:
      "A weather dashboard with live conditions, a 5-day forecast, a temperature trend chart, a solar orbit tracker and a packing planner that turns raw metrics into advice.",
    lead: "A weather dashboard that turns raw meteorological data into readable metrics, trends and practical advice.",
    points: [
      "City search, geolocation (“Locate me”), °C/°F toggle and tracked-city chips with recent searches.",
      "Current conditions with humidity, wind and feels-like readouts, plus a 5-day forecast.",
      "A 5-day temperature trend chart and a solar orbit tracker for sunrise, sunset and golden hour.",
      "A packing and activity planner that scores comfort and flags heat warnings.",
      "A multi-city engine that verifies and tracks several locations at once.",
    ],
    stack: ["JavaScript", "REST API", "Charts", "Responsive CSS", "Render"],
    stackLine: "JavaScript · REST API · Render",
    links: [
      { label: "Live demo", href: "https://atmosphere-io.onrender.com/", kind: "live" },
      { label: "Code", href: `${GH}atmosphere-weather-dashboard`, kind: "code" },
    ],
    cover: {
      kind: "scroll",
      src: "/img/atmosphere.webp",
      width: 900,
      height: 1219,
      alt: "Atmosphere.io weather console with current conditions, 5-day forecast, trend chart and packing planner",
    },
    size: "wide",
  },
  {
    slug: "recipely",
    title: "Recipely · Recipe Finder",
    tracks: ["frontend"],
    tags: [{ label: "FRONTEND", accent: "a1" }, { label: "Live" }],
    summary: "Search any recipe, filter by diet and cooking time, save favorites and build a shopping list behind a user login.",
    lead: "A recipe search app with user accounts, favorites and a shopping list, deployed on Netlify.",
    points: [
      "Search for any recipe by keyword.",
      "Filter results by diet category and maximum cooking time.",
      "Save recipes to My Favorites and collect ingredients in a Shopping List.",
      "Login and logout with a personalized welcome.",
    ],
    stack: ["JavaScript", "REST API", "Netlify"],
    stackLine: "JavaScript · REST API · Netlify",
    links: [
      { label: "Live demo", href: "https://recipely-app.netlify.app/", kind: "live" },
      { label: "Code", href: `${GH}Recipe-Finder-with-Favorites`, kind: "code" },
    ],
    cover: {
      kind: "image",
      src: "/img/recipe.webp",
      width: 1200,
      height: 685,
      alt: "Recipe Finder search page with diet category and cooking time filters",
    },
    size: "medium",
  },
  {
    slug: "analyst-kit",
    title: "Analyst Instrument Kit",
    tracks: ["frontend", "data"],
    tags: [{ label: "FRONTEND", accent: "a1" }, { label: "DATA", accent: "a3" }, { label: "Flagship" }],
    summary:
      "A React component library of KPI readouts, sparklines and status tags for analysts who need production-grade dashboards.",
    lead: "A React and TypeScript component library of dashboard instruments, packaged so analysts can ship production-grade dashboards without a design team.",
    points: [
      "KPI readouts, sparklines and status tags built as typed, reusable components.",
      "A semantic color system that separates data, interface and live status.",
      "Monospaced data typography with tabular numerals for scannable figures.",
      "Dark-first design language with accessible contrast.",
    ],
    stack: ["React", "TypeScript", "Tailwind CSS", "Lucide"],
    stackLine: "React · TypeScript · Tailwind",
    links: [],
    cover: { kind: "art", art: "analyst-kit" },
    size: "small",
  },
  {
    slug: "job-market",
    title: "Smart Job Market Analyzer",
    tracks: ["data"],
    tags: [{ label: "DATA", accent: "a3" }],
    summary: "Live job listings from REST APIs, analyzed in Pandas to surface in-demand skills, salary spreads and hiring patterns.",
    lead: "A Python pipeline that collects live job listings and shows which data skills employers actually ask for.",
    points: [
      "Collected real-time listings from REST APIs and shaped JSON responses into analysis-ready datasets.",
      "Ran exploratory analysis in Pandas to find in-demand skills, role trends and location-based hiring patterns.",
      "Analyzed keyword frequency and salary distributions to uncover skill gaps in the analytics market.",
      "Built visual summaries of top technologies and experience-level requirements.",
    ],
    stack: ["Python", "Pandas", "REST APIs", "Matplotlib", "EDA"],
    stackLine: "Python · Pandas · EDA",
    links: [{ label: "Code", href: `${GH}smart-job-market-analyzer`, kind: "code" }],
    cover: { kind: "art", art: "job-market" },
    size: "small",
  },
  {
    slug: "weather-cli",
    title: "Weather Forecast CLI",
    tracks: ["data"],
    tags: [{ label: "DATA", accent: "a3" }, { label: "CLI" }],
    summary: "A Python CLI over the Open-Meteo APIs with retries, exponential backoff and clean 7-day forecasts.",
    lead: "A fault-tolerant command-line app that geocodes any city and prints a clean 7-day forecast from the Open-Meteo APIs.",
    points: [
      "Integrated Open-Meteo Geocoding and Forecast APIs with Python Requests.",
      "Built a reusable HTTP session with urllib3 retries and exponential backoff.",
      "Handled timeouts, invalid responses and unknown cities with structured errors.",
      "Mapped WMO weather codes to readable descriptions in formatted terminal output.",
    ],
    stack: ["Python", "Requests", "urllib3", "Open-Meteo API"],
    stackLine: "Python · Requests · urllib3",
    links: [{ label: "Code", href: `${GH}weather-cli-bot`, kind: "code" }],
    cover: { kind: "art", art: "weather-cli" },
    size: "small",
  },
];

export type Client = {
  name: string;
  domain: string;
  href: string;
  summary: string;
  shot?: { src: string; width: number; height: number; alt: string };
  placeholder?: { title: string; caption: string };
};

export const clients: Client[] = [
  {
    name: "NFTY Property Marketplace",
    domain: "nfty.property",
    href: "https://nfty.property/",
    summary: "Listings, auctions and dashboards in React and TypeScript on a Laravel API.",
    shot: { src: "/img/nfty.webp", width: 620, height: 2704, alt: "Full page of the NFTY fractional property marketplace website" },
  },
  {
    name: "Baltic Capital Partners",
    domain: "balticcapitalpartners.com",
    href: "https://balticcapitalpartners.com/",
    summary: "WordPress site for EU residency and investment, tuned for SEO and speed.",
    shot: { src: "/img/bcp.webp", width: 540, height: 2605, alt: "Full page of the Baltic Capital Partners website" },
  },
  {
    name: "My Gateway to Europe",
    domain: "mygatewaytoeurope.com",
    href: "https://mygatewaytoeurope.com/",
    summary: "EU residency site for Baltic Capital Partners that I managed and optimized for SEO, speed and conversions.",
    shot: { src: "/img/mygateway.webp", width: 620, height: 3248, alt: "Full page of the My Gateway to Europe EU residency website by Baltic Capital Partners" },
  },
  {
    name: "Nail Academy Nicolle",
    domain: "nail-academy-nicolle.nl",
    href: "https://www.nail-academy-nicolle.nl/",
    summary: "Magento 2 webshop and academy site, built pixel-perfect from Figma as the project's Magento 2 developer.",
    shot: { src: "/img/nicolle.webp", width: 620, height: 2758, alt: "Full page of the Nail Academy Nicolle webshop and training site" },
  },
];

export type Role = {
  company: string;
  title: string;
  period: string;
  shortPeriod: string;
  place: string;
  current?: boolean;
  points: string[];
  stack: string[];
};

export const experience: Role[] = [
  {
    company: "Benchmark Gensuite",
    title: "UI Developer / Lead Product Developer",
    period: "06/2026 — present",
    shortPeriod: "2026 — now",
    place: "Remote · contract",
    current: true,
    points: [
      "Build user-facing features for enterprise EHS (environment, health & safety) SaaS products across the full lifecycle, from requirements and design to testing and release.",
      "Learned ColdFusion (CFML) on the job and now build and maintain features with it across multiple projects, alongside the frontend work.",
      "Turn UI/UX designs, wireframes and business requirements into responsive, cross-browser interfaces with HTML, CSS, JavaScript and jQuery.",
      "Integrate the UI with REST APIs and backend services alongside product managers, designers and backend developers.",
      "Handle bug fixes and UI improvements from customer feedback, and review code to keep design systems consistent.",
    ],
    stack: ["ColdFusion (CFML)", "JavaScript", "jQuery", "HTML/CSS", "REST APIs", "SaaS"],
  },
  {
    company: "Baltic Capital Partners",
    title: "Frontend Web Developer",
    period: "04/2023 — 02/2026",
    shortPeriod: "2023 — 2026",
    place: "Remote",
    points: [
      "Built NFT property marketplace features including listings, auctions and dashboards in React and TypeScript on a Laravel backend.",
      "Converted Figma designs into pixel-perfect, responsive interfaces with React, TypeScript and Bootstrap.",
      "Integrated Laravel APIs, handling data flow and Open Graph metadata across connected platforms.",
      "Managed and optimized the Baltic Capital Partners and My Gateway to Europe WordPress sites for SEO, speed and usability.",
    ],
    stack: ["React", "TypeScript", "Laravel APIs", "WordPress", "SEO"],
  },
  {
    company: "Hiddentechies",
    title: "Web Developer",
    period: "05/2019 — 03/2023",
    shortPeriod: "2019 — 2023",
    place: "Surat, Gujarat",
    points: [
      "Developed custom Magento 2 and PrestaShop themes for more than 50 e-commerce storefronts.",
      "Implemented responsive, pixel-perfect layouts with HTML, CSS, JavaScript and Bootstrap across browsers and devices.",
      "Resolved client support tickets by diagnosing bugs, fixing frontend issues and adding features to live stores.",
      "Built scalable UI components with designers and backend developers in a fast-paced team.",
    ],
    stack: ["Magento 2", "PrestaShop", "Bootstrap", "JavaScript"],
  },
  {
    company: "Templatemela",
    title: "Web Developer",
    period: "07/2017 — 04/2019",
    shortPeriod: "2017 — 2019",
    place: "Surat, Gujarat · Pixothemes",
    points: [
      "Developed and customized PrestaShop templates for international clients.",
      "Converted Figma and PSD designs into responsive HTML, CSS and JavaScript templates.",
      "Maintained e-commerce storefronts with content updates and basic SEO.",
      "Worked across PrestaShop, WordPress, OpenCart and Shopify with PHP and jQuery.",
    ],
    stack: ["PrestaShop", "PHP", "jQuery", "PSD to HTML"],
  },
];

export type SkillTrack = "fe" | "da" | "tl";
export const skillTrackLabels: Record<SkillTrack, string> = { fe: "Frontend", da: "Data", tl: "Platforms" };

export const skills: { name: string; track: SkillTrack }[] = [
  { name: "React", track: "fe" },
  { name: "TypeScript", track: "fe" },
  { name: "JavaScript", track: "fe" },
  { name: "HTML5 / CSS3", track: "fe" },
  { name: "Tailwind CSS", track: "fe" },
  { name: "Responsive design", track: "fe" },
  { name: "Figma to code", track: "fe" },
  { name: "React Native", track: "fe" },
  { name: "Bootstrap", track: "fe" },
  { name: "jQuery", track: "fe" },
  { name: "Accessibility", track: "fe" },
  { name: "Web performance", track: "fe" },
  { name: "Python", track: "da" },
  { name: "SQL", track: "da" },
  { name: "Pandas", track: "da" },
  { name: "NumPy", track: "da" },
  { name: "Matplotlib", track: "da" },
  { name: "MySQL", track: "da" },
  { name: "EDA", track: "da" },
  { name: "Regression", track: "da" },
  { name: "Clustering", track: "da" },
  { name: "Excel · XLOOKUP · Pivots", track: "da" },
  { name: "ColdFusion (CFML)", track: "tl" },
  { name: "Magento 2", track: "tl" },
  { name: "WordPress", track: "tl" },
  { name: "Laravel", track: "tl" },
  { name: "PHP", track: "tl" },
  { name: "PrestaShop", track: "tl" },
  { name: "Shopify", track: "tl" },
  { name: "Git / GitHub", track: "tl" },
  { name: "SEO", track: "tl" },
];

export const marqueeRows = [
  ["React", "TypeScript", "JavaScript", "Tailwind CSS", "HTML5", "CSS3", "Figma", "React Native", "ColdFusion", "Magento 2", "WordPress"],
  ["Python", "SQL", "Pandas", "NumPy", "MySQL", "Matplotlib", "Laravel", "Git", "PrestaShop", "Shopify", "Excel"],
];

export const stats = [
  { value: 6, suffix: "+", label: "years building production frontends" },
  { value: 50, suffix: "+", label: "e-commerce storefronts shipped" },
  { value: 4, suffix: "", label: "live client sites below" },
  { value: 5, suffix: "", label: "personal UI & data projects" },
];

export const frontendStrengths = [
  {
    icon: "figma",
    title: "Pixel-perfect from Figma",
    body: "Designs turned into production UI that matches the file, across 50+ storefronts and marketplaces.",
  },
  {
    icon: "devices",
    title: "Responsive on every screen",
    body: "Layouts tested from small phones to wide monitors, in every major browser.",
  },
  {
    icon: "gauge",
    title: "Fast and found",
    body: "Performance and SEO tuning for WordPress and React sites, so pages load quickly and rank.",
  },
  {
    icon: "components",
    title: "Reusable, typed components",
    body: "React and TypeScript component systems with accessibility built in from the start.",
  },
] as const;

export const education = {
  pg: {
    title: "PG Program in Data Science & AI/ML",
    where: "IIT Guwahati, via Masai School",
    period: "02/2025 — 04/2026",
    curriculum: [
      { label: "Python for Data Science", accent: "a3" as Accent },
      { label: "SQL & Databases", accent: "a3" as Accent },
      { label: "Statistics & Probability", accent: "a1" as Accent },
      { label: "EDA", accent: "a1" as Accent },
      { label: "ML Fundamentals", accent: "a2" as Accent },
      { label: "Data Visualization", accent: "a2" as Accent },
      { label: "Business Analytics" },
    ],
  },
  degrees: [
    { kind: "Master's", title: "Master of Computer Applications", where: "SRIMCA, Uka Tarsadia University", period: "08/2015 — 05/2017" },
    { kind: "Bachelor's", title: "Bachelor of Computer Applications", where: "SS Patel College, VNSGU", period: "07/2012 — 05/2015" },
  ],
  certificates: [
    { name: "PG Program, Data Science & AI/ML · IIT Guwahati / Masai", year: "2025–26" },
    { name: "Big Data Fundamentals · Big Data University", year: "—" },
    { name: "IIT Bombay Techfest participation", year: "2016" },
    { name: "Collabera Tact 360 Recruiter", year: "2016" },
  ],
};

export const faqs = [
  {
    q: "What kind of roles are you looking for?",
    a: "Frontend engineering roles, especially on data-heavy products like dashboards, reporting tools and analytics platforms, and data analyst roles where my frontend background helps present the numbers.",
  },
  {
    q: "Are you available right now?",
    a: "I'm on a contract as UI Developer / Lead Product Developer at Benchmark Gensuite, which started in June 2026, where I also work in ColdFusion. I'm open to conversations about upcoming roles.",
  },
  {
    q: "Do you work remotely?",
    a: "Yes. I've worked remotely since 2023 with Baltic Capital Partners and Benchmark Gensuite. I'm based in Navsari, India, on IST (UTC+5:30), which overlaps comfortably with European working hours.",
  },
  {
    q: "Can I see your code?",
    a: "Yes. Every personal project links to its GitHub repository, and my profile is at github.com/JaniPrasant. Atmosphere.io and Recipely also have live demos you can try.",
  },
  {
    q: "Which tools do you use for data work?",
    a: "Python with Pandas, NumPy and Matplotlib for analysis, SQL on MySQL for querying, and Excel with pivot tables and XLOOKUP for quick reporting.",
  },
  {
    q: "Do you take freelance work?",
    a: "Selectively, through Upwork or directly. Frontend builds, WordPress and e-commerce sites, and dashboards are the best fit.",
  },
];

export const contactTopics = ["Frontend role", "Data analytics role", "Freelance project", "Something else"] as const;
