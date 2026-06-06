import { useEffect, useState } from 'react';
import OurStorySection from '../../components/OurStorySection.jsx';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { menuApi } from '../../api/menu.api.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import TodaySpecialSection from '../../components/TodaySpecialSection.jsx';
import AdsModal from '../../components/AdsModal.jsx';
import AboutSection from '../../components/AboutSection.jsx';
import GoogleReviewSlider from '../../components/GoogleReviewsSlider.jsx';

export default function Home() {
  const settings = useSelector((s) => s.settings.data);
  const hero = settings?.hero || {};
  const about = settings?.about || {};

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    menuApi.getPublic()
      .catch((err) => {
        console.error("❌ Failed to resolve baseline system configuration rows:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <AdsModal />

      {/* ── HERO CONTAINER ── */}
      <section className="relative overflow-hidden text-white md:h-[580px] md:flex md:items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-900 via-forest-800 to-brand-900" />
        <div
          className="absolute inset-0 hidden md:block bg-cover bg-center"
          style={{
            backgroundImage: `url(${hero.backgroundImage || '/hero.jpg'})`,
          }}
        />
        <div className="absolute inset-0 bg-black/40 md:bg-black/50" />

        {/* ✅ ONLY CHANGE: container width behavior aligned with sections like TodaySpecial */}
        <div className="relative mx-auto max-w-6xl w-full px-4 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-brand-300">
              Kathmandu, Nepal
            </p>

            <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
              {hero.title || 'Welcome to Relax Station'}
            </h1>

            <p className="mt-6 max-w-xl text-lg text-stone-200">
              {hero.subtitle || "Nepal's favorite spot for great food and family fun"}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to={hero.ctaLink || '/menu'}
                className="btn-primary bg-brand-500 hover:bg-brand-400"
              >
                {hero.ctaText || 'View Menu'}
              </Link>

              <Link
                to="/book-birthday"
                className="btn-secondary border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                Book a Birthday
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <OurStorySection story={settings?.story || {}} />
      <TodaySpecialSection />
      <GoogleReviewSlider />
      <AboutSection about={about} />
    </>
  );
}