import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Activity, 
  PieChart, 
  Download, 
  RefreshCw,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { api } from '../services/api.ts';
import { useNotification } from '../context/NotificationContext.tsx';

export const AnalyticsDashboard: React.FC = () => {
  const { sendPush } = useNotification();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liveStreamActive, setLiveStreamActive] = useState(true);
  const [liveEvents, setLiveEvents] = useState<Array<{ id: string; time: string; text: string; amount?: number }>>([
    { id: '1', time: 'Just now', text: 'Alex Rivera purchased Aura Studio ANC Headphones', amount: 339.23 },
    { id: '2', time: '14 mins ago', text: 'Clara Oswald checked out with Apple Pay (2 items)', amount: 311.04 },
    { id: '3', time: '35 mins ago', text: 'FedEx carrier scanned package #ORD-9481 at regional hub' },
    { id: '4', time: '1 hour ago', text: 'Sarah Chen restocked 50 units of GaN III 140W Chargers' }
  ]);

  const loadMetrics = async () => {
    try {
      const res = await api.getAnalytics();
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
    const interval = setInterval(loadMetrics, 12000); // 12-sec refresh
    return () => clearInterval(interval);
  }, []);

  // Real-time live simulation generator
  useEffect(() => {
    if (!liveStreamActive) return;

    const streamInterval = setInterval(() => {
      const simulatedCustomers = ['Elena Vance', 'Marcus Thorne', 'Devon Hayes', 'Zoe Chen', 'Liam Vance'];
      const items = ['Titanium Smartwatch Ultra', 'ANC Headphones', 'Tactile Mechanical Keyboard', 'GaN 140W Charger'];
      const randomCust = simulatedCustomers[Math.floor(Math.random() * simulatedCustomers.length)];
      const randomItem = items[Math.floor(Math.random() * items.length)];
      const randomPrice = Math.floor(89 + Math.random() * 400);

      const newEvent = {
        id: `evt-${Date.now()}`,
        time: 'Just now',
        text: `${randomCust} completed purchase for ${randomItem}`,
        amount: randomPrice
      };

      setLiveEvents(prev => [newEvent, ...prev.slice(0, 7)]);
    }, 18000);

    return () => clearInterval(streamInterval);
  }, [liveStreamActive]);

  const exportReport = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auracommerce-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  if (loading || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-neutral-400">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-400" />
        <span>Aggregating real-time store metrics...</span>
      </div>
    );
  }

  // Calculate maximum for chart scale
  const maxRevenue = Math.max(...data.dailyMetrics.map((d: any) => d.revenue), 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Real-Time Intelligence & Performance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Storefront Sales Analytics
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Live telemetry monitoring revenue flow, conversion velocity, and catalog performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLiveStreamActive(!liveStreamActive)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 ${
              liveStreamActive
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-neutral-900 border-neutral-800 text-neutral-500'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Live Ticker: {liveStreamActive ? 'Streaming' : 'Paused'}</span>
          </button>

          <button
            onClick={exportReport}
            className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Total Gross Revenue</span>
            <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-white font-mono">
            ${data.totalRevenue.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% vs last week</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Orders Processed</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-white font-mono">
            {data.totalOrders}
          </div>
          <div className="mt-2 text-xs text-neutral-400 font-medium">
            {data.processingOrders} in fulfillment queue
          </div>
        </div>

        {/* Average Order Value */}
        <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Average Order Value (AOV)</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-white font-mono">
            ${data.averageOrderValue.toFixed(2)}
          </div>
          <div className="mt-2 text-xs text-emerald-400 font-semibold">
            High basket conversion
          </div>
        </div>

        {/* Active Shoppers */}
        <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Active Live Shoppers</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-black text-emerald-400 font-mono flex items-center gap-2">
            <span>{data.activeVisitors}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <div className="mt-2 text-xs text-neutral-400 font-medium">
            Conversion Rate: <strong className="text-white font-mono">{data.conversionRate}%</strong>
          </div>
        </div>
      </div>

      {/* Main Charts & Live Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 7-Day Revenue Trend Chart */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white">Daily Revenue Velocity</h3>
              <p className="text-xs text-neutral-400">Weekly sales trajectory across peak checkout hours</p>
            </div>
            <span className="text-xs font-mono text-amber-400 font-bold bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
              7-Day Window
            </span>
          </div>

          {/* SVG Bar / Metric Visualization */}
          <div className="pt-6 pb-2">
            <div className="h-56 flex items-end justify-between gap-3 px-2">
              {data.dailyMetrics.map((item: any, idx: number) => {
                const heightPercent = Math.max(15, Math.round((item.revenue / maxRevenue) * 100));
                const isToday = item.date === 'Today';
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    {/* Tooltip Hover Value */}
                    <div className="opacity-0 group-hover:opacity-100 transition duration-200 mb-1 px-2 py-1 rounded bg-neutral-950 border border-neutral-700 text-[10px] font-mono font-bold text-white whitespace-nowrap shadow-xl pointer-events-none">
                      ${item.revenue} ({item.orders} ord)
                    </div>

                    {/* Bar */}
                    <div className="w-full bg-neutral-950 rounded-xl overflow-hidden p-1 flex items-end h-full">
                      <div 
                        className={`w-full rounded-lg transition-all duration-700 ${
                          isToday 
                            ? 'bg-gradient-to-t from-amber-500 to-amber-300 shadow-lg shadow-amber-400/20' 
                            : 'bg-neutral-800 group-hover:bg-amber-400/60'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    {/* Date Label */}
                    <span className={`text-[11px] font-mono mt-1 ${isToday ? 'text-amber-400 font-bold' : 'text-neutral-500'}`}>
                      {item.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Live Stream & Activity Ticker */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Live Transaction Stream</span>
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>

            <div className="mt-4 space-y-3 max-h-72 overflow-y-auto pr-1">
              {liveEvents.map((evt) => (
                <div key={evt.id} className="p-3 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-neutral-500 font-mono">{evt.time}</span>
                    {evt.amount && (
                      <span className="font-mono font-bold text-emerald-400">+${evt.amount}</span>
                    )}
                  </div>
                  <p className="text-neutral-300 text-[11px] leading-relaxed">
                    {evt.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800 text-[10px] text-neutral-500 flex items-center justify-between">
            <span>Encrypted WebSocket bridge simulation</span>
            <span className="text-emerald-400 font-mono">Status: Connected</span>
          </div>
        </div>
      </div>

      {/* Category Breakdown Progress Grid */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
        <h3 className="font-bold text-base text-white">Sales Distribution by Category</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.categoryBreakdown.map((cat: any) => (
            <div key={cat.category} className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">{cat.category}</span>
                <span className="font-mono font-bold text-amber-400">{cat.percentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                <span>${cat.sales.toLocaleString()}</span>
                <span>{cat.units} units sold</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
