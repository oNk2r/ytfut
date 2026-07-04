import { countryForLogin } from "../geo";
import { topCategoryLogo } from "../youtube/categories";
import { deriveMetrics, deriveSkillMoves, deriveStyle, deriveWeakFoot, deriveWorkRate } from "./attributes";
import { ATTACK_STATS, FINISH_LABELS, K, STATS, WEIGHTS } from "./constants";
import { derivePlaystyles } from "./playstyles";
import type {
  Archetype,
  Card,
  Family,
  Finish,
  Position,
  Profile,
  Signals,
  StatKey,
  Stats,
} from "./types";

const Lg = (x: number) => Math.log10(Math.max(0, x) + 1);
const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));
const mean = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length;
const vals = (s: Profile) => STATS.map((k) => s[k]);

// §2 — raw estimates, tuned so the six land on a comparable scale.
function rawStats(s: Signals): Stats {
  const o: Stats = {
    pac: 30 + 15 * Lg(s.recent_uploads),
    sho: 20 + 10 * Lg(s.avg_views_recent),
    pas: 30 + 8 * Lg(s.avg_comments_recent) + 6 * Lg(s.avg_likes_recent),
    dri: 50 + 12 * Math.sqrt(s.category_count),
    def: clamp(Math.round(40 + 800 * (s.avg_likes_recent / (s.avg_views_recent || 1))), 1, 99),
    phy: 25 + 5 * Lg(s.total_views) + 3.0 * Math.min(s.active_years, 12),
  };
  for (const k of STATS) o[k] = clamp(Math.round(o[k]), 1, 99);
  return o;
}

// §3.1 — magnitude → gravity-well center the stats sit around.
function center(s: Signals): number {
  const { w1, w2, w3, w4, b, lo, hi } = K.magnitude;
  const M = sigmoid(
    w1 * Lg(s.total_views) +
    w2 * Lg(s.subscribers) +
    w3 * Lg(s.avg_views_recent) +
    w4 * s.channel_age_years +
    b,
  );
  return lerp(lo, hi, M);
}

// §3.2 — z-score of their own six.
function zscore(raw: Stats): Profile {
  const v = vals(raw);
  const m = mean(v);
  const sd = Math.sqrt(mean(v.map((x) => (x - m) ** 2))) || 1;
  const p = {} as Profile;
  STATS.forEach((k, i) => (p[k] = (v[i] - m) / sd));
  return p;
}

// §3.3 — penalise antagonist pairs so nobody is elite at everything.
function applyTension(p: Profile): Profile {
  const out = { ...p };
  for (const [a, b] of K.tension.pairs) {
    const overlap = Math.max(0, Math.min(out[a], out[b]));
    const weaker = out[a] <= out[b] ? a : b;
    out[weaker] -= K.tension.alpha * overlap;
  }
  return out;
}

// §3.4 — spike around center; specialists get spikier cards.
function spike(p: Profile, c: number): Stats {
  const v = vals(p);
  const lop = clamp((Math.max(...v) - Math.min(...v)) / 4, 0, 1);
  const spread = K.spike.base * (1 + lop);
  const m = mean(v);
  const raw = {} as Stats;
  STATS.forEach((k) => (raw[k] = c + spread * (p[k] - m)));
  // §3.5 — attacking cohesion: the technical four share sub-skills, so pull them
  // toward their own group mean (preserving order and their collective level)
  // before rounding.
  const am = mean(ATTACK_STATS.map((k) => raw[k]));
  ATTACK_STATS.forEach((k) => (raw[k] = am + K.spike.cohesion * (raw[k] - am)));
  const stats = {} as Stats;
  STATS.forEach((k) => (stats[k] = clamp(Math.round(raw[k]), 1, 99)));
  return stats;
}

const POSITION_FAMILY: Record<Position, Family> = {
  GK: "Anchor",
  CB: "Anchor",
  LB: "Anchor",
  RB: "Anchor",
  CDM: "Anchor",
  CM: "Playmaker",
  CAM: "Playmaker",
  LW: "Forward",
  RW: "Forward",
  ST: "Forward"
};

const ARCHETYPES: Record<Position, { name: string; blurb: string }> = {
  GK: { name: "Evergreen Legend", blurb: "exceptional longevity and presence — steady and trusted channel anchor" },
  CB: { name: "Reliable Veteran", blurb: "unshakeable foundation — defensive stability with solid physical presence" },
  LB: { name: "Overlap Engine", blurb: "dynamic wingback — supports play transitions with high pace and defensive alignment" },
  RB: { name: "Overlap Engine", blurb: "dynamic wingback — supports play transitions with high pace and defensive alignment" },
  CDM: { name: "Community Anchor", blurb: "the midfield engine — controls the community tempo with high passing and defensive support" },
  CM: { name: "Balanced Creator", blurb: "complete midfielder — contributes across all facets of content with balanced attributes" },
  CAM: { name: "Creative Playmaker", blurb: "playmaker in the pocket — creates opportunities with elite passing and dribbling versatility" },
  LW: { name: "Trend Sprinter", blurb: "explosive winger — creates massive content waves with high pace and versatility" },
  RW: { name: "Trend Sprinter", blurb: "explosive winger — creates massive content waves with high pace and versatility" },
  ST: { name: "Viral Finisher", blurb: "clinical content hitter — dominates the space with massive virality and views" }
};

function positionFromShape(subs: number): { position: Position; family: Family; confidence: number } {
  let position: Position = "GK";

  if (subs >= 25_000_000) {
    position = "ST";
  } else if (subs >= 10_000_000) {
    position = "RW";
  } else if (subs >= 5_000_000) {
    position = "LW";
  } else if (subs >= 1_000_000) {
    position = "CAM";
  } else if (subs >= 500_000) {
    position = "CM";
  } else if (subs >= 100_000) {
    position = "CDM";
  } else if (subs >= 50_000) {
    position = "RB";
  } else if (subs >= 10_000) {
    position = "LB";
  } else if (subs >= 1_000) {
    position = "CB";
  } else {
    position = "GK";
  }

  const family = POSITION_FAMILY[position];
  return { position, family, confidence: 100 };
}

// §3.6 — position-weighted, never a flat mean; stats alone cap at 88.
function weightedOVR(stats: Stats, family: Family): number {
  const w = WEIGHTS[family];
  const ovr = STATS.reduce((s, k) => s + stats[k] * w[k], 0);
  return Math.min(Math.round(ovr), K.ovrCap);
}

// §4 — the 88→99 range is bought with years and sustained influence.
function legacyScore(s: Signals): number {
  const { a, b, c, d, e, f, activeCap } = K.legacy;
  const z =
    a * Math.log(s.channel_age_years + 1) +
    b * Math.min(s.active_years, activeCap) +
    c * Lg(s.subscribers) +
    d * Lg(s.total_views) +
    e * Lg(s.video_count) -
    f;
  return sigmoid(z);
}

function pickFinish(overall: number, L: number, recentSpike: boolean, login: string): Finish {
  if (K.iconAllowlist.includes(login.toLowerCase())) return "icon";
  if (overall >= K.finish.totyMin && L >= K.finish.totyLegacy) return "toty";
  if (recentSpike && overall >= K.finish.silverMin) return "totw";
  if (overall >= K.finish.goldMin && L >= K.finish.goldLegacy) return "gold";
  if (overall >= K.finish.silverMin && L >= K.finish.silverLegacy) return "silver";
  return "bronze";
}

function archetypeFromShape(position: Position): Archetype {
  return ARCHETYPES[position];
}

function clampOVRByRequirements(overall: number, s: Signals, L: number): number {
  let maxOVR = 89;

  const age = s.channel_age_years;
  const subs = s.subscribers;

  // 96-99: Reserved for generational creators with exceptional longevity, scale, and impact
  const isGenerational = age >= 10 && subs >= 15_000_000 && L >= 0.95;
  // 93-95: Industry-leading creator with long-term influence
  const isIndustryLeading = age >= 6 && subs >= 5_000_000 && L >= 0.88;
  // 92: >=4 years old, elite consistency
  const isEliteConsistency = age >= 4 && L >= 0.78;
  // 91: >=3 years old, >=1M subs, sustained growth
  const isSustainedGrowth = age >= 3 && subs >= 1_000_000 && L >= 0.60;
  // 90: >=2 years old, >=500k subs, strong engagement
  const isStrongEngagement = age >= 2 && subs >= 500_000 && L >= 0.45;

  if (isGenerational) {
    maxOVR = 99;
  } else if (isIndustryLeading) {
    maxOVR = 95;
  } else if (isEliteConsistency) {
    maxOVR = 92;
  } else if (isSustainedGrowth) {
    maxOVR = 91;
  } else if (isStrongEngagement) {
    maxOVR = 90;
  }

  return Math.min(overall, maxOVR);
}

export function buildCard(s: Signals): Card {
  const stats = spike(applyTension(zscore(rawStats(s))), center(s));
  const { position, family, confidence } = positionFromShape(s.subscribers);
  const baseOVR = weightedOVR(stats, family);
  const L = legacyScore(s);

  const loginLower = s.login.toLowerCase();
  let overall = clamp(baseOVR + Math.round(K.legacy.bonusMax * L), 1, 99);

  overall = clampOVRByRequirements(overall, s, L);

  const finish: Finish = pickFinish(overall, L, s.recent_spike, s.login);
  const archetype = archetypeFromShape(position);
  const skill = deriveSkillMoves(s);
  const weak = deriveWeakFoot(stats);
  const work = deriveWorkRate(stats);
  const style = deriveStyle(s);

  const categoryLogo = topCategoryLogo(s.rankedCategories ?? []);
  return {
    login: s.login,
    name: s.name,
    avatarUrl: s.avatarUrl,
    country: s.location || countryForLogin(s.login.replace(/^@/, ""), s.location) || "",
    club: finish === "icon" ? "legends" : "neutral",
    stats,
    position,
    positionConfidence: confidence,
    family,
    baseOVR,
    overall,
    finish,
    finishLabel: FINISH_LABELS[finish],
    archetype: archetype.name,
    archetypeBlurb: archetype.blurb,
    topCategory: s.topCategory ?? null,
    categoryLogo,
    legacy: { L },
    report: {
      skillMoves: skill.value,
      weakFoot: weak.value,
      workRate: { attack: work.attack, defense: work.defense },
      style: style.value,
      reasons: {
        skillMoves: skill.reason,
        weakFoot: weak.reason,
        workRate: work.reason,
        style: style.reason,
      },
      playstyles: derivePlaystyles(s),
      metrics: deriveMetrics(s),
    },
  };
}
