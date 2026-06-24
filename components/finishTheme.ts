import type { Finish } from "@/lib/scoring/types";

// Each finish maps to a FUT background PNG (public/cards), the text ink the
// Python generator uses for that card, a glow for the card's drop-shadow, and
// the avatar filter from the Claude Design card: avatarTint is a RADIAL tint —
// transparent in the centre so the photo shows clearly, ramping to the card
// colour toward the edges so they blend in; avatarHalo is the avatar's glow.
// totw reuses the TOTY art; icon uses the legend art.
export interface CardTheme {
  bg: string;
  ink: string;
  glow: string;
  avatarTint: string;
  avatarHalo: string;
}

export const CARD_THEME: Record<Finish, CardTheme> = {
  bronze: {
    bg: "/cards/bronze.png",
    ink: "#3a2717",
    glow: "rgba(190,120,60,.45)",
    avatarTint: "radial-gradient(ellipse 72% 76% at 52% 40%, transparent 46%, rgba(106,69,39,.26) 78%, rgba(50,31,14,.44))",
    avatarHalo: "rgba(214,163,110,.4)",
  },
  silver: {
    bg: "/cards/silver.png",
    ink: "#303536",
    glow: "rgba(170,188,210,.5)",
    avatarTint: "radial-gradient(ellipse 72% 76% at 52% 40%, transparent 46%, rgba(170,188,210,.22) 78%, rgba(70,78,90,.42))",
    avatarHalo: "rgba(220,228,238,.4)",
  },
  gold: {
    bg: "/cards/gold.png",
    ink: "#46390c",
    glow: "rgba(225,185,80,.55)",
    avatarTint: "radial-gradient(ellipse 72% 76% at 52% 40%, transparent 46%, rgba(243,214,121,.24) 78%, rgba(156,118,33,.44))",
    avatarHalo: "rgba(243,214,121,.45)",
  },
  totw: {
    bg: "/cards/toty.png",
    ink: "#ebcd5b",
    glow: "rgba(90,140,255,.55)",
    avatarTint: "radial-gradient(ellipse 72% 76% at 52% 40%, transparent 46%, rgba(74,120,210,.22) 78%, rgba(14,35,80,.46))",
    avatarHalo: "rgba(127,168,255,.45)",
  },
  toty: {
    bg: "/cards/toty.png",
    ink: "#ebcd5b",
    glow: "rgba(90,140,255,.55)",
    avatarTint: "radial-gradient(ellipse 72% 76% at 52% 40%, transparent 46%, rgba(74,120,210,.22) 78%, rgba(14,35,80,.46))",
    avatarHalo: "rgba(127,168,255,.45)",
  },
  icon: {
    bg: "/cards/legend.png",
    ink: "#625217",
    glow: "rgba(243,213,128,.5)",
    avatarTint: "radial-gradient(ellipse 72% 76% at 52% 40%, transparent 46%, rgba(243,214,121,.24) 78%, rgba(120,90,30,.46))",
    avatarHalo: "rgba(243,214,136,.5)",
  },
};

export interface ResultTheme {
  glow: string;
  chip: string;
  ink: string;
}

export const RESULT_THEME: Record<Finish, ResultTheme> = {
  bronze: { glow: "rgba(190,120,60,.34)", chip: "#2A1A0C", ink: "#F0CFA8" },
  silver: { glow: "rgba(170,188,210,.34)", chip: "#262B33", ink: "#D6DCE6" },
  gold: { glow: "rgba(225,185,80,.4)", chip: "#3A2806", ink: "#F3D679" },
  totw: { glow: "rgba(90,140,255,.5)", chip: "#10254F", ink: "#CADBFF" },
  toty: { glow: "rgba(90,140,255,.5)", chip: "#10254F", ink: "#CADBFF" },
  icon: { glow: "rgba(243,213,128,.45)", chip: "#2A1A45", ink: "#F3D688" },
};
