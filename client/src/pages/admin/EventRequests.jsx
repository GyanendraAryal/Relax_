import { useEffect, useState } from 'react';
import { bookingsApi } from '../../api/bookings.api.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { formatDate } from '../../utils/format.js';

const statuses = ['pending', 'confirmed', 'declined', 'completed'];

export default function EventRequests() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = () =>
    bookingsApi.listEvents({ page: 1, limit: 50, status: filter || undefined }).then((r) => setItems(r.items));

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [filter]);

  const updateStatus = async (id, status) => {
    await bookingsApi.updateEvent(id, { status });
    await load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold">Event Requests</h1>
      <select className="input-field mt-4 max-w-xs" value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="">All statuses</option>
        {statuses.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <div className="mt-6 space-y-4">
        {items.map((r) => (
          <div key={r.id} className="card">
            <div className="flex flex-wrap justify-between gap-2">
              <h3 className="font-semibold">{r.customer_name} — {r.event_type}</h3>
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs capitalize">{r.status}</span>
            </div>
            <p className="mt-2 text-sm text-stone-600">{r.email} · {r.phone}</p>
            <p className="text-sm">{formatDate(r.event_date)} · {r.guest_count} guests · {r.budget_range || 'Budget N/A'}</p>
            {r.message && <p className="mt-2 text-sm italic">{r.message}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              {statuses.filter((s) => s !== r.status).map((s) => (
                <button key={s} type="button" onClick={() => updateStatus(r.id, s)} className="btn-secondary text-xs py-1 px-2">
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
