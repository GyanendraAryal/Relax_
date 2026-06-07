import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { galleryApi } from '../../api/gallery.api.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import ImageLightbox from '../../components/ImageLightbox.jsx';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    galleryApi.getPublic().then(setImages).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      
      {/* HEADER (slightly refined typography spacing) */}
      <h1 className="font-display text-4xl font-bold text-forest-900 tracking-tight">
        Gallery
      </h1>
      <p className="mt-2 text-stone-500 text-sm">
        Moments from Relax Station — captured experiences, vibes & memories
      </p>

      {images.length === 0 ? (
        <EmptyState title="No photos yet" />
      ) : (
        <div className="mt-12 columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((img, i) => {

            const heightClass =
              i % 7 === 0 ? 'aspect-[4/5]' :
              i % 5 === 0 ? 'aspect-[1/1]' :
              i % 3 === 0 ? 'aspect-[3/4]' :
              'aspect-[4/3]';

            return (
              <motion.figure
                key={img.id}
                onClick={() => setActiveIndex(i)}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.02 }}
                
                className="
                  mb-6 cursor-pointer break-inside-avoid
                  overflow-hidden rounded-3xl
                  bg-white border border-stone-100
                  shadow-sm hover:shadow-2xl
                  transition-all duration-300
                  group
                "
              >
                {/* IMAGE WRAPPER */}
                <div className={`relative w-full ${heightClass} overflow-hidden`}>
                  
                  <img
                    src={img.image_url}
                    alt={img.title || 'Gallery'}
                    className="
                      h-full w-full object-cover
                      transition-transform duration-700
                      group-hover:scale-110
                    "
                  />

                  {/* softer cinematic overlay */}
                  <div className="
                    absolute inset-0
                    bg-gradient-to-t from-black/50 via-black/10 to-transparent
                    opacity-0 group-hover:opacity-100
                    transition duration-300
                  " />

                  {/* subtle shine effect */}
                  <div className="
                    absolute inset-0
                    bg-white/10 opacity-0
                    group-hover:opacity-100
                    transition
                  " />
                </div>

                {/* CAPTION */}
                {(img.title || img.caption) && (
                  <figcaption className="p-5 bg-white">
                    
                    {img.title && (
                      <p className="font-semibold text-stone-900 text-sm tracking-tight">
                        {img.title}
                      </p>
                    )}

                    {img.caption && (
                      <p className="mt-1 text-xs text-stone-500 leading-relaxed">
                        {img.caption}
                      </p>
                    )}

                  </figcaption>
                )}
              </motion.figure>
            );
          })}
        </div>
      )}

      {/* LIGHTBOX (unchanged logic) */}
      <ImageLightbox
        images={images}
        index={activeIndex}
        setIndex={setActiveIndex}
        onClose={() => setActiveIndex(null)}
      />
    </div>
  );
}