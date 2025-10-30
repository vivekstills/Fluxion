'use client';

import { Card } from '@/components/ui/card';
import { OrderPanel } from './order-panel';
import { StatsCard } from './stats-card';
import { DuelChart } from './chart';

'use client';

import { Card } from '@/components/ui/card';
import { OrderPanel } from './order-panel';
import { StatsCard } from './stats-card';
import { DuelChart } from './chart';
import { useDuel } from './duel-provider';

export function BattleArena() {
  const { duel, timeLeft, tickIndex, duelPath } = useDuel();

  if (!duel) {
    return <div>Loading Duel...</div>;
  }

  const progress = (tickIndex / (duelPath?.data.length || 1)) * 100;

  return (
    <div className="flex flex-col h-full gap-4 p-4 bg-black text-white">
      {/* Top Bar */}
      <div className="flex justify-between items-center bg-gray-900 p-2 rounded-lg">
        <div className="font-bold text-lg">{duel.symbol || 'BTC/USDT'}</div>
        <div className="text-2xl font-mono">{`00:${timeLeft.toString().padStart(2, '0')}`}</div>
        <div className={`px-3 py-1 rounded-full text-white text-sm font-bold ${duel.status === 'Running' ? 'bg-green-500' : 'bg-gray-500'}`}>
          {duel.status}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
        {/* Chart Panel */}
        <div className="md:col-span-2">
          <Card className="h-full bg-gray-900">
            <DuelChart />
          </Card>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col gap-4">
          <OrderPanel />
          <StatsCard title="Current Price" value="$69,420.00" />
          <StatsCard title="Your PnL" value="$420.69" />
          <StatsCard title="Opponent PnL" value="$ -1337.00" />
        </div>
      </div>

      {/* Footer Bar */}
      <div className="flex items-center gap-4 bg-gray-900 p-2 rounded-lg">
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="text-sm">{Math.round(progress)}%</div>
      </div>
    </div>
  );
}
