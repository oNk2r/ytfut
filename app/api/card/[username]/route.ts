import { type GithubError } from "@/lib/github/client";
import { scoutCard } from "@/lib/scout";
import { getViewerCountry } from "@/lib/ipgeo";
import { needsIpFallback, pickFlag } from "@/lib/flagPriority";
import { recordScout } from "@/lib/analytics";
import { after } from "next/server";
import type { Card } from "@/lib/scoring/types";

// Resolve the card's flag by priority (override → GitHub → viewer IP). The IP
// lookup only runs when it can change the result, so the common GitHub-resolved
// path stays network-free.
async function resolveCountry(card: Card, override: string | null, req: Request): Promise<Card> {
  const ip = needsIpFallback(override, card.country) ? await getViewerCountry(req) : null;
  return { ...card, country: pickFlag(override, card.country, ip) ?? "" };
}

export async function GET(req: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const override = new URL(req.url).searchParams.get("country");
  // scoutCard handles the Redis cache and the tokenless sample fallback; here we
  // just resolve the visitor's flag and record the scout after the response.
  try {
    const card = await scoutCard(username);
    after(() => recordScout());
    return Response.json(await resolveCountry(card, override, req));
  } catch (e) {
    const err = e as GithubError;
    const status =
      err.type === "notfound"
        ? 404
        : err.type === "invalid"
          ? 400
          : err.type === "ratelimit"
            ? 429
            : err.type === "config"
              ? 500
              : 502;
    return Response.json({ error: err.message ?? "Failed to scout that profile." }, { status });
  }
}
