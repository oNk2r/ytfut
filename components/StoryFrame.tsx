"use client";

import { forwardRef } from "react";
import type { Card } from "@/lib/scoring/types";
import PlayerCard from "./PlayerCard";
import { resolveCardTheme, resolveResultTheme } from "./finishTheme";

// Instagram Story canvas (9:16). The frame renders at native resolution: the
// captured PNG IS these pixels, so the on-page card's pixelRatio:3 upscale is
// unnecessary — CardActions captures the story at pixelRatio:1.
const STORY_W = 1080;
const STORY_H = 1920;

// The card sits centred at ~64% of the canvas width, leaving branded margins
// top (wordmark) and bottom (archetype + handle) to fill the taller 9:16 frame.
const CARD_W = Math.round(STORY_W * 0.64); // 691px → card stays ~2:3

const FONT_DISPLAY = "var(--font-bebas), 'Saira Condensed', sans-serif";
const FONT_BOLD = "var(--font-din-bold), 'Saira Condensed', sans-serif";
const FONT_COND = "var(--font-din-cond), 'Saira Condensed', sans-serif";

// Hidden, fixed-size story canvas wrapping the existing PlayerCard. Mounted once
// (off-screen) in ResultView so renderCardImage can clone + capture it through
// the same proven pipeline as the card — no separate Satori layout, no second
// React root. The signature here is always visible (the whole frame is
// capture-only and never shown on screen), so it needs no .gitfut-capturing gate.
const StoryFrame = forwardRef<HTMLDivElement, { card: Card }>(function StoryFrame(
  { card },
  ref,
) {
  const theme = resolveCardTheme(card);
  const accent = resolveResultTheme(card).ink;

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: "relative",
        width: STORY_W,
        height: STORY_H,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
        // Tier-reactive backdrop: a soft accent wash from the top fading into the
        // app's base, mirroring ResultView's result screen so the story reads as
        // the same product, not a stripped export.
        background: `radial-gradient(120% 60% at 50% 0%, ${theme.glow}, transparent 58%), #0d1117`,
        fontFamily: FONT_DISPLAY,
      }}
    >
      {/* top — brand wordmark */}
      <div
        style={{
          marginTop: 132,
          fontFamily: FONT_DISPLAY,
          fontSize: 76,
          letterSpacing: "0.06em",
          lineHeight: 1,
          color: "#ffffff",
        }}
      >
        GIT<span style={{ color: "#39d353" }}>FUT</span>
      </div>
      <div
        style={{
          marginTop: 14,
          fontFamily: FONT_COND,
          fontSize: 30,
          letterSpacing: "0.34em",
          color: "rgba(255,255,255,0.5)",
          textTransform: "uppercase",
        }}
      >
        Scouted on GitHub
      </div>

      {/* centre — the card */}
      <div
        style={{
          marginTop: 96,
          width: CARD_W,
          // Match ResultView's tier glow behind the card so it ignites the frame.
          filter: `drop-shadow(0 24px 80px ${theme.glow})`,
        }}
      >
        <PlayerCard card={card} />
      </div>

      {/* bottom — archetype + handle */}
      <div
        style={{
          marginTop: 88,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        <div
          style={{
            fontFamily: FONT_BOLD,
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: "0.01em",
            color: accent,
            textAlign: "center",
            maxWidth: STORY_W - 160,
          }}
        >
          {card.archetype.toUpperCase()}
        </div>
        <div
          style={{
            fontFamily: FONT_COND,
            fontSize: 38,
            letterSpacing: "0.04em",
            color: "rgba(255,255,255,0.66)",
          }}
        >
          gitfut.com/{card.login}
        </div>
      </div>
    </div>
  );
});

export default StoryFrame;
