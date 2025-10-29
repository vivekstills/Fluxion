'use client';
import { useState } from 'react';
import { DailyRewardCard } from '@/components/daily-reward-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function RewardsPage() {
  const [claimed, setClaimed] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-4 sm:p-6 md:p-8">
      {claimed ? (
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto bg-green-500/20 p-3 rounded-full w-fit">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <CardTitle className="font-headline text-2xl mt-2">Reward Claimed!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Your reward has been added to your account. Come back tomorrow for another!</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight text-center">
              Claim Your Rewards
            </h1>
            <p className="text-muted-foreground text-center">
              Don't miss out on daily bonuses and streak rewards.
            </p>
          </div>
          <DailyRewardCard onClaim={() => setClaimed(true)} />
        </>
      )}
    </div>
  );
}
