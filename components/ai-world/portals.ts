export type AiWorldPortalId = "study" | "forum" | "knowledge" | "ai-lab" | "admin";

export type AiWorldPortal = {
  id: AiWorldPortalId;
  titleJa: string;
  titleZh: string;
  titleEn: string;
  subtitleJa: string;
  subtitleZh: string;
  subtitleEn: string;
  descriptionJa: string;
  descriptionZh: string;
  descriptionEn: string;
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
    titleEn: "Japanese School",
    subtitleJa: "日本語学習システム",
    subtitleZh: "日语学习系统",
    subtitleEn: "Japanese learning system",
    descriptionJa: "学ぶ・練習・テスト",
    descriptionZh: "学习・练习・测试",
    descriptionEn: "Learn, practice, and test",
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
    titleEn: "Forum Plaza",
    subtitleJa: "フォーラムシステム",
    subtitleZh: "论坛系统",
    subtitleEn: "Community forum",
    descriptionJa: "コミュニティ・交流",
    descriptionZh: "社区・交流",
    descriptionEn: "Community and exchange",
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
    titleEn: "Knowledge Library",
    subtitleJa: "知識ベース",
    subtitleZh: "知识库",
    subtitleEn: "Knowledge base",
    descriptionJa: "資料・ガイド・文書",
    descriptionZh: "资料・指南・文档",
    descriptionEn: "Resources, guides, and docs",
    url: "https://hub.jimmyyao.com",
    enabled: true,
    position: [1.45, 0.25, -2.62],
    entrancePosition: [1.12, 0.42, -1.92],
    color: "#f59e0b",
    buildingType: "library"
  },
  {
    id: "ai-lab",
    titleJa: "AIラボ",
    titleZh: "AI 工具中心",
    titleEn: "AI Lab",
    subtitleJa: "AIツールセンター",
    subtitleZh: "AI 工具中心",
    subtitleEn: "AI tools center",
    descriptionJa: "支援・生成・分析",
    descriptionZh: "辅助・生成・分析",
    descriptionEn: "Assist, generate, and analyze",
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
    titleEn: "Admin Center",
    subtitleJa: "管理システム",
    subtitleZh: "管理系统",
    subtitleEn: "Admin system",
    descriptionJa: "設定・データ・承認",
    descriptionZh: "设置・数据・审核",
    descriptionEn: "Settings, data, and approvals",
    url: "https://study.jimmyyao.com/admin/system",
    enabled: true,
    position: [2.1, 0.25, 2.42],
    entrancePosition: [1.62, 0.42, 1.86],
    color: "#ef4444",
    buildingType: "admin"
  }
];

export function getAiWorldPortal(id: AiWorldPortalId) {
  return aiWorldPortals.find((portal) => portal.id === id);
}
