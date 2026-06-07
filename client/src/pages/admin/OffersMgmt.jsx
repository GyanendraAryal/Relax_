import { useEffect, useState } from 'react';
import { offersApi } from '../../api/offers.api.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import Alert from '../../components/Alert.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';

const EMPTY_FORM = { title: '', description: '', discount_percent: '', valid_until: '', is_active: true };

export default function OffersMgmt() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ message: '', type: 'success' });
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [editTarget, setEditTarget] = useState(null); // offer being edited
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);

  const showAlert = (message, type = 'success') => setAlert({ message, type });

  const load = async () => {
    try {
      const data = await offersApi.getAll();
      setOffers(data || []);
    } catch (err) {
      showAlert(err.message || 'Failed to load offers', 'error');
    }
  };

  useEffect(() => { load().finally(() => setLoading(false)); }, []);

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setFile(null);
    setPreview('');
    setModalOpen(true);
  };

  const openEdit = (offer) => {
    setEditTarget(offer);
    setForm({
      title: offer.title,
      description: offer.description || '',
      discount_percent: offer.discount_percent ?? '',
      valid_until: offer.valid_until ? offer.valid_until.split('T')[0] : '',
      is_active: offer.is_active,
    });
    setFile(null);
    setPreview(offer.image_url || '');
    setModalOpen(true);
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        discount_percent: form.discount_percent ? Number(form.discount_percent) : null,
      };
      if (editTarget) {
        await offersApi.update(editTarget.id, payload, file);
        showAlert(`"${form.title}" updated`, 'success');
      } else {
        await offersApi.create(payload, file);
        showAlert(`"${form.title}" created`, 'success');
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      showAlert(err.message || 'Failed to save offer', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (offer) => {
    const original = offer.is_active;
    setOffers((prev) => prev.map((o) => o.id === offer.id ? { ...o, is_active: !original } : o));
    try {
      await offersApi.update(offer.id, { is_active: !original });
      showAlert(`"${offer.title}" ${!original ? 'activated' : 'deactivated'}`, 'success');
    } catch (err) {
      setOffers((prev) => prev.map((o) => o.id === offer.id ? { ...o, is_active: original } : o));
      showAlert(err.message || 'Failed to update offer', 'error');
    }
  };

  const handleDelete = async () => {
    if (!confirmTarget) return;
    try {
      await offersApi.delete(confirmTarget.id);
      await load();
      showAlert(`"${confirmTarget.title}" deleted`, 'success');
    } catch (err) {
      showAlert(err.message || 'Failed to delete offer', 'error');
    } finally {
      setConfirmTarget(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Offers Management</h1>
          <p className="text-sm text-stone-500 mt-0.5">Create and manage promotional offers shown on the public site.</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-1.5 rounded-xl px-4 py-2">
          <span>➕</span> Add Offer
        </button>
      </div>

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ message: '', type: 'success' })} />

      {offers.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-stone-200 rounded-2xl bg-stone-50">
          <div className="text-4xl mb-3 select-none">🎁</div>
          <p className="text-sm text-stone-500 font-medium">No offers yet. Create your first one.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((o) => (
            <div key={o.id} className="card flex flex-col gap-3 bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
              {o.image_url && (
                <div className="overflow-hidden rounded-xl aspect-video bg-stone-100">
                  <img src={o.image_url} alt={o.title} className="h-full w-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-stone-900 leading-tight">{o.title}</h3>
                  {o.discount_percent && (
                    <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                      {o.discount_percent}% OFF
                    </span>
                  )}
                </div>
                {o.description && (
                  <p className="mt-1 text-xs text-stone-500 line-clamp-2">{o.description}</p>
                )}
                {o.valid_until && (
                  <p className="mt-1 text-xs text-stone-400">Valid until {o.valid_until.split('T')[0]}</p>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-stone-100 pt-3">
                <button
                  type="button"
                  onClick={() => handleToggleActive(o)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    o.is_active ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {o.is_active ? 'Active' : 'Inactive'}
                </button>
                <div className="flex gap-3">
                  <button onClick={() => openEdit(o)}
                    className="text-xs font-semibold text-stone-600 hover:text-stone-900 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => setConfirmTarget(o)}
                    className="text-xs font-semibold text-red-600 hover:text-red-800 hover:underline">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-100 my-8 space-y-4">
            <h3 className="text-lg font-bold text-stone-900">
              {editTarget ? 'Edit Offer' : 'Create Offer'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Title</label>
                <input className="input-field" placeholder="e.g. Weekend Special" required
                  value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Description</label>
                <textarea className="input-field h-20 resize-none" placeholder="Describe the offer..."
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Discount %</label>
                  <input type="number" min="0" max="100" className="input-field" placeholder="e.g. 20"
                    value={form.discount_percent} onChange={(e) => setForm({ ...form, discount_percent: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Valid Until</label>
                  <input type="date" className="input-field"
                    value={form.valid_until} onChange={(e) => setForm({ ...form, valid_until: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Image</label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl border border-stone-200 overflow-hidden bg-stone-50 flex items-center justify-center shrink-0">
                    {preview ? <img src={preview} alt="Preview" className="h-full w-full object-cover" /> : <span className="text-xl">🎁</span>}
                  </div>
                  <div>
                    <input type="file" accept="image/*" id="offer-file" className="hidden" onChange={handleFileChange} />
                    <label htmlFor="offer-file" className="btn-secondary py-1.5 px-3 rounded-lg text-xs cursor-pointer select-none">
                      {editTarget ? 'Change Image' : 'Choose File'}
                    </label>
                  </div>
                </div>
              </div>
              <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                <input type="checkbox" checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="rounded text-brand-600 focus:ring-brand-500" />
                Active (visible on public site)
              </label>
              <div className="flex gap-3 pt-4 border-t border-stone-100">
                <button type="button" onClick={() => setModalOpen(false)} disabled={submitting}
                  className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-600 bg-stone-100 rounded-xl hover:bg-stone-200 transition">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-brand-600 rounded-xl hover:bg-brand-500 transition">
                  {submitting ? 'Saving...' : editTarget ? 'Save Changes' : 'Create Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!confirmTarget}
        title="Delete Offer"
        message={`Delete "${confirmTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
