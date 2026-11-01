/*
 * NOTE: every price is an INDICATIVE PLACEHOLDER (INR) to be calibrated by
 * sales team. They live in one table, so changing them is a data edit.
 */
import { CATALOG, Estimate, Selection } from "./types";
import { COMPLEXITY, FEATURE_INDEX, TIMELINE } from "./types";
import { isService, isFeature, isComplexity, isTimeline } from "./types";

const BUNDLE_DISCOUNT = 0.95; // 2+ service lines combined
const PARALLEL_FACTOR = 0.7; // work streams overlap in time

export function normalizeSelection(input: unknown): Selection {
    const raw = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
    const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
    const services = [...new Set(list(raw.services).filter(isService))]
    const features = [...new Set(list(raw.features).filter(isFeature).filter((f) => services.includes(FEATURE_INDEX[f].service))),];

    return {
        services,
        features,
        complexity: isComplexity(raw.complexity) ? raw.complexity : 'mvp',
        timeline: isTimeline(raw.timeline) ? raw.timeline : 'standard',
    };
}

const roundTo = (n: number, step: number) => Math.round(n / step) * step;

export function estimate(input: unknown): Estimate | null {
    const selection = normalizeSelection(input);
    if(selection.services.length === 0){
        return null;
    }

    const cx = COMPLEXITY[selection.complexity];
    const tl = TIMELINE[selection.timeline];
    const bundle = selection.services.length > 1 ? BUNDLE_DISCOUNT : 1;
    const costMult = cx.cost * tl.cost * bundle;
    const parallel = selection.services.length > 1 ? PARALLEL_FACTOR : 1;

    let min = 0;
    let max = 0;
    let wMin = 0;
    let wMax = 0;
    const breakdown: Estimate['breakdown'] = [];

    for (const s of selection.services){
        const svc = CATALOG[s];
        let lo: number = svc.base.cost[0];
        let hi: number = svc.base.cost[1];
        let wlo: number = svc.base.weeks[0];
        let whi: number = svc.base.weeks[1];

        for (const f of selection.features){
            const feat = FEATURE_INDEX[f];
            if(feat.service !== s){
                continue;
            }

            lo = lo + feat.cost[0];
            hi = hi + feat.cost[1];
            wlo = wlo + feat.weeks[0];
            whi = whi + feat.weeks[1];
        }

        min = min + lo;
        max = max + hi;
        wMin = wMin + wlo;
        wMax = wMax + whi;

        breakdown.push({
            service: s,
            label: svc.label,
            min: roundTo(lo * costMult, 5000),
            max: roundTo(hi * costMult, 5000),
        });
    }

    const timeMult = cx.time * tl.time * parallel;

    return {
        min: roundTo(min * costMult, 5000),
        max: roundTo(max * costMult, 5000),
        weeksMin: Math.max(2, Math.ceil(wMin * timeMult)),
        weeksMax: Math.max(3, Math.ceil(wMax * timeMult)),
        breakdown,
    }
}