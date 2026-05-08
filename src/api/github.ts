import { CACHE_TTL_MS, CONTRIBUTIONS_API } from "../data/github";

export interface ContributionDay {
  date: string;
  count: number;
}

export interface ContributionsResponse {
  contributions: ContributionDay[];
}

interface RawDay {
  date: string;
  contributionCount: number;
}

interface CacheEntry<T> {
  data: T;
  ts: number;
}

function readCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
}

export async function fetchContributions(): Promise<ContributionsResponse> {
  const cacheKey = "gh-contributions-v2";
  const cached = readCache<ContributionsResponse>(cacheKey);
  if (cached) return cached;

  const res = await fetch(CONTRIBUTIONS_API);
  if (!res.ok) throw new Error(`Contributions ${res.status}`);
  const raw = (await res.json()) as { contributions: RawDay[][] };
  const flat: ContributionDay[] = [];
  for (const week of raw.contributions || []) {
    for (const day of week) {
      flat.push({ date: day.date, count: day.contributionCount });
    }
  }
  const data: ContributionsResponse = { contributions: flat };
  writeCache(cacheKey, data);
  return data;
}
