import React from 'react';

export default function ErrorState({
  title = 'Something went wrong',
  subtitle = 'Please try again in a moment.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-rose-50/60 rounded-2xl border border-rose-200">
      <div className="w-14 h-14 rounded-2xl bg-white border border-rose-200 flex items-center justify-center text-2xl mb-4">
        ⚠️
      </div>
      <p className="font-bold text-rose-800">{title}</p>
      <p className="text-sm text-rose-700/80 mt-1 max-w-sm">{subtitle}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
