"use client";

import type { CSSProperties, RefObject } from "react";
import { type WorldPortalKey, worldPortals } from "@/lib/world-portals";
import styles from "./anime-gate.module.css";

type HtmlOverlayMenuProps = {
  activePortal?: WorldPortalKey | null;
  isTransitioning: boolean;
  characterState: "idle" | "running" | "arrived";
  characterRef: RefObject<HTMLDivElement | null>;
  statusMessage: string;
  onPortalSelect: (key: WorldPortalKey) => void;
  onPortalHover: (key: WorldPortalKey | null) => void;
};

export function HtmlOverlayMenu({
  activePortal,
  isTransitioning,
  characterState,
  characterRef,
  statusMessage,
  onPortalSelect,
  onPortalHover
}: HtmlOverlayMenuProps) {
  return (
    <section className={`${styles.uiLayer} ${styles.animePortal} fixed inset-0 z-20 min-h-[100dvh] w-full overflow-hidden text-center`}>
      <picture className={styles.animeBackdrop} aria-hidden="true">
        <source media="(max-width: 767px)" srcSet="/assets/ai-world/ai-world-mobile.webp" />
        <img src="/assets/ai-world/ai-world-desktop.webp" alt="" />
      </picture>

      <div className={styles.portalShade} aria-hidden="true" />

      <div className={styles.mapTopBar}>
        <div className={styles.topMark}>
          <span className={styles.crest} aria-hidden="true" />
          <span>
            <strong>JY</strong>
            <small>AI Learning World</small>
          </span>
        </div>
      </div>

      <div className={styles.mapHeroCopy}>
        <p className={styles.mapEyebrow}>AI Learning World</p>
        <h1>JY 学習タウン</h1>
        <p>入口を選んで、JYの世界を探索しよう！</p>
      </div>

      <div
        ref={characterRef}
        className={styles.jyCharacter}
        data-state={characterState}
        aria-hidden="true"
      >
        <span className={styles.jyHair} />
        <span className={styles.jyHead}>
          <span />
          <span />
        </span>
        <span className={styles.jyBody}>JY</span>
        <span className={styles.jyArmLeft} />
        <span className={styles.jyArmRight} />
        <span className={styles.jyLegLeft} />
        <span className={styles.jyLegRight} />
        <span className={styles.jyShadow} />
      </div>

      <div className={styles.hotspotLayer} aria-label="Building entrances">
        {worldPortals.map((portal) => {
          const isActive = activePortal === portal.key;
          const style = {
            "--hotspot-left": portal.desktopHotspot.left,
            "--hotspot-top": portal.desktopHotspot.top,
            "--hotspot-width": portal.desktopHotspot.width,
            "--hotspot-height": portal.desktopHotspot.height,
            "--hotspot-mobile-left": portal.mobileHotspot.left,
            "--hotspot-mobile-top": portal.mobileHotspot.top,
            "--hotspot-mobile-width": portal.mobileHotspot.width,
            "--hotspot-mobile-height": portal.mobileHotspot.height,
            "--portal-color": portal.accent
          } as CSSProperties;
          const label = `${portal.titleJa} / ${portal.titleZh}`;

          if (portal.status === "live" && portal.href) {
            return (
              <a
                key={portal.key}
                href={portal.href}
                aria-label={label}
                className={styles.portalHotspot}
                data-active={isActive ? "true" : "false"}
                style={style}
                onMouseEnter={() => onPortalHover(portal.key)}
                onMouseLeave={() => onPortalHover(null)}
                onFocus={() => onPortalHover(portal.key)}
                onBlur={() => onPortalHover(null)}
                onClick={(event) => {
                  event.preventDefault();
                  if (!isTransitioning) {
                    onPortalSelect(portal.key);
                  }
                }}
              >
                <span>{portal.titleJa}</span>
              </a>
            );
          }

          return (
            <button
              key={portal.key}
              type="button"
              disabled={isTransitioning}
              aria-label={label}
              className={styles.portalHotspot}
              data-active={isActive ? "true" : "false"}
              style={style}
              onMouseEnter={() => onPortalHover(portal.key)}
              onMouseLeave={() => onPortalHover(null)}
              onFocus={() => onPortalHover(portal.key)}
              onBlur={() => onPortalHover(null)}
              onClick={() => onPortalSelect(portal.key)}
            >
              <span>{portal.titleJa}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.mapStatus} aria-live="polite">
        {statusMessage}
      </div>

      <nav className={styles.portalDock} aria-label="AI Learning World entrances">
        {worldPortals.map((portal) => {
          const isActive = activePortal === portal.key;
          const isLive = portal.status === "live" && portal.href;
          const content = (
            <>
              <span className={styles.portalDot} style={{ "--portal-color": portal.accent } as CSSProperties} aria-hidden="true" />
              <span className={styles.portalCopy}>
                <span className={styles.portalTitle}>{portal.titleJa}</span>
                <span className={styles.portalSubtitle}>{portal.titleZh} · {portal.description}</span>
              </span>
              <span className={styles.portalState}>{isLive ? "进入" : "Soon"}</span>
            </>
          );

          return (
            <button
              key={portal.key}
              type="button"
              disabled={isTransitioning}
              aria-current={isActive ? "true" : undefined}
              className={styles.portalCard}
              data-active={isActive ? "true" : "false"}
              style={{ "--portal-color": portal.accent } as CSSProperties}
              onMouseEnter={() => onPortalHover(portal.key)}
              onMouseLeave={() => onPortalHover(null)}
              onFocus={() => onPortalHover(portal.key)}
              onBlur={() => onPortalHover(null)}
              onClick={() => onPortalSelect(portal.key)}
            >
              {content}
            </button>
          );
        })}
      </nav>

      <div className={styles.seoLinks} aria-label="Public site links">
        <a href="https://study.jimmyyao.com">日本語学校 / 日语学习系统</a>
        <a href="https://forum.jimmyyao.com">フォーラム広場 / 论坛系统</a>
      </div>
    </section>
  );
}
