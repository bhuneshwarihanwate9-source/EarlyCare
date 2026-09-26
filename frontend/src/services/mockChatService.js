/**
 * EarlyCare — Mock Chat Service
 * ------------------------------------------------
 * ⚠️ FRONTEND-ONLY MOCK. Simple keyword matching + simulated latency,
 * standing in for a real AI/model API call.
 *
 * FUTURE INTEGRATION NOTE: replace the body of `sendChatMessage()` with a
 * real request to the AI backend once it exists, keeping the same
 * signature (accepts a string, returns a Promise<string>).
 */

import { CHAT_RULES, FALLBACK_REPLIES } from '../data/chatKnowledge';

const TYPING_DELAY_MS = 900;

function matchReply(text) {
  const lower = text.toLowerCase();
  for (const rule of CHAT_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.reply;
    }
  }
  return FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)];
}

export function sendChatMessage(text) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(matchReply(text)), TYPING_DELAY_MS);
  });
}
