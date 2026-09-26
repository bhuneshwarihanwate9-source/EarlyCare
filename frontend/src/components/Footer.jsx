import React from 'react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-sky-600 to-blue-700 flex items-center justify-center text-white font-extrabold shadow-sm">
                🫀
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">EarlyCare</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Early disease risk awareness, made simple. Screening insights for diabetes, hypertension, and heart disease.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">Explore</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><button onClick={() => onNavigate('home')} className="hover:text-sky-700 transition-colors">Home</button></li>
              <li><button onClick={() => onNavigate('diseases')} className="hover:text-sky-700 transition-colors">Diseases</button></li>
              <li><button onClick={() => onNavigate('ai-assistant')} className="hover:text-sky-700 transition-colors">AI Assistant</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-sky-700 transition-colors">About</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><button onClick={() => onNavigate('feedback')} className="hover:text-sky-700 transition-colors">Feedback</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-sky-700 transition-colors">Contact Us</button></li>
              <li><button onClick={() => onNavigate('login')} className="hover:text-sky-700 transition-colors">Portal Sign In</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">Get in Touch</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>support@earlycare.ai</li>
              <li>+91 98765 43210</li>
              <li>Bengaluru, India</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-500">
            <span className="font-bold text-slate-700">EarlyCare AI</span> — Disease Risk Prediction Platform © {new Date().getFullYear()}
          </p>
          <p className="text-xs text-slate-400 max-w-lg text-center sm:text-right">
            This is an AI-assisted prediction platform and does not provide medical diagnoses. Always consult a qualified doctor for medical concerns.
          </p>
        </div>
      </div>
    </footer>
  );
}
