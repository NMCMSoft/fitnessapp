'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export function LogoutButton() {
  const router = useRouter();
  async function handleLogout() {
    await fetch('/api/auth/session', { method: 'DELETE' });
    router.refresh();
  }

  useEffect(() => {
    document.title="Fitness App";
  }, []);
  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded border px-3 py-1 text-sm"
    >
      Log out
    </button>
  );
}