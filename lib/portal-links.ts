export const portalLinks = {
  start: "https://study.jimmyyao.com",
  worldMap: "https://hub.jimmyyao.com",
  contact: "mailto:me@jimmyyao.com"
} as const;

export type PortalLinkKey = keyof typeof portalLinks;
