'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ArticleCard from '../../components/ArticleCard';
import { fetchApi } from '../../lib/api';
import { Search, Filter, BookOpen } from 'lucide-react';

function ArticlesContent() {
  const searchParams = useSearchParams();
  const searchFromUrl = searchParams.get('search') || '';

  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState(searchFromUrl);
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetchApi('/categories');
        if (res?.categories) setCategories(res.categories);
      } catch (err) {
        console.error(err);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function fetchFilteredArticles() {
      setLoading(true);
      try {
        let endpoint = `/articles?sort=${sortBy}`;
        if (selectedCategory) endpoint += `&category=${encodeURIComponent(selectedCategory)}`;
        if (searchTerm) endpoint += `&search=${encodeURIComponent(searchTerm)}`;

        const res = await fetchApi(endpoint);
        if (res?.articles) setArticles(res.articles);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchFilteredArticles();
  }, [selectedCategory, searchTerm, sortBy]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#191919] mb-3">
          Explore Articles
        </h1>
        <p className="text-sm sm:text-base text-[#737373]">
          Curated long-form stories, engineering notes, and design essays from writers worldwide.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E8E5DF] rounded-2xl p-4 mb-8 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#737373] absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search topics or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-stone-50 border border-[#E8E5DF] rounded-xl focus:outline-none focus:border-[#416B57]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === ''
                ? 'bg-[#416B57] text-white'
                : 'bg-stone-100 text-[#737373] hover:bg-stone-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat.name
                  ? 'bg-[#416B57] text-white'
                  : 'bg-stone-100 text-[#737373] hover:bg-stone-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <span className="text-xs text-[#737373] font-medium">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-medium bg-stone-50 border border-[#E8E5DF] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#416B57]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="views">Most Viewed</option>
            <option value="likes">Most Liked</option>
          </select>
        </div>
      </div>

      {/* Grid of Articles */}
      {loading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white border border-[#E8E5DF] rounded-xl p-4 h-80 animate-pulse"></div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#E8E5DF] rounded-2xl">
          <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-[#191919]">No articles found</h3>
          <p className="text-sm text-[#737373] mt-1">Try searching for something else or clearing filters.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ArticlesPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-20 text-center text-sm text-[#737373]">Loading articles...</div>}>
      <ArticlesContent />
    </Suspense>
  );
}
