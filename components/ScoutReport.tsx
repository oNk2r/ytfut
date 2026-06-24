"use client";

import {
  Clock,
  FastForward,
  Flame,
  FolderGit2,
  GitPullRequest,
  Infinity as InfinityIcon,
  Languages,
  type LucideIcon,
  Shield,
  Star,
  Users,
  Zap,
} from "lucide-react";
import type { Card, Finish, Metric, Playstyle } from "@/lib/scoring/types";
import { formatCount } from "@/lib/format";
import { RESULT_THEME } from "./finishTheme";

const PLAYSTYLE_ICONS: Record<string, LucideIcon> = {
  star: Star,
  flame: Flame,
  zap: Zap,
  "fast-forward": FastForward,
  infinity: InfinityIcon,
  shield: Shield,
  "git-pull-request": GitPullRequest,
  users: Users,
  languages: Languages,
  "folder-git": FolderGit2,
  clock: Clock,
};

// The scout's one-line verdict — the signature, in recruitment vernacular.
const VERDICTS: Record<Finish, string> = {
  icon: "Generational talent",
  toty: "Elite prospect",
  totw: "In-form, in demand",
  gold: "First-team ready",
  silver: "Squad rotation",
  bronze: "One to watch",
};

// Lightweight hover popup explaining why a value was given.
function Tip({
  text,
  align = "center",
  children,
}: {
  text: string;
  align?: "left" | "right" | "center";
  children: React.ReactNode;
}) {
  const pos = align === "left" ? "left-0" : align === "right" ? "right-0" : "left-1/2 -translate-x-1/2";
  return (
    <span className="group/tip relative inline-flex cursor-help items-center">
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute bottom-full ${pos} z-30 mb-2 hidden w-max max-w-[220px] whitespace-normal rounded-lg border border-white/10 bg-[#17131f] px-3 py-2 text-left text-[12px] font-normal leading-snug text-ink-dim shadow-[0_10px_30px_rgba(0,0,0,.55)] group-hover/tip:block`}
      >
        {text}
      </span>
    </span>
  );
}

function StarRating({ value, accent }: { value: number; accent: string }) {
  return (
    <span className="inline-flex gap-[3px]" style={{ color: accent }} aria-label={`${value} of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={15} className={i < value ? "fill-current" : "fill-transparent opacity-25"} />
      ))}
    </span>
  );
}

function AttributeRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.06] py-[11px] last:border-0">
      <span className="text-[13.5px] text-ink-dim">{label}</span>
      <span className="font-display text-[14px] font-bold tracking-[.02em] text-ink-soft">{children}</span>
    </div>
  );
}

// Editorial section: an accent dash + tracked label, then content — reads as a
// scouting-report section rather than a dashboard card.
function Section({
  title,
  accent,
  className,
  children,
}: {
  title: string;
  accent: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`rounded-2xl border border-white/[0.06] bg-white/[0.02] p-[16px] ${className ?? ""}`}>
      <div className="mb-[8px] flex items-center gap-[9px]">
        <span className="h-[2px] w-[16px] rounded-full" style={{ background: accent }} />
        <h3 className="font-display text-[11px] font-bold tracking-[.22em] text-ink-faint">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function PlaystyleList({ playstyles, accent }: { playstyles: Playstyle[]; accent: string }) {
  if (playstyles.length === 0) {
    return <p className="py-1 text-[13.5px] leading-snug text-ink-mute">No standout traits yet — keep shipping.</p>;
  }
  return (
    <ul className="flex flex-col gap-[11px] pt-1">
      {playstyles.map((p) => {
        const Icon = PLAYSTYLE_ICONS[p.icon] ?? Star;
        return (
          <li key={p.name}>
            <Tip text={p.reason} align="left">
              <Icon size={16} style={{ color: accent }} aria-hidden />
              <span className="ml-[11px] text-[14px] font-medium text-ink-soft">{p.name}</span>
              {p.plus && (
                <span
                  className="font-display ml-[7px] rounded-[5px] px-[5px] text-[11px] font-extrabold leading-[15px]"
                  style={{ background: accent, color: "#0b0a0f" }}
                  title="PlayStyle+"
                >
                  +
                </span>
              )}
            </Tip>
          </li>
        );
      })}
    </ul>
  );
}

function MetricBar({ metric, accent }: { metric: Metric; accent: string }) {
  const fill = Math.max(metric.score, 5); // never an empty bar — show a sliver minimum
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[13.5px] text-ink-dim">{metric.label}</span>
        <span className="font-display text-[15px] font-bold leading-none" style={{ color: accent }}>
          {metric.score}
        </span>
      </div>
      <div className="mt-[6px] h-[3px] overflow-hidden rounded-full bg-white/[0.08]">
        <div className="h-full rounded-full" style={{ width: `${fill}%`, background: accent }} />
      </div>
      <div className="mt-[3px] text-right text-[11px] tabular-nums text-ink-mute">
        {formatCount(metric.value)}
        {metric.unit ? ` ${metric.unit}` : ""}
      </div>
    </div>
  );
}

// Dossier-style header: ruled eyebrow, name, meta + @login link, verdict tag.
export function ReportHeader({ card }: { card: Card }) {
  const theme = RESULT_THEME[card.finish];
  const accent = theme.ink;
  return (
    <header className="text-center">
      <div className="flex items-center justify-center gap-[14px]">
        <span className="h-px w-[clamp(24px,8vw,52px)] bg-white/15" />
        <span className="font-display text-[12px] font-bold tracking-[.34em] text-brand">SCOUT REPORT</span>
        <span className="h-px w-[clamp(24px,8vw,52px)] bg-white/15" />
      </div>

      <h2 className="font-display mt-[7px] text-[clamp(27px,4.2vw,46px)] font-black leading-[.95]">{card.name}</h2>

      <div className="mt-[9px] flex flex-wrap items-center justify-center gap-x-[10px] gap-y-[6px] text-[14px]">
        <span
          className="font-display rounded-md px-[10px] py-[4px] text-[13px] font-bold tracking-[.12em]"
          style={{ background: theme.chip, color: accent }}
        >
          {card.position}
        </span>
        <span className="text-ink-soft">{card.archetype}</span>
        <span className="text-ink-faint">
          {card.finishLabel} · {card.overall} OVR
        </span>
        <a
          href={`https://github.com/${card.login}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink-faint underline-offset-2 transition hover:text-ink-soft hover:underline"
        >
          @{card.login}
        </a>
      </div>

      <div
        className="mt-[11px] inline-flex items-center gap-[9px] rounded-full border px-[14px] py-[5px]"
        style={{ borderColor: `${accent}44` }}
      >
        <span className="font-display text-[10.5px] font-bold tracking-[.2em] text-ink-faint">VERDICT</span>
        <span className="text-[13px] font-semibold" style={{ color: accent }}>
          {VERDICTS[card.finish]}
        </span>
      </div>

      <p className="mx-auto mt-[11px] line-clamp-2 max-w-[540px] text-[14.5px] leading-[1.45] text-ink-soft">
        {card.archetypeBlurb}.
      </p>
    </header>
  );
}

// Left side: attributes + playstyles.
export function AttributesPanel({ card }: { card: Card }) {
  const accent = RESULT_THEME[card.finish].ink;
  const { report } = card;
  return (
    <div className="flex w-full flex-col gap-[14px]">
      <Section title="ATTRIBUTES" accent={accent}>
        <AttributeRow label="Skill moves">
          <Tip text={report.reasons.skillMoves} align="right">
            <StarRating value={report.skillMoves} accent={accent} />
          </Tip>
        </AttributeRow>
        <AttributeRow label="Weak foot">
          <Tip text={report.reasons.weakFoot} align="right">
            <StarRating value={report.weakFoot} accent={accent} />
          </Tip>
        </AttributeRow>
        <AttributeRow label="Work rate">
          <Tip text={report.reasons.workRate} align="right">
            <span>
              {report.workRate.attack} / {report.workRate.defense}
            </span>
          </Tip>
        </AttributeRow>
        <AttributeRow label="Style">
          <Tip text={report.reasons.style} align="right">
            <span>{report.style}</span>
          </Tip>
        </AttributeRow>
      </Section>

      <Section title="PLAYSTYLES" accent={accent}>
        <PlaystyleList playstyles={report.playstyles} accent={accent} />
      </Section>
    </div>
  );
}

// Right side: scouting metrics.
export function MetricsPanel({ card }: { card: Card }) {
  const accent = RESULT_THEME[card.finish].ink;
  return (
    <Section title="SCOUTING METRICS" accent={accent} className="w-full">
      <div className="flex flex-col gap-[13px] pt-1">
        {card.report.metrics.map((m) => (
          <MetricBar key={m.label} metric={m} accent={accent} />
        ))}
      </div>
    </Section>
  );
}
