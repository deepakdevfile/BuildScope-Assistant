'use client';




export default function Estimator(){
    return (
      <div>
        <section>
          <ol>list of label</ol>

          <div>
            <>
              <h2>What do you want to build?</h2>
              <p>Pick one or more. Combing services earns a bundle discount.</p>
              <fieldset>
                <legend>Services</legend>
                <div>list of options</div>
              </fieldset>
            </>
          </div>

          <>
            step 1 HTML
            <h2>Which capabilities do you need?</h2>
            <p>
              Optional. Each one refines the estimate. Skip if you are unsure.
            </p>
            service list
            <fieldset>
              <legend>label</legend>
              <div>
                <option value="">checkbox for cost</option>
              </div>
            </fieldset>
          </>

          <>
            Step 2 html
            <h2>Which capabilities do you need?</h2>
            <p>
              Optional. Each one refines the estimate. Skip if you are unsure.
            </p>
            <fieldset>
              <legend>label</legend>
              <div>options for services</div>
            </fieldset>
          </>

          <>
            if step 2 is then
            <h2>How big and how fast?</h2>
            <p>This is the biggestt driver of cost and duration. </p>
            <fieldset>
              <legend>Level of polish</legend>
              <div>options for complexity</div>
            </fieldset>
            <fieldset>
              <legend>Target timeline</legend>
              <div>options for timeline</div>
            </fieldset>
            if step 3 then LeadForm component
          </>

          <div>
            <button>Back</button>
            <button>Continue</button>
          </div>
        </section>

        EstimatePanel component
      </div>
    );
}