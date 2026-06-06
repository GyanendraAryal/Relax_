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

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src={logo}
              alt="Relax Station"
              className="h-10 w-auto rounded-xl object-contain md:h-16"
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm lg:text-base font-medium transition whitespace-nowrap ${pathname === link.to
                  ? 'text-brand-600'
                  : 'text-stone-600 hover:text-brand-600'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* MOBILE NAV */}
        <nav className="flex md:hidden overflow-x-auto gap-2 border-t border-stone-100 px-3 py-2 scrollbar-hide">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${pathname === link.to
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
      <footer className="mt-auto bg-forest-900 text-stone-300">
        <div className="mx-auto max-w-6xl px-4 py-12">

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="grid gap-10 md:grid-cols-4"
          >

            {/* BRAND */}
            <div>
              <h3 className="font-display text-lg font-semibold text-white">
                {restaurant.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed">
                {restaurant.tagline}
              </p>

              {/* SOCIAL ICONS (REAL) */}

            </div>

            {/* CONTACT */}
            <div>
              <h4 className="font-semibold text-white">Contact</h4>
              <p className="mt-2 text-sm">{restaurant.address}</p>

              {restaurant.phone && (
                <p className="text-sm break-words">{restaurant.phone}</p>
              )}

              {restaurant.email && (
                <p className="text-sm break-words">{restaurant.email}</p>
              )}
            </div>

            {/* QUICK LINKS */}
            <div>
              <h4 className="font-semibold text-white">Quick Links</h4>
              <div className="mt-4 items-start flex gap-4 text-lg">

                <a
                  href="https://www.instagram.com/relaxstation_food_fun"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-pink-400 transition"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>

                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-900 transition"
                  aria-label="Facebook"
                >
                  <FaFacebook />
                </a>

                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition"
                  aria-label="TikTok"
                >
                  <FaTiktok />
                </a>

              </div>
            </div>

            {/* VISIT + CREDIT */}
            <div>
              <h4 className="font-semibold text-white">Visit Us</h4>
              <p className="mt-2 text-sm">Kathmandu, Nepal</p>
              {/* <a
                href="/admin/login"
                className="mt-3 inline-block text-xs text-brand-400 hover:text-brand-300"
              >
                Admin Login
              </a> */}


            </div>

          </motion.div>

          {/* BOTTOM BAR */}
          <div className="mt-10 border-t border-forest-700 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">

            <p className="text-xs text-stone-400">
              © {new Date().getFullYear()} {restaurant.name}. All rights reserved.
            </p>

            <div>
              <p className="text-xs text-stone-500">
                Crafted for better dining experiences
              </p>
              <p className=" text-xs text-stone-400">
                Developed by{" "}
                <span className="font-semibold text-orange-500">C2P</span>
              </p>
            </div>

          </div>

        </div>
      </footer>

    </div>
  );
}