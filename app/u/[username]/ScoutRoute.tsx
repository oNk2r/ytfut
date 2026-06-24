"use client";

import { useRouter } from "next/navigation";
import ResultView from "@/components/ResultView";
import type { Card } from "@/lib/scoring/types";

// Client wrapper: a server component can't pass an onBack function across the
// boundary, so the route provides navigation here.
export default function ScoutRoute({ card }: { card: Card }) {
  const router = useRouter();
  return <ResultView card={card} onBack={() => router.push("/")} />;
}
