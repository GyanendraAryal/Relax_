import { motion } from 'framer-motion';
import { formatPrice } from '../utils/format.js';

export default function MenuItemCard({ item }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card flex gap-4 overflow-hidden p-0"
    >
      {item.image_url && (
        <img
          src={item.image_url}
          alt={item.name}
          className="h-32 w-32 shrink-0 object-cover sm:h-36 sm:w-36"
        />
      )}
      <div className="flex flex-1 flex-col justify-center p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold text-forest-900">{item.name}</h3>
          <span className="font-semibold text-brand-700">{formatPrice(item.price)}</span>
        </div>
        {item.description && (
          <p className="mt-1 text-sm text-stone-600 line-clamp-2">{item.description}</p>
        )}
        <div className="mt-2 flex flex-wrap gap-2">
          {item.is_vegetarian && (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">Veg</span>
          )}
          {item.is_spicy && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-800">Spicy</span>
          )}
          {item.is_featured && (
            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs text-brand-800">Featured</span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
