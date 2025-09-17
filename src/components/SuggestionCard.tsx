'use client';

import React from 'react';
import type { ReviewSuggestion } from '../lib/types';
import { Severity } from '../lib/types';

interface SuggestionCardProps {
  suggestion: ReviewSuggestion;
}

const severityStyles: Record<Severity, { border: string; bg: string; text: string; badge: string }> = {
  [Severity.Critical]: {
    border: 'border-red-500/50',
    bg: 'bg-red-900/20',
    text: 'text-red-400',
    badge: 'bg-red-500/80 text-white',
  },
  [Severity.High]: {
    border: 'border-orange-500/50',
    bg: 'bg-orange-900/20',
    text: 'text-orange-400',
    badge: 'bg-orange-500/80 text-white',
  },
  [Severity.Medium]: {
    border: 'border-yellow-500/50',
    bg: 'bg-yellow-900/20',
    text: 'text-yellow-400',
    badge: 'bg-yellow-500/80 text-gray-900',
  },
  [Severity.Low]: {
    border: 'border-blue-500/50',
    bg: 'bg-blue-900/20',
    text: 'text-blue-400',
    badge: 'bg-blue-500/80 text-white',
  },
  [Severity.Info]: {
    border: 'border-gray-500/50',
    bg: 'bg-gray-700/20',
    text: 'text-gray-400',
    badge: 'bg-gray-500/80 text-white',
  },
};

export const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion }) => {
  const styles = severityStyles[suggestion.severity] || severityStyles[Severity.Info];

  return (
    <div className={`border rounded-lg ${styles.border} ${styles.bg} overflow-hidden`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-grow">
            <h3 className="font-semibold text-gray-100">{suggestion.suggestion}</h3>
          </div>
          <div className="flex-shrink-0 flex items-center gap-4">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${styles.badge}`}>
              {suggestion.severity}
            </span>
            <span className="text-sm font-mono text-gray-400">
              L{suggestion.line}
            </span>
          </div>
        </div>
        <p className="mt-2 text-gray-300 text-sm">
          {suggestion.explanation}
        </p>
      </div>
    </div>
  );
};
