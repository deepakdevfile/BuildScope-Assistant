
// In-memory limiter: fine for this prototype but we will use Redis/Upstash at scale.
const hits = new Map<string, number[]>();

export function rateLimited(key: string, limit: number, windowMs = 60_000, now = Date.now()): boolean {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.set(key, recent);
    if(hits.size > 5000){
        hits.clear();
    }
    return recent.length > limit;
}