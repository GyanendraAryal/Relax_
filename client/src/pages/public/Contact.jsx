import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent (connect this to backend later)');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">

      {/* HEADER */}
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold text-forest-900">
          Contact Us
        </h1>
        <p className="mt-3 text-stone-600 max-w-xl mx-auto">
          We’re here to help you plan visits, birthdays, and special events at Relax Station.
        </p>
      </div>

      {/* GRID */}
      <div className="mt-12 grid gap-10 lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="space-y-6">

          {/* LOCATION */}
          <div className="card rounded-2xl border border-stone-100 bg-white p-6 shadow-sm hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-forest-900">
              📍 Our Location
            </h2>
            <p className="mt-2 text-stone-600 leading-relaxed">
              Relax Station Food and Fun<br />
              Kalikasthan, Kathmandu, Nepal
            </p>
          </div>

          {/* CONTACT */}
          <div className="card rounded-2xl border border-stone-100 bg-white p-6 shadow-sm hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-forest-900">
              📞 Contact
            </h2>
            <p className="mt-2 text-stone-600">+977-98XXXXXXXX</p>
            <p className="text-stone-600">info@relaxstation.com</p>
          </div>

          {/* HOURS */}
          <div className="card rounded-2xl border border-stone-100 bg-white p-6 shadow-sm hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-forest-900">
              ⏰ Opening Hours
            </h2>
            <p className="mt-2 text-stone-600">
              Daily: 11:00 AM – 10:00 PM
            </p>
          </div>

        </div>

        {/* RIGHT SIDE - FORM */}
        <form
          onSubmit={handleSubmit}
          className="card rounded-2xl border border-stone-100 bg-white p-6 shadow-sm hover:shadow-md transition space-y-4"
        >
          <h2 className="text-lg font-semibold text-forest-900">
            Send a Message
          </h2>

          <input
            className="input-field focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            type="email"
            className="input-field focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
            placeholder="Your Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <textarea
            className="input-field h-32 resize-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
            placeholder="Your Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
          />

          <button
            type="submit"
            className="btn-primary w-full py-3 font-semibold shadow-sm hover:shadow-md transition"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* MAP SECTION */}
      <div className="mt-12 rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-md transition">

        <div className="bg-white p-5 border-b border-stone-100">
          <h2 className="text-lg font-semibold text-forest-900">
            📍 Find Us on Map
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Visit us easily using Google Maps
          </p>
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