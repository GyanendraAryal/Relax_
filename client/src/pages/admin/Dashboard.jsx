import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../../api/dashboard.api.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { formatDate } from '../../utils/format.js';

const statCards = [
  { key: 'menu_items', label: 'Menu Items', link: '/admin/menu', color: 'bg-brand-100 text-brand-800' },
  { key: 'active_offers', label: 'Active Offers', link: '/admin/offers', color: 'bg-green-100 text-green-800' },
  { key: 'gallery_images', label: 'Gallery Photos', link: '/admin/gallery', color: 'bg-blue-100 text-blue-800' },
  { key: 'pending_birthdays', label: 'Pending Birthdays', link: '/admin/birthday-requests', color: 'bg-amber-100 text-amber-800' },
  { key: 'pending_events', label: 'Pending Events', link: '/admin/event-requests', color: 'bg-purple-100 text-purple-800' },
  { key: 'today_specials', label: "Today's Specials", link: '/admin/today-special', color: 'bg-rose-100 text-rose-800' },
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getStats().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const { stats, recentBookings } = data || { stats: {}, recentBookings: [] };

  return (
    <div>
      <h1 className="text-2xl font-bold text-forest-900">Dashboard</h1>
      <p className="text-stone-500">Overview of Relax Station CMS</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <Link key={card.key} to={card.link} className="card transition hover:shadow-md">
            <p className="text-sm text-stone-500">{card.label}</p>
            <p className={`mt-2 inline-block rounded-lg px-3 py-1 text-2xl font-bold ${card.color}`}>
              {stats[card.key] ?? 0}
            </p>
          </Link>
        ))}
      </div>

      <div className="card mt-8">
        <h2 className="font-semibold">Recent Booking Requests</h2>
        {recentBookings.length === 0 ? (
          <p className="mt-4 text-sm text-stone-500">No recent requests</p>
        ) : (
          <ul className="mt-4 divide-y divide-stone-100">
            {recentBookings.map((b) => (
              <li key={`${b.type}-${b.id}`} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <span className="rounded bg-stone-100 px-2 py-0.5 text-xs uppercase">{b.type}</span>
                  <span className="ml-2 font-medium">{b.customer_name}</span>
                </div>
                <div className="text-right text-stone-500">
                  <p>{formatDate(b.event_date)}</p>
                  <p className="capitalize">{b.status}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
