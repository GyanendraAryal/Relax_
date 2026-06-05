import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { bookingsApi } from '../../api/bookings.api.js';
import Alert from '../../components/Alert.jsx';

export default function BookEvent() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setStatus({ type: '', message: '' });
    try {
      await bookingsApi.createEvent(data);
      setStatus({ type: 'success', message: 'Your event inquiry has been submitted! Our team will reach out shortly.' });
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
        <h1 className="font-display text-3xl font-bold text-forest-900">Book an Event</h1>
        <p className="mt-2 text-stone-600">Corporate gatherings, reunions, and private celebrations</p>

        <form onSubmit={handleSubmit(onSubmit)} className="card mt-8 space-y-4">
          <Alert type={status.type} message={status.message} onClose={() => setStatus({})} />

          <div>
            <label className="mb-1 block text-sm font-medium">Contact Name *</label>
            <input className="input-field" {...register('customer_name', { required: 'Required' })} />
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
            <label className="mb-1 block text-sm font-medium">Event Type *</label>
            <input className="input-field" placeholder="Corporate, reunion, etc." {...register('event_type', { required: 'Required' })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Event Date *</label>
            <input type="date" className="input-field" {...register('event_date', { required: 'Required' })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Start Time</label>
              <input type="time" className="input-field" {...register('start_time')} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">End Time</label>
              <input type="time" className="input-field" {...register('end_time')} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Guests *</label>
            <input type="number" min="1" className="input-field" {...register('guest_count', { required: true, min: 1 })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Budget Range</label>
            <input className="input-field" placeholder="e.g. Rs. 50,000 - 100,000" {...register('budget_range')} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Details</label>
            <textarea rows={4} className="input-field" {...register('message')} />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Submitting...' : 'Submit Inquiry'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
