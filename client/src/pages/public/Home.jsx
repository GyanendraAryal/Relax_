import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { menuApi } from '../../api/menu.api.js';
import MenuItemCard from '../../components/MenuItemCard.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import TodaySpecialSection from '../../components/TodaySpecialSection.jsx';
import AdsModal from '../../components/AdsModal.jsx';

export default function Home() {
  const settings = useSelector((s) => s.settings.data);
  const hero = settings?.hero || {};
  const about = settings?.about || {};
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    menuApi.getPublic()
      .then((menu) => {
        if (!menu || !Array.isArray(menu)) {
          console.warn("⚠️ API returned non-array structure:", menu);
          return;
        }
        const items = menu
          .flatMap((c) => c.items)
          .filter((i) => i.is_featured);

        setFeatured(items.slice(0, 4));
      })
      .catch((err) => {
        console.error("❌ Failed to load home menu:", err);

      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <AdsModal />
      <section className="relative overflow-hidden text-white md:h-[580px] md:flex md:items-center">

        {/* Mobile fallback gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-forest-900 via-forest-800 to-brand-900" />

        {/* Desktop image background */}
        <div
          className="absolute inset-0 hidden md:block bg-cover bg-center"
          style={{
            backgroundImage: `url(${hero.backgroundImage || '/hero.jpg'})`,
          }}
        />

        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/40 md:bg-black/50" />

        {/* Pattern overlay (optional, keep subtle) */}

        <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-32">
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
              <Link to={hero.ctaLink || '/menu'} className="btn-primary bg-brand-500 hover:bg-brand-400">
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

      <TodaySpecialSection />

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-2xl font-bold text-forest-900">{about.title || 'About Us'}</h2>
          <p className="mt-4 max-w-3xl text-stone-600 leading-relaxed">
            {about.content ||
              'Relax Station Food and Fun is a family-friendly restaurant in Kathmandu offering delicious cuisine, birthday packages, and event hosting.'}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-bold text-forest-900">Featured Dishes</h2>
          <Link to="/menu" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            Full menu →
          </Link>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {featured.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
