import React from 'react';
import ChatWidget from '../components/ChatWidget';
import { QUICK_PROMPTS } from '../data/chatKnowledge';

export default function AIAssistant() {
  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold tracking-wide mb-1">
          <span className="w-2 h-2 rounded-full bg-sky-600 animate-pulse"></span>
          Preview — Mock Responses
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">EarlyCare AI Assistant</h1>
        <p className="text-slate-500 text-sm sm:text-base">
          Ask about symptoms, prevention, or how EarlyCare's risk checks work. This preview uses canned responses and is ready to connect to a real AI model.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-sky-600 to-blue-700 text-white">
          <span className="text-lg">🤖</span>
          <span className="font-bold text-sm">EarlyCare Assistant</span>
        </div>
        <ChatWidget quickPrompts={QUICK_PROMPTS} />
      </div>

      <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 text-center">
        This assistant provides general health information only and is not a substitute for professional medical advice.
      </div>
    </div>
  );
}
