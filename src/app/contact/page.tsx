'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/themeContext';
import { useRouter } from 'next/navigation';

export default function ContactPage() {
  const { themeClasses } = useTheme();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);
  if (!hydrated) return null;

  return (
    <main className="
      fixed inset-0 z-50
      flex items-center justify-center
      overflow-auto
      px-4 sm:px-6 md:px-8 lg:px-12
      py-12 sm:py-16 md:py-20
      bg-black/50 dark:bg-black/40
      backdrop-blur-sm
    ">
      <div className={`
        relative w-full max-w-4xl max-h-[90vh] p-6 sm:p-8 md:p-12 rounded-3xl
        backdrop-blur-md border ${themeClasses.border} hover:${themeClasses.borderHover}
        transition-all duration-500
        ${themeClasses.cardBg}
        flex flex-col space-y-6
        overflow-y-auto
      `}>
        {/* Close Button */}
        <button
          onClick={() => router.back()}
          className="
            absolute top-4 right-4 sm:top-6 sm:right-6
            w-10 h-10 flex items-center justify-center
            rounded-xl
            bg-gradient-to-r from-blue-400 to-purple-400
            text-white text-lg font-bold
            shadow-lg
            hover:scale-105 hover:shadow-2xl
            transition-all duration-300
          "
          aria-label="Close Contact Page"
        >
          ✕
        </button>

        {/* Header */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
          <span className="text-1xl sm:text-1xl md:text-2xl lg:text-3xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
            Contact
          </span>
          <br />
          <span className={themeClasses.text}>David Emmanuel</span>
        </h1>

        {/* Bio + Hire Notice */}
        <div className="space-y-4 text-base sm:text-lg md:text-xl">
          <p className={themeClasses.textSecondary}>
            As a software engineer, I construct web interfaces and design systems with a strong focus on accessibility and performance. I enjoy building things from scratch and bringing ideas to life.
          </p>
          <div className="flex items-center gap-2 font-semibold text-green-400">
            <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
            Available for hire
          </div>
        </div>

        {/* Contact Form */}
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const name = (document.getElementById('name') as HTMLInputElement).value;
            const email = (document.getElementById('email') as HTMLInputElement).value;
            const message = (document.getElementById('message') as HTMLTextAreaElement).value;

            if ((window as any).emailjs) {
              (window as any).emailjs.send('service_id', 'template_id', {
                from_name: name,
                from_email: email,
                message: message,
              })
                .then(() => {
                  alert('Message sent successfully!');
                  (e.target as HTMLFormElement).reset();
                }).catch(() => {
                  alert('Failed to send message. Please try again later.');
                });
            } else {
              alert('Email service not loaded. Please try again.');
            }
          }}
        >
          <div className="flex flex-col">
            <label htmlFor="name" className={`mb-1 font-medium ${themeClasses.text}`}>Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className={`
                w-full px-4 py-2 rounded-lg border ${themeClasses.border} ${themeClasses.inputBg} ${themeClasses.text}
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition
              `}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className={`mb-1 font-medium ${themeClasses.text}`}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              inputMode="email"
              className={`
                w-full px-4 py-2 rounded-lg border ${themeClasses.border} ${themeClasses.inputBg} ${themeClasses.text}
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition
              `}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="message" className={`mb-1 font-medium ${themeClasses.text}`}>How can I help you?</label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className={`
                w-full px-4 py-2 rounded-lg border ${themeClasses.border} ${themeClasses.inputBg} ${themeClasses.text}
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition
              `}
            />
          </div>

          <button
            type="submit"
            className="
              w-full py-3 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 text-white font-semibold
              shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300
            "
          >
            Send Message
          </button>
        </form>
      </div>
    </main>
  );
}
