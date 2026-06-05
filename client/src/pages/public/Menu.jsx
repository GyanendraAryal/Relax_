import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { menuApi } from '../../api/menu.api.js';
import MenuItemCard from '../../components/MenuItemCard.jsx';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import TodaySpecialSection from '../../components/TodaySpecialSection.jsx';

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    menuApi.getPublic().then(setMenu).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const featuredItems = menu
    .flatMap((category) => category.items || [])
    .filter((item) => item.is_featured);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-forest-900 md:text-4xl">Our Menu</h1>
        <p className="mt-2 text-stone-600">Fresh flavors crafted for families in Kathmandu</p>
      </motion.div>

      {/* Today's Special Section at the top */}
      <TodaySpecialSection hideViewMore={true} />

      {/* Featured Dishes Section */}
      {featuredItems.length > 0 && (
        <section className="mt-12">
          <h2 className="border-b border-brand-200 pb-2 font-display text-2xl font-bold text-forest-900">
            ★ Featured Dishes
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {featuredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {menu.length === 0 ? (
        <EmptyState title="Menu coming soon" description="Check back shortly for our full menu." />
      ) : (
        menu.map((category) => (
          <section key={category.id} className="mt-12">
            <h2 className="border-b border-brand-200 pb-2 font-display text-2xl font-semibold text-forest-800">
              {category.name}
            </h2>
            {category.description && (
              <p className="mt-2 text-sm text-stone-500">{category.description}</p>
            )}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {category.items?.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
