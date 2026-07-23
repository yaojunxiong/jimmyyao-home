import type { AiWorldLanguage } from "@/components/ai-world/i18n";

/**
 * Portal homepage content.
 *
 * This is a manually maintained content file — it is NOT a live data feed.
 * The "recent activity" section reads from `activity` below so the homepage
 * never shows fabricated real-time metrics, user counts, or project numbers.
 * Edit this file to keep the homepage's copy and links in sync.
 */

export type HomeLanguage = AiWorldLanguage;

export type SpaceItem = {
  id: "study" | "ai" | "forum";
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  href: string;
  cta: string;
  screenshot: string;
};

export type ActivityGroup = {
  id: string;
  label: string;
  items: string[];
};

export type ProjectItem = {
  id: string;
  title: string;
  description: string;
  status: string;
  href: string;
  screenshot: string;
};

export type TimelineStage = {
  id: string;
  year: string;
  title: string;
  description: string;
  status: "current" | "done" | "upcoming";
};

export type HomeContent = {
  heroName: string;
  heroSubtitle: string;
  heroIntro: string;
  ctaStudy: string;
  ctaAi: string;
  ctaGrowth: string;
  scrollCue: string;
  spacesHeading: string;
  spacesIntro: string;
  spaces: SpaceItem[];
  timelineHeading: string;
  timelineIntro: string;
  timelineStages: TimelineStage[];
  projectsHeading: string;
  projectsIntro: string;
  projects: ProjectItem[];
  aboutHeading: string;
  aboutSubheading: string;
  aboutText: string[];
  aboutTagWork: string;
  aboutTagStudy: string;
  aboutTagAi: string;
  footerTagline: string;
  footerLinks: { label: string; href: string }[];
  copyright: string;
};

const GITHUB_URL = "https://github.com/yaojunxiong";

export const homeContent: Record<HomeLanguage, HomeContent> = {
  zh: {
    heroName: "Jimmy Yao",
    heroSubtitle: "学习日语，用 AI 构建自己的成长系统",
    heroIntro: "这里记录我的学习、AI 项目和持续成长。",
    ctaStudy: "开始学习日语",
    ctaAi: "进入 Jimmy AI",
    ctaGrowth: "查看成长历程",
    scrollCue: "向下滚动，了解更多",
    spacesHeading: "三个核心空间",
    spacesIntro: "围绕学习与创造，这里连接几件我每天都在用的事。",
    spaces: [
      {
        id: "study",
        eyebrow: "STUDY",
        title: "日语学习",
        description: "从大家的日本语到 AI 陪练，把日语学习变成每天的小习惯。",
        bullets: ["大家的日本语课程", "会话字幕", "跟读练习", "AI 会话陪练"],
        href: "https://study.jimmyyao.com",
        cta: "进入学习",
        screenshot: "/screenshots/study.jpg"
      },
      {
        id: "ai",
        eyebrow: "JIMMY AI",
        title: "Jimmy AI",
        description: "用 AI 助手管理项目、任务与开发工作流。",
        bullets: ["AI 助手", "项目与任务", "模型选择", "开发工作流"],
        href: "https://ai.jimmyyao.com",
        cta: "进入 Jimmy AI",
        screenshot: "/screenshots/ai.jpg"
      },
      {
        id: "forum",
        eyebrow: "FORUM",
        title: "学习社区",
        description: "把学习、作品和疑问放到一起，和同样在成长的人交流。",
        bullets: ["学习交流", "作品分享", "问题讨论", "学习记录"],
        href: "https://forum.jimmyyao.com",
        cta: "进入社区",
        screenshot: "/screenshots/forum.jpg"
      }
    ],
    timelineHeading: "成长路径",
    timelineIntro: "从零基础到构建自己的 AI 世界，每一步都可见。",
    timelineStages: [
      { id: "t1", year: "阶段 01", title: "日语学习系统", description: "大家的日本语 + AI 会话陪练", status: "current" },
      { id: "t2", year: "阶段 02", title: "AI 背诵 & 跟读", description: "AI 驱动的记忆与发音练习", status: "current" },
      { id: "t3", year: "阶段 03", title: "Jimmy AIOS 中控台", description: "个人 AI 项目管理系统", status: "upcoming" },
      { id: "t4", year: "阶段 04", title: "AI Learning World", description: "3D 沉浸式学习世界", status: "upcoming" }
    ],
    projectsHeading: "项目与作品",
    projectsIntro: "这里是我在构建和维护的项目。",
    projects: [
      { id: "p1", title: "日语学习系统", description: "基于大家的日本语的在线学习平台", status: "开发中", href: "https://study.jimmyyao.com", screenshot: "/screenshots/study.jpg" },
      { id: "p2", title: "Jimmy AIOS", description: "个人 AI 中控台，管理项目与工作流", status: "活跃", href: "https://ai.jimmyyao.com", screenshot: "/screenshots/ai.jpg" },
      { id: "p3", title: "管理后台", description: "内容管理与系统配置中心", status: "内部使用", href: "https://admin.jimmyyao.com", screenshot: "/screenshots/admin.jpg" },
      { id: "p4", title: "社区论坛", description: "学习交流与作品分享平台", status: "运营中", href: "https://forum.jimmyyao.com", screenshot: "/screenshots/forum.jpg" }
    ],
    aboutHeading: "关于 Jimmy",
    aboutSubheading: "生活在日本，用 AI 搭建自己的成长世界",
    aboutText: [
      "我生活在日本，正在持续学习日语。",
      "平时用 AI 搭建属于自己的学习和开发系统，把零散的练习、项目和记录连成一条线。",
      "这个网站是我学习、项目和成长的记录本——不完美，但真实。"
    ],
    aboutTagWork: "工作",
    aboutTagStudy: "学习",
    aboutTagAi: "AI 项目",
    footerTagline: "学习日语，用 AI 构建自己的成长系统",
    footerLinks: [
      { label: "Study", href: "https://study.jimmyyao.com" },
      { label: "Jimmy AI", href: "https://ai.jimmyyao.com" },
      { label: "Forum", href: "https://forum.jimmyyao.com" },
      { label: "GitHub", href: GITHUB_URL }
    ],
    copyright: "© 2026 Jimmy Yao. 保留所有权利。"
  },
  ja: {
    heroName: "Jimmy Yao",
    heroSubtitle: "日本語を学び、AI で自分の成長システムをつくる",
    heroIntro: "ここには、わたしの学習・AI プロジェクト・成長の記録があります。",
    ctaStudy: "日本語を学びはじめる",
    ctaAi: "Jimmy AI を開く",
    ctaGrowth: "成長の記録を見る",
    scrollCue: "スクロールして詳しく",
    spacesHeading: "3 つの核心スペース",
    spacesIntro: "学習と創造を中心に、毎日使っているものをつなぎます。",
    spaces: [
      {
        id: "study",
        eyebrow: "STUDY",
        title: "日本語学習",
        description: "『みんなの日本語』から AI 会話練習まで、日本語を毎日の習慣に。",
        bullets: ["みんなの日本語コース", "会話字幕", "シャドーイング", "AI 会話練習"],
        href: "https://study.jimmyyao.com",
        cta: "学習を開く",
        screenshot: "/screenshots/study.jpg"
      },
      {
        id: "ai",
        eyebrow: "JIMMY AI",
        title: "Jimmy AI",
        description: "AI アシスタントでプロジェクト・タスク・開発フローを管理。",
        bullets: ["AI アシスタント", "プロジェクトとタスク", "モデル選択", "開発ワークフロー"],
        href: "https://ai.jimmyyao.com",
        cta: "Jimmy AI を開く",
        screenshot: "/screenshots/ai.jpg"
      },
      {
        id: "forum",
        eyebrow: "FORUM",
        title: "学習コミュニティ",
        description: "学習・作品・疑問を一か所に。成長する仲間とつながる。",
        bullets: ["学習の交流", "作品の共有", "質問と議論", "学習の記録"],
        href: "https://forum.jimmyyao.com",
        cta: "コミュニティを開く",
        screenshot: "/screenshots/forum.jpg"
      }
    ],
    timelineHeading: "成長の流れ",
    timelineIntro: "ゼロから自分の AI 世界を作るまで、すべてのステップを見える化。",
    timelineStages: [
      { id: "t1", year: "Step 01", title: "日本語学習システム", description: "みんなの日本語 + AI 会話練習", status: "current" },
      { id: "t2", year: "Step 02", title: "AI 暗唱 & 発音練習", description: "AI を使った記憶と発音の強化", status: "current" },
      { id: "t3", year: "Step 03", title: "Jimmy AIOS", description: "個人 AI プロジェクト管理システム", status: "upcoming" },
      { id: "t4", year: "Step 04", title: "AI Learning World", description: "3D 没入型学習空間", status: "upcoming" }
    ],
    projectsHeading: "プロジェクト",
    projectsIntro: "現在構築・運用中のプロジェクトです。",
    projects: [
      { id: "p1", title: "日本語学習システム", description: "みんなの日本語ベースの学習プラットフォーム", status: "開発中", href: "https://study.jimmyyao.com", screenshot: "/screenshots/study.jpg" },
      { id: "p2", title: "Jimmy AIOS", description: "個人 AI 中控台、プロジェクト管理", status: "アクティブ", href: "https://ai.jimmyyao.com", screenshot: "/screenshots/ai.jpg" },
      { id: "p3", title: "管理バックエンド", description: "コンテンツ管理とシステム設定", status: "内部利用", href: "https://admin.jimmyyao.com", screenshot: "/screenshots/admin.jpg" },
      { id: "p4", title: "コミュニティフォーラム", description: "学習交流と作品共有の場", status: "運営中", href: "https://forum.jimmyyao.com", screenshot: "/screenshots/forum.jpg" }
    ],
    aboutHeading: "Jimmy について",
    aboutSubheading: "日本に住み、AI で自分の成長の世界を作っている",
    aboutText: [
      "日本に住みながら、日本語を継続して学んでいます。",
      "普段は AI を使って自分専用の学習・開発システムをつくり、バラバラな練習・プロジェクト・記録をつなげています。",
      "このサイトはわたしの学習・プロジェクト・成長の記録帖です。完璧ではないけれど、本物です。"
    ],
    aboutTagWork: "仕事",
    aboutTagStudy: "学習",
    aboutTagAi: "AI プロジェクト",
    footerTagline: "日本語を学び、AI で自分の成長システムをつくる",
    footerLinks: [
      { label: "Study", href: "https://study.jimmyyao.com" },
      { label: "Jimmy AI", href: "https://ai.jimmyyao.com" },
      { label: "Forum", href: "https://forum.jimmyyao.com" },
      { label: "GitHub", href: GITHUB_URL }
    ],
    copyright: "© 2026 Jimmy Yao. All rights reserved."
  },
  en: {
    heroName: "Jimmy Yao",
    heroSubtitle: "Learning Japanese, building my own growth system with AI",
    heroIntro: "This is where I keep my learning, AI projects, and continuous growth.",
    ctaStudy: "Start learning Japanese",
    ctaAi: "Open Jimmy AI",
    ctaGrowth: "See my journey",
    scrollCue: "Scroll down to learn more",
    spacesHeading: "Three core spaces",
    spacesIntro: "Centered on learning and creating, these are the things I use every day.",
    spaces: [
      {
        id: "study",
        eyebrow: "STUDY",
        title: "Japanese learning",
        description: "From Minna no Nihongo to AI speaking practice — make Japanese a daily habit.",
        bullets: ["Minna no Nihongo course", "Dialogue subtitles", "Shadowing practice", "AI speaking partner"],
        href: "https://study.jimmyyao.com",
        cta: "Open learning",
        screenshot: "/screenshots/study.jpg"
      },
      {
        id: "ai",
        eyebrow: "JIMMY AI",
        title: "Jimmy AI",
        description: "Use the AI assistant to manage projects, tasks, and your dev workflow.",
        bullets: ["AI assistant", "Projects & tasks", "Model choice", "Dev workflow"],
        href: "https://ai.jimmyyao.com",
        cta: "Open Jimmy AI",
        screenshot: "/screenshots/ai.jpg"
      },
      {
        id: "forum",
        eyebrow: "FORUM",
        title: "Learning community",
        description: "Bring learning, work, and questions together, and grow with others.",
        bullets: ["Learning exchange", "Show your work", "Ask & discuss", "Learning logs"],
        href: "https://forum.jimmyyao.com",
        cta: "Open community",
        screenshot: "/screenshots/forum.jpg"
      }
    ],
    timelineHeading: "Growth path",
    timelineIntro: "From zero to building my own AI world — every step visible.",
    timelineStages: [
      { id: "t1", year: "Step 01", title: "Japanese Learning System", description: "Minna no Nihongo + AI conversation coach", status: "current" },
      { id: "t2", year: "Step 02", title: "AI Recitation & Shadowing", description: "AI-powered memory & pronunciation practice", status: "current" },
      { id: "t3", year: "Step 03", title: "Jimmy AIOS Console", description: "Personal AI project management hub", status: "upcoming" },
      { id: "t4", year: "Step 04", title: "AI Learning World", description: "3D immersive learning environment", status: "upcoming" }
    ],
    projectsHeading: "Projects & works",
    projectsIntro: "Projects I'm building and maintaining.",
    projects: [
      { id: "p1", title: "Japanese Learning", description: "Minna no Nihongo-based learning platform", status: "In dev", href: "https://study.jimmyyao.com", screenshot: "/screenshots/study.jpg" },
      { id: "p2", title: "Jimmy AIOS", description: "Personal AI console for project management", status: "Active", href: "https://ai.jimmyyao.com", screenshot: "/screenshots/ai.jpg" },
      { id: "p3", title: "Admin Dashboard", description: "Content management & system configuration", status: "Internal", href: "https://admin.jimmyyao.com", screenshot: "/screenshots/admin.jpg" },
      { id: "p4", title: "Community Forum", description: "Learning exchange & work showcase", status: "Live", href: "https://forum.jimmyyao.com", screenshot: "/screenshots/forum.jpg" }
    ],
    aboutHeading: "About Jimmy",
    aboutSubheading: "Living in Japan, building my own AI-powered growth world",
    aboutText: [
      "I live in Japan and keep learning Japanese.",
      "Day to day I use AI to build my own learning and development system, connecting scattered practice, projects, and notes into one thread.",
      "This site is my notebook for learning, projects, and growth — imperfect, but real."
    ],
    aboutTagWork: "Work",
    aboutTagStudy: "Study",
    aboutTagAi: "AI Projects",
    footerTagline: "Learning Japanese, building my own growth system with AI",
    footerLinks: [
      { label: "Study", href: "https://study.jimmyyao.com" },
      { label: "Jimmy AI", href: "https://ai.jimmyyao.com" },
      { label: "Forum", href: "https://forum.jimmyyao.com" },
      { label: "GitHub", href: GITHUB_URL }
    ],
    copyright: "© 2026 Jimmy Yao. All rights reserved."
  }
};
