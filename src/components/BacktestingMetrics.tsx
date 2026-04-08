"use client";

interface MetricProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: string;
}

function MetricBlock({ label, value, subValue, trend }: MetricProps) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-black text-zinc-100 italic">{value}</span>
        {subValue && <span className="text-[10px] font-bold text-zinc-500">{subValue}</span>}
        {trend && <span className="text-[10px] font-bold text-emerald-500">{trend}</span>}
      </div>
    </div>
  );
}

export default function BacktestingMetrics({ data }: { data: any }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-8 py-8 px-2">
      <MetricBlock 
        label="Total P&L" 
        value={`+${data.total_pnl_usd.toLocaleString()} USD`} 
        trend={`+${data.total_pnl_percent}%`} 
      />
      <MetricBlock 
        label="Max equity drawdown" 
        value={`${data.max_drawdown_usd.toLocaleString()} USD`} 
        subValue={`${data.max_drawdown_percent}%`} 
      />
      <MetricBlock 
        label="Total trades" 
        value={data.total_trades.toString()} 
      />
      <MetricBlock 
        label="Profitable trades" 
        value={`${data.profitable_trades_percent}%`} 
        subValue={`${data.profitable_trades_count}/${data.total_trades}`} 
      />
      <MetricBlock 
        label="Profit factor" 
        value={data.profit_factor.toString()} 
      />
    </div>
  );
}
