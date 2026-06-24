"use client";

import { useState } from "react";
import { toBlob, toPng } from "html-to-image";
import { Check, Copy, Download, Link2 } from "lucide-react";
import type { Card } from "@/lib/scoring/types";
import { shareUrl } from "@/lib/share";

const RENDER_OPTS = { pixelRatio: 3, cacheBust: true } as const;

function XLogo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

interface Action {
  id: string;
  label: string;
  title: string;
  done: string;
  icon: typeof Download;
  run: (node: HTMLElement, card: Card) => Promise<void>;
}

const ACTIONS: Action[] = [
  {
    id: "download",
    label: "Download",
    title: "Download as PNG",
    done: "Saved",
    icon: Download,
    run: async (node, card) => {
      const url = await toPng(node, RENDER_OPTS);
      const a = document.createElement("a");
      a.download = `${card.login}-gitfut.png`;
      a.href = url;
      a.click();
    },
  },
  {
    id: "copy",
    label: "Copy",
    title: "Copy image to clipboard",
    done: "Copied",
    icon: Copy,
    run: async (node) => {
      const blob = await toBlob(node, RENDER_OPTS);
      if (!blob) throw new Error("render returned no image");
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    },
  },
  {
    id: "link",
    label: "Link",
    title: "Copy link to this card",
    done: "Copied",
    icon: Link2,
    run: async (_node, card) => {
      await navigator.clipboard.writeText(`${window.location.origin}/u/${card.login}`);
    },
  },
];

export default function CardActions({
  card,
  targetRef,
}: {
  card: Card;
  targetRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [done, setDone] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async (a: Action) => {
    const node = targetRef.current;
    if (!node || busy) return;
    setBusy(a.id);
    setError(null);
    try {
      await document.fonts.ready; // local FUT fonts must be loaded before capture
      await a.run(node, card);
      setDone(a.id);
      setTimeout(() => setDone((d) => (d === a.id ? null : d)), 1500);
    } catch (e) {
      console.error("[gitfut] card export failed:", e);
      setError(`${a.label} failed: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex w-full flex-col gap-[10px]">
      <button
        onClick={() => window.open(shareUrl(card), "_blank", "noopener,noreferrer")}
        className="font-display flex h-[46px] w-full cursor-pointer items-center justify-center gap-[6px] rounded-xl border border-white/[0.12] bg-white/[0.06] text-[15px] font-extrabold tracking-[.04em] text-white transition-colors duration-150 hover:border-white/30 hover:bg-white/[0.12]"
      >
        Share on
        <XLogo />
      </button>

      {/* grouped export actions */}
      <div className="flex w-full overflow-hidden rounded-xl border border-white/[0.1] bg-white/[0.02]">
        {ACTIONS.map((a, i) => {
          const isDone = done === a.id;
          const isBusy = busy === a.id;
          const Icon = a.icon;
          return (
            <button
              key={a.id}
              onClick={() => run(a)}
              disabled={isBusy}
              title={a.title}
              className={`group flex flex-1 cursor-pointer items-center justify-center gap-[7px] py-[11px] text-[12.5px] font-semibold text-ink-dim transition-colors duration-150 hover:bg-white/[0.07] hover:text-white disabled:opacity-60 ${
                i > 0 ? "border-l border-white/[0.08]" : ""
              }`}
            >
              {isBusy ? (
                <span className="h-[14px] w-[14px] animate-spin rounded-full border-[1.5px] border-white/25 border-t-white/80" />
              ) : isDone ? (
                <Check size={14} className="text-[#7fcf9e]" />
              ) : (
                <Icon size={14} className="text-ink-faint transition-colors group-hover:text-ink-soft" />
              )}
              {isBusy ? "…" : isDone ? a.done : a.label}
            </button>
          );
        })}
      </div>

      {error && <p className="text-center text-[12px] leading-snug text-brand">{error}</p>}
    </div>
  );
}
