'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MessagePage() {
  const router = useRouter();
  useEffect(() => { router.push('/dr-ram'); }, [router]);
  return <div className="flex items-center justify-center min-h-screen"><p className="text-white">Redirecting...</p></div>;
}
