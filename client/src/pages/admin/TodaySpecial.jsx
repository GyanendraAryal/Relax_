import { useEffect, useState } from 'react';
import { todaySpecialApi } from '../../api/todaySpecial.api.js';
import { menuApi } from '../../api/menu.api.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import { formatPrice, formatDate } from '../../utils/format.js';

export default function TodaySpecial() {
  const [specials, setSpecials] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    menu_item_id: '',
    special_price: '',
    note: '',
    special_date: new Date().toISOString().split('T')[0],
  });
  const [file, setFile] = useState(null);

  const load = async () => {
    const [s, menu] = await Promise.all([todaySpecialApi.getAll(), menuApi.getItems()]);
    setSpecials(s);
    setItems(menu);
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    await todaySpecialApi.create({
      menu_item_id: Number(form.menu_item_id),
      special_price: form.special_price ? Number(form.special_price) : null,
      note: form.note,
      special_date: form.special_date,
    }, file);
    setForm({ ...form, menu_item_id: '', special_price: '', note: '' });
    setFile(null);
    await load();
  };

  const remove = async (id) => {
    await todaySpecialApi.delete(id);
    await load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold">Today&apos;s Special</h1>
      <form onSubmit={onSubmit} className="card mt-6 max-w-lg space-y-3">
        <select className="input-field" value={form.menu_item_id} onChange={(e) => setForm({ ...form, menu_item_id: e.target.value })} required>
          <option value="">Menu item</option>
          {items.map((i) => (
            <option key={i.id} value={i.id}>{i.name} ({formatPrice(i.price)})</option>
          ))}
        </select>
        <input className="input-field" type="number" placeholder="Special price (optional)" value={form.special_price} onChange={(e) => setForm({ ...form, special_price: e.target.value })} />
        <input className="input-field" type="date" value={form.special_date} onChange={(e) => setForm({ ...form, special_date: e.target.value })} />
        <input className="input-field" placeholder="Note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        <div className="space-y-1">
          <label className="block text-xs font-medium text-stone-500">Custom Banner Image (Optional)</label>
          <input className="input-field" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0])} />
        </div>
        <button type="submit" className="btn-primary">Add Special</button>
      </form>
      <ul className="mt-8 space-y-2">
        {specials.map((s) => (
          <li key={s.id} className="card flex items-center justify-between py-3">
            <div className="flex items-center gap-4">
              {s.image_url && (
                <img src={s.image_url} alt="" className="h-12 w-12 rounded object-cover shrink-0 border" />
              )}
              <div>
                <span className="font-medium">{s.item_name}</span>
                <span className="ml-2 text-sm text-stone-500">{formatDate(s.special_date)}</span>
                {s.note && <p className="text-xs text-stone-400 mt-0.5">{s.note}</p>}
              </div>
            </div>
            <button type="button" onClick={() => remove(s.id)} className="text-sm text-red-600">Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
