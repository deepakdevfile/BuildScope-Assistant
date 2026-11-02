'use client';

import { useState, useRef } from "react";
import { CATALOG, COMPLEXITY, DEFAULT_SELECTION, TIMELINE } from "@/lib/types";
import {
  ServiceId,
  Selection,
  FeatureId,
  ComplexityId,
  TimelineId,
} from "@/lib/types";
import { formatINR, normalizeSelection } from "@/lib/estimator";
import LeadForm from "./LeadForm";
import EstimatePanel from "./EstimatePanel";

const STEPS = ['Services', 'Capabilities', 'Scope', 'Contact'] as const;

const toggle = <T,>(arr: readonly T[], v: T): T[] => (arr.includes(v) ? arr.filter((x) => x !== v): [...arr, v]);

function Option(props: {
    type: 'checkbox' | 'radio';
    name: string;
    checked: boolean;
    title: string;
    desc?: string;
    onChange: () => void
}) {
    return (
        <label htmlFor="">
            <input type={props.type} name={props.name} checked={props.checked} onChange={props.onChange} />
            <span>
                <span>{props.title}</span>
                {props.desc && <span> {props.desc} </span>}
            </span>
        </label>
    );
}

export default function Estimator(){
    const [step, setStep] = useState(0);
    const [sel, setSel] = useState<Selection>(DEFAULT_SELECTION);
    const panelRef = useRef<HTMLDivElement>(null);

    const go = (n: number) => {
      setStep(Math.max(0, Math.min(STEPS.length - 1, n)));
      // Move focus so keyboard / screen-reader users land on the new step.
      requestAnimationFrame(() => panelRef.current?.focus());
    };

    const toggleService = (id: ServiceId) =>
      setSel((s) =>
        normalizeSelection({ ...s, services: toggle(s.services, id) }),
      );

    const toggleFeature = (id: FeatureId) => setSel((s) => ({ ...s, features: toggle(s.features, id)}));

    return (
      <div>
        <section aria-label="Project estimator">
          <ol aria-label="Progress">
            {STEPS.map((label, i) => (
              <li key={label} aria-current={i === step ? "step" : undefined}>
                <span>{i + 1}</span>
                <span>{label}</span>
              </li>
            ))}
          </ol>

          <div ref={panelRef} tabIndex={-1} id="panel">
            {step === 0 && (
              <>
                <h2>What do you want to build?</h2>
                <p>
                  Pick one or more. Combining services earns a bundle discount.
                </p>
                <fieldset>
                  <legend>Services</legend>
                  <div>
                    {(Object.keys(CATALOG) as ServiceId[]).map((id) => (
                      <Option
                        key={id}
                        type="checkbox"
                        name="service"
                        checked={sel.services.includes(id)}
                        title={CATALOG[id].label}
                        desc={CATALOG[id].blurb}
                        onChange={() => toggleService(id)}
                      />
                    ))}
                  </div>
                </fieldset>
              </>
            )}

            {step === 1 && (
              <>
                <h2>Which capabilities do you need?</h2>
                <p>
                  Optional. Each one refines the estimate. Skip if you are
                  unsure.
                </p>
                {sel.services.map((sid) => (
                  <fieldset key={sid}>
                    <legend>{CATALOG[sid].label}</legend>
                    <div>
                      {Object.entries(CATALOG[sid].features).map(([fid, f]) => (
                        <Option
                          key={fid}
                          type="checkbox"
                          name="feature"
                          checked={sel.features.includes(fid as FeatureId)}
                          title={f.label}
                          desc={`${formatINR(f.cost[0])} – ${formatINR(f.cost[1])} extra`}
                          onChange={() => toggleFeature(fid as FeatureId)}
                        />
                      ))}
                    </div>
                  </fieldset>
                ))}
              </>
            )}

            {step === 2 && (
              <>
                <h2>How big and how fast?</h2>
                <p>This is the biggestt driver of cost and duration. </p>
                <fieldset>
                  <legend>Level of polish</legend>
                  <div>
                    {(Object.keys(COMPLEXITY) as ComplexityId[]).map((id) => (
                      <Option
                        key={id}
                        type="radio"
                        name="complexity"
                        checked={sel.complexity === id}
                        title={COMPLEXITY[id].label}
                        desc={COMPLEXITY[id].hint}
                        onChange={() =>
                          setSel((s) => ({ ...s, complexity: id }))
                        }
                      />
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend>Target timeline</legend>
                  <div>
                    {(Object.keys(TIMELINE) as TimelineId[]).map((id) => (
                      <Option
                        key={id}
                        type="radio"
                        name="timeline"
                        checked={sel.timeline === id}
                        title={TIMELINE[id].label}
                        onChange={() => setSel((s) => ({ ...s, timeline: id }))}
                      />
                    ))}
                  </div>
                </fieldset>
              </>
            )}

            {step === 3 && <LeadForm selection={sel} source="wizard" />}
          </div>

          <div>
            <button
              type="button"
              disabled={step === 0}
              onClick={() => go(step - 1)}
            >
              Back
            </button>
            {step < STEPS.length - 1 && (
              <button
                type="button"
                disabled={step === 0 && sel.services.length === 0}
                onClick={() => go(step + 1)}
              >
                Continue
              </button>
            )}
          </div>
        </section>
        
        <EstimatePanel selection={sel} />
      </div>
    );
}