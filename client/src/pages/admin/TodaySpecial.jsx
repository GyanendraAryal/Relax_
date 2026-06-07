import { useEffect, useState } from 'react';
import { todaySpecialApi } from '../../api/todaySpecial.api.js';
import { menuApi } from '../../api/menu.api.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import Alert from '../../components/Alert.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';
import { formatPrice, formatDate } from '../../utils/format.js';

export default function TodaySpecial() {
  const [specials, setSpecials] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: '', type: 'success' });
  const [confirmTarget, setConfirmTarget] = useState(null); // special to delete
  
  // 🟢 FIXED: Properly access index [0] to supply a valid ISO date string
  const [form, setForm] = useState({
    menu_item_id: '',
    special_price: '',
    note: '',
    special_date: new Date().toISOString().split('T')[0],
  });
  const [file, setFile] = useState(null);

  const load = async () => {
    try {
      const [s, menu] = await Promise.all([
        todaySpecialApi.getAll(), 
        menuApi.getAllItems()
      ]);
      setSpecials(s || []);
      setItems(menu || []);
    } catch (err) {
      console.error("❌ Failed to query admin today's special logs:", err);
    }
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await todaySpecialApi.create({
        menu_item_id: Number(form.menu_item_id),
        special_price: form.special_price ? Number(form.special_price) : null,
        note: form.note,
        special_date: form.special_date,
      }, file);
      
      setForm({
        menu_item_id: '',
        special_price: '',
        note: '',
        special_date: new Date().toISOString().split('T')[0],
      });
      setFile(null);
      const fileInput = document.getElementById('special-file-upload');
      if (fileInput) fileInput.value = '';
      await load();
      setAlert({ message: 'Special added successfully', type: 'success' });
    } catch (err) {
      setAlert({ message: err.message || 'Failed to add special', type: 'error' });
    }
  };

  const remove = async () => {
    if (!confirmTarget) return;
    try {
      await todaySpecialApi.delete(confirmTarget.id);
      await load();
      setAlert({ message: `Removed "${confirmTarget.item_name}"`, type: 'success' });
    } catch (err) {
      setAlert({ message: err.message || 'Failed to remove special', type: 'error' });
    } finally {
      setConfirmTarget(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Today&apos;s Special Dashboard</h1>
        <p className="text-sm text-stone-500 mt-1">Manage active promotional kitchen items and custom pricing metrics.</p>
      </div>

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ message: '', type: 'success' })} />

      <form onSubmit={onSubmit} className="card max-w-lg space-y-4 bg-white border border-stone-200 p-6 rounded-2xl shadow-sm">
        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Select Menu Item</label>
          <select 
            className="input-field w-full" 
            value={form.menu_item_id} 
            onChange={(e) => setForm({ ...form, menu_item_id: e.target.value })} 
            required
          >
            <option value="">Choose item...</option>
            {items.map((i) => (
              <option key={i.id} value={i.id}>{i.name} ({formatPrice(i.price)})</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Special Price</label>
            <input 
              className="input-field w-full" 
              type="number" 
              placeholder="Optional promo price" 
              value={form.special_price} 
              onChange={(e) => setForm({ ...form, special_price: e.target.value })} 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Promotion Date</label>
            <input 
              className="input-field w-full" 
              type="date" 
              value={form.special_date} 
              onChange={(e) => setForm({ ...form, special_date: e.target.value })} 
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Promo Note / Badge Text</label>
          <input 
            className="input-field w-full" 
            placeholder="e.g., Spicy Level 3, Chef Selection" 
            value={form.note} 
            onChange={(e) => setForm({ ...form, note: e.target.value })} 
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider">Custom Banner Image (Optional)</label>
          {/* 🟢 FIXED: Fixed runtime syntax crash on e.target.files definition targeting */}
          <input 
            id="special-file-upload"
            className="input-field w-full" 
            type="file" 
            accept="image/*" 
            onChange={(e) => setFile(e.target.files?.[0] || null)} 
          />
        </div>

        <button type="submit" className="btn-primary w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl transition">
          Add to Today's Specials
        </button>
      </form>

      {/* ── SQUARE CARD GRID FOR MANAGEMENT ITEMS ── */}
      <div className="pt-4">
        <h2 className="font-semibold text-stone-800 text-lg mb-4 border-b pb-2">Active Scheduled Specials ({specials.length})</h2>
        
        {specials.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-stone-200 rounded-2xl bg-stone-50/50">
            <p className="text-sm text-stone-500 font-medium">No items currently configured as specials.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {specials.map((s) => (
              <div 
                key={s.id} 
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-200/70 bg-white group shadow-sm hover:shadow transition aspect-square"
              >
                {/* Upper Half: Image Frame Section */}
                <div className="relative flex-1 bg-stone-50 min-h-0 w-full overflow-hidden">
                  {s.image_url ? (
                    <img 
                      src={s.image_url} 
                      alt={s.item_name} 
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100 text-4xl select-none">
                      🍽️
                    </div>
                  )}
                  
                  {/* Floating Date Badge */}
                  <span className="absolute bottom-3 right-3 rounded-md bg-stone-900/80 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold tracking-wider text-white">
                    {formatDate(s.special_date)}
                  </span>
                </div>

                {/* Lower Half: Metadata Details */}
                <div className="p-4 flex flex-col gap-1 shrink-0 bg-white border-t border-stone-100">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-stone-900 text-sm truncate capitalize max-w-[70%]">
                      {s.item_name}
                    </h3>
                    {s.special_price && (
                      <span className="text-xs font-bold text-brand-600 shrink-0 bg-brand-50 px-1.5 py-0.5 rounded">
                        {formatPrice(s.special_price)}
                      </span>
                    )}
                  </div>
                  
                  {s.note ? (
                    <p className="text-xs text-stone-400 line-clamp-1 min-h-[1.25rem]">
                      {s.note}
                    </p>
                  ) : (
                    <div className="min-h-[1.25rem]" />
                  )}

                  {/* Danger-styled delete control block */}
                  <div className="pt-2 mt-1 border-t border-stone-100 flex justify-end">
                    <button 
                      type="button" 
                      onClick={() => setConfirmTarget(s)} 
                      className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline transition"
                    >
                      Remove Special
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!confirmTarget}
        title="Remove Special"
        message={`Remove "${confirmTarget?.item_name}" from today's specials? This cannot be undone.`}
        confirmLabel="Remove"
        danger
        onConfirm={remove}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
