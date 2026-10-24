'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchApi } from '../../lib/api';
import { BookOpen } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, username, email, password })
      });

      if (!res.success) {
        setError(res.message || 'Registration failed');
        setLoading(false);
        return;
      }

      if (res.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
      }

      router.push('/dashboard');
    } catch (err) {
      setError('An unexpected network error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-[#E8E5DF] rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#416B57] flex items-center justify-center text-white mx-auto mb-3 shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#191919]">Join BlogSpace</h1>
          <p className="text-sm text-[#737373] mt-1">Start sharing your thoughts and articles</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#191919] uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Elena Vance"
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-[#E8E5DF] rounded-lg focus:outline-none focus:border-[#416B57] focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#191919] uppercase tracking-wider mb-1.5">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="elenavance"
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-[#E8E5DF] rounded-lg focus:outline-none focus:border-[#416B57] focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#191919] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="elena@example.com"
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-[#E8E5DF] rounded-lg focus:outline-none focus:border-[#416B57] focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#191919] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-[#E8E5DF] rounded-lg focus:outline-none focus:border-[#416B57] focus:bg-white transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#416B57] hover:bg-[#315441] text-white font-medium rounded-lg text-sm transition shadow-xs disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-xs text-[#737373] mt-6">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-[#416B57] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
