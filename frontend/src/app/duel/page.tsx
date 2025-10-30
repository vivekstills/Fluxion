'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { v4 as uuidv4 } from 'uuid';

export default function DuelLobbyPage() {
  const router = useRouter();

  const handleFindDuel = () => {
    const duelId = uuidv4();
    router.push(`/battle/${duelId}`);
  };

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Duel Lobby</CardTitle>
          <CardDescription>Find your next opponent and enter the arena.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="text-center">
            <p className="text-lg font-bold">Your Trader Stats</p>
            <p>XP: 1200</p>
            <p>Level: 12</p>
            <p>Risk Appetite: High</p>
          </div>
          <Button onClick={handleFindDuel} className="w-full font-headline text-lg">Find Duel</Button>
        </CardContent>
      </Card>
    </div>
  );
}
