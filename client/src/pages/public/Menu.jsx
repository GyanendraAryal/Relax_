import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { menuApi } from '../../api/menu.api.js';
import MenuCard from '../../components/MenuCard.jsx';
import TodaySpecialSection from '../../components/TodaySpecialSection.jsx';

function MenuSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 space-y-12 animate-pulse">
      {/* Title block skeleton */}
      <div className="space-y-3 max-w-xl">
        <div className="h-10 w-48 bg-stone-200 rounded-2xl" />
        <div className="h-4 w-full bg-stone-200 rounded-lg" />
        <div className="h-4 w-2/3 bg-stone-200 rounded-lg" />
      </div>

      {/* Tabs bar skeleton */}
      <div className="flex gap-2 py-3 border-b border-stone-100 overflow-hidden">
        <div className="h-8 w-24 bg-stone-200 rounded-full shrink-0" />
        <div className="h-8 w-20 bg-stone-200 rounded-full shrink-0" />
        <div className="h-8 w-24 bg-stone-200 rounded-full shrink-0" />
        <div className="h-8 w-32 bg-stone-200 rounded-full shrink-0" />
      </div>

      {/* Category Section skeleton */}
      <div className="space-y-6">
        <div className="h-8 w-36 bg-stone-200 rounded-xl" />
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col md:flex-row gap-4 p-5 border border-stone-100 rounded-3xl bg-white">
              <div className="aspect-video w-full md:aspect-square md:w-36 rounded-2xl bg-stone-200 shrink-0" />
              <div className="flex-1 space-y-3 py-1">
                <div className="h-5 w-1/3 bg-stone-200 rounded-md" />
                <div className="h-4 w-full bg-stone-200 rounded-md" />
                <div className="h-4 w-5/6 bg-stone-200 rounded-md" />
                <div className="h-5 w-16 bg-stone-200 rounded-md pt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const fetchMenu = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await menuApi.getCategoriesWithItems();
      setMenu(data || []);
    } catch (err) {
      console.error("❌ Failed to load menu directory:", err);
      setError(err.message || 'Unable to retrieve menu records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  if (loading) return <MenuSkeleton />;

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center space-y-4">
        <div className="text-5xl select-none">⚠️</div>
        <h2 className="text-xl font-bold text-stone-900">Failed to load menu</h2>
        <p className="text-stone-500 max-w-md mx-auto">{error}</p>
        <button 
          onClick={fetchMenu} 
          className="btn-primary px-6 py-2.5 rounded-xl bg-brand-600 text-white hover:bg-brand-500 transition shadow"
        >
          Try Again
        </button>
      </div>
    );
  }

  // 1. Gather global featured items copies cleanly
  const featuredItems = menu
    .flatMap((category) => category.items || [])
    .filter((item) => item.is_featured);

  // 2. Filter categories base list depending on selected navigation state
  const filteredMenu = activeTab === 'all' 
    ? menu 
    : menu.filter(category => category.id.toString() === activeTab.toString());

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 space-y-12">
      
      {/* ── HEADER INTRO BLOCK ── */}
      <motion.div 
        initial={{ opacity: 0, y: -12 }} 
        animate={{ opacity: 1, y: 0 }}
        className="text-center md:text-left max-w-xl"
      >
        <h1 className="font-display text-4xl font-bold text-forest-900 md:text-5xl tracking-tight">
          Our Menu
        </h1>
        <p className="mt-3 text-stone-600 leading-relaxed">
          Fresh flavors crafted with love for families and food lovers in Kathmandu.
        </p>
      </motion.div>

      {/* ── TODAY'S KITCHEN SPECIALS ── */}
      <div className="bg-stone-50/50 border border-stone-100 rounded-3xl p-2">
        <TodaySpecialSection hideViewMore={true} />
      </div>

      {/* ── REUSABLE DYNAMIC TAB NAVIGATION BAR ── */}
      {menu.length > 0 && (
        <div className="sticky top-[64px] md:top-[96px] z-40 bg-white/90 backdrop-blur-md border-b border-stone-100 py-3 -mx-4 px-4 overflow-x-auto scrollbar-none flex gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase transition ${
              activeTab === 'all' 
                ? 'bg-brand-600 text-white shadow-sm' 
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            📋 Full Menu
          </button>
          
          {menu.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase transition ${
                activeTab === category.id 
                  ? 'bg-brand-600 text-white shadow-sm' 
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {/* ── HIGHLIGHTED FEATURED DISHES (Only displays on "Full Menu" view) ── */}
      {activeTab === 'all' && featuredItems.length > 0 && (
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-brand-50/40 border border-brand-100/50 rounded-3xl p-6 md:p-8 animate-fade-in"
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xl">⭐</span>
            <h2 className="font-display text-2xl font-bold text-forest-900 tracking-tight">
              Chef's Featured Choices
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {featuredItems.map((item) => (
              <MenuCard
                key={item.id}
                name={item.name}
                description={item.description}
                price={Number(item.price)}
                image={item.image_url}
                isSpecial={item.is_featured}
                isAvailable={item.is_available}
              />
            ))}
          </div>
        </motion.section>
      )}

      {/* ── DINING CATEGORIES DATA MATRIX GRID ── */}
      <div className="space-y-16">
        {menu.length === 0 ? (
          <div className="mx-auto max-w-6xl px-4 py-20 text-center space-y-4">
            <div className="text-5xl select-none">🍽️</div>
            <h2 className="text-xl font-bold text-stone-900">No items available</h2>
            <p className="text-stone-500 max-w-md mx-auto">We are updating our kitchen. Check back shortly for our full menu!</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {filteredMenu.map((category) => {
              // Hide empty categories gracefully
              if (!category.items || category.items.length === 0) return null;
              
              return (
                <motion.section 
                  key={category.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.3 }}
                  className="scroll-mt-32"
                >
                  <div className="border-b border-stone-100 pb-3">
                    <h2 className="font-display text-2xl font-bold text-forest-900 tracking-tight">
                      {category.name}
                    </h2>
                    {category.description && (
                      <p className="mt-1 text-sm text-stone-500 max-w-2xl">
                        {category.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    {category.items.map((item) => (
                      <MenuCard
                        key={item.id}
                        name={item.name}
                        description={item.description}
                        price={Number(item.price)}
                        image={item.image_url}
                        isSpecial={item.is_featured}
                        isAvailable={item.is_available}
                      />
                    ))}
                  </div>
                </motion.section>
              );
            })}
          </AnimatePresence>
        )}
      </div>

    </div>
  );
}
