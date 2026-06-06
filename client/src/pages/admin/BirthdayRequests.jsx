import { useEffect, useState } from 'react';
import { bookingsApi } from '../../api/bookings.api.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { formatDate } from '../../utils/format.js';

const statuses = ['pending', 'confirmed', 'declined', 'completed'];

export default function BirthdayRequests() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = () =>
    bookingsApi
      .listBirthdays({
        page: 1,
        limit: 50,
        status: filter || undefined,
      })
      .then((r) => setItems(r.items));

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [filter]);

  const updateStatus = async (id, status) => {
    await bookingsApi.updateBirthday(id, { status });
    await load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold">Birthday Requests</h1>

      <select
        className="input-field mt-4 max-w-xs"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="">All statuses</option>
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* TABLE WRAPPER */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm border border-stone-200">
          <thead className="bg-stone-50">
            <tr>
              <th className="p-3 border-b">Customer</th>
              <th className="p-3 border-b">Contact</th>
              <th className="p-3 border-b">Event Date</th>
              <th className="p-3 border-b">Guests</th>
              <th className="p-3 border-b">Package</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="p-6 text-center text-stone-500"
                >
                  No birthday requests found
                </td>
              </tr>
            ) : (
              items.map((r) => (
                <tr key={r.id} className="border-b hover:bg-stone-50">
                  <td className="p-3 font-medium">{r.customer_name}</td>

                  <td className="p-3">
                    <div>{r.email}</div>
                    <div className="text-xs text-stone-500">{r.phone}</div>
                  </td>

                  <td className="p-3">{formatDate(r.event_date)}</td>

                  <td className="p-3">{r.guest_count}</td>

                  <td className="p-3">
                    {r.package_type || 'No package'}
                  </td>

                  <td className="p-3">
                    <span className="rounded-full bg-stone-100 px-3 py-1 text-xs capitalize">
                      {r.status}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {statuses
                        .filter((s) => s !== r.status)
                        .map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => updateStatus(r.id, s)}
                            className="btn-secondary text-xs px-2 py-1"
                          >
                            {s}
                          </button>
                        ))}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}