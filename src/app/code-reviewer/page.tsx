'use client';

import React, { useState, useCallback } from 'react';
import { CodeInput } from '../../components/CodeInput';
import { ReviewOutput } from '../../components/ReviewOutput';
import type { ReviewSuggestion } from '../../lib/types';
import { LANGUAGES, LANGUAGE_MAP } from '../../lib/constants';

export default function CodeReviewerPage() {
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>(LANGUAGES[0].value);
  const [reviewResult, setReviewResult] = useState<ReviewSuggestion[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isFetchingCode, setIsFetchingCode] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const handleReview = useCallback(async () => {
    if (!code.trim()) {
      setError("Please enter some code to review.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setReviewResult(null);

    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || `Request failed with status ${response.status}`);
      }
      
      setReviewResult(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [code, language]);
  
  const handleFetchCode = useCallback(async (repoUrl: string, filePath: string, token: string) => {
    if (!repoUrl || !filePath) {
        setFetchError("Repository URL and File Path are required.");
        return;
    }
    
    setIsFetchingCode(true);
    setFetchError(null);
    setError(null);
    setReviewResult(null);
    setCode('');

    try {
        const response = await fetch('/api/github', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ repoUrl, filePath, token }),
        });
        
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || `Request failed with status ${response.status}`);
        }

        const { code: fetchedCode } = result;
        setCode(fetchedCode);
        
        const extension = filePath.split('.').pop()?.toLowerCase() || '';
        const detectedLanguage = LANGUAGE_MAP[extension];
        if (detectedLanguage && LANGUAGES.some(l => l.value === detectedLanguage)) {
            setLanguage(detectedLanguage);
        }

    } catch (err) {
        if (err instanceof Error) {
            setFetchError(err.message);
        } else {
            setFetchError("An unknown error occurred while fetching the file.");
        }
    } finally {
        setIsFetchingCode(false);
    }
  }, []);


  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-100 font-sans">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 shrink-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-cyan-400">
            <span className="text-gray-100">INSPECTRA</span> Code Reviewer
          </h1>
          <p className="text-sm text-gray-400 hidden md:block">AI-powered code analysis</p>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 grow min-h-0">
        <CodeInput
          code={code}
          setCode={setCode}
          language={language}
          setLanguage={setLanguage}
          onReview={handleReview}
          isLoading={isLoading}
          onFetchCode={handleFetchCode}
          isFetchingCode={isFetchingCode}
          fetchError={fetchError}
        />
        <ReviewOutput
          reviewResult={reviewResult}
          isLoading={isLoading}
          error={error}
        />
      </main>
    </div>
  );
}