"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface EquityChartProps {
  trades: any[];
  initialBalance?: number;
}

export default function EquityChart({ trades = [] }: EquityChartProps) {
  // Filter and sort trades by date
  const validTrades = trades.filter(t => t.date && !isNaN(new Date(t.date).getTime()));
  const sortedTrades = [...validTrades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  let cumulativePnl = 0;
  const data = [
    { date: 'Start', pnl: 0 },
    ...sortedTrades.map(t => {
      cumulativePnl += (Number(t.profit) || 0);
      return {
        date: new Date(t.date).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' }),
        pnl: cumulativePnl,
        fullDate: new Date(t.date).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })
      };
    })
  ];

  // If we only have 'Start', add a few fake points to show a flat line instead of an empty chart
  const displayData = data.length > 1 ? data : [
    { date: 'Start', pnl: 0 },
    { date: 'Now', pnl: 0 }
  ];

  return (
    <div className="h-[450px] w-full bg-[#050505] p-4 rounded-3xl border border-zinc-900/50">
      <div className="mb-4 flex items-center justify-between px-4">
        <h3 className="text-sm font-black italic text-zinc-100 flex items-center gap-2">
          P&L Chart
          <span className="h-4 w-4 rounded-full bg-zinc-800 text-[10px] flex items-center justify-center text-zinc-500 font-bold not-italic">?</span>
        </h3>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={displayData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={true} horizontal={true} />
          <XAxis 
            dataKey="date" 
            stroke="#52525b" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            dy={10}
            interval={displayData.length > 20 ? Math.floor(displayData.length / 8) : 0}
          />
          <YAxis 
            stroke="#52525b" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            domain={['auto', 'auto']}
            orientation="right"
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
            itemStyle={{ color: '#f4f4f5', fontWeight: 'bold' }}
            formatter={(value: any) => [`$${value?.toLocaleString()}`, 'P&L']}
            labelFormatter={(label, payload) => payload[0]?.payload?.fullDate || label}
          />
          <Legend 
            verticalAlign="top" 
            align="left" 
            iconType="circle"
            wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', textTransform: 'none', fontWeight: 'bold' }}
          />
          <Line 
            name="Cumulative P&L"
            type="monotone" 
            dataKey="pnl" 
            stroke="#8b5cf6" 
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: '#a78bfa' }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
