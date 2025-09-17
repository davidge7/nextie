'use client';

import React from 'react';
import type { ReviewSuggestion } from '../lib/types';
import { Loader } from './Loader';
import { ErrorMessage } from './ErrorMessage';
import { SuggestionCard } from './SuggestionCard';

interface ReviewOutputProps {
  reviewResult: ReviewSuggestion[] | null;
  isLoading: boolean;
  error: string | null;
}

const WelcomeMessage: React.FC = () => (
  <div className="text-center text-gray-400 flex flex-col items-center justify-center h-full">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
    <h3 className="text-xl font-semibold text-gray-300">Ready for Review</h3>
    <p className="mt-2 max-w-sm">Paste your code on the left, select the language, and click &quot;Review Code&quot; to get AI-powered feedback.</p>
  </div>
);

export const ReviewOutput: React.FC<ReviewOutputProps> = ({ reviewResult, isLoading, error }) => {
  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }
    if (error) {
      return <ErrorMessage message={error} />;
    }
    if (reviewResult) {
      if (reviewResult.length === 0) {
        return (
          <div className="text-center text-green-400 flex flex-col items-center justify-center h-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold">Great job!</h3>
            <p className="mt-2">No issues found in your code.</p>
          </div>
        );
      
      }
      console.log('Rendering suggestions:', reviewResult);
      return (
        <div className="space-y-4">
          {reviewResult.map((suggestion, index) => (
            <SuggestionCard key={index} suggestion={suggestion} />
          ))}
        </div>
      );
    }
    return <WelcomeMessage />;
  };

  return (
    <div className="flex flex-col overflow-y-auto bg-gray-800 rounded-lg border border-gray-700 h-full">
      <div className="p-3 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-gray-200">Review Feedback</h2>
      </div>
      <div className="flex-grow p-4 overflow-auto min-h-0">
        {renderContent()}
      </div>
    </div>
  );
};