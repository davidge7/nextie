'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/themeContext';
import { useRouter } from 'next/navigation';

export default function ContactPage() {
  const { themeClasses } = useTheme();
  const router = useRouter();

  // Ensure hydration before using client-only theme values
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  if (!hydrated) return null; // or a skeleton/loading placeholder

  return (
    <main
      className={`
        fixed inset-0 z-50
        flex items-center justify-center
        overflow-auto
        px-4 sm:px-6 md:px-8 lg:px-12
        py-12 sm:py-16 md:py-20
        bg-black/50 dark:bg-black/40
        backdrop-blur-sm
      `}
    >
      <div
        className={`
          relative
          w-full max-w-4xl p-6 sm:p-8 md:p-12 rounded-3xl
          backdrop-blur-md border ${themeClasses.border} hover:${themeClasses.borderHover}
          transition-all duration-500
          ${themeClasses.cardBg}
          flex flex-col
        `}
      >
        <button
          onClick={() => router.back()}
          className={`
            absolute top-4 right-4 sm:top-6 sm:right-6
            w-10 h-10 flex items-center justify-center
            rounded-xl
            bg-gradient-to-r from-blue-400 to-purple-400
            text-white text-lg font-bold
            shadow-lg
            hover:scale-105 hover:shadow-2xl
            transition-all duration-300
          `}
          aria-label="Close Contact Page"
        >
          ✕
        </button>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
            Contact
          </span>
          <br />
          <span className={themeClasses.text}>Nextie</span>
        </h1>

        <p className={`text-base sm:text-lg md:text-xl lg:text-2xl ${themeClasses.textSecondary} mb-6 md:mb-8 leading-relaxed`}>
          Get in touch with us! We’d love to hear your thoughts, feedback, or any questions you may have.
        </p>

        <div className="flex flex-col space-y-4 text-left text-sm sm:text-base md:text-lg">
          <p className={themeClasses.textMuted}>
            Email: <a href="mailto:hello@nextie.com" className="text-blue-400 hover:underline">hello@nextie.com</a>
          </p>
          <p className={themeClasses.textMuted}>
            Phone: <a href="tel:+1234567890" className="text-blue-400 hover:underline">+1 234 567 890</a>
          </p>
        </div>
      </div>
    </main>
  );
}
