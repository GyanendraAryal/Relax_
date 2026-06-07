import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { offersApi } from '../../api/offers.api.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { formatDate, formatPrice } from '../../utils/format.js';

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    offersApi.getPublic()
      .then((res) => {
        // Safely extract array if backend wraps it in a data property
        if (Array.isArray(res)) {
          setOffers(res);
        } else if (res && Array.isArray(res.data)) {
          setOffers(res.data);
        } else {
          setOffers([]);
        }
      })
      .catch((err) => {
        console.error("Offers API network error:", err);
        setOffers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  // Safely guard against null/undefined data values
  const safeOffers = Array.isArray(offers) ? offers : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-forest-900">Special Offers</h1>
      <p className="mt-2 text-stone-600">Save more on your next visit</p>

      {/* FIXED: Uses the safe fallback array */}
      {safeOffers.length === 0 ? (
        <EmptyState title="No active offers" description="Follow us for upcoming deals!" />
      ) : (
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {safeOffers.map((offer, i) => (
            <motion.article
              key={offer.id || i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card overflow-hidden p-0"
            >
              {offer.image_url && (
                <img src={offer.image_url} alt={offer.title} className="h-48 w-full object-cover" />
              )}
              <div className="p-6">
                <h2 className="font-display text-xl font-semibold">{offer.title}</h2>
                {offer.description && <p className="mt-2 text-sm text-stone-600">{offer.description}</p>}
                <p className="mt-3 text-lg font-bold text-brand-700">
                  {offer.discount_percent
                    ? `${offer.discount_percent}% OFF`
                    : offer.discount_amount
                      ? `${formatPrice(offer.discount_amount)} OFF`
                      : 'Special Deal'}
                </p>
                {(offer.valid_from || offer.valid_until) && (
                  <p className="mt-2 text-xs text-stone-500">
                    Valid: {formatDate(offer.valid_from)} — {formatDate(offer.valid_until)}
                  </p>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
