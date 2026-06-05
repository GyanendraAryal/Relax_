import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { loadSettings } from '../app/slices/settingsSlice.js';
import logo from '../assets/logo.png';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/offers', label: 'Offers' },
  { to: '/book-birthday', label: 'Birthday' },
  { to: '/book-event', label: 'Events' },
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
      <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/90 backdrop-blur-md">
        
        {/* Cleaned container with controlled responsive heights */}
        <div className="mx-auto flex max-w-6xl h-16 md:h-24 items-center justify-between gap-4 px-4">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="Relax Station"
              className="h-12 rounded-xl md:h-16 w-auto object-contain"
            />
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-medium transition ${
                  pathname === link.to ? 'text-brand-600' : 'text-stone-600 hover:text-brand-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation Row */}
        <nav className="flex gap-1 overflow-x-auto border-t border-stone-100 px-4 py-2 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                pathname === link.to ? 'bg-brand-600 text-white' : 'bg-stone-100 text-stone-700'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-auto bg-forest-900 text-stone-300">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="grid gap-8 md:grid-cols-3"
          >
            <div>
              <h3 className="font-display text-lg font-semibold text-white">{restaurant.name}</h3>
              <p className="mt-2 text-sm">{restaurant.tagline}</p>
            </div>
            <div>
              <h4 className="font-semibold text-white">Contact</h4>
              <p className="mt-2 text-sm">{restaurant.address}</p>
              {restaurant.phone && <p className="text-sm">{restaurant.phone}</p>}
              {restaurant.email && <p className="text-sm">{restaurant.email}</p>}
            </div>
            <div>
              <h4 className="font-semibold text-white">Visit Us</h4>
              <p className="mt-2 text-sm">Kathmandu, Nepal</p>
              <Link to="/admin/login" className="mt-4 inline-block text-xs text-brand-400 hover:text-brand-300">
                Admin
              </Link>
            </div>
          </motion.div>
          <p className="mt-8 border-t border-forest-700 pt-6 text-center text-xs">
            © {new Date().getFullYear()} Relax Station Food and Fun. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
