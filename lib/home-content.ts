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
};

export type ActivityGroup = {
  id: string;
  label: string;
  items: string[];
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
  growthHeading: string;
  growthIntro: string;
  activity: ActivityGroup[];
  aboutHeading: string;
  aboutText: string[];
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
        cta: "进入学习"
      },
      {
        id: "ai",
        eyebrow: "JIMMY AI",
        title: "Jimmy AI",
        description: "用 AI 助手管理项目、任务与开发工作流。",
        bullets: ["AI 助手", "项目与任务", "模型选择", "开发工作流"],
        href: "https://ai.jimmyyao.com",
        cta: "进入 Jimmy AI"
      },
      {
        id: "forum",
        eyebrow: "FORUM",
        title: "学习社区",
        description: "把学习、作品和疑问放到一起，和同样在成长的人交流。",
        bullets: ["学习交流", "作品分享", "问题讨论", "学习记录"],
        href: "https://forum.jimmyyao.com",
        cta: "进入社区"
      }
    ],
    growthHeading: "最近在做什么",
    growthIntro: "不是数据看板，只是我真实的进度与计划。",
    activity: [
      {
        id: "learning",
        label: "正在学习",
        items: ["大家的日本语（初级）每天跟读练习", "用字幕精听日剧片段"]
      },
      {
        id: "building",
        label: "正在开发",
        items: ["Jimmy AIOS 个人成长系统", "www.jimmyyao.com 门户体验优化"]
      },
      {
        id: "done",
        label: "最近完成",
        items: ["重建个人门户 www.jimmyyao.com", "整理日语学习与跟读素材"]
      },
      {
        id: "next",
        label: "下一步目标",
        items: ["完成 N4 阶段课程", "在社区上线作品分享"]
      }
    ],
    aboutHeading: "关于 Jimmy",
    aboutText: [
      "我生活在日本，正在持续学习日语。",
      "平时用 AI 搭建属于自己的学习和开发系统，把零散的练习、项目和记录连成一条线。",
      "这个网站是我学习、项目和成长的记录本——不完美，但真实。"
    ],
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
        cta: "学習を開く"
      },
      {
        id: "ai",
        eyebrow: "JIMMY AI",
        title: "Jimmy AI",
        description: "AI アシスタントでプロジェクト・タスク・開発フローを管理。",
        bullets: ["AI アシスタント", "プロジェクトとタスク", "モデル選択", "開発ワークフロー"],
        href: "https://ai.jimmyyao.com",
        cta: "Jimmy AI を開く"
      },
      {
        id: "forum",
        eyebrow: "FORUM",
        title: "学習コミュニティ",
        description: "学習・作品・疑問を一か所に。成長する仲間とつながる。",
        bullets: ["学習の交流", "作品の共有", "質問と議論", "学習の記録"],
        href: "https://forum.jimmyyao.com",
        cta: "コミュニティを開く"
      }
    ],
    growthHeading: "最近の活動",
    growthIntro: "ダッシュボードではなく、わたしの正直な進捗と計画です。",
    activity: [
      {
        id: "learning",
        label: "学習中",
        items: ["みんなの日本語（初級）の毎日シャドーイング", "字幕でドラマの短いシーンを精聴"]
      },
      {
        id: "building",
        label: "開発中",
        items: ["Jimmy AIOS 個人の成長システム", "www.jimmyyao.com ポータルの体験改善"]
      },
      {
        id: "done",
        label: "最近やったこと",
        items: ["個人ポータル www.jimmyyao.com を作り直し", "日本語学習・シャドーイング素材を整理"]
      },
      {
        id: "next",
        label: "次の目標",
        items: ["N4 レベルを完了する", "コミュニティで作品共有を公開"]
      }
    ],
    aboutHeading: "Jimmy について",
    aboutText: [
      "日本に住みながら、日本語を継続して学んでいます。",
      "普段は AI を使って自分専用の学習・開発システムをつくり、バラバラな練習・プロジェクト・記録をつなげています。",
      "このサイトはわたしの学習・プロジェクト・成長の記録帖です。完璧ではないけれど、本物です。"
    ],
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
        cta: "Open learning"
      },
      {
        id: "ai",
        eyebrow: "JIMMY AI",
        title: "Jimmy AI",
        description: "Use the AI assistant to manage projects, tasks, and your dev workflow.",
        bullets: ["AI assistant", "Projects & tasks", "Model choice", "Dev workflow"],
        href: "https://ai.jimmyyao.com",
        cta: "Open Jimmy AI"
      },
      {
        id: "forum",
        eyebrow: "FORUM",
        title: "Learning community",
        description: "Bring learning, work, and questions together, and grow with others.",
        bullets: ["Learning exchange", "Show your work", "Ask & discuss", "Learning logs"],
        href: "https://forum.jimmyyao.com",
        cta: "Open community"
      }
    ],
    growthHeading: "What I'm up to",
    growthIntro: "Not a dashboard — just my real progress and plans.",
    activity: [
      {
        id: "learning",
        label: "Learning",
        items: ["Daily shadowing with Minna no Nihongo (beginner)", "Listening to drama clips with subtitles"]
      },
      {
        id: "building",
        label: "Building",
        items: ["Jimmy AIOS personal growth system", "www.jimmyyao.com portal experience upgrade"]
      },
      {
        id: "done",
        label: "Recently finished",
        items: ["Rebuilt the personal portal www.jimmyyao.com", "Organized Japanese study & shadowing materials"]
      },
      {
        id: "next",
        label: "Next goals",
        items: ["Complete the N4 stage", "Launch work sharing in the community"]
      }
    ],
    aboutHeading: "About Jimmy",
    aboutText: [
      "I live in Japan and keep learning Japanese.",
      "Day to day I use AI to build my own learning and development system, connecting scattered practice, projects, and notes into one thread.",
      "This site is my notebook for learning, projects, and growth — imperfect, but real."
    ],
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
