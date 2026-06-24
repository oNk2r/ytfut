"use client";

import { useRef } from "react";
import { ArrowLeft } from "lucide-react";
import type { Card } from "@/lib/scoring/types";
import PlayerCard from "./PlayerCard";
import CardActions from "./CardActions";
import { AttributesPanel, MetricsPanel, ReportHeader } from "./ScoutReport";
import { RESULT_THEME } from "./finishTheme";

interface Props {
  card: Card;
  onBack: () => void;
}

// Card width tracks viewport height so the whole report fits one screen; it falls
// back to a fixed range on the stacked mobile layout.
const CARD_WIDTH = "clamp(206px, 40vh, 322px)";

export default function ResultView({ card, onBack }: Props) {
  const captureRef = useRef<HTMLDivElement>(null);
  const theme = RESULT_THEME[card.finish];

  return (
    <main className="relative z-[2] mx-auto flex h-[100dvh] w-full max-w-[1280px] flex-col overflow-hidden px-[22px] max-[980px]:h-auto max-[980px]:min-h-[100dvh] max-[980px]:overflow-visible max-[980px]:pb-12">
      <button
        onClick={onBack}
        className="mb-[8px] mt-[clamp(8px,2vh,18px)] inline-flex shrink-0 items-center gap-[7px] self-start text-[14px] font-semibold text-ink-faint hover:text-ink-soft"
      >
        <ArrowLeft size={18} />
        back
      </button>

      <div className="shrink-0">
        <ReportHeader card={card} />
      </div>

      <div className="mt-[clamp(10px,2vh,22px)] grid min-h-0 flex-1 grid-cols-[1fr_auto_1fr] items-stretch gap-[clamp(14px,2.4vw,40px)] max-[980px]:mt-6 max-[980px]:flex max-[980px]:flex-col max-[980px]:items-center">
        {/* left — attributes + playstyles */}
        <div className="flex h-full min-h-0 justify-end overflow-y-auto max-[980px]:order-2 max-[980px]:h-auto max-[980px]:w-full max-[980px]:max-w-[420px] max-[980px]:justify-center">
          <div className="w-full max-w-[360px]">
            <AttributesPanel card={card} />
          </div>
        </div>

        {/* center — the card + actions */}
        <div className="flex h-full flex-col items-center  gap-[12px] max-[980px]:order-1 max-[980px]:h-auto">
          <div
            ref={captureRef}
            className="relative"
            style={{ width: CARD_WIDTH }}
          >
            <div
              className="animate-glow pointer-events-none absolute -inset-[12%] z-0 rounded-full blur-[18px]"
              style={{
                background: `radial-gradient(closest-side, ${theme.glow}, transparent 72%)`,
              }}
            />
            <div className="relative z-[1]">
              <PlayerCard card={card} />
            </div>
          </div>
          <div style={{ width: CARD_WIDTH }}>
            <CardActions card={card} targetRef={captureRef} />
          </div>
        </div>

        {/* right — scouting metrics */}
        <div className="flex h-full min-h-0 overflow-y-auto max-[980px]:order-3 max-[980px]:h-auto max-[980px]:w-full max-[980px]:max-w-[420px] max-[980px]:justify-center">
          <div className="w-full max-w-[360px]">
            <MetricsPanel card={card} />
          </div>
        </div>
      </div>
    </main>
  );
}
