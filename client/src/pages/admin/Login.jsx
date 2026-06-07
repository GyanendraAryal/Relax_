import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth.js';
import Alert from '../../components/Alert.jsx';

export default function AdminLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, loading, error, user, clearError } = useAuth();
  const navigate = useNavigate();
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (user) navigate('/admin', { replace: true });
  }, [user, navigate]);

  const onSubmit = async (data) => {
    setLocalError('');
    clearError();
    const result = await login(data);
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/admin');
    } else {
      setLocalError(result.payload || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-forest-900 to-forest-800 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <Link to="/" className="font-display text-xl font-bold text-forest-900">
          Relax <span className="text-brand-600">Station</span>
        </Link>
        <h1 className="mt-6 text-2xl font-bold">Admin Sign In</h1>
        <p className="mt-1 text-sm text-stone-500">CMS Dashboard</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
          <Alert message={error || localError} onClose={() => { clearError(); setLocalError(''); }} />

          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              autoComplete="email"
              className={`input-field ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email' },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              autoComplete="current-password"
              className={`input-field ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
              })}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
