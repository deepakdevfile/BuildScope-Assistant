import { estimate, formatINR,  } from "@/lib/estimator";
import { COMPLEXITY, TIMELINE } from "@/lib/types";
import { featureLabel } from "@/lib/types";
import type { Selection } from "@/lib/types";

export default function EstimatePanel({ selection }: { selection: Selection }) {
    const est = estimate(selection);

    return (
      <aside aria-labelledby="sum-title">
        <h2 id="sum-title">Your estimate</h2>
        <div aria-live="polite">
          {!est ? (
            <p>Select a service to see an indicative budget and timeline.</p>
          ) : (
            <>
              <div>
                {formatINR(est.min)} – {formatINR(est.max)}
              </div>
              <p>
                ≈ {est.weeksMin} – {est.weeksMax} weeks
              </p>
              <ul>
                {est.breakdown.map((b) => (
                  <li key={b.service}>
                    <span>{b.label}</span>
                    <span>
                      {formatINR(b.min)} – {formatINR(b.max)}
                    </span>
                  </li>
                ))}
              </ul>
              <div>
                {selection.features.map((f) => (
                  <span key={f}>{featureLabel(f)} </span>
                ))}
                <span>{COMPLEXITY[selection.complexity].label}</span>
                <span>{TIMELINE[selection.timeline].label}</span>
              </div>
              <p>Indicative and non-binding. Confirmed after discovery.</p>
            </>
          )}
        </div>
      </aside>
    );
}