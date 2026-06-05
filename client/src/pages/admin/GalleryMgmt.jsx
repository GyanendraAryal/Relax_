import { useEffect, useState } from 'react';
import { galleryApi } from '../../api/gallery.api.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';

export default function GalleryMgmt() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', caption: '' });
  const [file, setFile] = useState(null);

  const load = () => galleryApi.getAll().then(setImages);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Image required');
    await galleryApi.create(form, file);
    setForm({ title: '', caption: '' });
    setFile(null);
    await load();
  };

  const remove = async (id) => {
    if (!confirm('Delete image?')) return;
    await galleryApi.delete(id);
    await load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold">Gallery Management</h1>
      <form onSubmit={onSubmit} className="card mt-6 max-w-lg space-y-3">
        <input className="input-field" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="input-field" placeholder="Caption" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} />
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0])} required />
        <button type="submit" className="btn-primary">Upload</button>
      </form>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {images.map((img) => (
          <div key={img.id} className="relative overflow-hidden rounded-lg">
            <img src={img.image_url} alt={img.title} className="aspect-square w-full object-cover" />
            <button type="button" onClick={() => remove(img.id)} className="absolute right-2 top-2 rounded bg-red-600 px-2 py-1 text-xs text-white">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
