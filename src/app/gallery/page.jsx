'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function GalleryPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/charts');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-white">Redirecting...</p>
    </div>
  );
}
