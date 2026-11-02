
import Link from 'next/link';
import { useState } from 'react';

import { ChatMessage } from '@/lib/types';

const GREETING: ChatMessage = {
    role: 'assistant',
    content: "Hi! I'm Cynbit's Project Discovery Assistant. Tell me what you'd like to build or automate, and I'll help shape a brief for our team.",
};

const MAX_USER_TURNS = 12;

export default function DiscoveryChat(){
    const [message, setMessage] = useState<ChatMessage[]>([GREETING]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const userTurns = message.filter((m) => m.role === 'user').length;
    const atLimit = userTurns >= MAX_USER_TURNS;
    return (
      <div>
        <section>
          <div>
            {message.map((m, i) => (
              <div key={i}>
                <span>{m.role === "user" ? "You" : "Assistant"} </span>
                <p>{m.content}</p>
              </div>
            ))}

            {loading && (
              <div>
                <span>Assistant</span>
                <p>Thinking...</p>
              </div>
            )}
          </div>

          {error && (
            <div>
              {error} You can also
              <Link href="/estimate">use the step-by-step estimator</Link>.
            </div>
          )}
          {atLimit && (
            <p>
              if finished then Conversation limit reached. Please send your
              brief so the team can continue with you.{" "}
            </p>
          )}

          <form action="">
            <label htmlFor="chat-input">Your message</label>
            <input id="chat-input" type="text" />
            <button>Send</button>
          </form>

          <div>
            <Link href="/estimate">Prefer a form ? Use the estimator</Link>
            <button>Send brief to Cynbit</button>
          </div>

          <div>if need to show form then LeadForm component</div>
        </section>
        EstimatePanel component
      </div>
    );
}