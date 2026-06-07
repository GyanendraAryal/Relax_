import { useEffect, useState } from 'react';
import { settingsApi } from '../../api/settings.api.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import Alert from '../../components/Alert.jsx';
import ConfirmModal from '../../components/ConfirmModal.jsx';

export default function SiteSettings() {
  const [settings, setSettings] = useState({ restaurant: {}, hero: {}, about: {}, story: {}, google: {} });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: '', type: 'success' });
  const [loadingHeroImage, setLoadingHeroImage] = useState(false);
  const [loadingStoryImage, setLoadingStoryImage] = useState(false);
  const [confirm, setConfirm] = useState(null); // { action: 'hero' | 'story' }

  const showAlert = (message, type = 'success') => setAlert({ message, type });

  useEffect(() => {
    settingsApi
      .getAll()
      .then((rows) => {
        const map = rows.reduce((acc, row) => { acc[row.key] = row.value; return acc; }, {});
        setSettings({
          restaurant: map.restaurant || {},
          hero: map.hero || {},
          about: map.about || {},
          story: map.story || {},
          google: map.google || {},
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      await settingsApi.update(settings);
      showAlert('Settings saved successfully', 'success');
    } catch (err) {
      showAlert(err.message || 'Failed to save settings', 'error');
    }
  };

  const updateSection = (section, field, value) =>
    setSettings((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));

  const updateAboutInt = (field, rawValue) => {
    const parsed = parseInt(rawValue, 10);
    updateSection('about', field, Number.isFinite(parsed) ? parsed : '');
  };

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setLoadingHeroImage(true);
      const updatedHero = await settingsApi.uploadHeroImage(file);
      setSettings((prev) => ({ ...prev, hero: updatedHero }));
      showAlert('Hero background image uploaded successfully', 'success');
    } catch (err) {
      showAlert(err.message || 'Failed to upload background image', 'error');
    } finally {
      setLoadingHeroImage(false);
    }
  };

  const handleHeroImageDelete = async () => {
    try {
      setLoadingHeroImage(true);
      const updatedHero = await settingsApi.deleteHeroImage();
      setSettings((prev) => ({ ...prev, hero: updatedHero }));
      showAlert('Hero background image removed', 'success');
    } catch (err) {
      showAlert(err.message || 'Failed to remove background image', 'error');
    } finally {
      setLoadingHeroImage(false);
      setConfirm(null);
    }
  };

  const handleStoryImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setLoadingStoryImage(true);
      const updatedStory = await settingsApi.uploadStoryImage(file);
      setSettings((prev) => ({ ...prev, story: updatedStory }));
      showAlert('Story background image uploaded successfully', 'success');
    } catch (err) {
      showAlert(err.message || 'Failed to upload story image', 'error');
    } finally {
      setLoadingStoryImage(false);
    }
  };

  const handleStoryImageDelete = async () => {
    try {
      setLoadingStoryImage(true);
      const updatedStory = await settingsApi.deleteStoryImage();
      setSettings((prev) => ({ ...prev, story: updatedStory }));
      showAlert('Story background image removed', 'success');
    } catch (err) {
      showAlert(err.message || 'Failed to remove story image', 'error');
    } finally {
      setLoadingStoryImage(false);
      setConfirm(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold">Site Settings</h1>
      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ message: '', type: 'success' })} />

      <form onSubmit={save} className="mt-6 space-y-8">

        {/* RESTAURANT INFO */}
        <section className="card space-y-3">
          <h2 className="font-semibold">Restaurant Info</h2>
          {[
            { label: 'Restaurant Name', field: 'name', placeholder: 'Name' },
            { label: 'Tagline', field: 'tagline', placeholder: 'Tagline' },
            { label: 'Address', field: 'address', placeholder: 'Address' },
            { label: 'Phone Number', field: 'phone', placeholder: 'Phone' },
            { label: 'Email Address', field: 'email', placeholder: 'Email' },
          ].map(({ label, field, placeholder }) => (
            <div key={field}>
              <label className="text-sm font-medium">{label}</label>
              <input className="input-field" placeholder={placeholder}
                value={settings.restaurant[field] || ''}
                onChange={(e) => updateSection('restaurant', field, e.target.value)} />
            </div>
          ))}
        </section>

        {/* HERO SECTION */}
        <section className="card space-y-3">
          <h2 className="font-semibold">Hero Section</h2>
          {[
            { label: 'Hero Title', field: 'title', placeholder: 'Title' },
            { label: 'Hero Subtitle', field: 'subtitle', placeholder: 'Subtitle' },
            { label: 'CTA Button Text', field: 'ctaText', placeholder: 'CTA Text' },
          ].map(({ label, field, placeholder }) => (
            <div key={field}>
              <label className="text-sm font-medium">{label}</label>
              <input className="input-field" placeholder={placeholder}
                value={settings.hero[field] || ''}
                onChange={(e) => updateSection('hero', field, e.target.value)} />
            </div>
          ))}

          <div className="space-y-2 pt-2">
            <label className="block text-sm font-semibold text-stone-700">Hero Background Image (Desktop Only)</label>
            {settings.hero.backgroundImage ? (
              <div className="relative overflow-hidden rounded-lg border border-stone-200 bg-stone-50 p-2">
                <div className="group relative aspect-[21/9] w-full overflow-hidden rounded bg-stone-100">
                  <img src={settings.hero.backgroundImage} alt="Hero Background Preview"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 px-1">
                  <span className="text-xs text-stone-500 truncate max-w-[70%]">Current Image URL</span>
                  <button type="button" onClick={() => setConfirm({ action: 'hero' })} disabled={loadingHeroImage}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline disabled:opacity-50">
                    {loadingHeroImage ? 'Removing...' : 'Remove Image'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center rounded-lg border border-dashed border-stone-300 px-6 py-8">
                <div className="text-center space-y-2">
                  <label className="cursor-pointer font-semibold text-brand-600">
                    {loadingHeroImage ? 'Uploading...' : 'Upload Hero Background Image'}
                    <input type="file" accept="image/*" className="sr-only"
                      onChange={handleHeroImageUpload} disabled={loadingHeroImage} />
                  </label>
                  <p className="text-xs text-stone-500">Recommended: High resolution landscape image</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* STORY SECTION */}
        <section className="card space-y-3">
          <h2 className="font-semibold">Our Story Section</h2>
          <div>
            <label className="text-sm font-medium block mb-1">Story Headline</label>
            <input className="input-field w-full" placeholder="Enter headline"
              value={settings.story?.headline || ''}
              onChange={(e) => updateSection('story', 'headline', e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Story Content</label>
            <textarea className="input-field w-full h-24" placeholder="Write your story..."
              value={settings.story?.content || ''}
              onChange={(e) => updateSection('story', 'content', e.target.value)} />
          </div>
          <label className="block text-sm font-semibold text-stone-700">Story Background Image</label>
          {settings.story?.backgroundImage ? (
            <div className="relative overflow-hidden rounded-lg border border-stone-200 bg-stone-50 p-2">
              <div className="group relative aspect-[21/9] w-full overflow-hidden rounded bg-stone-100">
                <img src={settings.story.backgroundImage} alt="Story Background Preview"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="mt-2 flex items-center justify-between gap-2 px-1">
                <span className="text-xs text-stone-500 truncate max-w-[70%]">Current Image URL</span>
                <button type="button" onClick={() => setConfirm({ action: 'story' })} disabled={loadingStoryImage}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline disabled:opacity-50">
                  {loadingStoryImage ? 'Removing...' : 'Remove Image'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center rounded-lg border border-dashed border-stone-300 px-6 py-8">
              <div className="text-center space-y-2">
                <label className="cursor-pointer font-semibold text-brand-600">
                  {loadingStoryImage ? 'Uploading...' : 'Upload Story Background Image'}
                  <input type="file" accept="image/*" className="sr-only"
                    onChange={handleStoryImageUpload} disabled={loadingStoryImage} />
                </label>
                <p className="text-xs text-stone-500">Recommended: High resolution portrait image</p>
              </div>
            </div>
          )}
        </section>

        {/* ABOUT SECTION */}
        <section className="card space-y-4">
          <h2 className="font-semibold text-lg border-b pb-1">About Section Details</h2>
          <div>
            <label className="text-sm font-medium block mb-1">About Title</label>
            <input className="input-field w-full" placeholder="Title"
              value={settings.about.title || ''}
              onChange={(e) => updateSection('about', 'title', e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">About Content</label>
            <textarea className="input-field w-full h-24" placeholder="Write your restaurant description here..."
              value={settings.about.content || ''}
              onChange={(e) => updateSection('about', 'content', e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-4 pt-2">
            {[
              { label: 'Founding Year', field: 'foundingYear', placeholder: 'e.g. 2020', min: 1900, max: new Date().getFullYear() },
              { label: 'Birthdays Celebrated', field: 'birthdaysCount', placeholder: 'e.g. 1250', min: 0 },
              { label: 'Events Organized', field: 'eventsCount', placeholder: 'e.g. 450', min: 0 },
            ].map(({ label, field, placeholder, min, max }) => (
              <div key={field}>
                <label className="text-sm font-medium block mb-1">{label}</label>
                <input type="number" className="input-field w-full" placeholder={placeholder} min={min} max={max}
                  value={settings.about[field] || ''}
                  onChange={(e) => updateAboutInt(field, e.target.value)} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-sm font-medium block mb-1">Opening Time</label>
              <input type="time" className="input-field w-full"
                value={settings.about.openingTime || '11:00'}
                onChange={(e) => updateSection('about', 'openingTime', e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Closing Time</label>
              <input type="time" className="input-field w-full"
                value={settings.about.closingTime || '22:00'}
                onChange={(e) => updateSection('about', 'closingTime', e.target.value)} />
            </div>
          </div>
        </section>

        {/* GOOGLE REVIEWS */}
        <section className="card space-y-4">
          <h2 className="font-semibold text-lg border-b pb-1">Google Reviews API Configuration</h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            Configure Google Places API credentials to pull real reviews. If left empty, mock reviews will be shown.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Google Place ID</label>
              <input className="input-field w-full" placeholder="e.g. ChIJN1t_tDeuEmsRUsoyG83VSY4"
                value={settings.google?.placeId || ''}
                onChange={(e) => updateSection('google', 'placeId', e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Google Maps API Key</label>
              <input type="password" className="input-field w-full" placeholder="Enter API Key"
                value={settings.google?.apiKey || ''}
                onChange={(e) => updateSection('google', 'apiKey', e.target.value)} />
            </div>
          </div>
        </section>

        <div className="pt-2">
          <button type="submit" className="btn-primary w-full py-3 font-semibold shadow-sm">
            Save Site Settings
          </button>
        </div>
      </form>

      <ConfirmModal
        isOpen={!!confirm}
        title="Remove Image"
        message={`Remove the ${confirm?.action === 'hero' ? 'hero background' : 'story background'} image? This cannot be undone.`}
        confirmLabel="Remove"
        danger
        onConfirm={confirm?.action === 'hero' ? handleHeroImageDelete : handleStoryImageDelete}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
