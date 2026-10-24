'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '../../../lib/api';
import { Heart, Bookmark, Share2, Clock, Calendar, ArrowLeft, Send } from 'lucide-react';

export default function ArticleDetailPage() {
  const { slug } = useParams();

  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadArticle() {
      try {
        const res = await fetchApi(`/articles/${slug}`);
        if (res?.article) {
          setArticle(res.article);
          setLikesCount(res.article.likesCount || 0);

          // fetch comments
          const commentsRes = await fetchApi(`/articles/${res.article._id}/comments`);
          if (commentsRes?.comments) setComments(commentsRes.comments);

          // fetch like status if logged in
          const token = localStorage.getItem('token');
          if (token) {
            const statusRes = await fetchApi(`/articles/${res.article._id}/like-status`);
            if (statusRes?.success) {
              setLiked(statusRes.liked);
              setBookmarked(statusRes.bookmarked);
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) loadArticle();
  }, [slug]);

  const handleLike = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to like this article');
      return;
    }

    try {
      const method = liked ? 'DELETE' : 'PUT';
      const res = await fetchApi(`/articles/${article._id}/like`, { method });
      if (res?.success) {
        setLiked(res.liked);
        setLikesCount(res.likesCount);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookmark = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to bookmark this article');
      return;
    }

    try {
      const method = bookmarked ? 'DELETE' : 'PUT';
      const res = await fetchApi(`/articles/${article._id}/bookmark`, { method });
      if (res?.success) {
        setBookmarked(res.bookmarked);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to leave a comment');
      return;
    }

    setSubmittingComment(true);
    try {
      const res = await fetchApi(`/articles/${article._id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content: newComment.trim() })
      });

      if (res?.comment) {
        setComments([res.comment, ...comments]);
        setNewComment('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 animate-pulse">
        <div className="h-8 bg-stone-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-stone-200 rounded w-1/4 mb-8"></div>
        <div className="h-64 bg-stone-200 rounded-xl mb-8"></div>
        <div className="space-y-3">
          <div className="h-4 bg-stone-200 rounded w-full"></div>
          <div className="h-4 bg-stone-200 rounded w-5/6"></div>
          <div className="h-4 bg-stone-200 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#191919] mb-2">Article Not Found</h2>
        <p className="text-sm text-[#737373] mb-6">The article you are looking for might have been removed or unpublished.</p>
        <Link href="/articles" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#416B57]">
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <Link
        href="/articles"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#737373] hover:text-[#191919] mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Articles
      </Link>

      <header className="mb-8">
        <div className="inline-block bg-[#416B57]/10 text-[#416B57] text-xs font-semibold px-3 py-1 rounded-full mb-4">
          {article.category || 'General'}
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#191919] leading-tight mb-6">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[#E8E5DF]">
          <div className="flex items-center gap-3">
            <img
              src={article.author?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
              alt={article.author?.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-[#191919]">{article.author?.name}</p>
              <div className="flex items-center gap-3 text-xs text-[#737373]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readingTime || 3} min read
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                liked
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-[#E8E5DF] text-[#737373] hover:text-rose-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-rose-600' : ''}`} />
              <span>{likesCount}</span>
            </button>

            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full border transition ${
                bookmarked
                  ? 'bg-[#416B57]/10 border-[#416B57] text-[#416B57]'
                  : 'bg-white border-[#E8E5DF] text-[#737373] hover:text-[#191919]'
              }`}
              title="Bookmark"
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-[#416B57]' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white border border-[#E8E5DF] text-[#737373] hover:text-[#191919] transition relative"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
              {copied && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#191919] text-white text-[10px] px-2 py-0.5 rounded shadow">
                  Copied!
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      {article.coverImageUrl && (
        <div className="relative aspect-video rounded-2xl overflow-hidden mb-10 bg-stone-100 shadow-xs">
          <img
            src={article.coverImageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-stone max-w-none text-base sm:text-lg text-[#191919] leading-relaxed mb-12 whitespace-pre-wrap font-sans">
        {article.content}
      </div>

      {/* Author Bio Box */}
      {article.author?.bio && (
        <div className="bg-white border border-[#E8E5DF] rounded-2xl p-6 mb-12 flex gap-4 items-center">
          <img
            src={article.author.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
            alt={article.author.name}
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <h4 className="font-serif font-bold text-[#191919] text-base">Written by {article.author.name}</h4>
            <p className="text-xs sm:text-sm text-[#737373] mt-1">{article.author.bio}</p>
          </div>
        </div>
      )}

      {/* Comments Section */}
      <section className="pt-8 border-t border-[#E8E5DF]">
        <h3 className="font-serif text-2xl font-bold text-[#191919] mb-6">
          Discussion ({comments.length})
        </h3>

        {/* Comment Form */}
        <form onSubmit={handleAddComment} className="mb-8">
          <textarea
            rows="3"
            placeholder="Share your thoughts on this story..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-3.5 text-sm bg-white border border-[#E8E5DF] rounded-xl focus:outline-none focus:border-[#416B57] transition shadow-xs"
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={submittingComment || !newComment.trim()}
              className="inline-flex items-center gap-1.5 bg-[#416B57] hover:bg-[#315441] text-white px-4 py-2 rounded-lg text-xs font-semibold transition disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {submittingComment ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-sm text-[#737373] italic">No comments yet. Be the first to start the conversation.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="bg-white border border-[#E8E5DF] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={comment.author?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={comment.author?.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-xs font-semibold text-[#191919]">{comment.author?.name || 'Reader'}</span>
                  </div>
                  <span className="text-[11px] text-[#737373]">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-[#191919] leading-relaxed pl-8">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </article>
  );
}
