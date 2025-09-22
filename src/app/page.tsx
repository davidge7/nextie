'use client';
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { ChevronDown, MessageCircle, Code, FileText, User, Sparkles, ArrowRight, Sun, Moon, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from '../context/themeContext';

export default function Home() {
  const router = useRouter();
  const { themeClasses, toggleTheme, isDarkMode } = useTheme(); // Using context

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFooterExpanded, setIsFooterExpanded] = useState(false);

  const toggleFooter = () => setIsFooterExpanded(!isFooterExpanded);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false);
  };

  // Social links data
  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/davidge7",
      icon: "https://github.com/devicons/devicon/raw/v2.16.0/icons/github/github-original.svg"
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/davidge97",
      icon: "https://github.com/devicons/devicon/raw/v2.16.0/icons/linkedin/linkedin-original.svg"
    }
  ];

  const features = [
    {
      icon: <MessageCircle className="w-6 h-6 md:w-8 md:h-8" />,
      title: "AI Chat",
      description: "Intelligent conversations powered by advanced AI technology",
      href: "/chat",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: <Code className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Code Reviewer",
      description: "Smart code analysis and optimization suggestions",
      href: "/code-reviewer",
      gradient: "from-green-500 to-teal-600"
    },
    {
      icon: <FileText className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Blog",
      description: "Insights, tutorials, and the latest in tech innovation",
      href: "/blog",
      gradient: "from-orange-500 to-red-600"
    },
    {
      icon: <User className="w-6 h-6 md:w-8 md:h-8" />,
      title: "About",
      description: "Learn more about our mission and technology",
      href: "/about",
      gradient: "from-purple-500 to-pink-600"
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e: { clientX: number; clientY: number }) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={`min-h-screen ${themeClasses.background} relative overflow-hidden transition-all duration-500`}>
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
        style={{ background: themeClasses.headerFooterBg, borderColor: themeClasses.border }}
      >
        <nav className="flex justify-between items-center py-2 md:py-3 px-4 md:px-6 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-3 h-3 md:w-5 md:h-5 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Nextie
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {['About', 'Blog', 'Contact'].map((item) => (
              <a
                key={item}
                href={`/${item.toLowerCase()}`}
                className={`${themeClasses.textSecondary} hover:${themeClasses.text} transition-colors duration-300 relative group cursor-pointer`}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${themeClasses.textMuted} hover:${themeClasses.text} transition-colors duration-300`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${themeClasses.textMuted} hover:${themeClasses.text} cursor-pointer transition-colors`}
              >
                <img src={link.icon} alt={link.name} className="w-4 h-4 md:w-5 md:h-5" />
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${themeClasses.textMuted} hover:${themeClasses.text} transition-colors duration-300`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg ${themeClasses.textMuted} hover:${themeClasses.text} transition-colors duration-300`}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mx-4 mb-4 rounded-2xl backdrop-blur-sm border p-4" style={{ background: themeClasses.cardBg, borderColor: themeClasses.border }}>
            <div className="flex flex-col space-y-2">
              {['About', 'Blog', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavigation(`/${item.toLowerCase()}`)}
                  className={`${themeClasses.textSecondary} hover:${themeClasses.text} transition-colors duration-300 py-2 text-left`}
                >
                  {item}
                </button>
              ))}
              <div className="flex space-x-3 pt-3 border-t border-gray-300 dark:border-gray-700">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${themeClasses.textMuted} hover:${themeClasses.text} cursor-pointer transition-colors`}
                  >
                    <img src={link.icon} alt={link.name} className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Container - with padding for fixed header and footer */}
      <div className="pt-20 md:pt-24 pb-16 md:pb-1 min-h-screen relative">
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

        {/* Hero Section */}
        <main className="relative z-20 flex flex-col items-center justify-center min-h-[60vh] px-4 md:px-8 text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-4 md:mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                Build
              </span>
              <br />
              <span className={themeClasses.text}>
                The Future
              </span>
            </h1>

            <p className={`text-lg sm:text-xl md:text-2xl ${themeClasses.textSecondary} mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-4`}>
              Experience the next generation of AI-powered tools designed to revolutionize your workflow and unlock unprecedented creativity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center mb-8 md:mb-12 px-4">
              <button
                onClick={() => handleNavigation('/chat')}
                className="w-full sm:w-auto group relative px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button
                onClick={() => handleNavigation('/about')}
                className={`w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 border ${themeClasses.border} ${themeClasses.textSecondary} font-semibold rounded-full hover:${themeClasses.borderHover} hover:${themeClasses.text} transition-all duration-300 backdrop-blur-sm`}
              >
                Learn More
              </button>
            </div>

            {/* Scroll indicator */}
            <div className="flex flex-col items-center animate-bounce">
              <span className={`${themeClasses.textMuted} text-sm mb-2`}>Scroll to explore</span>
              <ChevronDown className={`w-5 h-5 md:w-6 md:h-6 ${themeClasses.textMuted}`} />
            </div>
          </div>
        </main>

        {/* Features Section */}
        <section className="relative z-20 py-12 md:py-20 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className={`text-3xl md:text-5xl font-bold text-center mb-8 md:mb-16 ${themeClasses.text}`}>
              Powerful
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Features</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`group relative p-6 md:p-8 rounded-2xl backdrop-blur-sm border ${themeClasses.border} hover:${themeClasses.borderHover} transition-all duration-500 hover:scale-105 hover:shadow-2xl ${index % 2 === 0 ? 'hover:shadow-blue-500/25' : 'hover:shadow-purple-500/25'
                    }`}
                  style={{ background: themeClasses.cardBg }}
                >
                  <div className={`inline-flex p-2 md:p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>

                  <h3 className={`text-xl md:text-2xl font-bold ${themeClasses.text} mb-3 md:mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300`}>
                    {feature.title}
                  </h3>

                  <p className={`${themeClasses.textMuted} mb-4 md:mb-6 leading-relaxed text-sm md:text-base`}>
                    {feature.description}
                  </p>

                  <button
                    onClick={() => handleNavigation(feature.href)}
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors group-hover:translate-x-2 duration-300 text-sm md:text-base cursor-pointer"
                  >
                    Explore
                    <ArrowRight className="ml-2 w-3 h-3 md:w-4 md:h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-20 py-12 md:py-20 px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div
              className={`relative p-8 md:p-12 rounded-3xl backdrop-blur-sm border ${themeClasses.border}`}
              style={{ background: themeClasses.cardBg }}
            >
              <h2 className={`text-2xl md:text-4xl font-bold ${themeClasses.text} mb-4 md:mb-6`}>
                Ready to Transform Your Workflow?
              </h2>
              <p className={`text-lg md:text-xl ${themeClasses.textSecondary} mb-6 md:mb-8`}>
                Join thousands of developers and creators who are already building the future with our AI-powered platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/chat')}
                  className="group px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center justify-center"
                >
                  <MessageCircle className="mr-2 w-4 h-4 md:w-5 md:h-5" />
                  Start Chatting
                  <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => router.push('/code-reviewer')}
                  className="group px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/25 flex items-center justify-center"
                >
                  <Code className="mr-2 w-4 h-4 md:w-5 md:h-5" />
                  Review Code
                  <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Fixed Footer */}
      <footer
        className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md border-t transition-all duration-300"
        style={{
          background: themeClasses.headerFooterBg,
          borderColor: isDarkMode
            ? 'rgba(55, 65, 81, 0.5)'
            : 'rgba(229, 231, 235, 0.5)',
        }}
      >
        {/* Compact Footer Header */}
        <div
          className="flex justify-between items-center py-3 px-4 md:px-8 cursor-pointer"
          onClick={toggleFooter}
        >
          <div className="max-w-7xl mx-auto md:pt-0.5 text-center">
            <p className={`${themeClasses.textMuted} text-sm md:text-base`}>
              © 2025 Nextie. All rights reserved. Built with ❤️ and cutting-edge AI.
            </p>
          </div>
          {/* <span className={`${themeClasses.textMuted} text-sm md:text-base`}>
            {isFooterExpanded ? 'Collapse ▲' : 'Expand ▼'}
          </span> */}
        </div>

        {/* Expandable Footer Content */}
        <div
          className={`overflow-hidden transition-all duration-300 px-4 md:px-8 ${isFooterExpanded ? 'max-h-[1000px] py-6 md:py-8' : 'max-h-0'
            }`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-12">
              {/* About / Description */}
              <div className="col-span-1 md:col-span-2">
                <p className={`${themeClasses.textMuted} mb-4 md:mb-6 text-sm md:text-base`}>
                  Building the future of AI-powered development tools, one innovation at a time.
                </p>

                {/* Social Links */}
                <div className="flex items-center space-x-3 md:space-x-4">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${themeClasses.textMuted} hover:${themeClasses.text} transition-colors`}
                    >
                      <img
                        src={link.icon}
                        alt={link.name}
                        className="w-5 h-5 md:w-6 md:h-6"
                      />
                    </a>
                  ))}
                </div>
              </div>

              {/* Product Links */}
              <div>
                <h4 className={`${themeClasses.text} font-semibold mb-3 text-sm md:text-base`}>
                  Product
                </h4>
                <ul className="space-y-2">
                  <li><a href="/chat" className={`${themeClasses.textMuted} hover:${themeClasses.text} transition-colors text-sm md:text-base cursor-pointer`}>AI Chat</a></li>
                  <li><a href="/code-reviewer" className={`${themeClasses.textMuted} hover:${themeClasses.text} transition-colors text-sm md:text-base cursor-pointer`}>Code Reviewer</a></li>
                  <li><a href="/blog" className={`${themeClasses.textMuted} hover:${themeClasses.text} transition-colors text-sm md:text-base cursor-pointer`}>Blog</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}