'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useDuel } from './duel-provider';

export function DuelChart() {
  const { duelPath, tickIndex } = useDuel();

  const chartData = duelPath?.data.slice(0, tickIndex) || [];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis dataKey="time" stroke="#888" />
        <YAxis stroke="#888" domain={['dataMin', 'dataMax']} />
        <Tooltip contentStyle={{ backgroundColor: '#222', border: 'none' }} />
        <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
