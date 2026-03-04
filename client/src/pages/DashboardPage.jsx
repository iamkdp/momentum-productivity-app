import { useEffect } from 'react';
import { useTaskStore } from '../store/taskStore';
import { useRoutineStore } from '../store/routineStore';
import Layout from '../components/Layout';
import AddTaskForm from '../components/AddTaskForm';
import TaskCard from '../components/TaskCard';
import AddRoutineForm from '../components/AddRoutineForm';
import RoutineCard from '../components/RoutineCard';
import EmptyState from '../components/EmptyState';
import { SkeletonList } from '../components/Skeleton';
import { useAnalyticsStore } from '../store/analyticsStore';

export default function DashboardPage() {
  const { tasks, fetchTasks, isLoading: tasksLoading } = useTaskStore();
  const { routines, fetchRoutines, isLoading: routinesLoading } = useRoutineStore();
  const { quote, fetchQuote } = useAnalyticsStore();
  useEffect(() => {
    fetchTasks();
    fetchRoutines();
    fetchQuote();
  }, []);

  const pending = tasks.filter(t => !t.isCompleted);
  const completed = tasks.filter(t => t.isCompleted);
  const routinesDone = routines.filter(r => r.completedToday).length;
  const allRoutinesDone = routines.length > 0 && routinesDone === routines.length;

  return (
    <Layout>
      {/* Daily Quote */}
      {quote && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 mb-6 flex gap-3 items-start">
          <span className="text-lg mt-0.5">💬</span>
          <div>
            <p className="text-sm text-zinc-300 italic leading-relaxed">"{quote.text}"</p>
            <p className="text-xs text-zinc-600 mt-1">— {quote.author}</p>
          </div>
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-8">

        {/* Left — Routines */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-semibold text-base text-white">Daily Routines</h2>
              <p className="text-zinc-500 text-xs mt-0.5">
                {routines.length === 0
                  ? 'Resets every morning'
                  : `${routinesDone} / ${routines.length} done`}
              </p>
            </div>
            {allRoutinesDone && (
              <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium animate-fade-in">
                🎉 All done!
              </span>
            )}
          </div>

          <div className="space-y-3">
            <AddRoutineForm />

            {routinesLoading ? (
              <SkeletonList count={3} />
            ) : routines.length === 0 ? (
              <EmptyState
                icon="🌱"
                title="No routines yet"
                description="Add habits you want to do every single day. Streaks will track your consistency."
              />
            ) : (
              <div className="space-y-2">
                {routines.filter(r => !r.completedToday).map(r => (
                  <RoutineCard key={r._id} routine={r} />
                ))}
                {routines.filter(r => r.completedToday).map(r => (
                  <RoutineCard key={r._id} routine={r} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Right — Tasks */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-semibold text-base text-white">Tasks</h2>
              <p className="text-zinc-500 text-xs mt-0.5">
                {pending.length === 0 && tasks.length > 0
                  ? 'All caught up 🎉'
                  : pending.length > 0
                    ? `${pending.length} remaining`
                    : 'One-off tasks with optional deadlines'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <AddTaskForm />

            {tasksLoading ? (
              <SkeletonList count={3} />
            ) : tasks.length === 0 ? (
              <EmptyState
                icon="✅"
                title="No tasks yet"
                description="Add anything you need to get done. Mark important tasks to earn bonus points."
              />
            ) : (
              <div className="space-y-2">
                {pending.map(task => <TaskCard key={task._id} task={task} />)}
                {completed.length > 0 && (
                  <>
                    <p className="text-xs text-zinc-700 uppercase tracking-widest pt-3 pb-1">
                      Completed ({completed.length})
                    </p>
                    {completed.map(task => <TaskCard key={task._id} task={task} />)}
                  </>
                )}
              </div>
            )}
          </div>
        </section>

      </div>
    </Layout>
  );
}