"use client";

import { useEffect, useRef, useState } from "react";

const READS = [
  { abbr: "PAC", gloss: "Your uploads frequency and schedule consistency" },
  { abbr: "SHO", gloss: "Recent average view counts and virality pulls" },
  { abbr: "PAS", gloss: "Audience engagement (recent comments & likes per view)" },
  { abbr: "DRI", gloss: "Your content versatility — number of unique genres covered" },
  { abbr: "DEF", gloss: "Average like-to-view ratios and community alignment" },
  { abbr: "PHY", gloss: "Channel longevity (age) and total views over active years" },
];

const LADDER = [
  { label: "BRONZE", bg: "#2A1A0C", ink: "#F0CFA8" },
  { label: "SILVER", bg: "#262B33", ink: "#D6DCE6" },
  { label: "GOLD", bg: "#3A2806", ink: "#F3D679" },
  { label: "IN-FORM", bg: "#4A0A14", ink: "#FFD3D9" },
  { label: "TOTY", bg: "#10254F", ink: "#CADBFF" },
  { label: "ICON", bg: "#2A1A45", ink: "#F3D688" },
];

export default function HowItWorksModal({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    const t = setTimeout(() => setShown(true), 10);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(3,5,10,.78)] p-[22px] backdrop-blur-[6px]"
      style={{ opacity: shown ? 1 : 0, transition: "opacity .25s ease" }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hiw-title"
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[88vh] w-[min(560px,100%)] overflow-auto rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,#1c1212,#0f0a0a)] p-[clamp(24px,4.5vw,36px)] shadow-[0_40px_120px_rgba(0,0,0,.6)] outline-none"
        style={{
          opacity: shown ? 1 : 0,
          transform: shown ? "translateY(0) scale(1)" : "translateY(14px) scale(.985)",
          transition: "opacity .4s ease, transform .45s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,0,0,.55), transparent)" }}
        />

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[15px] text-ink-faint transition hover:bg-white/10 hover:text-ink"
        >
          ✕
        </button>

        <div className="font-mono mb-[12px] text-[13px] font-semibold tracking-[.32em] text-brand">
          THE RATER&apos;S EYE
        </div>
        <h3
          id="hiw-title"
          className="font-display m-0 text-[38px] font-black leading-tight tracking-[-.01em]"
        >
          How It Works<span className="text-brand">.</span>
        </h3>

        <div className="mt-[24px]">
          <div className="font-mono mb-[14px] text-[12.5px] font-bold tracking-[.2em] text-ink-faint">
            WHAT FEEDS THE SIX
          </div>
          <div className="grid grid-cols-2 gap-x-[16px] gap-y-[13px] max-[440px]:grid-cols-1">
            {READS.map((r) => (
              <div key={r.abbr} className="flex items-start gap-[11px]">
                <span className="font-display mt-[1px] w-[48px] flex-none rounded-[7px] bg-brand/15 py-[5px] text-center text-[15px] font-extrabold tracking-[.04em] text-brand">
                  {r.abbr}
                </span>
                <span className="text-[15px] leading-[1.4] text-ink-faint">{r.gloss}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-[24px] border-t border-white/[0.08] pt-[20px]">
          <div className="font-mono mb-[13px] text-[12.5px] font-bold tracking-[.2em] text-ink-faint">THE LADDER</div>
          <div className="flex flex-wrap items-center gap-y-[8px]">
            {LADDER.map((f, i) => (
              <span key={f.label} className="inline-flex items-center">
                <span
                  className="font-display rounded-[7px] px-[13px] py-[6px] text-[14.5px] font-bold tracking-[.06em]"
                  style={{ background: f.bg, color: f.ink }}
                >
                  {f.label}
                </span>
                {i < LADDER.length - 1 && (
                  <span aria-hidden className="px-[7px] text-[13px] text-ink-mute">
                    →
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-[24px] border-t border-white/[0.08] pt-[20px]">
          <div className="font-mono mb-[14px] text-[12.5px] font-bold tracking-[.2em] text-ink-faint">
            POSITIONS
          </div>
          <div className="grid grid-cols-2 gap-x-[20px] gap-y-[12px] max-[440px]:grid-cols-1">
            <div className="flex items-center gap-[10px]">
              <span className="font-display w-[52px] flex-none rounded-[6px] bg-brand/15 py-[3px] text-center text-[20px] font-bold text-brand">
                ST
              </span>
              <span className="text-[13.5px] font-semibold text-ink-soft">25M+ subs</span>
            </div>
            <div className="flex items-center gap-[10px]">
              <span className="font-display w-[52px] flex-none rounded-[6px] bg-brand/15 py-[3px] text-center text-[20px] font-bold text-brand">
                RW
              </span>
              <span className="text-[13.5px] font-semibold text-ink-soft">10M – 25M subs</span>
            </div>
            <div className="flex items-center gap-[10px]">
              <span className="font-display w-[52px] flex-none rounded-[6px] bg-brand/15 py-[3px] text-center text-[20px] font-bold text-brand">
                LW
              </span>
              <span className="text-[13.5px] font-semibold text-ink-soft">5M – 10M subs</span>
            </div>
            <div className="flex items-center gap-[10px]">
              <span className="font-display w-[52px] flex-none rounded-[6px] bg-brand/15 py-[3px] text-center text-[20px] font-bold text-brand">
                CAM
              </span>
              <span className="text-[13.5px] font-semibold text-ink-soft">1M – 5M subs</span>
            </div>
            <div className="flex items-center gap-[10px]">
              <span className="font-display w-[52px] flex-none rounded-[6px] bg-brand/15 py-[3px] text-center text-[20px] font-bold text-brand">
                CM
              </span>
              <span className="text-[13.5px] font-semibold text-ink-soft">500K – 1M subs</span>
            </div>
            <div className="flex items-center gap-[10px]">
              <span className="font-display w-[52px] flex-none rounded-[6px] bg-brand/15 py-[3px] text-center text-[20px] font-bold text-brand">
                CDM
              </span>
              <span className="text-[13.5px] font-semibold text-ink-soft">100K – 500K subs</span>
            </div>
            <div className="flex items-center gap-[10px]">
              <span className="font-display w-[52px] flex-none rounded-[6px] bg-brand/15 py-[3px] text-center text-[20px] font-bold text-brand">
                RB
              </span>
              <span className="text-[13.5px] font-semibold text-ink-soft">50K – 100K subs</span>
            </div>
            <div className="flex items-center gap-[10px]">
              <span className="font-display w-[52px] flex-none rounded-[6px] bg-brand/15 py-[3px] text-center text-[20px] font-bold text-brand">
                LB
              </span>
              <span className="text-[13.5px] font-semibold text-ink-soft">10K – 50K subs</span>
            </div>
            <div className="flex items-center gap-[10px]">
              <span className="font-display w-[52px] flex-none rounded-[6px] bg-brand/15 py-[3px] text-center text-[20px] font-bold text-brand">
                CB
              </span>
              <span className="text-[13.5px] font-semibold text-ink-soft">1K – 10K subs</span>
            </div>
            <div className="flex items-center gap-[10px]">
              <span className="font-display w-[52px] flex-none rounded-[6px] bg-brand/15 py-[3px] text-center text-[20px] font-bold text-brand">
                GK
              </span>
              <span className="text-[13.5px] font-semibold text-ink-soft">0 – 1K subs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
