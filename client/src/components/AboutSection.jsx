import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// ── Simple Count-Up Hook ──
function useAnimatedCount(targetValue, durationMs = 2000, triggerCondition = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Allow targetValue === 0 to animate correctly
    if (!triggerCondition || targetValue < 0) return;

    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);
      
      // Easing function to slow down near the end
      const easeOutQuad = progress * (2 - progress);
      setCount(Math.floor(easeOutQuad * targetValue));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [targetValue, durationMs, triggerCondition]);

  return count;
}

export default function AboutSection({ about = {} }) {
  const title = about.title || 'About Us';
  const content = about.content || 'Relax Station Food and Fun is a family-friendly restaurant in Kathmandu offering delicious cuisine, birthday packages, and event hosting.';
  const openingHours = about.hours || 'Open Daily: 11:00 AM - 10:00 PM';
  
  // Custom numeric stats fields (Fallback presets)
  const targetBirthdays = about.birthdaysCount || 1250;
  const targetEvents = about.eventsCount || 450;

  const highlights = about.highlights || [
    '✨ Family Friendly Environment',
    '🎉 Custom Birthday Event Packages',
    '🍔 Freshly Sourced Local Ingredients',
  ];

  // Ref setup to detect when section scrolls onto the monitor screen
  const containerRef = useRef(null);
  const isSectionInView = useInView(containerRef, { once: true, margin: "-100px" });

  // ── Years of Service ──────────────────────────────────────────────────────
  const foundingYear = Number(about.foundingYear || 2020);
  const currentYear  = new Date().getFullYear();
  const targetYears  = Math.max(currentYear - foundingYear, 0);

  // ── Animated counters (all triggered when section scrolls into view) ──────
  const animatedBirthdays = useAnimatedCount(targetBirthdays, 2000, isSectionInView);
  const animatedEvents    = useAnimatedCount(targetEvents,    2000, isSectionInView);
  const animatedYears     = useAnimatedCount(targetYears,     1800, isSectionInView);

  return (
    <section ref={containerRef} className="bg-white py-20 border-t border-stone-100">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-12 lg:grid-cols-3">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isSectionInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-display text-3xl font-bold text-forest-900 tracking-tight">
                {title}
              </h2>
              <p className="mt-4 text-stone-600 leading-relaxed text-base">
                {content}
              </p>
            </motion.div>

            {/* Highlights bullets list */}
            <div className="pt-4 grid gap-3 sm:grid-cols-2">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-stone-700 font-medium">
                  {highlight}
                </div>
              ))}
            </div>

            {/* Stats Counter Grid — 3 columns */}
            <div className="mt-8 pt-6 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-stone-50/60 p-4 rounded-xl border border-stone-100">
                <p className="text-3xl font-bold text-brand-600 font-display">
                  {animatedBirthdays.toLocaleString()}+
                </p>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mt-1">
                  Birthdays Celebrated
                </p>
              </div>

              <div className="bg-stone-50/60 p-4 rounded-xl border border-stone-100">
                <p className="text-3xl font-bold text-brand-600 font-display">
                  {animatedEvents.toLocaleString()}+
                </p>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mt-1">
                  Events Organized
                </p>
              </div>

              <div className="bg-stone-50/60 p-4 rounded-xl border border-stone-100">
                <p className="text-3xl font-bold text-brand-600 font-display">
                  {targetYears === 0 ? 'New' : `${animatedYears}+`}
                </p>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mt-1">
                  Years of Service
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Highlight Box Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isSectionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl bg-stone-50 p-6 border border-stone-100/80 flex flex-col justify-between"
          >
            <div>
              <h3 className="font-display text-lg font-bold text-forest-900 mb-3">
                Quick Info
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Timings</p>
                  <p className="text-sm font-medium text-stone-700 mt-0.5">{openingHours}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Location</p>
                  <p className="text-sm font-medium text-stone-700 mt-0.5">Kathmandu, Nepal</p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-stone-200/60 pt-4 text-xs text-stone-400 font-medium">
              We look forward to serving you!
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
