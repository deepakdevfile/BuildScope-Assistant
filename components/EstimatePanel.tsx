


export default function EstimatePanel({ selection }: { selection: Selection }) {

    return (
      <aside>
        <h2>Your estimate</h2>
        <div>
          <p>
            if no estimation then Select a service to see an indicative budget
            and timeline.
          </p>
          <>
            if estimate exists then
            <div>range of finacial estimation</div>
            <p>range of estimated weeks to complete the project</p>
            <ul>list to breakdown the estimation</ul>
            <div>
              <span>list of selected features </span>
              <span>list of complexit </span>
              <span>list of timeline </span>

            </div>
            <p>
                indicatove note for financial and weeks estimation 
            </p>
          </>
        </div>
      </aside>
    );
}