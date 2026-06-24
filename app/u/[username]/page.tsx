import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Background from "@/components/Background";
import { fetchProfile, type GithubError } from "@/lib/github/client";
import { signalsFromPayload } from "@/lib/github/signals";
import { buildCard } from "@/lib/scoring/engine";
import type { Card } from "@/lib/scoring/types";
import ScoutRoute from "./ScoutRoute";

export const dynamic = "force-dynamic"; // per-user, token-gated, always fresh

// Memoised per request so generateMetadata and the page share one fetch.
const loadCard = cache(
  async (username: string): Promise<{ card: Card } | { error: GithubError }> => {
    try {
      return { card: buildCard(signalsFromPayload(await fetchProfile(username))) };
    } catch (e) {
      return { error: e as GithubError };
    }
  },
);

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const res = await loadCard(username);
  if ("card" in res) {
    return {
      title: `${res.card.name} — ${res.card.overall} ${res.card.finishLabel} · GitFut`,
      description: `${res.card.name} scouted on GitFut: ${res.card.overall} OVR ${res.card.position}, ${res.card.archetype}.`,
    };
  }
  return { title: `@${username} · GitFut` };
}

function NotScouted({ username, error }: { username: string; error: GithubError }) {
  const message =
    error.type === "notfound"
      ? `There's no GitHub user named @${username}.`
      : error.type === "invalid"
        ? `“${username}” isn't a valid GitHub username.`
        : error.message;
  return (
    <main className="relative z-[2] mx-auto flex min-h-screen max-w-[560px] flex-col items-center justify-center px-6 text-center">
      <div className="font-display text-[12px] font-bold tracking-[.3em] text-brand">SCOUT REPORT</div>
      <h1 className="font-display mt-3 text-[clamp(30px,6vw,48px)] font-black leading-[.95]">No file found</h1>
      <p className="mt-3 text-[15.5px] leading-[1.5] text-ink-soft">{message}</p>
      <Link
        href="/"
        className="font-display mt-7 inline-flex h-[46px] items-center rounded-xl bg-brand px-6 text-[15px] font-extrabold tracking-[.04em] text-white transition hover:bg-brand-hi"
      >
        Scout someone else
      </Link>
    </main>
  );
}

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const res = await loadCard(username);
  return (
    <div className="relative min-h-screen overflow-x-hidden text-ink">
      <Background />
      {"card" in res ? <ScoutRoute card={res.card} /> : <NotScouted username={username} error={res.error} />}
    </div>
  );
}
