import { useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const sidebarLinks = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/menu', label: 'Menu' },
  { to: '/admin/offers', label: 'Offers' },
  { to: '/admin/gallery', label: 'Gallery' },
  { to: '/admin/today-special', label: "Today's Special" },
  { to: '/admin/birthday-requests', label: 'Birthday Requests' },
  { to: '/admin/event-requests', label: 'Event Requests' },
  { to: '/admin/settings', label: 'Site Settings' },
];

export default function AdminLayout() {
  const { user, fetchMe, logout, checked } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!checked) {
      fetchMe();
    }
  }, []);

  useEffect(() => {
    if (checked && !user) {
      navigate('/admin/login', { replace: true });
    }
  }, [checked, user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  if (!checked || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-stone-100">

      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-64 h-full flex-col border-r border-stone-200 bg-forest-900 text-stone-200">

        <div className="border-b border-forest-700 p-6">
          <Link to="/" className="font-display text-lg font-bold text-white">
            Relax Station
          </Link>
          <p className="mt-1 text-xs text-stone-400">CMS Dashboard</p>
        </div>

        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'hover:bg-forest-800 text-stone-300'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-forest-700 p-4">
          <p className="truncate text-sm font-semibold text-white">
            {user.full_name}
          </p>
          <p className="truncate text-xs text-stone-400">
            {user.email}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 text-sm font-medium text-brand-400 hover:text-brand-300"
          >
            Sign out
          </button>
        </div>

      </aside>

      {/* MAIN */}
      <div className="flex flex-1 flex-col h-full overflow-hidden">

        {/* MOBILE HEADER */}
        <header className="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3 lg:hidden shrink-0">
          <span className="font-semibold text-stone-800">
            Admin Console
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm font-medium text-brand-600"
          >
            Sign out
          </button>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-stone-50 min-w-0">
          <Outlet />
        </main>

      </div>

    </div>
  );
}