import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#E8E5DF] bg-white py-12 mt-20">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-[#416B57] flex items-center justify-center text-white">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-[#191919] text-lg">BlogSpace</span>
        </div>
        <p className="text-xs text-[#737373]">
          &copy; {new Date().getFullYear()} BlogSpace. An editorial full-stack blogging platform.
        </p>
        <div className="flex gap-6 text-sm text-[#737373]">
          <Link href="/articles" className="hover:text-[#191919] transition">Articles</Link>
          <Link href="/login" className="hover:text-[#191919] transition">Sign In</Link>
          <Link href="/register" className="hover:text-[#191919] transition">Register</Link>
        </div>
      </div>
    </footer>
  );
}
