import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { loadSettings } from '../app/slices/settingsSlice.js';
import logo from '../assets/logo.png';
import { FaInstagram, FaFacebook, FaTiktok } from 'react-icons/fa';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/offers', label: 'Offers' },
  { to: '/book-birthday', label: 'Birthday' },
  { to: '/book-event', label: 'Events' },
  { to: '/contact', label: 'Contact' },
];

const quickLinks = [
  { label: 'Menu', to: '/menu' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Birthday Packages', to: '/book-birthday' },
  { label: 'Book an Event', to: '/book-event' },
  { label: 'Contact', to: '/contact' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const colVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 0, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const socialLinks = [
  {
    href: 'https://www.instagram.com/relaxstation_food_fun',
    label: 'Instagram',
    icon: FaInstagram,
    hover: 'hover:border-pink-500 hover:bg-pink-500/10 hover:text-pink-400',
  },
  {
    href: 'https://facebook.com',
    label: 'Facebook',
    icon: FaFacebook,
    hover: 'hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-400',
  },
  {
    href: 'https://tiktok.com',
    label: 'TikTok',
    icon: FaTiktok,
    hover: 'hover:border-stone-300 hover:bg-white/10 hover:text-white',
  },
];

export default function PublicLayout() {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const settings = useSelector((s) => s.settings.data);

  useEffect(() => {
    dispatch(loadSettings());
  }, [dispatch]);

  const restaurant = settings?.restaurant || {
    name: 'Relax Station Food and Fun',
    tagline: 'Food, Fun & Memories in Kathmandu',
    address: 'Kathmandu, Nepal',
    phone: '',
    email: '',
  };

  return (
    <div className="flex min-h-screen flex-col">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-stone-800/40 bg-stone-950/20 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:h-24">

          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src={logo}
              alt="Relax Station"
              className="h-10 w-auto rounded-xl object-contain md:h-16"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-5 lg:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm lg:text-base font-medium transition whitespace-nowrap ${
                  pathname === link.to
                    ? 'text-brand-600'
                    : 'text-stone-600 hover:text-brand-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <nav className="flex md:hidden overflow-x-auto gap-2 border-t border-stone-100 px-3 py-2 scrollbar-hide">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${
                pathname === link.to
                  ? 'bg-brand-600 text-white'
                  : 'bg-stone-100 text-stone-700'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* MAIN */}
      <main className="flex-1 w-full overflow-x-hidden">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="mt-auto bg-forest-900 text-stone-300 relative overflow-hidden">

        <div className="mx-auto max-w-6xl px-4 py-16">

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid gap-10 sm:grid-cols-2 md:grid-cols-4"
          >

            {/* BRAND */}
            <motion.div variants={colVariants} className="flex flex-col gap-3">
              <h3 className="font-display text-lg font-semibold text-white tracking-wide">
                {restaurant.name}
              </h3>
              <p className="text-sm leading-relaxed text-stone-400">
                {restaurant.tagline}
              </p>

              <div className="mt-3 flex items-center gap-2">
                {socialLinks.map(({ href, label, icon: Icon, hover }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border border-forest-700 text-stone-400 transition-all duration-200 ${hover}`}
                  >
                    <Icon size={14} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* CONTACT */}
            <motion.div variants={colVariants} className="flex flex-col gap-1">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/70">
                Contact
              </h4>

              <p className="text-sm text-stone-400 leading-relaxed">
                {restaurant.address}
              </p>

              {restaurant.phone && (
                <a
                  href={`tel:${restaurant.phone}`}
                  className="mt-1 text-sm text-stone-400 break-words transition hover:text-white hover:translate-x-0.5 inline-block"
                >
                  {restaurant.phone}
                </a>
              )}

              {restaurant.email && (
                <a
                  href={`mailto:${restaurant.email}`}
                  className="text-sm text-stone-400 break-words transition hover:text-white hover:translate-x-0.5 inline-block"
                >
                  {restaurant.email}
                </a>
              )}
            </motion.div>

            {/* QUICK LINKS */}
            <motion.div variants={colVariants} className="flex flex-col gap-1">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/70">
                Quick Links
              </h4>

              <div className="flex flex-col gap-0.5">
                {quickLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.07, duration: 0.35 }}
                  >
                    <Link
                      to={link.to}
                      className="group flex items-center gap-2 py-0.5 text-sm text-stone-400 transition-all duration-200 hover:text-white w-fit"
                    >
                      <span className="inline-block h-px w-3 bg-stone-600 transition-all duration-300 group-hover:w-5 group-hover:bg-orange-500" />
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* VISIT US */}
            <motion.div variants={colVariants} className="flex flex-col gap-1">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/70">
                Visit Us
              </h4>
              <p className="text-sm text-stone-400">New Plaza Sadak, Kathmandu</p>
              <p className="mt-2 text-sm text-stone-400">Open Daily</p>
              <p className="text-sm text-stone-400">10:00 AM – 10:00 PM</p>
            </motion.div>

          </motion.div>
        </div>
      </footer>

    </div>
  );
}