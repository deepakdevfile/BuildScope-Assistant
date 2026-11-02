'use client';

import Link from 'next/link';
import React, { useEffect, useState, useRef } from 'react';
import { type Selection, DEFAULT_SELECTION } from "@/lib/types";
import { ChatMessage, LIMITS } from '@/lib/types';
import EstimatePanel from './EstimatePanel';
import LeadForm from './LeadForm';
import { normalizeSelection } from '@/lib/estimator';

const GREETING: ChatMessage = {
    role: 'assistant',
    content: "Hi! I'm Cynbit's Project Discovery Assistant. Tell me what you'd like to build or automate, and I'll help shape a brief for our team.",
};

const MAX_USER_TURNS = 12;

export default function DiscoveryChat(){
    const [messages, setMessage] = useState<ChatMessage[]>([GREETING]);
    const [selection, setSelection] = useState<Selection>(DEFAULT_SELECTION);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const logRef = useRef<HTMLDivElement>(null);

    const userTurns = messages.filter((m) => m.role === 'user').length;
    const atLimit = userTurns >= MAX_USER_TURNS;

    useEffect(() => {
        logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
    }, [messages, loading]);

    async function send(ev: React.SubmitEvent){
        ev.preventDefault();
        const text = input.trim();

        if(!text || loading || atLimit){
            return;
        }

        const next: ChatMessage[] = [...messages, { role: 'user', content: text }];
        setMessage(next);
        setInput('');
        setError('');
        setLoading(true);

        try {
            const payload = next.slice(next.findIndex((m) => m.role === "user"));
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: payload, selection }),
            });

            const data = (await res.json().catch(() => ({}))) as {reply?: string; selection?: unknown; error?: string };
            if(!res.ok || !data.reply){
                throw new Error(data.error ?? 'Request failed'); 
            }
            setMessage([...next, { role: 'assistant', content: data.reply }]);
            setSelection(normalizeSelection(data.selection));
        } catch(e){
            setError(e instanceof Error ? e.message : 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    }

    const transcript = messages.slice(
      messages.findIndex((m) => m.role === "user") >= 0
        ? messages.findIndex((m) => m.role === "user")
        : messages.length,
    );
    const canSend = selection.services.length > 0;

    return (
      <div>
        <section>
          <div ref={logRef} role='log'>
            {messages.map((m, i) => (
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
              Conversation limit reached. Please send your brief so the team can
              continue with you.{" "}
            </p>
          )}

          <form onSubmit={send}>
            <label htmlFor="chat-input">Your message</label>
            <input
              id="chat-input"
              type="text"
              value={input}
              maxLength={LIMITS.maxChars}
              placeholder={
                atLimit
                  ? "Conversation limit reached"
                  : "e.g. We need an AI agent to handle customer calls"
              }
              onChange={(e) => setInput(e.target.value)}
              disabled={loading || atLimit}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={loading || atLimit || !input.trim()}
            >
              Send
            </button>
          </form>

          <div>
            <Link href="/estimate">Prefer a form ? Use the estimator</Link>
            <button
              type="button"
              disabled={!canSend}
              onClick={() => setShowForm(true)}
            >
              Send brief to Cynbit
            </button>
          </div>

          {showForm && (
            <div>
              <LeadForm
                selection={selection}
                source="chat"
                transcript={transcript}
              />
            </div>
          )}
        </section>
        <EstimatePanel selection={selection} />
      </div>
    );
}