'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ArticleCard from '../components/ArticleCard';
import { fetchApi } from '../lib/api';
import { ArrowRight, Sparkles, TrendingUp, BookMarked } from 'lucide-react';

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [articlesRes, featuredRes] = await Promise.all([
          fetchApi('/articles'),
          fetchApi('/articles/featured')
        ]);

        if (articlesRes?.articles) setArticles(articlesRes.articles);
        if (featuredRes?.articles) setFeatured(featuredRes.articles);
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const heroArticle = featured[0] || articles[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      {/* Editorial Hero */}
      <section className="mb-16 border-b border-[#E8E5DF] pb-14">
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#416B57]/10 text-[#416B57] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Independent Editorial Platform
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#191919] leading-[1.15] mb-6">
            Where ideas find clarity, depth, and thoughtful readers.
          </h1>
          <p className="text-lg md:text-xl text-[#737373] leading-relaxed mb-8">
            BlogSpace is a minimalist sanctuary for writers and thinkers. Explore long-form articles, engineering notes, and design reflections.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 bg-[#416B57] hover:bg-[#315441] text-white font-medium px-6 py-3 rounded-full transition shadow-sm"
            >
              Start Reading <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard/new"
              className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-[#191919] border border-[#E8E5DF] font-medium px-6 py-3 rounded-full transition"
            >
              Write an Article
            </Link>
          </div>
        </div>

        {/* Featured Banner Card */}
        {heroArticle && (
          <div className="bg-white border border-[#E8E5DF] rounded-2xl overflow-hidden shadow-sm grid md:grid-cols-2">
            <div className="relative aspect-16/10 md:aspect-auto">
              <img
                src={heroArticle.coverImageUrl}
                alt={heroArticle.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs text-[#416B57] text-xs font-semibold px-3 py-1 rounded-full border border-[#E8E5DF]">
                Featured Story
              </span>
            </div>
            <div className="p-8 md:p-10 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-[#416B57] mb-2 block">
                  {heroArticle.category}
                </span>
                <Link href={`/articles/${heroArticle.slug}`}>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#191919] hover:text-[#416B57] transition leading-snug mb-4">
                    {heroArticle.title}
                  </h2>
                </Link>
                <p className="text-[#737373] leading-relaxed line-clamp-3 mb-6">
                  {heroArticle.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-[#E8E5DF]">
                <div className="flex items-center gap-3">
                  <img
                    src={heroArticle.author?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={heroArticle.author?.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#191919]">{heroArticle.author?.name}</p>
                    <p className="text-xs text-[#737373]">{heroArticle.readingTime || 3} min read</p>
                  </div>
                </div>
                <Link
                  href={`/articles/${heroArticle.slug}`}
                  className="text-sm font-semibold text-[#416B57] hover:text-[#315441] inline-flex items-center gap-1"
                >
                  Read Story <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Latest Articles Feed */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#191919]">
              Latest Publications
            </h2>
            <p className="text-sm text-[#737373] mt-1">Fresh perspectives from our community</p>
          </div>
          <Link
            href="/articles"
            className="text-sm font-semibold text-[#416B57] hover:underline inline-flex items-center gap-1"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white border border-[#E8E5DF] rounded-xl p-4 h-80 animate-pulse flex flex-col justify-between">
                <div className="w-full h-40 bg-stone-200 rounded-lg"></div>
                <div className="h-5 bg-stone-200 rounded w-3/4 mt-4"></div>
                <div className="h-4 bg-stone-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[#E8E5DF] rounded-xl">
            <BookMarked className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-[#191919]">No articles yet</h3>
            <p className="text-sm text-[#737373] mt-1 mb-4">Be the first to share an editorial story.</p>
            <Link
              href="/dashboard/new"
              className="inline-block bg-[#416B57] text-white text-sm px-4 py-2 rounded-full"
            >
              Write Now
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
