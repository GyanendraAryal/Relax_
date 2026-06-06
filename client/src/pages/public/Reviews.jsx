import { useEffect, useState } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/google-reviews')
      .then(res => res.json())
      .then(data => setReviews(data.reviews || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      
      <h1 className="text-3xl font-bold font-display text-forest-900 text-center">
        All Reviews
      </h1>

      <p className="mt-2 text-stone-600">
        What people say about Relax Station
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {reviews.map((r, i) => (
          <div
            key={i}
            className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-4"
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
                <h3 className="font-semibold text-stone-900 text-sm truncate">{r.author_name}</h3>
                <span className="text-[10px] text-stone-400 font-medium block mt-0.5">{r.relative_time_description}</span>
              </div>
              <div className="flex items-center text-yellow-400 text-xs shrink-0 self-start mt-0.5 ml-2">
                {"★".repeat(Math.round(r.rating || 5))}
              </div>
            </div>

            <p className="text-sm text-stone-600 leading-relaxed">
              {r.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}