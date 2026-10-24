'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, PenSquare, User, LogOut, Search } from 'lucide-react';

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    router.push('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/articles?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E8E5DF]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-[#416B57] flex items-center justify-center text-white shadow-sm transition group-hover:scale-105">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-[#191919]">
            BlogSpace
          </span>
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex items-center relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-[#737373] absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-white border border-[#E8E5DF] rounded-full focus:outline-none focus:border-[#416B57] transition shadow-2xs"
          />
        </form>

        <nav className="flex items-center gap-3 md:gap-5">
          <Link href="/articles" className="text-sm font-medium text-[#737373] hover:text-[#191919] transition">
            Explore
          </Link>

          {currentUser ? (
            <>
              <Link
                href="/dashboard/new"
                className="flex items-center gap-1.5 text-sm font-medium bg-[#416B57] hover:bg-[#315441] text-white px-3.5 py-1.5 rounded-full transition shadow-xs"
              >
                <PenSquare className="w-4 h-4" />
                <span>Write</span>
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-1 text-sm font-medium text-[#191919] hover:text-[#416B57] transition"
              >
                <User className="w-4 h-4 text-[#737373]" />
                <span className="hidden sm:inline">{currentUser.name || currentUser.username}</span>
              </Link>
              <button
                onClick={handleLogout}
                title="Logout"
                className="text-[#737373] hover:text-red-600 transition p-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-[#737373] hover:text-[#191919] transition"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium bg-[#416B57] hover:bg-[#315441] text-white px-4 py-1.5 rounded-full transition shadow-xs"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
