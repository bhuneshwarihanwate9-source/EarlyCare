/**
 * EarlyCare AI Assistant — Mock Knowledge Base
 * ------------------------------------------------
 * ⚠️ FRONTEND-ONLY MOCK. Simple keyword matching, not a real LLM.
 * See services/mockChatService.js for the designated swap-in point once a
 * real AI/model API is connected.
 */

export const QUICK_PROMPTS = [
  'What is diabetes?',
  'What are signs of high blood pressure?',
  'How accurate are these predictions?',
  'I have chest pain, what should I do?',
  'How can I lower my risk?',
  'Is my data kept private?',
];

export const CHAT_RULES = [
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening'],
    reply: "Hello! I'm the EarlyCare AI Assistant. I can help explain diseases, symptoms, or how the risk checks work. What would you like to know?",
  },
  {
    keywords: ['diabetes', 'blood sugar', 'glucose'],
    reply: 'Diabetes is a chronic condition where the body struggles to regulate blood glucose. Common early signs include frequent thirst, frequent urination, and fatigue. You can run a quick risk check on the Diseases page under "Diabetes".',
  },
  {
    keywords: ['hypertension', 'blood pressure', 'bp'],
    reply: 'Hypertension (high blood pressure) often has no obvious symptoms, which is why it\'s called a "silent" risk factor. Occasional headaches, dizziness, or blurred vision can be early clues. A reading of 140/90 mmHg or higher on repeated checks is a signal to see a doctor.',
  },
  {
    keywords: ['heart', 'cardiac', 'chest pain', 'palpitation'],
    reply: 'Heart disease risk builds up gradually through factors like smoking, high cholesterol, and low activity. If you\'re currently experiencing chest pain, pressure, or shortness of breath, please seek medical attention promptly rather than waiting on an app-based check.',
  },
  {
    keywords: ['accurate', 'accuracy', 'trust', 'reliable', 'confidence'],
    reply: 'Great question — EarlyCare\'s risk checks are meant for early awareness and screening, not diagnosis. They highlight patterns worth discussing with a doctor, but they can\'t replace lab tests or a clinical exam.',
  },
  {
    keywords: ['privacy', 'data', 'secure', 'confidential'],
    reply: 'This preview version runs entirely in your browser — the health information you enter during a check is not sent to or stored on a server yet. Once backend integration is complete, this section will be updated with our full data policy.',
  },
  {
    keywords: ['risk', 'lower', 'prevent', 'reduce', 'improve'],
    reply: 'Across most conditions, the highest-impact habits are: regular physical activity, a lower-sodium and lower-sugar diet, not smoking, managing stress, and consistent sleep. Check a specific disease\'s "Prevention Tips" on its details page for more targeted guidance.',
  },
  {
    keywords: ['doctor', 'consult', 'appointment', 'physician'],
    reply: 'If your check comes back Moderate or High risk, or if you\'re experiencing concerning symptoms right now, it\'s best to consult a qualified doctor as soon as possible rather than relying on the app alone.',
  },
  {
    keywords: ['thank', 'thanks', 'appreciate'],
    reply: "You're welcome! Let me know if there's anything else about symptoms, prevention, or how EarlyCare works.",
  },
  {
    keywords: ['who are you', 'what are you', 'what can you do'],
    reply: 'I\'m a preview AI assistant for EarlyCare. Right now I answer common questions about diabetes, hypertension, and heart disease using canned responses — I\'ll be connected to a full AI model soon for richer, personalized conversations.',
  },
];

export const FALLBACK_REPLIES = [
  'I\'m still a preview assistant with a limited knowledge base. Could you rephrase that, or try one of the quick questions below?',
  'I don\'t have a specific answer for that yet, but I can tell you about diabetes, hypertension, or heart disease — or how the risk checks work.',
  'That\'s outside what I can help with right now. Try asking about symptoms, prevention, or a specific condition.',
];
