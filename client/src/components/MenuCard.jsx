import { motion } from 'framer-motion';
import { formatPrice } from '../utils/format.js';

export default function MenuCard({ name, description, price, image, isSpecial, isAvailable = true }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative flex flex-col md:flex-row overflow-hidden rounded-3xl border border-stone-200/60 bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* Badges container */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {isSpecial && (
          <span className="rounded-full bg-amber-500 px-3 py-1 text-[11px] font-bold text-white shadow-sm flex items-center gap-1 select-none">
            <span>⭐</span> Special
          </span>
        )}
        {!isAvailable && (
          <span className="rounded-full bg-stone-800/95 backdrop-blur-sm px-3 py-1 text-[11px] font-bold text-stone-200 shadow-sm select-none">
            Unavailable
          </span>
        )}
      </div>

      {/* Image container */}
      <div className="relative aspect-video w-full overflow-hidden bg-stone-50 md:aspect-square md:w-36 md:shrink-0">
        {image ? (
          <img
            src={image}
            alt={name}
            loading="lazy"
            className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
              !isAvailable ? 'grayscale opacity-75' : ''
            }`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100/50 text-4xl select-none">
            🍽️
          </div>
        )}
      </div>

      {/* Details container */}
      <div className="flex flex-1 flex-col justify-between p-5 md:p-6">
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-display text-lg font-bold text-forest-900 group-hover:text-brand-600 transition-colors duration-200">
              {name}
            </h3>
            <span className="font-semibold text-brand-700 shrink-0 text-base">
              {formatPrice(price)}
            </span>
          </div>
          {description ? (
            <p className="text-sm text-stone-500 leading-relaxed line-clamp-2 pr-2">
              {description}
            </p>
          ) : (
            <p className="text-sm text-stone-400 italic">No description available.</p>
          )}
        </div>

        {/* Footer/Meta section inside the card */}
        <div className="mt-4 flex items-center justify-between text-xs text-stone-400 border-t border-stone-100 pt-3">
          <span className="font-medium text-stone-500">Relax Station Choice</span>
          {isAvailable ? (
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Available
            </span>
          ) : (
            <span className="flex items-center gap-1 text-stone-400 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-stone-400" /> Out of stock
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
