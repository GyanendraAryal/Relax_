import { useEffect, useState } from 'react';
import { galleryApi } from '../../api/gallery.api.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import Alert from '../../components/Alert.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';

export default function GalleryMgmt() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ message: '', type: 'success' });
  const [form, setForm] = useState({ title: '', caption: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [confirmTarget, setConfirmTarget] = useState(null);

  const showAlert = (message, type = 'success') => setAlert({ message, type });

  const load = async () => {
    try {
      const data = await galleryApi.getAll();
      setImages(data || []);
    } catch (err) {
      showAlert(err.message || 'Failed to load gallery', 'error');
    }
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return showAlert('Please select an image to upload', 'error');
    setSubmitting(true);
    try {
      await galleryApi.create(form, file);
      setForm({ title: '', caption: '' });
      setFile(null);
      setPreview('');
      await load();
      showAlert('Image uploaded successfully', 'success');
    } catch (err) {
      showAlert(err.message || 'Failed to upload image', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmTarget) return;
    try {
      await galleryApi.delete(confirmTarget.id);
      await load();
      showAlert(`"${confirmTarget.title || 'Image'}" deleted`, 'success');
    } catch (err) {
      showAlert(err.message || 'Failed to delete image', 'error');
    } finally {
      setConfirmTarget(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Gallery Management</h1>
        <p className="text-sm text-stone-500 mt-0.5">Upload and manage photos shown on the public gallery page.</p>
      </div>

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ message: '', type: 'success' })} />

      {/* Upload Form */}
      <form onSubmit={onSubmit} className="card max-w-lg space-y-4 bg-white border border-stone-200 p-6 rounded-2xl shadow-sm">
        <h2 className="font-semibold text-stone-800">Upload New Image</h2>

        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Title</label>
          <input className="input-field" placeholder="e.g. Rooftop View" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Caption</label>
          <input className="input-field" placeholder="Short description" value={form.caption}
            onChange={(e) => setForm({ ...form, caption: e.target.value })} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Image</label>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl border border-stone-200 overflow-hidden bg-stone-50 flex items-center justify-center shrink-0">
              {preview
                ? <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                : <span className="text-2xl select-none">🖼️</span>}
            </div>
            <div>
              <input type="file" accept="image/*" id="gallery-file" className="hidden" onChange={handleFileChange} />
              <label htmlFor="gallery-file"
                className="btn-secondary py-1.5 px-3 rounded-lg text-xs cursor-pointer select-none">
                Choose File
              </label>
              {file && <p className="text-xs text-stone-500 mt-1 truncate max-w-[180px]">{file.name}</p>}
            </div>
          </div>
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full py-2.5">
          {submitting ? 'Uploading...' : 'Upload Image'}
        </button>
      </form>

      {/* Gallery Grid */}
      <div>
        <h2 className="font-semibold text-stone-800 text-lg mb-4 border-b pb-2">
          Gallery ({images.length} images)
        </h2>

        {images.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-stone-200 rounded-2xl bg-stone-50">
            <p className="text-sm text-stone-500">No images uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {images.map((img) => (
              <div key={img.id} className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 shadow-sm">
                <img src={img.image_url} alt={img.title}
                  className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105" />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100">
                  {img.title && (
                    <p className="text-xs font-semibold text-white truncate">{img.title}</p>
                  )}
                  {img.caption && (
                    <p className="text-[10px] text-white/80 truncate">{img.caption}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setConfirmTarget(img)}
                  className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white text-xs opacity-0 group-hover:opacity-100 transition hover:bg-red-700 shadow"
                  aria-label="Delete image"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!confirmTarget}
        title="Delete Image"
        message={`Delete "${confirmTarget?.title || 'this image'}" from the gallery? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
