"use client";

import { useEffect } from "react";
import { storageKeys } from "@/lib/site";
import { safeStorage } from "@/lib/utils";

const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

/**
 * Remembers UTM campaign parameters for the visit (sessionStorage only) so the
 * contact form can tell you which link a recruiter came from, e.g.
 * https://prashantjani.dev/?utm_source=linkedin&utm_medium=profile
 */
export function UtmCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const found: Record<string, string> = {};
    for (const k of KEYS) {
      const v = params.get(k);
      if (v) found[k] = v.slice(0, 100);
    }
    if (Object.keys(found).length) safeStorage.set(storageKeys.utm, JSON.stringify(found), "session");
  }, []);
  return null;
}
