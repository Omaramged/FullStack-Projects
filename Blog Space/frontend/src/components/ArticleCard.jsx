import Link from 'next/link';
import { Clock, Eye, Heart } from 'lucide-react';

export default function ArticleCard({ article }) {
  if (!article) return null;

  return (
    <article className="group bg-white border border-[#E8E5DF] rounded-xl overflow-hidden hover:shadow-md transition duration-200 flex flex-col h-full">
      <Link href={`/articles/${article.slug}`} className="block relative aspect-video overflow-hidden bg-stone-100">
        <img
          src={article.coverImageUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#416B57] text-xs font-semibold px-2.5 py-1 rounded-full border border-[#E8E5DF]">
          {article.category || 'General'}
        </span>
      </Link>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/articles/${article.slug}`}>
            <h3 className="font-serif text-xl font-bold text-[#191919] group-hover:text-[#416B57] transition leading-snug line-clamp-2 mb-2">
              {article.title}
            </h3>
          </Link>
          <p className="text-sm text-[#737373] line-clamp-2 leading-relaxed mb-4">
            {article.excerpt}
          </p>
        </div>

        <div className="pt-4 border-t border-[#E8E5DF]/60 flex items-center justify-between text-xs text-[#737373]">
          <div className="flex items-center gap-2">
            <img
              src={article.author?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt={article.author?.name || 'Author'}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="font-medium text-[#191919]">{article.author?.name || 'Author'}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readingTime || 3} min
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              {article.likesCount || 0}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
