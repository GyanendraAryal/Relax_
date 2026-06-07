import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageLightbox({ images, index, setIndex, onClose }) {
  if (index === null) return null;

  const current = images[index];
  const total = images.length;

  const next = () => setIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  const prev = () => setIndex((prev) => (prev === 0 ? total - 1 : prev - 1));

  // index in deps array prevents stale closure — next/prev always use current index
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };

    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = 'auto';
    };
  }, [index, total]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.img
          key={current.id}
          src={current.image_url}
          alt={current.title || 'Image'}
          className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        />

        {/* Image counter */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
          {index + 1} / {total}
        </div>

        {/* Close */}
        <button className="absolute top-5 right-5 text-white text-2xl font-bold" onClick={onClose}>
          ✕
        </button>

        {/* Prev */}
        <button
          className="absolute left-5 text-white text-3xl"
          onClick={(e) => { e.stopPropagation(); prev(); }}
        >
          ‹
        </button>

        {/* Next */}
        <button
          className="absolute right-5 text-white text-3xl"
          onClick={(e) => { e.stopPropagation(); next(); }}
        >
          ›
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
