import { useState } from 'react';
import { useSelector } from 'react-redux';
import Alert from '../../components/Alert.jsx';

export default function Contact() {
  const settings = useSelector((s) => s.settings.data);
  const restaurant = settings?.restaurant || {};
  const about = settings?.about || {};

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // No backend contact endpoint — show a friendly confirmation and reset
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
  };

  // Derive display values from settings with sensible fallbacks
  const address   = restaurant.address  || 'Kalikasthan, Kathmandu, Nepal';
  const phone     = restaurant.phone    || '';
  const email     = restaurant.email    || '';
  const hours     = about.hours         ||
    (about.openingTime && about.closingTime
      ? `Daily: ${about.openingTime} – ${about.closingTime}`
      : 'Daily: 11:00 AM – 10:00 PM');

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">

      <div className="text-center">
        <h1 className="font-display text-4xl font-bold text-forest-900">Contact Us</h1>
        <p className="mt-3 text-stone-600 max-w-xl mx-auto">
          We're here to help you plan visits, birthdays, and special events at Relax Station.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">

        {/* INFO CARDS */}
        <div className="space-y-6">
          <div className="card rounded-2xl border border-stone-100 bg-white p-6 shadow-sm hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-forest-900">📍 Our Location</h2>
            <p className="mt-2 text-stone-600 leading-relaxed">
              {restaurant.name || 'Relax Station Food and Fun'}<br />{address}
            </p>
          </div>

          <div className="card rounded-2xl border border-stone-100 bg-white p-6 shadow-sm hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-forest-900">📞 Contact</h2>
            {phone
              ? <a href={`tel:${phone}`} className="mt-2 block text-stone-600 hover:text-brand-600 transition">{phone}</a>
              : <p className="mt-2 text-stone-400 italic text-sm">Phone not set</p>}
            {email
              ? <a href={`mailto:${email}`} className="block text-stone-600 hover:text-brand-600 transition">{email}</a>
              : <p className="text-stone-400 italic text-sm">Email not set</p>}
          </div>

          <div className="card rounded-2xl border border-stone-100 bg-white p-6 shadow-sm hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-forest-900">⏰ Opening Hours</h2>
            <p className="mt-2 text-stone-600">{hours}</p>
          </div>
        </div>

        {/* CONTACT FORM */}
        <form onSubmit={handleSubmit}
          className="card rounded-2xl border border-stone-100 bg-white p-6 shadow-sm hover:shadow-md transition space-y-4">
          <h2 className="text-lg font-semibold text-forest-900">Send a Message</h2>

          {submitted && (
            <Alert type="success"
              message="Thanks for reaching out! We'll get back to you soon."
              onClose={() => setSubmitted(false)} />
          )}

          <input className="input-field" placeholder="Your Name" required
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

          <input type="email" className="input-field" placeholder="Your Email" required
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />

          <textarea className="input-field h-32 resize-none" placeholder="Your Message" required
            value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />

          <button type="submit" className="btn-primary w-full py-3 font-semibold shadow-sm hover:shadow-md transition">
            Send Message
          </button>
        </form>
      </div>

      {/* MAP */}
      <div className="mt-12 rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-md transition">
        <div className="bg-white p-5 border-b border-stone-100">
          <h2 className="text-lg font-semibold text-forest-900">📍 Find Us on Map</h2>
          <p className="text-sm text-stone-500 mt-1">Visit us easily using Google Maps</p>
        </div>
        <div className="h-96 w-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.4795359273962!2d85.32357929999999!3d27.7024767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19006e9f193f%3A0x9f5c09a842b906a9!2sRelax%20station%20food%20and%20fun!5e0!3m2!1sen!2snp!4v1780694253175!5m2!1sen!2snp"
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Relax Station Location"
          />
        </div>
      </div>
    </div>
  );
}
