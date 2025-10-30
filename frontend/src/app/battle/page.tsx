'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FaultyTerminal from '@/components/faulty-terminal';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot } from 'lucide-react';
import { simulateBattle } from '@/services/backend-service';
import { traders } from '@/lib/mock-data';

const StockChart = dynamic(() => import('@/components/stock-chart'), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[300px]" />,
});

const timeFrames = ['+5min', '+10min', '+15min', '+30min', '+60min'];

export default function BattlePage() {
  const [simulationResult, setSimulationResult] = useState(null);

  const handleSimulate = async () => {
    try {
      const result = await simulateBattle(traders[0], traders[1]);
      setSimulationResult(result);
    } catch (error) {
      console.error('Failed to simulate battle:', error);
    }
  };
  return (
    <div className="relative flex flex-col h-full w-full items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <FaultyTerminal
          scale={1.5}
          gridMul={[2, 1]}
          digitSize={1.2}
          timeScale={0.3}
          scanlineIntensity={0.1}
          glitchAmount={0.3}
          flickerAmount={0.2}
          noiseAmp={0.05}
          chromaticAberration={0.02}
          curvature={0.1}
          tint="#8A2BE2"
          brightness={0.8}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="z-10 w-full h-full max-w-7xl mx-auto flex flex-col">
        <Tabs defaultValue="ai-battle" className="w-full flex flex-col flex-grow">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-card/60 backdrop-blur-sm border-primary/20">
            <TabsTrigger value="ai-battle" className="font-headline">AI Battle</TabsTrigger>
            <TabsTrigger value="market-prediction" className="font-headline">Market Prediction</TabsTrigger>
          </TabsList>
          <TabsContent value="ai-battle" className="flex-grow mt-4">
            <Card className="h-full flex flex-col bg-card/60 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="font-headline">AI Battle Mode</CardTitle>
                <CardDescription>
                  Analyze the historical chart data. Your goal is to predict the next move more accurately than your opponent, as judged by an AI analyst.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 h-[300px] md:h-full">
                  <StockChart />
                </div>
                <div className="flex flex-col gap-4">
                  <Card className="bg-background/80">
                    <CardHeader>
                      <CardTitle className="font-headline text-lg">Your Analysis</CardTitle>
                      <CardDescription>Enter your prediction.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Input placeholder="Predict the pattern (e.g., 'Bullish Engulfing')" />
                    </CardContent>
                  </Card>
                   <Card className="bg-background/80">
                    <CardHeader>
                      <CardTitle className="font-headline text-lg">Opponent's Analysis</CardTitle>
                      <CardDescription>Awaiting prediction...</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                  <div className="flex gap-2 mt-auto">
                    <Button className="w-full font-headline bg-accent hover:bg-accent/80">
                      <Bot className="mr-2 h-4 w-4" />
                      Submit & Await AI Verdict
                    </Button>
                    <Button
                      className="w-full font-headline bg-blue-500 hover:bg-blue-500/80"
                      onClick={handleSimulate}
                    >
                      <Bot className="mr-2 h-4 w-4" />
                      Simulate Battle
                    </Button>
                  </div>
                  {simulationResult && (
                    <pre className="mt-4 text-xs bg-gray-800 p-4 rounded-md overflow-auto">
                      {JSON.stringify(simulationResult, null, 2)}
                    </pre>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="market-prediction" className="flex-grow mt-4">
             <Card className="h-full flex flex-col bg-card/60 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle className="font-headline">Live Market Prediction</CardTitle>
                <CardDescription>
                  Predict the real-life price movement for the FLXN/USDC pair.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 h-[300px] md:h-full">
                  <StockChart />
                </div>
                <div className="flex flex-col gap-4">
                   <Card className="bg-background/80">
                    <CardHeader>
                        <CardTitle className="font-headline text-lg">Your Predictions</CardTitle>
                        <CardDescription>Enter the predicted price for each timeframe.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {timeFrames.map((frame) => (
                        <div key={frame} className="flex flex-col gap-1.5">
                            <label className="text-sm text-muted-foreground font-headline">
                            {frame}
                            </label>
                            <Input
                            type="number"
                            placeholder="e.g., 155.5"
                            className="bg-background/80"
                            />
                        </div>
                        ))}
                    </CardContent>
                    </Card>
                     <Button className="w-full font-headline bg-accent hover:bg-accent/80 mt-auto">
                        Submit Predictions
                    </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
