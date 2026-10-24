'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchApi } from '../../lib/api';
import { PenSquare, FileText, Eye, Heart, Trash2, Edit3, Bookmark, UserCheck } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [articles, setArticles] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [activeTab, setActiveTab] = useState('articles');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    async function loadDashboardData() {
      try {
        const [statsRes, articlesRes, bookmarksRes] = await Promise.all([
          fetchApi('/users/me/stats'),
          fetchApi('/articles/me'),
          fetchApi('/users/me/bookmarks')
        ]);

        if (statsRes?.stats) setStats(statsRes.stats);
        if (articlesRes?.articles) setArticles(articlesRes.articles);
        if (bookmarksRes?.articles) setBookmarks(bookmarksRes.articles);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [router]);

  const handleDeleteArticle = async (id) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const res = await fetchApi(`/articles/${id}`, { method: 'DELETE' });
      if (res?.success) {
        setArticles(articles.filter((a) => a._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 bg-stone-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-stone-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#191919]">Creator Dashboard</h1>
          <p className="text-sm text-[#737373] mt-1">Manage your publications and reading list</p>
        </div>
        <Link
          href="/dashboard/new"
          className="inline-flex items-center gap-1.5 bg-[#416B57] hover:bg-[#315441] text-white px-4 py-2.5 rounded-full text-sm font-semibold transition shadow-xs"
        >
          <PenSquare className="w-4 h-4" /> New Article
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white border border-[#E8E5DF] p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#737373] mb-1">
            <FileText className="w-4 h-4 text-[#416B57]" /> Published
          </div>
          <p className="text-2xl font-serif font-bold text-[#191919]">{stats?.publishedCount || 0}</p>
        </div>

        <div className="bg-white border border-[#E8E5DF] p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#737373] mb-1">
            <PenSquare className="w-4 h-4 text-amber-600" /> Drafts
          </div>
          <p className="text-2xl font-serif font-bold text-[#191919]">{stats?.draftCount || 0}</p>
        </div>

        <div className="bg-white border border-[#E8E5DF] p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#737373] mb-1">
            <Eye className="w-4 h-4 text-blue-600" /> Total Views
          </div>
          <p className="text-2xl font-serif font-bold text-[#191919]">{stats?.totalViews || 0}</p>
        </div>

        <div className="bg-white border border-[#E8E5DF] p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#737373] mb-1">
            <Heart className="w-4 h-4 text-rose-500" /> Total Likes
          </div>
          <p className="text-2xl font-serif font-bold text-[#191919]">{stats?.totalLikes || 0}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-[#E8E5DF] mb-6">
        <button
          onClick={() => setActiveTab('articles')}
          className={`pb-3 text-sm font-semibold transition border-b-2 ${
            activeTab === 'articles'
              ? 'border-[#416B57] text-[#416B57]'
              : 'border-transparent text-[#737373] hover:text-[#191919]'
          }`}
        >
          My Articles ({articles.length})
        </button>
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`pb-3 text-sm font-semibold transition border-b-2 ${
            activeTab === 'bookmarks'
              ? 'border-[#416B57] text-[#416B57]'
              : 'border-transparent text-[#737373] hover:text-[#191919]'
          }`}
        >
          Reading List / Bookmarks ({bookmarks.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'articles' ? (
        articles.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[#E8E5DF] rounded-2xl">
            <FileText className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h3 className="font-serif text-base font-bold text-[#191919]">No articles yet</h3>
            <p className="text-xs text-[#737373] mt-1 mb-4">You haven't written any drafts or stories yet.</p>
            <Link
              href="/dashboard/new"
              className="inline-block bg-[#416B57] text-white text-xs px-4 py-2 rounded-full"
            >
              Write your first story
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-[#E8E5DF] rounded-2xl overflow-hidden divide-y divide-[#E8E5DF]">
            {articles.map((item) => (
              <div key={item._id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        item.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="text-xs text-[#737373]">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Link href={`/articles/${item.slug}`}>
                    <h3 className="font-serif font-bold text-[#191919] hover:text-[#416B57] transition text-base sm:text-lg">
                      {item.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-4 text-xs text-[#737373] mt-2">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> {item.views || 0} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5" /> {item.likesCount || 0} likes
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Link
                    href={`/articles/${item.slug}`}
                    className="p-2 text-xs font-medium text-[#737373] hover:text-[#191919] border border-[#E8E5DF] rounded-lg transition"
                    title="View Public"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDeleteArticle(item._id)}
                    className="p-2 text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        bookmarks.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[#E8E5DF] rounded-2xl">
            <Bookmark className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h3 className="font-serif text-base font-bold text-[#191919]">No bookmarks saved</h3>
            <p className="text-xs text-[#737373] mt-1">Bookmark articles to build your personal reading list.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {bookmarks.map((bm) => (
              <div key={bm._id} className="bg-white border border-[#E8E5DF] rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#416B57] uppercase tracking-wider">{bm.category}</span>
                  <Link href={`/articles/${bm.slug}`}>
                    <h4 className="font-serif font-bold text-base text-[#191919] hover:text-[#416B57] mt-1 mb-2 line-clamp-2">
                      {bm.title}
                    </h4>
                  </Link>
                  <p className="text-xs text-[#737373] line-clamp-2">{bm.excerpt}</p>
                </div>
                <div className="pt-4 border-t border-[#E8E5DF] mt-4 flex items-center justify-between text-xs text-[#737373]">
                  <span>{bm.author?.name}</span>
                  <Link href={`/articles/${bm.slug}`} className="text-[#416B57] font-semibold">Read</Link>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
