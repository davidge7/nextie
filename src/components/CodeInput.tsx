'use client';

import React, { useState } from 'react';
import { LANGUAGES } from '../lib/constants';

interface CodeInputProps {
  code: string;
  setCode: (code: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  onReview: () => void;
  isLoading: boolean;
  onFetchCode: (repoUrl: string, filePath: string, token: string) => void;
  isFetchingCode: boolean;
  fetchError: string | null;
}

type InputMode = 'paste' | 'github';

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
      active
        ? 'bg-gray-700 text-cyan-400'
        : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
    }`}
  >
    {children}
  </button>
);


export const CodeInput: React.FC<CodeInputProps> = ({ code, setCode, language, setLanguage, onReview, isLoading, onFetchCode, isFetchingCode, fetchError }) => {
  const [mode, setMode] = useState<InputMode>('paste');
  const [repoUrl, setRepoUrl] = useState('');
  const [filePath, setFilePath] = useState('');
  const [githubToken, setGithubToken] = useState('');

  const handleFetchClick = () => {
    onFetchCode(repoUrl, filePath, githubToken);
  };
  
  const isDisabled = isLoading || isFetchingCode;

  return (
    <div className="flex flex-col bg-gray-800 rounded-lg border border-gray-700 h-full">
      <div className="flex items-center justify-between p-3 border-b border-gray-700 flex-wrap gap-2">
        <div className="flex items-center gap-2 bg-gray-900/50 p-1 rounded-lg">
          <TabButton active={mode === 'paste'} onClick={() => setMode('paste')}>Paste Code</TabButton>
          <TabButton active={mode === 'github'} onClick={() => setMode('github')}>From GitHub</TabButton>
        </div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2"
          disabled={isDisabled}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {mode === 'github' && (
        <div className="p-3 border-b border-gray-700 bg-gray-800/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="e.g., https://github.com/owner/repo"
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
              disabled={isDisabled}
            />
            <input
              type="text"
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              placeholder="e.g., src/components/Button.tsx"
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
              disabled={isDisabled}
            />
          </div>
          <div className="mt-3">
             <input
              type="password"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              placeholder="GitHub Personal Access Token (optional)"
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
              disabled={isDisabled}
            />
            <p className="text-xs text-gray-500 mt-1 px-1">Needed for private repos or to avoid rate limits. Your token is not stored.</p>
          </div>
          <button
            onClick={handleFetchClick}
            disabled={isDisabled}
            className="w-full mt-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600/50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
           {isFetchingCode ? (
             <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Fetching File...
             </>
           ) : 'Fetch File'}
          </button>
          {fetchError && <p className="mt-2 text-sm text-red-400 text-center">{fetchError}</p>}
        </div>
      )}

      <div className="flex-grow p-1 relative">
        <textarea
          className="w-full h-full p-3 bg-gray-900 text-gray-200 font-mono text-sm rounded-b-md resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={mode === 'paste' ? "Paste your code here..." : "Fetched code will appear here..."}
          spellCheck="false"
          disabled={isDisabled}
        />
      </div>
       <div className="p-3 border-t border-gray-700">
        <button
          onClick={onReview}
          disabled={isDisabled || !code}
          className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Reviewing...
            </>
          ) : (
            'Review Code'
          )}
        </button>
      </div>
    </div>
  );
};
