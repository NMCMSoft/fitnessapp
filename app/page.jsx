import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { LoginForm } from './components/loginform';
import { LogoutButton } from './components/logoutbtn';
import Content from './templates/content';
import Header from './templates/header';
function parseJwtPayload(token) {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    return JSON.parse(Buffer.from(padded, 'base64').toString('utf8'));
  } catch {
    return null;
  }
}

async function SessionView() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get('fitness_jwt')?.value ?? null;

  if (!jwt) {
    return <LoginForm />;
  }

  const payload = parseJwtPayload(jwt);

  return (
    <>
    <Header/>
    <Content payload={payload}/>
    </>
  );
}

export default function HomePage() {
  return (
    <div className="mx-auto max-w-2xl p-8">
      <Suspense fallback={<p className="text-sm text-gray-500">Checking session...</p>}>
        <SessionView />
      </Suspense>
    </div>
  );
}