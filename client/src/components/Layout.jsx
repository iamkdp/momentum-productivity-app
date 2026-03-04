import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '⚡' },
  { path: '/analytics', label: 'Analytics', icon: '📊' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">

      {/* Top nav */}
      <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-lg font-display font-bold text-white tracking-tight">
              ⚡ Momentum
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition
                  ${location.pathname === item.path
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-500 hover:text-white hover:bg-zinc-800/60'
                  }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User info */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              <ScorePill icon="🔥" value={user?.currentStreak ?? 0} label="streak" color="orange" />
              <ScorePill icon="⭐" value={user?.score ?? 0} label="pts" color="violet" />
            </div>
            <span className="hidden sm:block text-sm text-zinc-500 font-medium">
              {user?.username}
            </span>
            <button
              onClick={handleLogout}
              className="text-xs text-zinc-600 hover:text-red-400 transition"
            >
              Logout
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="sm:hidden flex flex-col gap-1 p-1"
            >
              <span className={`block w-5 h-0.5 bg-zinc-400 transition-transform ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block w-5 h-0.5 bg-zinc-400 transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-zinc-400 transition-transform ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="sm:hidden border-t border-zinc-800 bg-zinc-950 px-4 py-3 space-y-1 animate-fade-in">
            <div className="flex gap-3 pb-3 border-b border-zinc-800 mb-2">
              <ScorePill icon="🔥" value={user?.currentStreak ?? 0} label="streak" color="orange" />
              <ScorePill icon="⭐" value={user?.score ?? 0} label="pts" color="violet" />
            </div>
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition
                  ${location.pathname === item.path
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-white'
                  }`}
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 animate-fade-up">
        {children}
      </main>
    </div>
  );
}

function ScorePill({ icon, value, label, color }) {
  const colors = {
    orange: 'text-orange-400',
    violet: 'text-violet-400'
  };
  return (
    <div className="flex items-center gap-1">
      <span className="text-sm">{icon}</span>
      <span className={`text-sm font-semibold font-display ${colors[color]}`}>{value}</span>
      <span className="text-xs text-zinc-600">{label}</span>
    </div>
  );
}