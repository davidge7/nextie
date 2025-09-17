"use client";

import { useState, useRef, useEffect, FormEvent } from "react"; // Added FormEvent
import axios from "axios";
import { Sparkles, Sun, Moon, ArrowRight } from 'lucide-react';

interface Model {
  name: string;
  displayName: string;
  description: string;
  inputTokenLimit: number;
  outputTokenLimit: number;
}

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ sender: string; text: string }[]>([]); // Typed chat state
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [modelsLoading, setModelsLoading] = useState<boolean>(true); // New state for models loading
  const [modelsError, setModelsError] = useState<string | null>(null); // New state for models error

  const chatContainerRef = useRef<HTMLDivElement>(null); // Typed ref

  // Dark mode state and toggle from the Home component
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // For mouse follower

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

  // Fetch models on component mount
  useEffect(() => {
    async function fetchModels() {
      setModelsLoading(true);
      setModelsError(null);
      try {
        const response = await axios.get('/api/models'); // Using axios
        const data: Model[] = response.data;
        setModels(data);
        // if (data.length > 0) {
        //   // Set a default model, preferring 'gemma'
        //   const defaultGeminiPro = data.find(m => m.name === 'models/gemma');
        //   setSelectedModel(defaultGeminiPro ? defaultGeminiPro.name : data[0].name);
        // }
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

  const sendMessage = async (e: FormEvent) => { // Accept FormEvent for consistency
    e.preventDefault(); // Prevent default form submission behavior

    if (!message.trim() || isLoading || !selectedModel) return;

    const userMessage = { sender: "user", text: message.trim() };
    const newChat = [...chat, userMessage];
    setChat(newChat);
    setMessage("");
    setIsLoading(true);

    try {
      const res = await axios.post("/api/chat", {
        message: userMessage.text,
        model: selectedModel
      });
      setChat([...newChat, { sender: "bot", text: res.data.reply }]);
    } catch (err: any) { // Type err as any
      console.error(err);
      setChat([...newChat, { sender: "bot", text: `Sorry, I encountered an error: ${err.response?.data?.error || err.message}. Please try again.` }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Theme classes inspired by the Home component
  const themeClasses = {
    background: isDarkMode
      ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
      : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50",
    text: isDarkMode ? "text-white" : "text-gray-900",
    textSecondary: isDarkMode ? "text-gray-300" : "text-gray-600",
    textMuted: isDarkMode ? "text-gray-400" : "text-gray-500",
    border: isDarkMode ? "border-gray-800" : "border-gray-200",
    borderHover: isDarkMode ? "border-gray-600" : "border-gray-300",
    cardBg: isDarkMode
      ? "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)"
      : "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 100%)",
    glowColor: isDarkMode ? "rgba(99, 102, 241, 0.03)" : "rgba(99, 102, 241, 0.08)",
    inputBg: isDarkMode ? "bg-gray-700" : "bg-gray-100",
    inputBorder: isDarkMode ? "border-gray-700" : "border-gray-200",
    inputTextColor: isDarkMode ? "text-gray-200" : "text-gray-800",
    // Specific for chat bubbles
    botBubbleBg: isDarkMode ? "bg-gray-800" : "bg-white",
    botBubbleText: isDarkMode ? "text-gray-200" : "text-gray-800",
    dropdownBg: isDarkMode ? "bg-gray-700" : "bg-white",
    dropdownBorder: isDarkMode ? "border-gray-600" : "border-gray-300",
    dropdownText: isDarkMode ? "text-gray-200" : "text-gray-800",
  };

  return (
    <div className={`flex flex-col h-screen relative overflow-hidden transition-all duration-500 ${themeClasses.background}`}>
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className={`absolute top-1/4 left-1/4 w-48 h-48 md:w-96 md:h-96 ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-500/20'} rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute top-3/4 right-1/4 w-48 h-48 md:w-96 md:h-96 ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-500/20'} rounded-full blur-3xl animate-pulse delay-1000`}></div>
        <div className={`absolute top-1/2 left-1/2 w-48 h-48 md:w-96 md:h-96 ${isDarkMode ? 'bg-pink-500/10' : 'bg-pink-500/20'} rounded-full blur-3xl animate-pulse delay-2000`}></div>
      </div>

      {/* Mouse follower - hidden on mobile */}
      <div
        className="absolute w-96 h-96 pointer-events-none z-10 hidden md:block"
        style={{
          background: `radial-gradient(circle, ${themeClasses.glowColor} 0%, transparent 70%)`,
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          transition: 'all 0.3s ease-out'
        }}
      />

      {/* Header - Styled like Home component's nav */}
      <div className={`relative z-20 flex flex-col md:flex-row justify-between items-center p-4 md:p-8 ${isDarkMode ? 'bg-gradient-to-br from-slate-900/80 via-purple-900/80 to-slate-900/80' : 'bg-gradient-to-br from-blue-50/80 via-purple-50/80 to-pink-50/80'} backdrop-blur-sm shadow-sm gap-4`}>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-white" />
          </div>
          <span className={`text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent`}>
            Nextie Chat
          </span>
        </div>

        {/* Model Selection Dropdown */}
        <div className="flex items-center space-x-2">
          <label htmlFor="model-select" className={`text-sm md:text-base ${themeClasses.textSecondary} hidden md:block`}>Model:</label>
          <select
            id="model-select"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className={`rounded-lg px-3 py-1 md:px-4 md:py-2 ${themeClasses.dropdownBg} ${themeClasses.dropdownText} ${themeClasses.dropdownBorder} border focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base`}
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

          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg ${themeClasses.textMuted} hover:${themeClasses.text} transition-colors duration-300`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div
        ref={chatContainerRef}
        className="relative z-20 flex-1 overflow-y-auto pt-4 pb-28 px-4 md:px-6 space-y-6" // Adjusted padding
      >
        {chat.length === 0 && (
          <div className={`text-center ${themeClasses.textMuted} mt-10 text-lg md:text-xl font-medium`}>
            <p>👋 Hello! I'm your AI Chat Assistant.</p>
            <p>Ask me anything!</p>
          </div>
        )}

        {chat.map((message, i) => ( // Removed any type here, using typed state
          <div
            key={i}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 ${message.sender === "user"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                : `${themeClasses.botBubbleBg} ${themeClasses.botBubbleText} shadow-md`
                }`}
            >
              <p className="whitespace-pre-wrap text-sm md:text-base">{message.text}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className={`${themeClasses.botBubbleBg} rounded-2xl px-4 py-3 ${themeClasses.textMuted} shadow-md`}>
              <div className="flex space-x-2">
                <div className="animate-bounce">●</div>
                <div className="animate-bounce [animation-delay:0.2s]">●</div>
                <div className="animate-bounce [animation-delay:0.4s]">●</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className={`relative z-20 w-full ${themeClasses.cardBg} border-t ${themeClasses.border} px-4 py-4 backdrop-blur-sm`}>
        <div className="max-w-4xl mx-auto flex gap-3 md:gap-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className={`flex-1 rounded-full px-4 md:px-6 py-2 md:py-3 ${themeClasses.inputBg} ${themeClasses.inputTextColor} focus:outline-none focus:ring-2 focus:ring-blue-500 border ${themeClasses.inputBorder} text-sm md:text-base`}
            disabled={isLoading || modelsLoading || !selectedModel}
          />
          <button
            type="submit" // Changed to type="submit" for form
            disabled={isLoading || !message.trim() || modelsLoading || !selectedModel}
            className="rounded-full px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center text-sm md:text-base"
          >
            Send
            <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}