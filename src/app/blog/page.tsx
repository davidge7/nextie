'use client';

import { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/themeContext';
import { useRouter } from 'next/navigation';

export default function BlogPage() {
  const router = useRouter();
  const { themeClasses } = useTheme();

  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      const username = 'david_emmanuelg';
      const apiUrl = `https://dev.to/api/articles?username=${username}&per_page=6`;
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('Failed to fetch articles');
        const data = await res.json();
        setArticles(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) {
    return (
      <main className={`flex min-h-screen flex-col items-center justify-center p-24 ${themeClasses.background}`}>
        <p className={themeClasses.textSecondary}>Loading articles...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className={`flex min-h-screen flex-col items-center justify-center p-24 ${themeClasses.background}`}>
        <p className="text-red-500">Error: {error}</p>
      </main>
    );
  }

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
      {/* Content Card */}
      <div
        className={`
          relative
          w-full max-w-5xl p-6 sm:p-8 md:p-12 rounded-3xl
          backdrop-blur-md border ${themeClasses.border} hover:${themeClasses.borderHover}
          transition-all duration-500
          ${themeClasses.cardBg}
          flex flex-col
        `}
      >
        {/* Close Button inside card */}
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
          aria-label="Close Blog Page"
        >
          ✕
        </button>

        <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight`}>
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
            Blog
          </span>
          <br />
          <span className={themeClasses.text}>Insights</span>
        </h1>

        <p className={`text-base sm:text-lg md:text-xl lg:text-2xl ${themeClasses.textSecondary} mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed`}>
          Stay updated with our latest thoughts on AI, development, and the future of technology.
        </p>

        {articles.length > 0 ? (
          <Carousel
            showArrows
            infiniteLoop
            showThumbs={false}
            showStatus={false}
            autoPlay
            interval={5000}
            stopOnHover
            className="carousel-container"
            renderArrowPrev={(onClickHandler, hasPrev, label) =>
              hasPrev && (
                <button
                  type="button"
                  onClick={onClickHandler}
                  title={label}
                  className="absolute left-0 top-1/2 z-10 p-3 -translate-y-1/2 bg-gray-800/50 hover:bg-gray-800 rounded-full ml-2 hidden md:block transition-all"
                >
                  <ArrowRight className="w-6 h-6 text-white rotate-180" />
                </button>
              )
            }
            renderArrowNext={(onClickHandler, hasNext, label) =>
              hasNext && (
                <button
                  type="button"
                  onClick={onClickHandler}
                  title={label}
                  className="absolute right-0 top-1/2 z-10 p-3 -translate-y-1/2 bg-gray-800/50 hover:bg-gray-800 rounded-full mr-2 hidden md:block transition-all"
                >
                  <ArrowRight className="w-6 h-6 text-white" />
                </button>
              )
            }
            renderIndicator={(onClickHandler, isSelected, index, label) => (
              <li
                className={`inline-block w-2.5 h-2.5 mx-1 rounded-full cursor-pointer transition-colors duration-300 ${
                  isSelected ? 'bg-blue-400' : 'bg-gray-400 hover:bg-gray-300'
                }`}
                onClick={onClickHandler}
                onKeyDown={onClickHandler}
                value={index}
                key={index}
                role="button"
                tabIndex={0}
                aria-label={`${label} ${index + 1}`}
              />
            )}
          >
            {articles.map((article, index) => (
              <div
                key={article.id}
                className={`
                  group relative p-6 md:p-8 rounded-2xl backdrop-blur-sm border ${themeClasses.border} hover:${themeClasses.borderHover}
                  transition-all duration-500 hover:scale-105 hover:shadow-2xl ${index % 2 === 0 ? 'hover:shadow-blue-500/25' : 'hover:shadow-purple-500/25'}
                `}
                style={{ background: themeClasses.cardBg }}
              >
                {article.cover_image && (
                  <img
                    src={article.cover_image}
                    alt={article.title}
                    className="w-full h-48 object-cover rounded-xl mb-6 shadow-md transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                )}
                <h2 className={`text-2xl font-bold mb-3 ${themeClasses.text} group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300`}>
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {article.title}
                  </a>
                </h2>
                <p className={`${themeClasses.textMuted} mb-4 leading-relaxed line-clamp-3 text-base`}>
                  {article.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className={themeClasses.textSecondary}>
                    {new Date(article.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors group-hover:translate-x-2 duration-300 cursor-pointer"
                  >
                    Read More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </Carousel>
        ) : (
          <p className={`mt-8 ${themeClasses.textSecondary}`}>No articles found.</p>
        )}
      </div>
    </main>
  );
}
