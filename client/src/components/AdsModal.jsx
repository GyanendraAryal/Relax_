import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { todaySpecialApi } from '../api/todaySpecial.api.js';
import { offersApi } from '../api/offers.api.js';
import { formatPrice } from '../utils/format.js';

const AUTO_CLOSE_SECONDS = 10; // modal closes after N seconds if not dismissed
const SLIDE_INTERVAL_MS = 3200;  // each slide shows for this long (ms)
const SESSION_KEY = 'rs_ads_modal_shown';

/** Promotional Ads Banner — shown once per session on first visit */
export default function AdsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [countdown, setCountdown] = useState(AUTO_CLOSE_SECONDS);
  const [loading, setLoading] = useState(true);

  const slideTimer  = useRef(null);
  const closeTimer  = useRef(null);
  const countTimer  = useRef(null);

  // ── Fetch data & open modal once per session ─────────────────────────────
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return; // already shown this session

    Promise.all([
      todaySpecialApi.getToday().catch(() => []),
      offersApi.getPublic().catch(() => []),
    ]).then(([specials, offers]) => {
      const specialSlides = (Array.isArray(specials) ? specials : []).map((s) => ({
        id:        `special-${s.id}`,
        type:      'special',
        image:     s.item_image || null,
        title:     s.item_name,
        subtitle:  s.note || "Today's Special",
        badge:     '🔥 Today\'s Special',
        badgeCls:  'bg-brand-600',
        price:     s.special_price || s.regular_price,
        origPrice: s.special_price ? s.regular_price : null,
        link:      '/menu',
        linkLabel: 'View Menu',
      }));

      const offerSlides = (Array.isArray(offers) ? offers : []).map((o) => ({
        id:        `offer-${o.id}`,
        type:      'offer',
        image:     o.image_url || null,
        title:     o.title,
        subtitle:  o.description || '',
        badge:     o.discount_percent ? `🏷️ ${o.discount_percent}% OFF` : '🎁 Special Offer',
        badgeCls:  'bg-emerald-600',
        price:     null,
        origPrice: null,
        link:      '/offers',
        linkLabel: 'See Offers',
      }));

      const all = [...specialSlides, ...offerSlides];
      if (all.length === 0) return; // nothing to show — stay closed

      setSlides(all);
      setIsOpen(true);
    }).finally(() => setLoading(false));
  }, []);

  // ── Start timers once modal opens ─────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || slides.length === 0) return;

    // Auto-slide
    if (slides.length > 1) {
      slideTimer.current = setInterval(() => {
        setCurrent((c) => (c + 1) % slides.length);
      }, SLIDE_INTERVAL_MS);
    }

    // Countdown ticker
    setCountdown(AUTO_CLOSE_SECONDS);
    countTimer.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(countTimer.current); return 0; }
        return c - 1;
      });
    }, 1000);

    // Auto-close
    closeTimer.current = setTimeout(close, AUTO_CLOSE_SECONDS * 1000);

    return () => clearTimers();
  }, [isOpen, slides.length]);

  function clearTimers() {
    clearInterval(slideTimer.current);
    clearInterval(countTimer.current);
    clearTimeout(closeTimer.current);
  }

  function close() {
    clearTimers();
    sessionStorage.setItem(SESSION_KEY, '1');
    setIsOpen(false);
  }

  function goTo(idx) {
    setCurrent(idx);
    // Reset slide interval on manual nav
    clearInterval(slideTimer.current);
    if (slides.length > 1) {
      slideTimer.current = setInterval(() => {
        setCurrent((c) => (c + 1) % slides.length);
      }, SLIDE_INTERVAL_MS);
    }
  }

  function prev() { goTo((current - 1 + slides.length) % slides.length); }
  function next() { goTo((current + 1) % slides.length); }

  if (loading || slides.length === 0) return null;

  const slide = slides[current];

  // Progress ring circumference
  const R = 16;
  const CIRC = 2 * Math.PI * R;
  const progress = ((AUTO_CLOSE_SECONDS - countdown) / AUTO_CLOSE_SECONDS) * CIRC;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

          {/* ── Blurred Backdrop ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* ── Modal Card ── */}
          <motion.div
            key="ads-modal-card"
            initial={{ opacity: 0, scale: 0.92, y: 32 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.92, y: 24  }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl bg-white"
            style={{ maxHeight: '90vh' }}
          >

            {/* ── Slide Area ── */}
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0  }}
                  exit={{    opacity: 0, x: -60 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                >
                  {/* Slide Image / Gradient */}
                  <div className="relative h-56 w-full overflow-hidden">
                    {slide.image ? (
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-forest-900 via-forest-800 to-brand-800 flex items-center justify-center">
                        <span className="text-7xl select-none">🍽️</span>
                      </div>
                    )}
                    {/* Dark gradient overlay at bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Badge */}
                    <span className={`absolute top-4 left-4 text-xs font-bold uppercase tracking-wider text-white px-3 py-1 rounded-full ${slide.badgeCls}`}>
                      {slide.badge}
                    </span>
                  </div>

                  {/* Slide Content */}
                  <div className="px-6 pt-5 pb-3">
                    <h2 className="font-display text-xl font-bold text-stone-900 leading-tight">
                      {slide.title}
                    </h2>
                    {slide.subtitle && (
                      <p className="mt-1 text-sm text-stone-500 line-clamp-2">
                        {slide.subtitle}
                      </p>
                    )}
                    {slide.price != null && (
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-brand-700">
                          {formatPrice(slide.price)}
                        </span>
                        {slide.origPrice && (
                          <span className="text-sm text-stone-400 line-through">
                            {formatPrice(slide.origPrice)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Divider ── */}
            <div className="mx-6 border-t border-stone-100" />

            {/* ── Controls & CTA Row ── */}
            <div className="flex items-center justify-between px-6 py-4 gap-4">

              {/* Dot indicators + arrow nav */}
              <div className="flex items-center gap-2">
                {slides.length > 1 && (
                  <button
                    onClick={prev}
                    aria-label="Previous slide"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 transition"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                <div className="flex items-center gap-1.5">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      className={`rounded-full transition-all duration-300 ${
                        i === current
                          ? 'w-5 h-2 bg-brand-600'
                          : 'w-2 h-2 bg-stone-300 hover:bg-stone-400'
                      }`}
                    />
                  ))}
                </div>

                {slides.length > 1 && (
                  <button
                    onClick={next}
                    aria-label="Next slide"
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 transition"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>

              {/* CTA Button */}
              <Link
                to={slide.link}
                onClick={close}
                className="rounded-xl bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition active:scale-95"
              >
                {slide.linkLabel}
              </Link>
            </div>

            {/* ── Close button with countdown ring ── */}
            <button
              onClick={close}
              aria-label="Close promotional banner"
              className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/50 transition focus:outline-none focus:ring-2 focus:ring-white"
            >
              {/* SVG progress ring */}
              <svg className="absolute h-10 w-10 -rotate-90" viewBox="0 0 40 40">
                <circle
                  cx="20" cy="20" r={R}
                  fill="none"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="2.5"
                />
                <circle
                  cx="20" cy="20" r={R}
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeDasharray={CIRC}
                  strokeDashoffset={CIRC - progress}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              {/* X icon */}
              <svg className="relative h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* ── Countdown text ── */}
            <div className="absolute top-3 left-4">
              <span className="rounded-full bg-black/30 px-2.5 py-0.5 text-[11px] font-medium text-white/80 backdrop-blur-sm">
                Closes in {countdown}s
              </span>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
