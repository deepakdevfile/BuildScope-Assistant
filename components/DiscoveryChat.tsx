
import Link from 'next/link';


export default function DiscoveryChat(){
    return (
      <div>
        <section>
          <div>
            messages list
            <div>
              <span>user role </span>
              <p>message content</p>
            </div>
            <div>
              if loading
              <span>Assistant</span>
              <p>Thinking...</p>
            </div>
          </div>

          <div>
            if error 
            You can also <Link href="/estimate">use the step-by-step estimator</Link>.
          </div>
          <p>if finished then Conversation limit reached. Please send your brief so the team can continue with you. </p>

          <form action="">
            <label htmlFor="chat-input">Your message</label>
            <input id='chat-input' type="text" />
            <button>Send</button>
          </form>

          <div>
            <Link href="/estimate">
              Prefer a form ? Use the estimator 
            </Link>
            <button>
                Send brief to Cynbit
            </button>
          </div>

          <div>
            if need to show form then 
            LeadForm component
          </div>
        </section>
        EstimatePanel component
      </div>
    );
}