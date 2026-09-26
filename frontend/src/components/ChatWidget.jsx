import React, { useEffect, useRef, useState } from 'react';
import { sendChatMessage } from '../services/mockChatService';

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'bot',
  text: "Hi there! I'm the EarlyCare AI Assistant. Ask me about symptoms, prevention, or how the risk checks work.",
};

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-slate-100 rounded-2xl rounded-bl-sm w-fit">
      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
    </div>
  );
}

export default function ChatWidget({ quickPrompts = [], compact = false }) {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const pushMessage = (msg) => setMessages((prev) => [...prev, msg]);

  const handleSend = async (text) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed || typing) return;

    pushMessage({ id: `u-${Date.now()}`, role: 'user', text: trimmed });
    setInput('');
    setError(null);
    setTyping(true);

    try {
      const reply = await sendChatMessage(trimmed);
      pushMessage({ id: `b-${Date.now()}`, role: 'bot', text: reply });
    } catch (err) {
      setError('The assistant is temporarily unavailable.');
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className={`flex flex-col ${compact ? 'h-[26rem]' : 'h-[32rem] sm:h-[36rem]'}`}>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed rounded-2xl ${
                m.role === 'user'
                  ? 'bg-sky-600 text-white rounded-br-sm'
                  : 'bg-slate-100 text-slate-800 rounded-bl-sm'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <TypingIndicator />
          </div>
        )}
        {error && (
          <div className="text-xs font-semibold text-rose-600 px-1">{error}</div>
        )}
      </div>

      {quickPrompts.length > 0 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {quickPrompts.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 p-3 border-t border-slate-200"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
          className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40"
        />
        <button
          type="submit"
          disabled={typing || !input.trim()}
          className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white transition-colors"
          aria-label="Send message"
        >
          ➤
        </button>
      </form>
    </div>
  );
}
