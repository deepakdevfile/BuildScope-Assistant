import { estimate, formatINR } from "@/lib/estimator";
import { COMPLEXITY, TIMELINE } from "@/lib/types";
import { featureLabel } from "@/lib/types";
import type { Selection } from "@/lib/types";

export default function EstimatePanel({ selection }: { selection: Selection }) {
  const est = estimate(selection);

  return (
    <aside className="card summary" aria-labelledby="sum-title">
      <h2 id="sum-title">Your estimate</h2>
      <div aria-live="polite">
        {!est ? (
          <p className="empty">
            Select a service to see an indicative budget and timeline.
          </p>
        ) : (
          <>
            <div className="range">
              {formatINR(est.min)} – {formatINR(est.max)}
            </div>
            <p className="weeks">
              ≈ {est.weeksMin} – {est.weeksMax} weeks
            </p>
            <ul className="bd">
              {est.breakdown.map((b) => (
                <li key={b.service}>
                  <span>{b.label}</span>
                  <span>
                    {formatINR(b.min)} – {formatINR(b.max)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="chips">
              {selection.features.map((f) => (
                <span className="chip" key={f}>
                  {featureLabel(f)}{" "}
                </span>
              ))}
              <span className="chip">
                {COMPLEXITY[selection.complexity].label}
              </span>
              <span className="chip">{TIMELINE[selection.timeline].label}</span>
            </div>
            <p className="note">
              Indicative and non-binding. Confirmed after discovery.
            </p>
          </>
        )}
      </div>
    </aside>
  );
}
