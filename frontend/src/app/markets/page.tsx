'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ArrowDown, ArrowUp } from 'lucide-react';
import FaultyTerminal from '@/components/faulty-terminal';

const generateCoinData = (coin: string) => {
  const data = [];
  let price = coin === 'SOL' ? 150 : coin === 'ETH' ? 3000 : 100;
  const now = new Date();
  now.setHours(10, 0, 0, 0);

  for (let i = 0; i < 30; i++) {
    const time = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000);
    data.push({
      date: time.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      price: parseFloat(price.toFixed(2)),
    });
    price += (Math.random() - 0.48) * (price * 0.05);
  }
  return data;
};

const marketData: { [key: string]: any } = {
  SOL: {
    name: 'Solana',
    data: generateCoinData('SOL'),
    price: 154.23,
    change: 2.5,
  },
  ETH: {
    name: 'Ethereum',
    data: generateCoinData('ETH'),
    price: 3420.78,
    change: -1.2,
  },
  FLXN: {
    name: 'Fluxion',
    data: generateCoinData('FLXN'),
    price: 1.22,
    change: 5.1,
  },
};

export default function MarketsPage() {
  const [selectedCoin, setSelectedCoin] = useState('SOL');
  const coinData = marketData[selectedCoin];

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

        <div className="z-10 w-full h-full max-w-7xl mx-auto flex flex-col items-center">
            <Card className="w-full max-w-4xl bg-card/60 backdrop-blur-sm border-primary/20">
            <CardHeader>
                <div className="flex justify-between items-center">
                <div>
                    <CardTitle className="font-headline text-3xl">Live Market</CardTitle>
                    <CardDescription>
                    Analyze real-time market data and place your predictions.
                    </CardDescription>
                </div>
                <Select defaultValue={selectedCoin} onValueChange={setSelectedCoin}>
                    <SelectTrigger className="w-[180px] bg-background/80 font-headline">
                    <SelectValue placeholder="Select a coin" />
                    </SelectTrigger>
                    <SelectContent>
                    {Object.keys(marketData).map((coin) => (
                        <SelectItem key={coin} value={coin}>
                        {marketData[coin].name} ({coin})
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={coinData.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        domain={['dataMin - 5', 'dataMax + 5']}
                    />
                    <Tooltip
                        contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        }}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 8 }}
                    />
                    </LineChart>
                </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-4">
                <Card className="bg-background/80 text-center">
                    <CardHeader>
                    <CardDescription className='font-headline'>{coinData.name} ({selectedCoin})</CardDescription>
                    <CardTitle className="text-4xl font-headline">${coinData.price.toLocaleString()}</CardTitle>
                    <div className={`flex items-center justify-center text-lg ${coinData.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {coinData.change >= 0 ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
                        <span>{coinData.change}%</span>
                    </div>
                    </CardHeader>
                </Card>
                <Card className="bg-background/80">
                    <CardHeader>
                    <CardTitle className="font-headline text-lg">Trade</CardTitle>
                    <CardDescription>Enter amount in USD.</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <Input type="number" placeholder="e.g., 100" className="text-center text-lg" />
                    </CardContent>
                    <CardFooter className="grid grid-cols-2 gap-2">
                        <Button className="w-full font-headline bg-green-600 hover:bg-green-700">Buy / Long</Button>
                        <Button className="w-full font-headline bg-red-600 hover:bg-red-700">Sell / Short</Button>
                    </CardFooter>
                </Card>
                 <Button className="w-full font-headline mt-auto" variant="secondary">Hold Position</Button>
                </div>
            </CardContent>
            </Card>
        </div>
    </div>
  );
}
