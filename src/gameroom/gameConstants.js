/* ==========================================================================
   Code City Explorer — Game Constants & Tuning v3
   Map grid, car physics, cyber garage catalog, scoring, weather, level themes
   ========================================================================== */

// ── World / Map Grid ──────────────────────────────────────────────────────
export const CITY_MAP = {
  WIDTH: 2000,
  HEIGHT: 1800,
  ROAD_GRID_X: [200, 550, 900, 1300, 1650],
  ROAD_GRID_Y: [250, 550, 900, 1250, 1600],
  ROAD_WIDTH: 70,
  PROXIMITY_RADIUS: 110, // distance to trigger signboard popup
};

// ── Campaign Rules ───────────────────────────────────────────────────────
export const CAMPAIGN = {
  QUESTIONS_PER_LEVEL: 20, // Exactly 20 questions/missions per level
};

// ── Dynamic Level Theme Generator (Infinite Levels) ───────────────────────
export function getLevelTheme(levelNum = 1, language = 'python') {
  const safeLevel = Math.max(1, parseInt(levelNum, 10) || 1);
  const normLang = (language || 'python').toLowerCase();
  const langUpper = normLang.toUpperCase();

  const LANG_OFFSETS = {
    python: 0,
    javascript: 1,
    cpp: 2,
    c: 3,
    java: 4,
    rust: 5,
  };

  const offset = LANG_OFFSETS[normLang] || 0;

  const PRESET_THEMES = [
    {
      name: 'Neon Cyber District',
      accent: '#00f2fe',
      secondary: '#4facfe',
      roadDash: '#00f2fe',
      roadBorder: 'rgba(0, 242, 254, 0.3)',
      buildingBorder: 'rgba(0, 242, 254, 0.15)',
      glowColor: 'rgba(0, 242, 254, 0.4)',
      bg: '#04060f',
      grass: '#070a1a',
      topic: `${langUpper} Basics & Variables`,
      topicsNote: [
        `📌 ${langUpper} Variables & Constant Declarations`,
        '📌 Arithmetic Operators (+, -, *, /)',
        `📌 Formatted Output Streams & String Logs`,
        '📌 Variable Assignments & Calculations',
      ],
      icon: '🌃',
    },
    {
      name: 'Synthwave Crimson Highway',
      accent: '#ff0055',
      secondary: '#ff5e62',
      roadDash: '#ff0055',
      roadBorder: 'rgba(255, 0, 85, 0.3)',
      buildingBorder: 'rgba(255, 0, 85, 0.15)',
      glowColor: 'rgba(255, 0, 85, 0.4)',
      bg: '#0c040b',
      grass: '#1a0715',
      topic: `${langUpper} Conditionals & Logic Gates`,
      topicsNote: [
        `📌 ${langUpper} If-Else Decision Branches`,
        '📌 Relational Operators (>, <, ==, !=)',
        '📌 Threshold & Tax Calculation Logic',
        '📌 Conditional Fallback Blocks',
      ],
      icon: '🌇',
    },
    {
      name: 'Matrix Emerald Sector',
      accent: '#10b981',
      secondary: '#34d399',
      roadDash: '#10b981',
      roadBorder: 'rgba(16, 185, 129, 0.3)',
      buildingBorder: 'rgba(16, 185, 129, 0.15)',
      glowColor: 'rgba(16, 185, 129, 0.4)',
      bg: '#040d0a',
      grass: '#071b15',
      topic: `${langUpper} Iteration Loops & Modulo`,
      topicsNote: [
        `📌 ${langUpper} For Loops & Counter Increment`,
        '📌 Modulo Divisibility Operator (%)',
        '📌 Multiples & Even Sequence Filters',
        '📌 Output Formatting & Spacing',
      ],
      icon: '🟩',
    },
    {
      name: 'Solar Flare Grid',
      accent: '#ffd43b',
      secondary: '#f59e0b',
      roadDash: '#ffd43b',
      roadBorder: 'rgba(255, 212, 59, 0.3)',
      buildingBorder: 'rgba(255, 212, 59, 0.15)',
      glowColor: 'rgba(255, 212, 59, 0.4)',
      bg: '#0f0c04',
      grass: '#1e1807',
      topic: `${langUpper} Arrays & Transformations`,
      topicsNote: [
        `📌 ${langUpper} Array & Sequence Structures`,
        '📌 Element-wise Square Transformations',
        '📌 Sequence Mapping & Array Printing',
        '📌 Data Collection Pipelines',
      ],
      icon: '☀️',
    },
    {
      name: 'Quantum Violet Realm',
      accent: '#7928ca',
      secondary: '#b829ea',
      roadDash: '#7928ca',
      roadBorder: 'rgba(121, 40, 202, 0.3)',
      buildingBorder: 'rgba(121, 40, 202, 0.15)',
      glowColor: 'rgba(121, 40, 202, 0.4)',
      bg: '#0a0412',
      grass: '#160724',
      topic: `${langUpper} Functions & Advanced Control`,
      topicsNote: [
        `📌 ${langUpper} Function & Scope Pipelines`,
        '📌 Complex Algorithmic Flow Control',
        '📌 Memory & Execution Optimization',
        '📌 Multi-branch Algorithm Solver',
      ],
      icon: '🔮',
    },
  ];

  const presetIdx = (safeLevel - 1 + offset) % PRESET_THEMES.length;
  const baseTheme = PRESET_THEMES[presetIdx];

  if (safeLevel <= 50) {
    return { level: safeLevel, ...baseTheme };
  }

  // Procedural theme for Level 51 and beyond!
  const hue = Math.floor(((safeLevel + offset * 7) * 137.5) % 360);
  const accent = `hsl(${hue}, 95%, 55%)`;
  const secondary = `hsl(${(hue + 40) % 360}, 90%, 65%)`;

  return {
    level: safeLevel,
    name: `Cyber Sector L-${safeLevel} (${langUpper})`,
    accent,
    secondary,
    roadDash: accent,
    roadBorder: `hsla(${hue}, 90%, 55%, 0.3)`,
    buildingBorder: `hsla(${hue}, 90%, 55%, 0.15)`,
    glowColor: `hsla(${hue}, 90%, 55%, 0.4)`,
    bg: '#04060f',
    grass: '#070a1a',
    topic: `Advanced ${langUpper} Mastery Level ${safeLevel}`,
    topicsNote: [
      `📌 Advanced Algorithm Patterns (L-${safeLevel})`,
      '📌 Multi-branch Conditionals & Nested Loops',
      '📌 Memory & Code Execution Optimization',
      `📌 ${langUpper} Expert Pipeline Mastery`,
    ],
    icon: '⚡',
  };
}

// ── Cyber Garage Vehicles Catalog ─────────────────────────────────────────
export const VEHICLES = [
  {
    id: 'roadster',
    name: 'Neon Roadster',
    icon: '🏎️',
    color: '#00f2fe',
    glowColor: 'rgba(0, 242, 254, 0.6)',
    maxSpeed: 420,
    acceleration: 850,
    nitroBoost: 1.8,
    unlockedAtLevel: 1,
    desc: 'Agile & balanced cyberpunk cruiser.',
  },
  {
    id: 'phantom',
    name: 'Hyper Phantom',
    icon: '🚗',
    color: '#ff0055',
    glowColor: 'rgba(255, 0, 85, 0.6)',
    maxSpeed: 480,
    acceleration: 950,
    nitroBoost: 2.1,
    unlockedAtLevel: 2,
    desc: 'High speed crimson interceptor.',
  },
  {
    id: 'truck',
    name: 'Cyber Truck',
    icon: '🛻',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.6)',
    maxSpeed: 390,
    acceleration: 750,
    nitroBoost: 1.6,
    unlockedAtLevel: 3,
    desc: 'Heavy armored titanium vehicle.',
  },
  {
    id: 'quantum',
    name: 'Quantum Speedster',
    icon: '⚡',
    color: '#ffd43b',
    glowColor: 'rgba(255, 212, 59, 0.6)',
    maxSpeed: 540,
    acceleration: 1100,
    nitroBoost: 2.5,
    unlockedAtLevel: 5,
    desc: 'Ultimate hyper-drive prototype.',
  },
];

// ── Default Physics ───────────────────────────────────────────────────────
export const CAR_PHYSICS = {
  MAX_SPEED: 420,          // pixels per sec
  ACCELERATION: 850,
  FRICTION: 0.92,
  ROTATION_SPEED: 10,
  DRAG_INTERPOLATION: 0.14, // lerp factor when dragging mouse/touch
  NITRO_MULTIPLIER: 1.75,
  NITRO_MAX: 100,
  NITRO_DRAIN_RATE: 45,    // per sec
  NITRO_RECHARGE_RATE: 12, // per sec
};

// ── Penalty & Scoring System ─────────────────────────────────────────────
export const SCORING = {
  BASE_QUEST_POINTS: 1000,
  FREE_CHECKS: 3,           // 3 free checks without penalty
  PENALTY_PER_EXTRA_CHECK: 50, // -50 pts for every check beyond 3
  MIN_SCORE: 100,
  BLOCK_COLLECT_XP: 100,
  QUEST_SOLVE_XP: 500,
  XP_PER_LEVEL: 1000,
};

// ── Destination Categories ───────────────────────────────────────────────
export const DESTINATION_CATEGORIES = {
  home: { icon: '🏠', color: '#00f2fe', label: 'Residential Zone' },
  factory: { icon: '🏭', color: '#ff007a', label: 'Industrial Zone' },
  shop: { icon: '🛍️', color: '#f59e0b', label: 'Commercial Market' },
  tower: { icon: '🏙️', color: '#7928ca', label: 'Tech District' },
  park: { icon: '🌲', color: '#10b981', label: 'Green Park' },
};

// ── Visual Palette ───────────────────────────────────────────────────────
export const CITY_PALETTE = {
  bg: '#04060f',
  grass: '#070a1a',
  road: '#0d1024',
  roadBorder: 'rgba(0, 242, 254, 0.25)',
  roadDash: '#00f2fe',
  buildingFill: 'rgba(15, 20, 50, 0.7)',
  buildingBorder: 'rgba(255, 255, 255, 0.08)',
  buildingGlow: 'rgba(121, 40, 202, 0.15)',
  carBody: '#00f2fe',
  carGlow: 'rgba(0, 242, 254, 0.6)',
  signboardBg: 'rgba(10, 12, 32, 0.9)',
  signboardBorder: 'rgba(0, 242, 254, 0.4)',
};

// ── Sound Tuning ─────────────────────────────────────────────────────────
export const SOUND = {
  DEFAULT_VOLUME: 0.3,
};

// ── Language Themes (used by LanguagePicker) ─────────────────────────────
export const LANGUAGE_THEMES = {
  langchain: {
    name: 'LangChain AI', icon: '🦜',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    primary: '#00A67E', secondary: '#38BDF8',
    accent: '#818CF8',
    glowColor: 'rgba(0, 166, 126, 0.5)',
    tagline: 'Master LCEL, RAG, ReAct Tools & LangGraph Swarms',
    locked: false,
  },
  sql: {
    name: 'SQL Database', icon: '🗄️',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
    primary: '#f59e0b', secondary: '#38bdf8',
    accent: '#10b981',
    glowColor: 'rgba(245, 158, 11, 0.5)',
    tagline: 'Master DQL, Joins, Group By, Window Functions & Transactions',
    locked: false,
  },
  htmlcss: {
    name: 'HTML & CSS', icon: '🎨',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
    primary: '#ff007a', secondary: '#00f2fe',
    accent: '#f59e0b',
    glowColor: 'rgba(255, 0, 122, 0.5)',
    tagline: 'Master HTML5 DOM, Flexbox, Grid, Glassmorphism & 3D Keyframes',
    locked: false,
  },
  python: {
    name: 'Python', icon: '🐍',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    primary: '#3776AB', secondary: '#FFD43B',
    accent: '#4B8BBE',
    glowColor: 'rgba(255, 212, 59, 0.4)',
    tagline: 'Explore Code City with Python',
    locked: false,
  },
  javascript: {
    name: 'JavaScript', icon: '⚡',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    primary: '#F7DF1E', secondary: '#323330',
    accent: '#F0DB4F',
    glowColor: 'rgba(247, 223, 30, 0.4)',
    tagline: 'Explore Code City with JavaScript',
    locked: false,
  },
  cpp: {
    name: 'C++', icon: '⚙️',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
    primary: '#00599C', secondary: '#004482',
    accent: '#659AD2',
    glowColor: 'rgba(101, 154, 210, 0.4)',
    tagline: 'Explore Code City with C++',
    locked: false,
  },
  c: {
    name: 'C Language', icon: '🔤',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
    primary: '#A8B9CC', secondary: '#283593',
    accent: '#5C6BC0',
    glowColor: 'rgba(92, 107, 192, 0.4)',
    tagline: 'Explore Code City with C',
    locked: false,
  },
  java: {
    name: 'Java', icon: '☕',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
    primary: '#ED8B00', secondary: '#5382A1',
    accent: '#F89820',
    glowColor: 'rgba(237, 139, 0, 0.4)',
    tagline: 'Explore Code City with Java',
    locked: false,
  },
};


