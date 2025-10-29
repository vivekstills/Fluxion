
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, CalendarDays } from "lucide-react";
import { formatDistanceToNow, addHours } from 'date-fns';

type DailyRewardCardProps = {
  onClaim: () => void;
};

export function DailyRewardCard({ onClaim }: DailyRewardCardProps) {
  const [claimed, setClaimed] = useState(false);
  const [streak, setStreak] = useState(3);
  const [nextClaimTime, setNextClaimTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    // Initialize nextClaimTime on the client to avoid hydration mismatch
    setNextClaimTime(addHours(new Date(), 18));
  }, []);

  useEffect(() => {
    if (claimed && nextClaimTime) {
      const interval = setInterval(() => {
        const remaining = formatDistanceToNow(nextClaimTime);
        setTimeRemaining(remaining);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [claimed, nextClaimTime]);

  const handleClaim = () => {
    setClaimed(true);
    setStreak(prev => prev + 1);
    const nextTime = addHours(new Date(), 24);
    setNextClaimTime(nextTime);
    setTimeRemaining(formatDistanceToNow(nextTime));
    onClaim();
  };

  return (
    <Card className="w-full max-w-md bg-card/80 border-primary/30">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit">
          <Gift className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="font-headline text-2xl mt-2">Daily Login Reward</CardTitle>
        <CardDescription>Claim your daily reward to maintain your streak!</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <div className="flex items-center justify-center gap-2">
            <CalendarDays className="w-5 h-5 text-accent"/>
            <p className="text-lg">Current Streak: <span className="font-bold text-accent font-headline">{streak} days</span></p>
        </div>
        <p className="text-sm text-muted-foreground mt-2">Next reward: <span className="font-semibold text-foreground">100 $FLXN</span></p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button 
          onClick={handleClaim} 
          disabled={claimed || !nextClaimTime} 
          className="w-full font-headline text-lg py-6 bg-accent hover:bg-accent/80 text-accent-foreground disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
        >
          {claimed ? `Claimed!` : "Claim Reward"}
        </Button>
        {claimed && timeRemaining && (
          <p className="text-sm text-muted-foreground">
            Next claim in {timeRemaining}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
