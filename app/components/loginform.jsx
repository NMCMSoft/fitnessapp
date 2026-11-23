'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
const LOGIN_URL = 'https://assignment2.swafe.dk/api/Users/login';

export function LoginForm({ onSuccess }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || `Login failed (${res.status})`);
      }

      const data = await res.json();
      const jwt = data?.jwt ?? null;

      if (!jwt) {
        throw new Error('Response did not include a jwt.');
      }
      const cacheRes = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jwt }),
      });

      if (!cacheRes.ok) {
        throw new Error('Failed to cache session token.');
      }

      setPassword('');
      if (typeof onSuccess === 'function') {
        onSuccess(jwt);
      }

      // Re-run Server Component check in page.jsx
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected login error');
    } finally {
      setLoading(false);
    }
  }

  return (<>
    <div className="loginform">
      <div>
        <h1>Please Log in to continue.</h1>
        <br/>
        <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-3 rounded border p-6">
          <label className="flex flex-col gap-1 text-sm">
            <span>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded border px-3 py-2"
            />
          </label>
          <br/><br/>
          <label className="flex flex-col gap-1 text-sm">
            <span>Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded border px-3 py-2"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <br/><br/>
          <button
            type="submit"
            disabled={loading} id='login-btn'
            className="mt-2 rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  </>
  );
}