"use client";

import { useEffect } from "react";
import { storeInitialAttribution } from "@/lib/attribution";

export function AttributionTracker() {
  useEffect(() => {
    storeInitialAttribution();
  }, []);

  return null;
}
