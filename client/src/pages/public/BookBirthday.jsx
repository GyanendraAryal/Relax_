import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { bookingsApi } from '../../api/bookings.api.js';
import Alert from '../../components/Alert.jsx';

export default function BookBirthday() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setStatus({ type: '', message: '' });
    try {
      await bookingsApi.createBirthday(data);
      setStatus({ type: 'success', message: 'Your birthday booking request has been submitted! We will contact you soon.' });
      reset();
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-forest-900">Book a Birthday Party</h1>
        <p className="mt-2 text-stone-600">Celebrate with food, fun, and unforgettable memories</p>

        <form onSubmit={handleSubmit(onSubmit)} className="card mt-8 space-y-4">
          <Alert type={status.type} message={status.message} onClose={() => setStatus({})} />

          <div>
            <label className="mb-1 block text-sm font-medium">Your Name *</label>
            <input className="input-field" {...register('customer_name', { required: 'Required' })} />
            {errors.customer_name && <p className="mt-1 text-xs text-red-600">{errors.customer_name.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email *</label>
            <input type="email" className="input-field" {...register('email', { required: 'Required' })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Phone *</label>
            <input className="input-field" {...register('phone', { required: 'Required' })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Event Date *</label>
            <input type="date" className="input-field"
              min={new Date().toISOString().split('T')[0]}
              {...register('event_date', { required: 'Required' })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Number of Guests *</label>
            <input type="number" min="1" className="input-field" {...register('guest_count', { required: 'Required', min: 1 })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Package</label>
            <select className="input-field" {...register('package_type')}>
              <option value="">Select a package</option>
              <option value="basic">Basic Party</option>
              <option value="premium">Premium Party</option>
              <option value="deluxe">Deluxe Celebration</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Message</label>
            <textarea rows={4} className="input-field" {...register('message')} />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
