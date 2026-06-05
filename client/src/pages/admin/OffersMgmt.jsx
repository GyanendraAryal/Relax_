import { useEffect, useState } from 'react';
import { offersApi } from '../../api/offers.api.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import Alert from '../../components/Alert.jsx';

export default function OffersMgmt() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState('');
  const [form, setForm] = useState({ title: '', description: '', discount_percent: '', valid_until: '' });
  const [file, setFile] = useState(null);

  const load = () => offersApi.getAll().then(setOffers);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await offersApi.create(
        { ...form, discount_percent: form.discount_percent ? Number(form.discount_percent) : null },
        file
      );
      setForm({ title: '', description: '', discount_percent: '', valid_until: '' });
      setFile(null);
      await load();
      setAlert('Offer created');
    } catch (err) {
      setAlert(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete offer?')) return;
    await offersApi.delete(id);
    await load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold">Offers Management</h1>
      <Alert type="success" message={alert} onClose={() => setAlert('')} />

      <form onSubmit={onSubmit} className="card mt-6 max-w-lg space-y-3">
        <input className="input-field" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <textarea className="input-field" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className="input-field" type="number" placeholder="Discount %" value={form.discount_percent} onChange={(e) => setForm({ ...form, discount_percent: e.target.value })} />
        <input className="input-field" type="date" value={form.valid_until} onChange={(e) => setForm({ ...form, valid_until: e.target.value })} />
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0])} />
        <button type="submit" className="btn-primary">Create Offer</button>
      </form>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {offers.map((o) => (
          <div key={o.id} className="card flex gap-4">
            {o.image_url && <img src={o.image_url} alt="" className="h-20 w-20 rounded object-cover" />}
            <div className="flex-1">
              <h3 className="font-semibold">{o.title}</h3>
              <p className="text-sm text-stone-500">{o.is_active ? 'Active' : 'Inactive'}</p>
              <button type="button" onClick={() => remove(o.id)} className="mt-2 text-sm text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
