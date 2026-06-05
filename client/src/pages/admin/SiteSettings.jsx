import { useEffect, useState } from 'react';
import { settingsApi } from '../../api/settings.api.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import Alert from '../../components/Alert.jsx';

export default function SiteSettings() {
  const [settings, setSettings] = useState({ restaurant: {}, hero: {}, about: {} });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState('');
  const [loadingHeroImage, setLoadingHeroImage] = useState(false);

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoadingHeroImage(true);
      const updatedHero = await settingsApi.uploadHeroImage(file);
      setSettings((prev) => ({
        ...prev,
        hero: updatedHero,
      }));
      setAlert('Hero background image uploaded successfully');
    } catch (err) {
      setAlert(err.message || 'Failed to upload background image');
    } finally {
      setLoadingHeroImage(false);
    }
  };

  const handleHeroImageDelete = async () => {
    if (!confirm('Are you sure you want to remove the custom hero background image?')) return;

    try {
      setLoadingHeroImage(true);
      const updatedHero = await settingsApi.deleteHeroImage();
      setSettings((prev) => ({
        ...prev,
        hero: updatedHero,
      }));
      setAlert('Hero background image removed successfully');
    } catch (err) {
      setAlert(err.message || 'Failed to remove background image');
    } finally {
      setLoadingHeroImage(false);
    }
  };

  useEffect(() => {
    settingsApi
      .getAll()
      .then((rows) => {
        const map = rows.reduce((acc, row) => {
          acc[row.key] = row.value;
          return acc;
        }, {});
        setSettings({
          restaurant: map.restaurant || {},
          hero: map.hero || {},
          about: map.about || {},
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      await settingsApi.update(settings);
      setAlert('Settings saved successfully');
    } catch (err) {
      setAlert(err.message);
    }
  };

  const updateSection = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold">Site Settings</h1>
      <Alert type="success" message={alert} onClose={() => setAlert('')} />

      <form onSubmit={save} className="mt-6 space-y-8">
        <section className="card space-y-3">
          <h2 className="font-semibold">Restaurant Info</h2>
          <input className="input-field" placeholder="Name" value={settings.restaurant.name || ''} onChange={(e) => updateSection('restaurant', 'name', e.target.value)} />
          <input className="input-field" placeholder="Tagline" value={settings.restaurant.tagline || ''} onChange={(e) => updateSection('restaurant', 'tagline', e.target.value)} />
          <input className="input-field" placeholder="Address" value={settings.restaurant.address || ''} onChange={(e) => updateSection('restaurant', 'address', e.target.value)} />
          <input className="input-field" placeholder="Phone" value={settings.restaurant.phone || ''} onChange={(e) => updateSection('restaurant', 'phone', e.target.value)} />
          <input className="input-field" placeholder="Email" value={settings.restaurant.email || ''} onChange={(e) => updateSection('restaurant', 'email', e.target.value)} />
        </section>

        <section className="card space-y-3">
          <h2 className="font-semibold">Hero Section</h2>
          <input className="input-field" placeholder="Title" value={settings.hero.title || ''} onChange={(e) => updateSection('hero', 'title', e.target.value)} />
          <input className="input-field" placeholder="Subtitle" value={settings.hero.subtitle || ''} onChange={(e) => updateSection('hero', 'subtitle', e.target.value)} />
          <input className="input-field" placeholder="CTA Text" value={settings.hero.ctaText || ''} onChange={(e) => updateSection('hero', 'ctaText', e.target.value)} />
          
          <div className="space-y-2 pt-2">
            <label className="block text-sm font-semibold text-stone-700">Desktop Background Image</label>
            {settings.hero.backgroundImage ? (
              <div className="relative overflow-hidden rounded-lg border border-stone-200 bg-stone-50 p-2">
                <div className="group relative aspect-[21/9] w-full overflow-hidden rounded bg-stone-100">
                  <img
                    src={settings.hero.backgroundImage}
                    alt="Hero Background Preview"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                    <span className="text-white text-xs font-semibold bg-stone-900/60 px-3 py-1 rounded-full backdrop-blur-sm">
                      Current Background Image
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 px-1">
                  <span className="text-xs text-stone-500 truncate max-w-[70%]">
                    {settings.hero.backgroundImage}
                  </span>
                  <button
                    type="button"
                    onClick={handleHeroImageDelete}
                    disabled={loadingHeroImage}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline disabled:opacity-50"
                  >
                    {loadingHeroImage ? 'Removing...' : 'Remove Background'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center rounded-lg border border-dashed border-stone-300 px-6 py-8 hover:border-brand-500 transition-colors duration-200">
                <div className="text-center space-y-2">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                  <div className="flex text-sm text-stone-600 justify-center">
                    <label className="relative cursor-pointer rounded-md font-semibold text-brand-600 focus-within:outline-none hover:text-brand-500">
                      <span>{loadingHeroImage ? 'Uploading...' : 'Upload desktop background image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleHeroImageUpload}
                        disabled={loadingHeroImage}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-stone-500">
                    PNG, JPG, GIF, WebP up to 5MB (Only visible on desktop/tablets)
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="card space-y-3">
          <h2 className="font-semibold">About</h2>
          <input className="input-field" placeholder="Title" value={settings.about.title || ''} onChange={(e) => updateSection('about', 'title', e.target.value)} />
          <textarea className="input-field" rows={5} placeholder="Content" value={settings.about.content || ''} onChange={(e) => updateSection('about', 'content', e.target.value)} />
        </section>

        <button type="submit" className="btn-primary">Save Settings</button>
      </form>
    </div>
  );
}
