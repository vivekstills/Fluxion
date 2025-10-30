'use client';

import { useParams } from 'next/navigation';
import { BattleArena } from '@/components/duel/battle-arena';
import { DuelProvider } from '@/components/duel/duel-provider';

export default function BattlePage() {
  const { duelId } = useParams();

  if (!duelId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full">
      <DuelProvider duelId={duelId as string}>
        <BattleArena />
      </DuelProvider>
    </div>
  );
}
