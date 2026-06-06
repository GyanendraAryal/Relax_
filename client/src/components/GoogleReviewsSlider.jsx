import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function GoogleReviewSlider() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch('/api/google-reviews'); 
        const data = await res.json();
        setReviews(data.reviews || []);
      } catch (err) {
        console.error('Failed to load reviews', err);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="py-10 text-center text-stone-500">
        Loading reviews...
      </div>
    );
  }

  if (!reviews.length) return null;

  return (
    <section className="bg-stone-50 py-14">
      <div className="mx-auto max-w-6xl px-4">
        
        <h2 className="text-2xl font-bold font-display text-forest-900">
          What Customers Say
        </h2>
        <p className="text-stone-600 mt-1">
          Real reviews from Google
        </p>

        <div className="mt-8 flex gap-4 overflow-x-auto scroll-smooth pb-4">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="min-w-[300px] max-w-[300px] bg-white border border-stone-200 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center">
                <img
                  src={r.profile_photo_url || "/avatar-fallback.png"}
                  onError={(e) => { e.target.src = "/avatar-fallback.png"; }}
                  referrerPolicy="no-referrer"
                  alt={r.author_name || "User"}
                  className="w-10 h-10 rounded-full object-cover border border-stone-100 mr-3 shrink-0 bg-stone-50"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-stone-900 text-sm truncate">{r.author_name}</h4>
                  <span className="text-[10px] text-stone-400 font-medium block mt-0.5">{r.relative_time_description}</span>
                </div>
                <div className="flex items-center text-yellow-400 text-xs shrink-0 self-start mt-0.5 ml-2">
                  {"★".repeat(Math.round(r.rating || 5))}
                </div>
              </div>

              <p className="mt-4 text-sm text-stone-600 line-clamp-5 leading-relaxed">
                {r.text}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}