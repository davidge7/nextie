"use client";

import React, { useState, useRef, useEffect, JSX } from "react";
import axios from "axios";
import { Sparkles, Sun, Moon, ArrowRight, Clock, Zap, AlertCircle, Bot, Check, Copy, User } from 'lucide-react';

interface Model {
  name: string;
  displayName: string;
  description: string;
  inputTokenLimit: number;
  outputTokenLimit: number;
}

interface ChatMessage {
  sender: string;
  text: string;
  responseTime?: number;
  timestamp?: Date;
  isError?: boolean;
}

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [modelsLoading, setModelsLoading] = useState<boolean>(true);
  const [modelsError, setModelsError] = useState<string | null>(null);
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | string>('');
  // Timer states
  const [currentTimer, setCurrentTimer] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Effect for mouse follower
  useEffect(() => {
    const handleMouseMove = (e: { clientX: any; clientY: any; }) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  // Fetch models on component mount
  useEffect(() => {
    async function fetchModels() {
      setModelsLoading(true);
      setModelsError(null);
      try {
        const response = await axios.get('/api/models');
        const data: Model[] = response.data;
        setModels(data);
        if (data.length > 0) {
          // Set a default model
          setSelectedModel(data[0].name);
        }
      } catch (e: any) {
        console.error('Failed to fetch models:', e);
        setModelsError(`Failed to fetch models: ${e.message}`);
      } finally {
        setModelsLoading(false);
      }
    }
    fetchModels();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const startTimer = () => {
    setCurrentTimer(0);
    const interval = setInterval(() => {
      setCurrentTimer(prev => prev + 0.1);
    }, 100);
    setTimerInterval(interval);
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageIndex(index);
      setTimeout(() => setCopiedMessageIndex(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const sendMessage = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();

    if (!message.trim() || isLoading || !selectedModel) return;

    const userMessage: ChatMessage = {
      sender: "user",
      text: message.trim(),
      timestamp: new Date(),
    };

    const newChat = [...chat, userMessage];
    setChat(newChat);
    setMessage("");
    setIsLoading(true);

    startTimer();
    const startTime = performance.now();

    try {
      // create new controller before fetch
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.text,
          modelName: selectedModel,
        }),
        signal: controller.signal, // 🔑 attach signal
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let botMessage = "";

      setChat((prev) => [
        ...prev,
        { sender: "bot", text: "", timestamp: new Date() },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        botMessage += decoder.decode(value, { stream: true });

        setChat((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            text: botMessage,
            responseTime: performance.now() - startTime,
          };
          return updated;
        });
      }

      stopTimer();
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Stream aborted by user");
      } else {
        console.error("Streaming error:", err);
        setChat((prev) => [
          ...prev,
          {
            sender: "bot",
            text: `❌ Error while processing your request.`,
            responseTime: performance.now() - startTime,
            timestamp: new Date(),
            isError: true,
          },
        ]);
      }
      stopTimer();
    } finally {
      abortControllerRef.current = null;
      setIsLoading(false);
      setCurrentTimer(0);
    }
  };


  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Theme classes with sleeker design
  const themeClasses = {
    background: isDarkMode
      ? "bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950"
      : "bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50",
    text: isDarkMode ? "text-gray-100" : "text-gray-900",
    textSecondary: isDarkMode ? "text-gray-300" : "text-gray-600",
    textMuted: isDarkMode ? "text-gray-500" : "text-gray-400",
    border: isDarkMode ? "border-gray-800/50" : "border-gray-200/50",
    borderHover: isDarkMode ? "border-gray-700/70" : "border-gray-300/70",
    cardBg: isDarkMode
      ? "bg-gray-900/20 backdrop-blur-xl border border-gray-800/30"
      : "bg-white/40 backdrop-blur-xl border border-gray-200/30",
    glowColor: isDarkMode ? "rgba(99, 102, 241, 0.04)" : "rgba(99, 102, 241, 0.06)",
    inputBg: isDarkMode ? "bg-gray-900/30" : "bg-white/60",
    inputBorder: isDarkMode ? "border-gray-700/50" : "border-gray-300/50",
    inputTextColor: isDarkMode ? "text-gray-100" : "text-gray-900",
    botBubbleBg: isDarkMode ? "bg-gray-800/40" : "bg-white/80",
    botBubbleText: isDarkMode ? "text-gray-100" : "text-gray-900",
    dropdownBg: isDarkMode ? "bg-gray-900/60" : "bg-white/80",
    dropdownBorder: isDarkMode ? "border-gray-700/50" : "border-gray-300/50",
    dropdownText: isDarkMode ? "text-gray-100" : "text-gray-900",
    errorBg: isDarkMode ? "bg-red-900/20 border-red-800/30" : "bg-red-50/80 border-red-200/50",
    errorText: isDarkMode ? "text-red-300" : "text-red-700",
    successBg: isDarkMode ? "bg-green-900/20 border-green-800/30" : "bg-green-50/80 border-green-200/50",
  };

  const MarkdownRenderer = ({
    content,
    messageIndex,
  }: {
    content: string;
    messageIndex: number;
  }) => {
    const renderContent = () => {
      const lines = content.split('\n');
      const elements: JSX.Element[] = [];
      let inCodeBlock = false;
      let codeContent = '';
      let codeLanguage = '';

      lines.forEach((line, index) => {
        if (line.startsWith('```')) {
          if (inCodeBlock) {
            // End of code block
            elements.push(
              <div key={`code-${index}`} className={`my-4 rounded-lg ${isDarkMode ? 'bg-gray-900/60' : 'bg-gray-100/80'} border ${themeClasses.border} overflow-hidden`}>
                <div className={`flex items-center justify-between px-4 py-2 ${isDarkMode ? 'bg-gray-800/60' : 'bg-gray-50/80'} border-b ${themeClasses.border}`}>
                  <span className={`text-xs font-mono ${themeClasses.textMuted}`}>
                    {codeLanguage || 'code'}
                  </span>
                  <button
                    onClick={() => copyToClipboard(codeContent, messageIndex)}
                    className={`text-xs px-2 py-1 rounded ${themeClasses.textMuted} hover:${themeClasses.text} transition-colors`}
                  >
                    {copiedMessageIndex === index ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <pre className={`p-4 text-sm whitespace-pre-wrap break-words ${themeClasses.text}`}>
                  <code className="block leading-relaxed">{codeContent}</code>
                </pre>
              </div>
            );
            inCodeBlock = false;
            codeContent = '';
            codeLanguage = '';
          } else {
            // Start of code block
            inCodeBlock = true;
            codeLanguage = line.replace('```', '');
          }
          return;
        }

        if (inCodeBlock) {
          codeContent += line + '\n';
          return;
        }

        // Handle headers
        if (line.startsWith('**') && line.endsWith('**')) {
          const text = line.replace(/\*\*/g, '');
          elements.push(
            <h3 key={index} className={`font-semibold text-lg mt-4 mb-2 ${themeClasses.text}`}>
              {text}
            </h3>
          );
        } else if (line.startsWith('# ')) {
          elements.push(
            <h1 key={index} className={`font-bold text-2xl mt-6 mb-3 ${themeClasses.text}`}>
              {line.replace('# ', '')}
            </h1>
          );
        } else if (line.startsWith('## ')) {
          elements.push(
            <h2 key={index} className={`font-semibold text-xl mt-5 mb-2 ${themeClasses.text}`}>
              {line.replace('## ', '')}
            </h2>
          );
        } else if (line.startsWith('### ')) {
          elements.push(
            <h3 key={index} className={`font-semibold text-lg mt-4 mb-2 ${themeClasses.text}`}>
              {line.replace('### ', '')}
            </h3>
          );
        }
        // Handle bullet points
        else if (line.startsWith('- ')) {
          elements.push(
            <div key={index} className="flex items-start space-x-2 my-2">
              <div className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'} mt-2 flex-shrink-0`} />
              <span className={themeClasses.text}>{line.replace('- ', '')}</span>
            </div>
          );
        }
        // Handle numbered lists
        else if (/^\d+\./.test(line)) {
          const match = line.match(/^(\d+)\.\s*(.*)$/);
          if (match) {
            elements.push(
              <div key={index} className="flex items-start space-x-3 my-2">
                <span className={`text-sm font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} mt-0.5 flex-shrink-0`}>
                  {match[1]}.
                </span>
                <span className={themeClasses.text}>{match[2]}</span>
              </div>
            );
          }
        }
        // Handle blockquotes
        else if (line.startsWith('> ')) {
          elements.push(
            <div key={index} className={`border-l-4 ${isDarkMode ? 'border-blue-400' : 'border-blue-500'} pl-4 py-2 my-3 ${isDarkMode ? 'bg-blue-900/10' : 'bg-blue-50/50'} rounded-r-lg`}>
              <p className={`italic ${themeClasses.textSecondary}`}>{line.replace('> ', '')}</p>
            </div>
          );
        }
        // Handle inline code
        else if (line.includes('`') && !line.startsWith('```')) {
          const parts = line.split('`');
          const processedParts = parts.map((part, i) =>
            i % 2 === 1 ? (
              <code key={i} className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? 'bg-gray-700/60' : 'bg-gray-200/60'} font-mono break-words`}>
                {part}
              </code>
            ) : part
          );
          elements.push(
            <p key={index} className={`my-2 leading-relaxed ${themeClasses.text} break-words`}>
              {processedParts}
            </p>
          );
        }
        // Handle regular paragraphs
        else if (line.trim()) {
          // Handle bold text within paragraphs
          const boldRegex = /\*\*(.*?)\*\*/g;
          const parts = [];
          let lastIndex = 0;
          let match;

          while ((match = boldRegex.exec(line)) !== null) {
            if (match.index > lastIndex) {
              parts.push(line.substring(lastIndex, match.index));
            }
            parts.push(
              <strong key={match.index} className="font-semibold">
                {match[1]}
              </strong>
            );
            lastIndex = match.index + match[0].length;
          }

          if (lastIndex < line.length) {
            parts.push(line.substring(lastIndex));
          }

          elements.push(
            <p key={index} className={`my-2 leading-relaxed ${themeClasses.text} break-words`}>
              {parts.length > 1 ? parts : line}
            </p>
          );
        } else {
          // Empty line for spacing
          elements.push(<div key={index} className="my-2" />);
        }
      });

      return elements;
    };

    return <div className="prose prose-sm max-w-none">{renderContent()}</div>;
  };

  return (
    <div className={`flex flex-col h-screen relative overflow-hidden transition-all duration-700 ${themeClasses.background}`}>
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 ${isDarkMode ? 'bg-blue-500/5' : 'bg-blue-500/10'} rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute top-3/4 right-1/4 w-64 h-64 md:w-96 md:h-96 ${isDarkMode ? 'bg-purple-500/5' : 'bg-purple-500/10'} rounded-full blur-3xl animate-pulse delay-1000`}></div>
        <div className={`absolute top-1/2 left-1/2 w-64 h-64 md:w-96 md:h-96 ${isDarkMode ? 'bg-pink-500/5' : 'bg-pink-500/10'} rounded-full blur-3xl animate-pulse delay-2000`}></div>
      </div>

      {/* Mouse follower */}
      <div
        className="absolute w-96 h-96 pointer-events-none z-10 hidden md:block"
        style={{
          background: `radial-gradient(circle, ${themeClasses.glowColor} 0%, transparent 70%)`,
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          transition: 'all 0.3s ease-out'
        }}
      />

      {/* Live Timer Display */}
      {isLoading && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className={`${themeClasses.cardBg} rounded-xl px-4 py-2 shadow-lg`}>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-400 animate-spin" />
              <span className={`text-sm font-mono ${themeClasses.text}`}>
                {currentTimer.toFixed(1)}s
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Sleek Header */}
      <div className={`relative z-20 ${themeClasses.cardBg} shadow-sm`}>
        <div className="flex flex-col md:flex-row justify-between items-center p-4 md:p-6 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Nextie Chat
              </h1>
              <p className={`text-xs ${themeClasses.textMuted}`}>AI-Powered Assistant</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Sleek Model Selection */}
            <div className="relative">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className={`appearance-none ${themeClasses.dropdownBg} ${themeClasses.dropdownText} ${themeClasses.dropdownBorder} border rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-sm transition-all duration-300 backdrop-blur-sm cursor-pointer min-w-[160px]`}
                disabled={modelsLoading || isLoading}
              >
                {modelsLoading ? (
                  <option value="">Loading models...</option>
                ) : modelsError ? (
                  <option value="">Error loading models</option>
                ) : models.length === 0 ? (
                  <option value="">No models available</option>
                ) : (
                  models.map((model) => (
                    <option key={model.name} value={model.name}>
                      {model.displayName}
                    </option>
                  ))
                )}
              </select>
              {modelsLoading ? (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : modelsError ? (
                <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-400 pointer-events-none" />
              ) : (
                <Zap className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400 pointer-events-none" />
              )}
            </div>

            <button
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-xl ${themeClasses.inputBg} ${themeClasses.textMuted} hover:${themeClasses.text} transition-all duration-300 backdrop-blur-sm border ${themeClasses.inputBorder} hover:scale-105`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div
        ref={chatContainerRef}
        className="relative z-20 flex-1 overflow-y-auto py-6 px-4 md:px-6 space-y-6"
      >
        {chat.length === 0 && (
          <div className={`text-center ${themeClasses.textMuted} mt-12`}>
            <div className={`${themeClasses.cardBg} rounded-2xl p-8 max-w-md mx-auto`}>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-lg font-semibold ${themeClasses.text} mb-2`}>Welcome to Nextie Chat</h3>
              <p className={`${themeClasses.textSecondary} text-sm`}>Your AI assistant is ready to help. Ask me anything!</p>
            </div>
          </div>
        )}

        {chat.map((message, i) => (
          <div
            key={i}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} group`}
          >
            <div className={`flex max-w-[85%] md:max-w-[75%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"} items-start space-x-3`}>
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.sender === "user"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 ml-3"
                : `${message.isError ? themeClasses.errorBg : themeClasses.botBubbleBg} border ${message.isError ? 'border-red-500/30' : themeClasses.border} mr-3`
                }`}>
                {message.sender === "user" ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className={`w-4 h-4 ${message.isError ? 'text-red-400' : 'text-blue-400'}`} />
                )}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div
                  className={`rounded-2xl px-4 py-3 ${message.sender === "user"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : message.isError
                      ? `${themeClasses.errorBg} border shadow-md backdrop-blur-sm`
                      : `${themeClasses.botBubbleBg} ${themeClasses.botBubbleText} shadow-md backdrop-blur-sm border ${themeClasses.border}`
                    }`}
                >
                  {/* Message Header for Bot */}
                  {message.sender === "bot" && (
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200/20">
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-medium ${message.isError ? themeClasses.errorText : 'text-blue-400'}`}>
                          {message.isError ? 'Error Response' : 'AI Assistant'}
                        </span>
                        {message.responseTime && (
                          <>
                            <span className={`text-xs ${themeClasses.textMuted}`}>•</span>
                            <span className={`text-xs ${themeClasses.textMuted}`}>
                              {(message.responseTime / 1000).toFixed(2)}s
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => copyToClipboard(message.text, i)}
                          className={`p-1.5 rounded-lg ${themeClasses.textMuted} hover:${themeClasses.text} hover:bg-gray-200/10 transition-all`}
                          title="Copy message"
                        >
                          {copiedMessageIndex === i ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Message Text */}
                  <div className="text-sm md:text-base leading-relaxed">
                    {message.sender === "user" ? (
                      <p>{message.text}</p>
                    ) : (
                      <MarkdownRenderer content={message.text} messageIndex={i} />
                    )}
                  </div>

                  {/* Timestamp for user messages */}
                  {message.sender === "user" && message.timestamp && (
                    <div className="flex justify-end mt-2">
                      <span className="text-xs text-white/70">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bot message timestamp */}
                {message.sender === "bot" && message.timestamp && (
                  <div className="flex items-center justify-between mt-2 px-1">
                    <span className={`text-xs ${themeClasses.textMuted}`}>
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start group">
            <div className="flex items-start space-x-3 max-w-[75%]">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${themeClasses.botBubbleBg} border ${themeClasses.border}`}>
                <Bot className="w-4 h-4 text-blue-400" />
              </div>
              <div className={`${themeClasses.botBubbleBg} rounded-2xl px-4 py-3 shadow-md backdrop-blur-sm border ${themeClasses.border}`}>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs font-medium text-blue-400">Nextie</span>
                  <span className={`text-xs ${themeClasses.textMuted}`}>thinking...</span>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sleek Message Input */}
      <div className={`relative z-20 ${themeClasses.cardBg} border-t ${themeClasses.border}`}>
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex gap-3 items-center">
            {/* Input Field */}
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
              placeholder="Type your message..."
              className={`flex-1 rounded-2xl px-5 py-3 ${themeClasses.inputBg} ${themeClasses.inputTextColor} 
        focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent border 
        ${themeClasses.inputBorder} text-sm md:text-base transition-all duration-300 
        backdrop-blur-sm placeholder:${themeClasses.textMuted}`}
              disabled={isLoading || !selectedModel}
            />

            {/* Stop + Timer Row */}
            {isLoading ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => abortControllerRef.current?.abort()}
                  className="rounded-2xl px-5 py-3 bg-gradient-to-r from-red-500 to-pink-600 
            text-white font-medium hover:from-red-600 hover:to-pink-700 focus:outline-none 
            focus:ring-2 focus:ring-red-500/50 transition-all duration-300 flex items-center 
            justify-center text-sm md:text-base shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Stop
                </button>

                {/* Timer Box */}
                <div
                  className={`${themeClasses.cardBg} rounded-xl px-3 py-2 shadow-md flex items-center gap-2`}
                >
                  <Clock className="w-4 h-4 text-blue-400 animate-spin" />
                  <span className={`text-xs font-mono ${themeClasses.text}`}>
                    {currentTimer.toFixed(1)}s
                  </span>
                </div>
              </div>
            ) : (
              <button
                onClick={sendMessage}
                disabled={!message.trim() || !selectedModel}
                className="rounded-2xl px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 
          text-white font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none 
          focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed 
          transition-all duration-300 flex items-center justify-center text-sm md:text-base 
          shadow-lg hover:shadow-xl hover:scale-105"
              >
                Send
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>


    </div>
  );
}