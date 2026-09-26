import React, { useState } from 'react';
import ChatWidget from './ChatWidget';
import { QUICK_PROMPTS } from '../data/chatKnowledge';

export default function FloatingChatButton({ onOpenFullAssistant }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[22rem] max-w-[calc(100vw-2.5rem)] bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-sky-600 to-blue-700 text-white">
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <span className="font-bold text-sm">EarlyCare Assistant</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={onOpenFullAssistant}
                className="text-xs font-semibold px-2 py-1 rounded-md hover:bg-white/15 transition-colors"
                title="Open full assistant"
              >
                Expand
              </button>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/15 transition-colors"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </div>
          <ChatWidget quickPrompts={QUICK_PROMPTS.slice(0, 3)} compact />
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-gradient-to-tr from-sky-600 to-blue-700 text-white text-2xl shadow-lg shadow-sky-600/40 flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="Toggle AI assistant chat"
      >
        {open ? '✕' : '💬'}
      </button>
    </>
  );
}
