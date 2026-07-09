export type WorldPortalKey = "study" | "forum" | "knowledge" | "tools" | "admin";

export type PortalRect = {
  left: string;
  top: string;
  width: string;
  height: string;
};

export type PortalPoint = {
  x: string;
  y: string;
};

export type WorldPortal = {
  key: WorldPortalKey;
  titleJa: string;
  titleZh: string;
  subtitleJa: string;
  description: string;
  status: "live" | "soon" | "hidden";
  href?: string;
  accent: string;
  buildingColor: string;
  roofColor: string;
  position: readonly [number, number, number];
  labelOffset: readonly [number, number, number];
  desktopHotspot: PortalRect;
  mobileHotspot: PortalRect;
  characterTargetDesktop: PortalPoint;
  characterTargetMobile: PortalPoint;
};

export const worldPortals: WorldPortal[] = [
  {
    key: "study",
    titleJa: "日本語学校",
    titleZh: "日语学习系统",
    subtitleJa: "日本語学習システム",
    description: "学ぶ・練習・テスト",
    status: "live",
    href: "https://study.jimmyyao.com",
    accent: "#3b82f6",
    buildingColor: "#f5e5be",
    roofColor: "#2d5d8f",
    position: [-2.35, 0.24, 0.72],
    labelOffset: [0, 1.28, 0.28],
    desktopHotspot: { left: "10%", top: "38%", width: "24%", height: "30%" },
    mobileHotspot: { left: "4%", top: "42%", width: "42%", height: "20%" },
    characterTargetDesktop: { x: "25%", y: "61%" },
    characterTargetMobile: { x: "28%", y: "58%" }
  },
  {
    key: "forum",
    titleJa: "フォーラム広場",
    titleZh: "论坛系统",
    subtitleJa: "フォーラムシステム",
    description: "コミュニティ・交流",
    status: "live",
    href: "https://forum.jimmyyao.com",
    accent: "#8b5cf6",
    buildingColor: "#edd9bc",
    roofColor: "#4a6898",
    position: [-1.28, 0.24, -1.72],
    labelOffset: [0, 1.24, 0.28],
    desktopHotspot: { left: "28%", top: "15%", width: "22%", height: "27%" },
    mobileHotspot: { left: "8%", top: "24%", width: "42%", height: "18%" },
    characterTargetDesktop: { x: "42%", y: "42%" },
    characterTargetMobile: { x: "38%", y: "43%" }
  },
  {
    key: "knowledge",
    titleJa: "知識の図書館",
    titleZh: "知识库",
    subtitleJa: "知識ベース",
    description: "資料・ガイド・文書",
    status: "live",
    href: "https://hub.jimmyyao.com",
    accent: "#d97706",
    buildingColor: "#e8d3aa",
    roofColor: "#3b638a",
    position: [1.18, 0.24, -1.78],
    labelOffset: [0, 1.48, 0.28],
    desktopHotspot: { left: "55%", top: "10%", width: "18%", height: "34%" },
    mobileHotspot: { left: "52%", top: "23%", width: "39%", height: "22%" },
    characterTargetDesktop: { x: "62%", y: "43%" },
    characterTargetMobile: { x: "66%", y: "44%" }
  },
  {
    key: "tools",
    titleJa: "AIラボ",
    titleZh: "AI 工具中心",
    subtitleJa: "AIツールセンター",
    description: "支援・生成・分析",
    status: "soon",
    accent: "#06b6d4",
    buildingColor: "#d9edf2",
    roofColor: "#39447a",
    position: [2.36, 0.24, 0.66],
    labelOffset: [0, 1.34, 0.28],
    desktopHotspot: { left: "73%", top: "22%", width: "22%", height: "34%" },
    mobileHotspot: { left: "58%", top: "46%", width: "38%", height: "19%" },
    characterTargetDesktop: { x: "80%", y: "52%" },
    characterTargetMobile: { x: "74%", y: "56%" }
  },
  {
    key: "admin",
    titleJa: "管理センター",
    titleZh: "管理后台",
    subtitleJa: "管理システム",
    description: "設定・データ・承認",
    status: "live",
    href: "https://study.jimmyyao.com/admin/system",
    accent: "#ef4444",
    buildingColor: "#e2d0b4",
    roofColor: "#4a5568",
    position: [1.2, 0.24, 1.88],
    labelOffset: [0, 1.16, 0.28],
    desktopHotspot: { left: "68%", top: "56%", width: "22%", height: "26%" },
    mobileHotspot: { left: "50%", top: "64%", width: "42%", height: "16%" },
    characterTargetDesktop: { x: "73%", y: "70%" },
    characterTargetMobile: { x: "66%", y: "70%" }
  }
] as const;

export function getWorldPortal(key: WorldPortalKey) {
  return worldPortals.find((portal) => portal.key === key);
}
