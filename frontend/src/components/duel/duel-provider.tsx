'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useDoc } from '@/firebase/firestore/use-doc';

interface DuelState {
  duel: any; // Replace with actual duel type
  duelPath: any; // Replace with actual duel path type
  tickIndex: number;
  timeLeft: number;
}

const DuelContext = createContext<DuelState | undefined>(undefined);

export function DuelProvider({ duelId, children }: { duelId: string; children: ReactNode }) {
  const { data: duel } = useDoc(`duels/${duelId}`);
  const { data: duelPath } = useDoc(`duelPaths/${duelId}`);
  const [timeLeft, setTimeLeft] = useState(60);
  const [tickIndex, setTickIndex] = useState(0);

  useEffect(() => {
    if (duel?.status === 'Running') {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            return 0;
          }
          const elapsedTime = 60 - prevTime;
          const simDays = 2; // As per the prompt
          const durationSec = 60;
          const newTickIndex = Math.floor((elapsedTime * (simDays * 1440)) / durationSec);
          setTickIndex(newTickIndex);
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [duel]);

  const value = { duel, duelPath, tickIndex, timeLeft };

  return <DuelContext.Provider value={value}>{children}</DuelContext.Provider>;
}

export function useDuel() {
  const context = useContext(DuelContext);
  if (context === undefined) {
    throw new Error('useDuel must be used within a DuelProvider');
  }
  return context;
}
