import { useEffect } from 'react';
import { useAnalyticsStore } from '../store/analyticsStore';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip,
    ResponsiveContainer, BarChart, Bar, CartesianGrid
} from 'recharts';
import Layout from '../components/Layout';
export default function AnalyticsPage() {
    const { stats, logs, quote, isLoading, fetchAnalytics } = useAnalyticsStore();
    const { user, logout } = useAuthStore();

    useEffect(() => { fetchAnalytics(); }, []);

    const chartData = logs.map(l => ({
        date: new Date(l.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        routines: l.routinesCompleted,
        tasks: l.tasksCompleted,
        score: l.scoreEarned
    }));

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <p className="text-zinc-500">Loading your stats...</p>
            </div>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-zinc-950 text-white">

                {/* Header
                <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 bg-zinc-950 z-10">
                    <span className="text-violet-400 font-bold text-lg tracking-tight">⚡ Momentum</span>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-zinc-400">
                            🔥 <span className="text-white font-medium">{user?.currentStreak ?? 0}</span>
                            <span className="text-zinc-600 text-xs ml-1">streak</span>
                        </span>
                        <span className="text-sm text-zinc-400">
                            ⭐ <span className="text-white font-medium">{user?.score ?? 0}</span>
                            <span className="text-zinc-600 text-xs ml-1">pts</span>
                        </span>
                        <Link to="/dashboard" className="text-xs text-zinc-500 hover:text-violet-400 transition">
                            ← Dashboard
                        </Link>
                        <button onClick={logout} className="text-xs text-zinc-500 hover:text-red-400 transition">
                            Logout
                        </button>
                    </div>
                </header> */}

                <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">

                    {/* Daily Quote */}
                    {quote && (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-5">
                            <p className="text-zinc-400 text-xs uppercase tracking-widest mb-2">Today's Quote</p>
                            <p className="text-white text-sm leading-relaxed italic">"{quote.text}"</p>
                            <p className="text-zinc-500 text-xs mt-2">— {quote.author}</p>
                        </div>
                    )}

                    {/* Stat Cards */}
                    {stats && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <StatCard label="Total Score" value={stats.totalScore} unit="pts" color="violet" />
                            <StatCard label="Current Streak" value={stats.currentStreak} unit="days" color="orange" />
                            <StatCard label="Task Completion" value={stats.taskCompletionRate} unit="%" color="blue" />
                            <StatCard label="Weekly Routines" value={stats.weeklyRoutineRate} unit="%" color="emerald" />
                        </div>
                    )}

                    {/* Secondary stats */}
                    {stats && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <MiniStat label="Tasks Completed" value={`${stats.completedTasks} / ${stats.totalTasks}`} />
                            <MiniStat label="Longest Streak" value={`${stats.longestStreak} days`} />
                            <MiniStat label="Best Routine Streak" value={`${stats.bestRoutineStreak} days`} />
                        </div>
                    )}

                    {/* Activity Chart */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                        <h3 className="text-sm font-medium text-zinc-300 mb-1">Daily Activity</h3>
                        <p className="text-zinc-600 text-xs mb-4">Routines + tasks completed per day (last 14 days)</p>
                        <ResponsiveContainer width="100%" height={180}>
                            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="routineGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="taskGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="date"
                                    tick={{ fill: '#52525b', fontSize: 10 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: '#52525b', fontSize: 10 }}
                                    axisLine={false}
                                    tickLine={false}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#18181b',
                                        border: '1px solid #3f3f46',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                        color: '#fff'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="routines"
                                    name="Routines"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    fill="url(#routineGrad)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="tasks"
                                    name="Tasks"
                                    stroke="#8b5cf6"
                                    strokeWidth={2}
                                    fill="url(#taskGrad)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Score Chart */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                        <h3 className="text-sm font-medium text-zinc-300 mb-1">Score Earned Per Day</h3>
                        <p className="text-zinc-600 text-xs mb-4">Points you earned each day</p>
                        <ResponsiveContainer width="100%" height={160}>
                            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fill: '#52525b', fontSize: 10 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: '#52525b', fontSize: 10 }}
                                    axisLine={false}
                                    tickLine={false}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#18181b',
                                        border: '1px solid #3f3f46',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                        color: '#fff'
                                    }}
                                />
                                <Bar dataKey="score" name="Points" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                </main>
            </div>
        </Layout>
    );
}

// ─── Sub-components ───────────────────────────────────────

const colorMap = {
    violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
};

function StatCard({ label, value, unit, color }) {
    return (
        <div className={`rounded-xl border p-4 ${colorMap[color]}`}>
            <p className="text-xs text-zinc-500 mb-1">{label}</p>
            <p className="text-2xl font-bold">
                {value}<span className="text-sm font-normal ml-1 text-zinc-500">{unit}</span>
            </p>
        </div>
    );
}

function MiniStat({ label, value }) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-xs text-zinc-500 mb-1">{label}</p>
            <p className="text-base font-semibold text-white">{value}</p>
        </div>
    );
}