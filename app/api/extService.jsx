'use client';

import { useEffect, useState } from 'react';
/*outdated but works*/
export function ApiClient({ url, method = 'GET', body, token, autoFetch, label, onResult }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  async function run() {
    setError(null);
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    if (method === 'POST') headers['Content-Type'] = 'application/json';

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: method === 'POST' ? JSON.stringify(body ?? {}) : undefined,
        cache: 'no-store',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const json = text ? JSON.parse(text) : null;
      setData(json);
      onResult?.(json);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    if (autoFetch && method === 'GET') run();
  }, [url, method, token, autoFetch]);

  return (
    <div className='hidden-response-json'>
      {!autoFetch && (
        <button type="button" onClick={run}>
          {label || method}
        </button>
      )}
      {error && <p>{error}</p>}
      {data !== null && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}

export async function PUT({ url, body, token }) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body ?? {}),
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
export async function GET({ url, token }) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    method: 'GET',
    headers,
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}