"use client";
import { useEffect } from "react";
import type { PublicEventKind } from "@/lib/analytics";
export function EventPing({ kind }: { kind: PublicEventKind }) {
  useEffect(() => {
    fetch("/api/v1/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind }),
      keepalive: true,
    }).catch(() => {});
  }, [kind]);
  return null;
}
