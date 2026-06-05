import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { galleryApi } from '../../api/gallery.api.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import EmptyState from '../../components/EmptyState.jsx';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    galleryApi.getPublic().then(setImages).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-forest-900">Gallery</h1>
      <p className="mt-2 text-stone-600">Moments from Relax Station</p>

      {images.length === 0 ? (
        <EmptyState title="No photos yet" />
      ) : (
        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {images.map((img, i) => (
            <motion.figure
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="mb-4 break-inside-avoid overflow-hidden rounded-xl shadow-md"
            >
              <img src={img.image_url} alt={img.title || 'Gallery'} className="w-full object-cover" />
              {(img.title || img.caption) && (
                <figcaption className="bg-white p-3 text-sm">
                  {img.title && <p className="font-medium">{img.title}</p>}
                  {img.caption && <p className="text-stone-500">{img.caption}</p>}
                </figcaption>
              )}
            </motion.figure>
          ))}
        </div>
      )}
    </div>
  );
}
