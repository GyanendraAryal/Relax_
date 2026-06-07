import { useEffect, useState } from 'react';
import { bookingsApi } from '../../api/bookings.api.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import { formatDate } from '../../utils/format.js';

const statuses = ['pending', 'confirmed', 'declined', 'completed'];

const statusStyles = {
  pending:   'bg-amber-100 text-amber-800',
  confirmed: 'bg-green-100 text-green-800',
  declined:  'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
};

const actionStyles = {
  pending:   'bg-amber-50 text-amber-700 hover:bg-amber-100',
  confirmed: 'bg-green-50 text-green-700 hover:bg-green-100',
  declined:  'bg-red-50 text-red-700 hover:bg-red-100',
  completed: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
};

// Statuses that are irreversible — require confirmation
const IRREVERSIBLE = new Set(['declined', 'completed']);

export default function BirthdayRequests() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [confirm, setConfirm] = useState(null); // { id, status, name }

  const load = () =>
    bookingsApi.listBirthdays({ page: 1, limit: 50, status: filter || undefined })
      .then((r) => setItems(r.items));

  useEffect(() => { load().finally(() => setLoading(false)); }, [filter]);

  const applyStatus = async (id, status) => {
    await bookingsApi.updateBirthday(id, { status });
    await load();
  };

  const handleStatusClick = (r, status) => {
    if (IRREVERSIBLE.has(status)) {
      setConfirm({ id: r.id, status, name: r.customer_name });
    } else {
      applyStatus(r.id, status);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900">Birthday Requests</h1>

      <select className="input-field mt-4 max-w-xs" value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="">All statuses</option>
        {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-200 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider font-bold">
            <tr>
              <th className="p-3 border-b border-stone-200">Customer</th>
              <th className="p-3 border-b border-stone-200">Contact</th>
              <th className="p-3 border-b border-stone-200">Event Date</th>
              <th className="p-3 border-b border-stone-200">Guests</th>
              <th className="p-3 border-b border-stone-200">Package</th>
              <th className="p-3 border-b border-stone-200">Status</th>
              <th className="p-3 border-b border-stone-200">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 bg-white">
            {items.length === 0 ? (
              <tr><td colSpan="7" className="p-8 text-center text-stone-500">No birthday requests found</td></tr>
            ) : items.map((r) => (
              <tr key={r.id} className="hover:bg-stone-50 transition">
                <td className="p-3 font-medium text-stone-900">{r.customer_name}</td>
                <td className="p-3">
                  <div>{r.email}</div>
                  <div className="text-xs text-stone-500">{r.phone}</div>
                </td>
                <td className="p-3 text-stone-700">{formatDate(r.event_date)}</td>
                <td className="p-3 text-stone-700">{r.guest_count}</td>
                <td className="p-3 text-stone-700">{r.package_type || '—'}</td>
                <td className="p-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[r.status] || 'bg-stone-100 text-stone-600'}`}>
                    {r.status}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {statuses.filter((s) => s !== r.status).map((s) => (
                      <button key={s} type="button" onClick={() => handleStatusClick(r, s)}
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize transition ${actionStyles[s]}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={!!confirm}
        title={`Mark as ${confirm?.status}?`}
        message={`Set ${confirm?.name}'s booking to "${confirm?.status}". This action cannot be easily reversed.`}
        confirmLabel={confirm?.status === 'declined' ? 'Decline' : 'Mark Complete'}
        danger={confirm?.status === 'declined'}
        onConfirm={() => { applyStatus(confirm.id, confirm.status); setConfirm(null); }}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
