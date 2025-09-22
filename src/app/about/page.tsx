'use client';

import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/themeContext";
import { useRouter } from "next/navigation";

const skills = [
  { name: "JavaScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "Typescript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "Core Java", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  { name: "HTML", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "CSS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  { name: "Bootstrap", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" },
  { name: "Angular", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" },
  { name: "React.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Next.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "Express.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
  { name: "Spring Boot", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" },
  { name: "MongoDB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  { name: "PostgreSQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  { name: "MySQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  { name: "Microservices", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { name: "RESTful API", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg" },
  { name: "Git", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { name: "GitHub", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
  { name: "Docker", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { name: "AWS", logo: "https://github.com/devicons/devicon/raw/v2.16.0/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
  { name: "Unit Testing", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg" },
  { name: "OAuth", logo: "https://img.icons8.com/ios-filled/50/lock-2.png" },
  { name: "JWT", logo: "https://img.icons8.com/ios-filled/50/key-security.png" },
];

export default function AboutPage() {
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
        relative w-full max-w-4xl p-6 sm:p-8 md:p-12 rounded-3xl
        backdrop-blur-md border ${themeClasses.border} hover:${themeClasses.borderHover}
        transition-all duration-500
        ${themeClasses.cardBg}
        flex flex-col
        max-h-[90vh] overflow-y-auto
        scrollbar-none
      `}>
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
          aria-label="Close About Page"
        >
          ✕
        </button>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
          <span className="text-1xl sm:text-1xl md:text-2xl lg:text-3xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
            About
          </span>
          <br />
          <span className={themeClasses.text}>
            David Emmanuel
          </span>
        </h1>

        <p className={`text-base sm:text-lg md:text-xl lg:text-2xl ${themeClasses.textSecondary} mb-6 md:mb-8 leading-relaxed`}>
          I&apos;m a senior developer and creative technologist with over 3 years of experience building scalable, user-centric web applications and digital experiences. My work blends technical precision with design-driven thinking, specializing in modern frameworks like Next.js, React, and Tailwind CSS.
        </p>

        <div className="flex flex-col space-y-3 text-left text-sm sm:text-base md:text-lg mb-6">
          <p className={themeClasses.textSecondary}>
            I’m the creator of Nextie, an AI-powered developer suite built on Next.js 14, designed to streamline workflows and empower creators.
          </p>
          <p className={themeClasses.textSecondary}>
            I also architect multi-platform streaming setups using OBS, crafting custom overlays with advanced HTML/CSS and intuitive UI/UX.
          </p>
          <p className={themeClasses.textSecondary}>
            I thrive on solving complex problems, mentoring teams, and sharing knowledge through blogs and live streams.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-gradient bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            🛠 Areas of Expertise
          </h2>
          <ul className={`list-disc list-inside ${themeClasses.textSecondary} text-sm sm:text-base md:text-lg space-y-1`}>
            <li>Full-stack development with JavaScript, TypeScript, Node.js, and RESTful APIs</li>
            <li>Frontend engineering with React, Next.js, Tailwind, and responsive design</li>
            <li>Streaming and media tech, including OBS automation and multi-camera workflows</li>
            <li>Technical writing, SEO optimization, and developer education</li>
          </ul>
        </div>

        {/* Skills Section */}
        <div className="mt-4">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gradient bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            🧰 Toolkit
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {skills.map((skill, index) => (
              <div key={index} className="relative group">
                <img
                  src={skill.logo}
                  alt={skill.name}
                  title={skill.name}
                  className="w-12 h-12 sm:w-14 sm:h-14 object-contain transition-transform duration-300 group-hover:scale-110"
                />
                <span className="
                  absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
                  px-2 py-1 rounded bg-black text-white text-xs opacity-0 group-hover:opacity-100
                  transition-opacity duration-300 whitespace-nowrap z-10
                ">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
