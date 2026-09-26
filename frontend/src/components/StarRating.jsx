import React, { useState } from 'react';

export default function StarRating({ value, onChange, size = 'text-3xl' }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = hovered ? n <= hovered : n <= value;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            className={`${size} leading-none transition-transform hover:scale-110 ${
              filled ? 'text-amber-400' : 'text-slate-300'
            }`}
            aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
