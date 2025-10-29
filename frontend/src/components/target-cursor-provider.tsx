'use client';

import dynamic from 'next/dynamic';

const TargetCursor = dynamic(() => import('@/components/target-cursor'), {
  ssr: false,
});

export function TargetCursorProvider() {
  return <TargetCursor />;
}
