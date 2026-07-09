export type AiWorldPortalId = "study" | "forum" | "knowledge" | "ai-lab" | "admin";

export type AiWorldPortal = {
  id: AiWorldPortalId;
  titleJa: string;
  titleZh: string;
  subtitle: string;
  description: string;
  url: string | null;
  enabled: boolean;
  position: readonly [number, number, number];
  entrancePosition: readonly [number, number, number];
  color: string;
  buildingType: "school" | "forum" | "library" | "lab" | "admin";
};

export const aiWorldPortals: AiWorldPortal[] = [
  {
    id: "study",
    titleJa: "日本語学校",
    titleZh: "日语学习系统",
    subtitle: "日本語学習システム",
    description: "学ぶ・練習・テスト",
    url: "https://study.jimmyyao.com",
    enabled: true,
    position: [-3.18, 0.25, 1.18],
    entrancePosition: [-2.32, 0.42, 0.94],
    color: "#3b82f6",
    buildingType: "school"
  },
  {
    id: "forum",
    titleJa: "フォーラム広場",
    titleZh: "论坛系统",
    subtitle: "フォーラムシステム",
    description: "コミュニティ・交流",
    url: "https://forum.jimmyyao.com",
    enabled: true,
    position: [-1.78, 0.25, -2.58],
    entrancePosition: [-1.32, 0.42, -1.9],
    color: "#8b5cf6",
    buildingType: "forum"
  },
  {
    id: "knowledge",
    titleJa: "知識の図書館",
    titleZh: "知识库",
    subtitle: "知識ベース",
    description: "資料・ガイド・文書",
    url: null,
    enabled: false,
    position: [1.45, 0.25, -2.62],
    entrancePosition: [1.12, 0.42, -1.92],
    color: "#f59e0b",
    buildingType: "library"
  },
  {
    id: "ai-lab",
    titleJa: "AIラボ",
    titleZh: "AI 工具中心",
    subtitle: "AIツールセンター",
    description: "支援・生成・分析",
    url: null,
    enabled: false,
    position: [3.12, 0.25, 0.78],
    entrancePosition: [2.34, 0.42, 0.6],
    color: "#06b6d4",
    buildingType: "lab"
  },
  {
    id: "admin",
    titleJa: "管理センター",
    titleZh: "管理后台",
    subtitle: "管理システム",
    description: "設定・データ・承認",
    url: null,
    enabled: false,
    position: [2.1, 0.25, 2.42],
    entrancePosition: [1.62, 0.42, 1.86],
    color: "#ef4444",
    buildingType: "admin"
  }
];

export function getAiWorldPortal(id: AiWorldPortalId) {
  return aiWorldPortals.find((portal) => portal.id === id);
}
