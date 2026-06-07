import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios.js';

export default function GoogleReviewSlider() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);
  // Track whether user is manually scrolling so we can reset the timer
  const userScrollingRef = useRef(false);
  const userScrollTimerRef = useRef(null);

  useEffect(() => {
    api.get('/google-reviews')
      .then((r) => setReviews(r.data.reviews || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  // ── Auto-slider ───────────────────────────────────────────────────────────
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || reviews.length === 0) return;

    const getCardWidth = () => {
      const first = slider.querySelector('[data-review-card]');
      return first ? first.offsetWidth + 16 : 316; // 16 = gap-4
    };

    const tick = () => {
      // Don't auto-scroll if tab is hidden or user is manually scrolling
      if (document.hidden || userScrollingRef.current) return;

      const cardWidth = getCardWidth();
      const maxScrollLeft = slider.scrollWidth - slider.clientWidth;

      if (slider.scrollLeft + cardWidth >= maxScrollLeft) {
        slider.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        slider.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    };

    const startInterval = () => {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(tick, 4000);
    };

    // Detect manual scrolling — pause auto-scroll for 6s after user touches it
    const handleScroll = () => {
      userScrollingRef.current = true;
      clearTimeout(userScrollTimerRef.current);
      userScrollTimerRef.current = setTimeout(() => {
        userScrollingRef.current = false;
      }, 6000);
    };

    // Pause when tab is hidden, resume when visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(intervalRef.current);
      } else {
        startInterval();
      }
    };

    slider.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    startInterval();

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(userScrollTimerRef.current);
      slider.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [reviews]);

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

        <div
          ref={sliderRef}
          className="mt-8 flex gap-4 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
        >
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              data-review-card
              // Use animate (not whileInView) — cards inside a scroll container
              // don't work reliably with IntersectionObserver-based whileInView
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="min-w-[300px] max-w-[300px] bg-white border border-stone-200 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center">
                <img
                  src={r.profile_photo_url || '/avatar-fallback.svg'}
                  // Do NOT use referrerPolicy="no-referrer" — Google's CDN
                  // uses the referrer to validate requests. Stripping it causes 403s.
                  // Fall back to placeholder on any load error instead.
                  onError={(e) => {
                    e.currentTarget.onerror = null; // prevent infinite retry loop
                    e.currentTarget.src = '/avatar-fallback.svg';
                  }}
                  alt={r.author_name || 'User'}
                  className="w-10 h-10 rounded-full object-cover border border-stone-100 mr-3 shrink-0 bg-stone-50"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-stone-900 text-sm truncate">
                    {r.author_name}
                  </h4>
                  <span className="text-[10px] text-stone-400 font-medium block mt-0.5">
                    {r.relative_time_description}
                  </span>
                </div>

                <div className="flex items-center text-yellow-400 text-xs shrink-0 self-start mt-0.5 ml-2">
                  {'★'.repeat(Math.round(r.rating || 5))}
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
