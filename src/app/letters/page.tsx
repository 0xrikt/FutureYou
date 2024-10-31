// src/app/letters/page.tsx
'use client';

import LetterDisplay from '@/components/LetterDisplay';
import { Footer } from '@/components/ui/Footer';

export default function LettersPage() {
  return (
    <>
      <main className="min-h-[calc(100vh-200px)]">
        <LetterDisplay />
      </main>
      <Footer />
    </>
  );
}