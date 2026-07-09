"use client";

import type { AiWorldPortal } from "./portals";

export type AiWorldLanguage = "ja" | "zh" | "en";

export const aiWorldLanguages: { code: AiWorldLanguage; label: string; shortLabel: string }[] = [
  { code: "ja", label: "日本語", shortLabel: "日" },
  { code: "zh", label: "中文", shortLabel: "中" },
  { code: "en", label: "English", shortLabel: "EN" }
];

export const aiWorldCopy = {
  ja: {
    defaultStatus: "WASD / 方向キー / 地面タップでJYを走らせよう",
    comingSoon: "この入口はまもなく公開されます",
    entering: (portal: AiWorldPortal) => `${portal.subtitleJa}に入ります`,
    movingTo: (portal: AiWorldPortal) => `JYが${portal.titleJa}へ向かっています...`,
    authSignIn: "SIGN IN",
    authSignOut: "SIGN OUT",
    soundOn: "Sound On",
    soundOff: "Sound Off",
    languageLabel: "言語",
    webglTitle: "AI Learning World",
    webglText: "WebGL が利用できません。下のリンクから各システムへ移動できます。",
    enter: "入る",
    soon: "準備中",
    seoStudy: "日本語学校 / 日语学习系统 / Japanese Learning",
    seoForum: "フォーラム広場 / 论坛系统 / Forum",
    seoKnowledge: "知識の図書館 / 知识库 / Knowledge Library",
    seoAdmin: "管理センター / 管理后台 / Admin Center"
  },
  zh: {
    defaultStatus: "用 WASD / 方向键 / 点击地面，让 JY 在小世界里跑起来",
    comingSoon: "这个入口即将开放",
    entering: (portal: AiWorldPortal) => `正在进入${portal.titleZh}`,
    movingTo: (portal: AiWorldPortal) => `JY 正在前往${portal.titleZh}...`,
    authSignIn: "登录",
    authSignOut: "退出",
    soundOn: "音效开",
    soundOff: "音效关",
    languageLabel: "语言",
    webglTitle: "AI Learning World",
    webglText: "当前设备无法使用 WebGL。你仍然可以通过下方链接进入各系统。",
    enter: "进入",
    soon: "即将开放",
    seoStudy: "日本語学校 / 日语学习系统 / Japanese Learning",
    seoForum: "フォーラム広場 / 论坛系统 / Forum",
    seoKnowledge: "知識の図書館 / 知识库 / Knowledge Library",
    seoAdmin: "管理センター / 管理后台 / Admin Center"
  },
  en: {
    defaultStatus: "Use WASD / arrow keys / tap the ground to move JY",
    comingSoon: "This entrance is coming soon",
    entering: (portal: AiWorldPortal) => `Entering ${portal.titleEn}`,
    movingTo: (portal: AiWorldPortal) => `JY is heading to ${portal.titleEn}...`,
    authSignIn: "SIGN IN",
    authSignOut: "SIGN OUT",
    soundOn: "Sound On",
    soundOff: "Sound Off",
    languageLabel: "Language",
    webglTitle: "AI Learning World",
    webglText: "WebGL is not available. You can still use the links below to enter each system.",
    enter: "ENTER",
    soon: "COMING SOON",
    seoStudy: "日本語学校 / 日语学习系统 / Japanese Learning",
    seoForum: "フォーラム広場 / 论坛系统 / Forum",
    seoKnowledge: "知識の図書館 / 知识库 / Knowledge Library",
    seoAdmin: "管理センター / 管理后台 / Admin Center"
  }
} satisfies Record<AiWorldLanguage, {
  defaultStatus: string;
  comingSoon: string;
  entering: (portal: AiWorldPortal) => string;
  movingTo: (portal: AiWorldPortal) => string;
  authSignIn: string;
  authSignOut: string;
  soundOn: string;
  soundOff: string;
  languageLabel: string;
  webglTitle: string;
  webglText: string;
  enter: string;
  soon: string;
  seoStudy: string;
  seoForum: string;
  seoKnowledge: string;
  seoAdmin: string;
}>;

export function detectAiWorldLanguage(): AiWorldLanguage {
  if (typeof window === "undefined") return "ja";

  const stored = window.localStorage.getItem("jimmyyao:language");
  if (stored === "ja" || stored === "zh" || stored === "en") return stored;

  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  const preferred = languages.find(Boolean)?.toLowerCase() ?? "";

  if (preferred.startsWith("zh")) return "zh";
  if (preferred.startsWith("en")) return "en";
  return "ja";
}

export function portalTitle(portal: AiWorldPortal, language: AiWorldLanguage) {
  if (language === "zh") return portal.titleZh;
  if (language === "en") return portal.titleEn;
  return portal.titleJa;
}

export function portalStatus(portal: AiWorldPortal, language: AiWorldLanguage) {
  if (language === "zh") return `${portal.titleZh} / ${portal.subtitleZh} / ${portal.descriptionZh}`;
  if (language === "en") return `${portal.titleEn} / ${portal.subtitleEn} / ${portal.descriptionEn}`;
  return `${portal.titleJa} / ${portal.subtitleJa} / ${portal.descriptionJa}`;
}
