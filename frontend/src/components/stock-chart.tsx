'use client';

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
import { useMemo } from 'react';

const generateStockData = () => {
    const data = [];
    let price = 150;
    const now = new Date();
    now.setHours(10, 0, 0, 0);

    for (let i = 0; i < 13; i++) {
        const time = new Date(now.getTime() + i * 5 * 60 * 1000);
        data.push({
            name: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            price: parseFloat(price.toFixed(2)),
        });
        price += (Math.random() - 0.5) * 2;
    }
    return data;
}


export default function StockChart() {
  const stockData = useMemo(() => generateStockData(), []);
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={stockData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          domain={['dataMin - 2', 'dataMax + 2']}
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
          dot={{ r: 4, fill: 'hsl(var(--primary))' }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
