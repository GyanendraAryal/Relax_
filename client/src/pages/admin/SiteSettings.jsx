import { useEffect, useState } from 'react';
import { settingsApi } from '../../api/settings.api.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import Alert from '../../components/Alert.jsx';

export default function SiteSettings() {
  const [settings, setSettings] = useState({ restaurant: {}, hero: {}, about: {}, story: {}, google: {} });
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

  const [loadingStoryImage, setLoadingStoryImage] = useState(false);

  const handleStoryImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setLoadingStoryImage(true);
      const updatedStory = await settingsApi.uploadStoryImage(file);
      setSettings((prev) => ({
        ...prev,
        story: updatedStory,
      }));
      setAlert('Story background image uploaded successfully');
    } catch (err) {
      setAlert(err.message || 'Failed to upload story image');
    } finally {
      setLoadingStoryImage(false);
    }
  };

  const handleStoryImageDelete = async () => {
    if (!confirm('Are you sure you want to remove the story background image?')) return;
    try {
      setLoadingStoryImage(true);
      const updatedStory = await settingsApi.deleteStoryImage();
      setSettings((prev) => ({
        ...prev,
        story: updatedStory,
      }));
      setAlert('Story background image removed successfully');
    } catch (err) {
      setAlert(err.message || 'Failed to remove story image');
    } finally {
      setLoadingStoryImage(false);
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

  // Numeric fields inside 'about' — always store as integers
  const updateAboutInt = (field, rawValue) => {
    const parsed = parseInt(rawValue, 10);
    updateSection('about', field, Number.isFinite(parsed) ? parsed : '');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold">Site Settings</h1>
      <Alert type="success" message={alert} onClose={() => setAlert('')} />

      <form onSubmit={save} className="mt-6 space-y-8">

        {/* RESTAURANT INFO */}
        <section className="card space-y-3">
          <h2 className="font-semibold">Restaurant Info</h2>

          <div>
            <label className="text-sm font-medium">Restaurant Name</label>
            <input className="input-field" placeholder="Name"
              value={settings.restaurant.name || ''}
              onChange={(e) => updateSection('restaurant', 'name', e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium">Tagline</label>
            <input className="input-field" placeholder="Tagline"
              value={settings.restaurant.tagline || ''}
              onChange={(e) => updateSection('restaurant', 'tagline', e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium">Address</label>
            <input className="input-field" placeholder="Address"
              value={settings.restaurant.address || ''}
              onChange={(e) => updateSection('restaurant', 'address', e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium">Phone Number</label>
            <input className="input-field" placeholder="Phone"
              value={settings.restaurant.phone || ''}
              onChange={(e) => updateSection('restaurant', 'phone', e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium">Email Address</label>
            <input className="input-field" placeholder="Email"
              value={settings.restaurant.email || ''}
              onChange={(e) => updateSection('restaurant', 'email', e.target.value)} />
          </div>
        </section>

        {/* HERO SECTION */}
        <section className="card space-y-3">
          <h2 className="font-semibold">Hero Section</h2>

          <div>
            <label className="text-sm font-medium">Hero Title</label>
            <input className="input-field" placeholder="Title"
              value={settings.hero.title || ''}
              onChange={(e) => updateSection('hero', 'title', e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium">Hero Subtitle</label>
            <input className="input-field" placeholder="Subtitle"
              value={settings.hero.subtitle || ''}
              onChange={(e) => updateSection('hero', 'subtitle', e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium">CTA Button Text</label>
            <input className="input-field" placeholder="CTA Text"
              value={settings.hero.ctaText || ''}
              onChange={(e) => updateSection('hero', 'ctaText', e.target.value)} />
          </div>

          {/* IMAGE SECTION (unchanged UI, only clearer labeling) */}
          <div className="space-y-2 pt-2">
            <label className="block text-sm font-semibold text-stone-700">
              Hero Background Image (Desktop Only)
            </label>

            {settings.hero.backgroundImage ? (
              <div className="relative overflow-hidden rounded-lg border border-stone-200 bg-stone-50 p-2">

                <div className="group relative aspect-[21/9] w-full overflow-hidden rounded bg-stone-100">
                  <img
                    src={settings.hero.backgroundImage}
                    alt="Hero Background Preview"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="mt-2 flex items-center justify-between gap-2 px-1">
                  <span className="text-xs text-stone-500 truncate max-w-[70%]">
                    Current Image URL
                  </span>

                  <button
                    type="button"
                    onClick={handleHeroImageDelete}
                    disabled={loadingHeroImage}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline disabled:opacity-50"
                  >
                    {loadingHeroImage ? 'Removing...' : 'Remove Image'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center rounded-lg border border-dashed border-stone-300 px-6 py-8">
                <div className="text-center space-y-2">

                  <label className="cursor-pointer font-semibold text-brand-600">
                    {loadingHeroImage ? 'Uploading...' : 'Upload Hero Background Image'}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleHeroImageUpload}
                      disabled={loadingHeroImage}
                    />
                  </label>

                  <p className="text-xs text-stone-500">
                    Recommended: High resolution landscape image
                  </p>

                </div>
              </div>
            )}
          </div>
        </section>

        {/* STORY SECTION */}
        <section className="card space-y-3">
          <h2 className="font-semibold">Our Story Section</h2>
          <div className="space-y-2 pt-2">
            {/* Story Section Label */}
  <div>
    <label className="text-sm font-medium block mb-1">Story Label</label>
    <input
      className="input-field w-full"
      placeholder="e.g. OUR STORY"
      value={settings.story?.label || ''}
      onChange={(e) => updateSection('story', 'label', e.target.value)}
    />
  </div>

  {/* Story Headline (Normal & Bold) */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="text-sm font-medium block mb-1">Headline (Normal Part)</label>
      <input
        className="input-field w-full"
        placeholder="e.g. Welcome To"
        value={settings.story?.headline || ''}
        onChange={(e) => updateSection('story', 'headline', e.target.value)}
      />
    </div>
    <div>
      <label className="text-sm font-medium block mb-1">Headline (Bold Brand Part)</label>
      <input
        className="input-field w-full"
        placeholder="e.g. Relax Station"
        value={settings.story?.headlineBold || ''}
        onChange={(e) => updateSection('story', 'headlineBold', e.target.value)}
      />
    </div>
  </div>

  {/* Story Content Paragraph 1 */}
  <div>
    <label className="text-sm font-medium block mb-1">Story Content - Paragraph 1</label>
    <textarea
      className="input-field w-full h-24"
      placeholder="Write the first paragraph..."
      value={settings.story?.paragraph1 || ''}
      onChange={(e) => updateSection('story', 'paragraph1', e.target.value)}
    />
  </div>

  {/* Story Content Paragraph 2 */}
  <div>
    <label className="text-sm font-medium block mb-1">Story Content - Paragraph 2</label>
    <textarea
      className="input-field w-full h-24"
      placeholder="Write the second paragraph..."
      value={settings.story?.paragraph2 || ''}
      onChange={(e) => updateSection('story', 'paragraph2', e.target.value)}
    />
  </div>

  {/* Sign-off Details */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="text-sm font-medium block mb-1">Sign-off Signature</label>
      <input
        className="input-field w-full"
        placeholder="e.g. -Kumar Bogati, Durga KC & all the staff"
        value={settings.story?.signOff || ''}
        onChange={(e) => updateSection('story', 'signOff', e.target.value)}
      />
    </div>
    <div>
      <label className="text-sm font-medium block mb-1">Sign-off Subtitle</label>
      <input
        className="input-field w-full"
        placeholder="e.g. Relax Station, Owners"
        value={settings.story?.signOffSub || ''}
        onChange={(e) => updateSection('story', 'signOffSub', e.target.value)}
      />
    </div>
  </div>

            <label className="block text-sm font-semibold text-stone-700 pt-2">
              Story Portrait Image
            </label>
            {settings.story?.backgroundImage ? (
              <div className="relative overflow-hidden rounded-lg border border-stone-200 bg-stone-50 p-2">
                <div className="group relative aspect-[3/4] max-w-[200px] overflow-hidden rounded bg-stone-100">
                  <img src={settings.story.backgroundImage} alt="Story Portrait Preview" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"/>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 px-1">
                  <span className="text-xs text-stone-500 truncate max-w-[70%]">Current Image URL</span>
                  <button type="button" onClick={handleStoryImageDelete} disabled={loadingStoryImage} className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline disabled:opacity-50">
                    {loadingStoryImage ? 'Removing...' : 'Remove Image'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center rounded-lg border border-dashed border-stone-300 px-6 py-8">
                <div className="text-center space-y-2">
                  <label className="cursor-pointer font-semibold text-brand-600">
                    {loadingStoryImage ? 'Uploading...' : 'Upload Story Portrait Image'}
                    <input type="file" accept="image/*" className="sr-only" onChange={handleStoryImageUpload} disabled={loadingStoryImage}/>
                  </label>
                  <p className="text-xs text-stone-500">Recommended: High resolution portrait image</p>
                </div>
              </div>
            )}
          </div>
        </section>
        <section className="card space-y-4">
          <h2 className="font-semibold text-lg border-b pb-1">About Section Details</h2>

          <div>
            <label className="text-sm font-medium block mb-1">About Title</label>
            <input
              className="input-field w-full"
              placeholder="Title"
              value={settings.about.title || ''}
              onChange={(e) => updateSection('about', 'title', e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">About Content</label>
            <textarea
              className="input-field w-full h-24"
              placeholder="Write your restaurant description here..."
              value={settings.about.content || ''}
              onChange={(e) => updateSection('about', 'content', e.target.value)}
            />
          </div>

          {/* Numeric Stat Counters */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div>
              <label className="text-sm font-medium block mb-1">Founding Year</label>
              <input
                type="number"
                className="input-field w-full"
                placeholder="e.g. 2020"
                min="1900"
                max={new Date().getFullYear()}
                value={settings.about.foundingYear || ''}
                onChange={(e) => updateAboutInt('foundingYear', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Birthdays Celebrated</label>
              <input
                type="number"
                className="input-field w-full"
                placeholder="e.g. 1250"
                min="0"
                value={settings.about.birthdaysCount || ''}
                onChange={(e) => updateAboutInt('birthdaysCount', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Events Organized</label>
              <input
                type="number"
                className="input-field w-full"
                placeholder="e.g. 450"
                min="0"
                value={settings.about.eventsCount || ''}
                onChange={(e) => updateAboutInt('eventsCount', e.target.value)}
              />
            </div>
          </div>

          {/* New Input Fields: Operating Hours */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-sm font-medium block mb-1">Opening Time</label>
              <input
                type="time"
                className="input-field w-full"
                value={settings.about.openingTime || '11:00'}
                onChange={(e) => updateSection('about', 'openingTime', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Closing Time</label>
              <input
                type="time"
                className="input-field w-full"
                value={settings.about.closingTime || '22:00'}
                onChange={(e) => updateSection('about', 'closingTime', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* GOOGLE REVIEWS SECTION */}
        <section className="card space-y-4">
          <h2 className="font-semibold text-lg border-b pb-1">Google Reviews API Configuration</h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            Configure Google Places API credentials to automatically pull real reviews from your Google Business Profile. If left empty, Relax Station will automatically fall back to displaying premium mock customer reviews.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Google Place ID</label>
              <input
                className="input-field w-full"
                placeholder="e.g. ChIJN1t_tDeuEmsRUsoyG83VSY4"
                value={settings.google?.placeId || ''}
                onChange={(e) => updateSection('google', 'placeId', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Google Maps API Key</label>
              <input
                type="password"
                className="input-field w-full"
                placeholder="Enter API Key"
                value={settings.google?.apiKey || ''}
                onChange={(e) => updateSection('google', 'apiKey', e.target.value)}
              />
            </div>
          </div>
        </section>

        <div className="pt-2">
          <button type="submit" className="btn-primary w-full py-3 font-semibold shadow-sm">
            Save Site Settings
          </button>
        </div>
      </form>
    </div>
  );
}