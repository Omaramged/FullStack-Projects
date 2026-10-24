'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '../../../lib/api';
import { ArrowLeft, Save, Send } from 'lucide-react';

export default function NewArticlePage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technology');
  const [excerpt, setExcerpt] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSave = async (statusToSet) => {
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetchApi('/articles', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          category,
          excerpt: excerpt.trim(),
          coverImageUrl: coverImageUrl.trim(),
          content: content.trim(),
          status: statusToSet
        })
      });

      if (!res.success) {
        setError(res.message || 'Failed to create article');
        setLoading(false);
        return;
      }

      router.push(`/articles/${res.article.slug}`);
    } catch (err) {
      setError('An unexpected network error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#737373] hover:text-[#191919] transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSave('draft')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-white border border-[#E8E5DF] hover:bg-stone-50 text-[#191919] rounded-full transition disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" /> Save Draft
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSave('published')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#416B57] hover:bg-[#315441] text-white rounded-full transition shadow-xs disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" /> Publish Now
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white border border-[#E8E5DF] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div>
          <label className="block text-xs font-semibold text-[#737373] uppercase tracking-wider mb-2">
            Article Title
          </label>
          <input
            type="text"
            placeholder="An insightful headline..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full font-serif text-2xl sm:text-3xl font-bold text-[#191919] placeholder:text-stone-300 border-b border-[#E8E5DF] pb-2 focus:outline-none focus:border-[#416B57]"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#737373] uppercase tracking-wider mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-sm bg-stone-50 border border-[#E8E5DF] rounded-lg p-2.5 focus:outline-none focus:border-[#416B57]"
            >
              <option value="Technology">Technology</option>
              <option value="Design">Design</option>
              <option value="Engineering">Engineering</option>
              <option value="Productivity">Productivity</option>
              <option value="Culture">Culture</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#737373] uppercase tracking-wider mb-2">
              Cover Image URL
            </label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              className="w-full text-sm bg-stone-50 border border-[#E8E5DF] rounded-lg p-2.5 focus:outline-none focus:border-[#416B57]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#737373] uppercase tracking-wider mb-2">
            Short Summary / Excerpt
          </label>
          <input
            type="text"
            placeholder="A one-sentence summary to entice readers..."
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full text-sm bg-stone-50 border border-[#E8E5DF] rounded-lg p-2.5 focus:outline-none focus:border-[#416B57]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#737373] uppercase tracking-wider mb-2">
            Story Content (Markdown supported)
          </label>
          <textarea
            rows="12"
            placeholder="Tell your story. Format with Markdown (# Heading, - list, **bold**)..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full text-sm font-sans leading-relaxed bg-stone-50 border border-[#E8E5DF] rounded-xl p-4 focus:outline-none focus:border-[#416B57] focus:bg-white transition"
          />
        </div>
      </div>
    </div>
  );
}
