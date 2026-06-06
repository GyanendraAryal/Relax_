import { useEffect, useState, useCallback } from 'react';
import { menuApi } from '../../api/menu.api.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import Alert from '../../components/Alert.jsx';
import { formatPrice } from '../../utils/format.js';

export default function MenuMgmt() {
  const [activeTab, setActiveTab] = useState('items'); // 'items' or 'categories'
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [alert, setAlert] = useState({ message: '', type: 'success' });
  const [submitting, setSubmitting] = useState(false);

  // Pagination & Filter States for Items
  const [search, setSearch] = useState('');
  const [categoryIdFilter, setCategoryIdFilter] = useState('');
  const [sortBy, setSortBy] = useState('display_order');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Form Modals State
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // If editing, holds the item object
  const [itemForm, setItemForm] = useState({
    category_id: '',
    name: '',
    description: '',
    price: '',
    is_vegetarian: false,
    is_spicy: false,
    is_available: true,
    is_featured: false,
    sort_order: '0',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Category Modal State
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null); // If editing, holds the category object
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    sort_order: '0',
    is_active: true,
  });

  // Deletion Target States
  const [deleteItemTarget, setDeleteItemTarget] = useState(null);
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState(null);

  // Success/Error toast helpers
  const showToast = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert({ message: '', type: 'success' });
    }, 4000);
  };

  // Load categories (all)
  const loadCategories = useCallback(async () => {
    try {
      const cats = await menuApi.getCategories();
      setCategories(cats || []);
    } catch (err) {
      console.error('❌ Failed to load categories:', err);
      showToast(err.message || 'Failed to load categories', 'error');
    }
  }, []);

  // Load items (paginated, filtered)
  const loadItems = useCallback(async () => {
    setItemsLoading(true);
    try {
      const response = await menuApi.getItems({
        search: search || undefined,
        category_id: categoryIdFilter || undefined,
        sortBy,
        sortOrder,
        page,
        limit,
      });
      setItems(response.data || []);
      setTotalItems(response.meta?.total || 0);
      setTotalPages(response.meta?.totalPages || 1);
    } catch (err) {
      console.error('❌ Failed to load menu items:', err);
      showToast(err.message || 'Failed to load items', 'error');
    } finally {
      setItemsLoading(false);
    }
  }, [search, categoryIdFilter, sortBy, sortOrder, page, limit]);

  // Initial load
  useEffect(() => {
    Promise.all([loadCategories(), loadItems()]).finally(() => setLoading(false));
  }, [loadCategories]);

  // Sync loadItems whenever pagination filters update
  useEffect(() => {
    if (!loading) {
      loadItems();
    }
  }, [loadItems, page, categoryIdFilter, sortBy, sortOrder]);

  // Trigger load when search query changes (debounce search slightly is good, but simple trigger is fine)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadItems();
  };

  const handleClearSearch = () => {
    setSearch('');
    setPage(1);
    // Timeout to wait for state to update, or pass it directly
    setTimeout(() => loadItems(), 0);
  };

  // Toggle availability action on table row
  const handleToggleAvailable = async (item) => {
    const originalAvailable = item.is_available;
    // Optimistic Update
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, is_available: !originalAvailable } : i))
    );
    try {
      await menuApi.updateItem(item.id, { is_available: !originalAvailable });
      showToast(`Updated visibility status of "${item.name}"`);
    } catch (err) {
      // Revert if error
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_available: originalAvailable } : i))
      );
      showToast(err.message || 'Failed to update visibility', 'error');
    }
  };

  // Toggle special status action on table row
  const handleToggleSpecial = async (item) => {
    const originalFeatured = item.is_featured;
    // Optimistic Update
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, is_featured: !originalFeatured } : i))
    );
    try {
      await menuApi.updateItem(item.id, { is_featured: !originalFeatured });
      showToast(`Updated promo status of "${item.name}"`);
    } catch (err) {
      // Revert if error
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_featured: originalFeatured } : i))
      );
      showToast(err.message || 'Failed to update promo status', 'error');
    }
  };

  // Toggle category active status on category list row
  const handleToggleCategoryActive = async (category) => {
    const originalActive = category.is_active;
    // Optimistic Update
    setCategories((prev) =>
      prev.map((c) => (c.id === category.id ? { ...c, is_active: !originalActive } : c))
    );
    try {
      await menuApi.updateCategory(category.id, { is_active: !originalActive });
      showToast(`Updated status of "${category.name}"`);
    } catch (err) {
      // Revert if error
      setCategories((prev) =>
        prev.map((c) => (c.id === category.id ? { ...c, is_active: originalActive } : c))
      );
      showToast(err.message || 'Failed to update category status', 'error');
    }
  };

  // Deletion logic
  const handleConfirmDeleteItem = async () => {
    if (!deleteItemTarget) return;
    try {
      await menuApi.deleteItem(deleteItemTarget.id);
      showToast(`Successfully deleted "${deleteItemTarget.name}"`);
      await loadItems();
    } catch (err) {
      showToast(err.message || 'Failed to delete menu item', 'error');
    } finally {
      setDeleteItemTarget(null);
    }
  };

  const handleConfirmDeleteCategory = async () => {
    if (!deleteCategoryTarget) return;
    try {
      await menuApi.deleteCategory(deleteCategoryTarget.id);
      showToast(`Successfully deleted category "${deleteCategoryTarget.name}"`);
      await loadCategories();
      await loadItems(); // Refresh items in case cascade deletion occurred
    } catch (err) {
      showToast(err.message || 'Failed to delete category', 'error');
    } finally {
      setDeleteCategoryTarget(null);
    }
  };

  // File picker handler
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Open Create/Edit Modals
  const openItemModal = (item = null) => {
    setSelectedItem(item);
    setImageFile(null);
    setImagePreview('');
    if (item) {
      setItemForm({
        category_id: item.category_id.toString(),
        name: item.name,
        description: item.description || '',
        price: item.price.toString(),
        is_vegetarian: item.is_vegetarian,
        is_spicy: item.is_spicy,
        is_available: item.is_available,
        is_featured: item.is_featured,
        sort_order: (item.sort_order ?? 0).toString(),
      });
      setImagePreview(item.image_url || '');
    } else {
      setItemForm({
        category_id: categories[0]?.id?.toString() || '',
        name: '',
        description: '',
        price: '',
        is_vegetarian: false,
        is_spicy: false,
        is_available: true,
        is_featured: false,
        sort_order: '0',
      });
    }
    setItemModalOpen(true);
  };

  const openCategoryModal = (category = null) => {
    setSelectedCategory(category);
    if (category) {
      setCategoryForm({
        name: category.name,
        description: category.description || '',
        sort_order: (category.sort_order ?? 0).toString(),
        is_active: category.is_active,
      });
    } else {
      setCategoryForm({
        name: '',
        description: '',
        sort_order: '0',
        is_active: true,
      });
    }
    setCategoryModalOpen(true);
  };

  // Submit handlers
  const handleItemSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        category_id: Number(itemForm.category_id),
        name: itemForm.name,
        description: itemForm.description,
        price: Number(itemForm.price),
        is_vegetarian: itemForm.is_vegetarian,
        is_spicy: itemForm.is_spicy,
        is_available: itemForm.is_available,
        is_featured: itemForm.is_featured,
        sort_order: Number(itemForm.sort_order),
      };

      if (selectedItem) {
        await menuApi.updateItem(selectedItem.id, payload, imageFile);
        showToast(`Successfully updated menu item "${payload.name}"`);
      } else {
        await menuApi.createItem(payload, imageFile);
        showToast(`Successfully added menu item "${payload.name}"`);
      }
      setItemModalOpen(false);
      await loadItems();
    } catch (err) {
      showToast(err.message || 'Failed to save menu item', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: categoryForm.name,
        description: categoryForm.description,
        sort_order: Number(categoryForm.sort_order),
        is_active: categoryForm.is_active,
      };

      if (selectedCategory) {
        await menuApi.updateCategory(selectedCategory.id, payload);
        showToast(`Successfully updated category "${payload.name}"`);
      } else {
        await menuApi.createCategory(payload);
        showToast(`Successfully added category "${payload.name}"`);
      }
      setCategoryModalOpen(false);
      await loadCategories();
      await loadItems();
    } catch (err) {
      showToast(err.message || 'Failed to save category', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-display">Menu Management</h1>
          <p className="text-sm text-stone-500 mt-0.5">Organize items, kitchen categories, visibility details, and prices.</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'items' ? (
            <button
              onClick={() => openItemModal()}
              className="btn-primary flex items-center gap-1.5 bg-brand-600 text-white rounded-xl shadow hover:bg-brand-500 transition py-2 px-4"
            >
              <span>➕</span> Add Menu Item
            </button>
          ) : (
            <button
              onClick={() => openCategoryModal()}
              className="btn-primary flex items-center gap-1.5 bg-brand-600 text-white rounded-xl shadow hover:bg-brand-500 transition py-2 px-4"
            >
              <span>➕</span> Add Category
            </button>
          )}
        </div>
      </div>

      {/* Alert toast notifications */}
      {alert.message && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ message: '', type: 'success' })} />
      )}

      {/* Tab Switcher */}
      <div className="flex border-b border-stone-200 gap-1.5 select-none bg-stone-100/60 p-1 rounded-xl max-w-sm">
        <button
          onClick={() => setActiveTab('items')}
          className={`flex-1 text-center py-2 px-4 rounded-lg text-sm font-semibold tracking-wide transition-all ${
            activeTab === 'items'
              ? 'bg-white text-forest-900 shadow-sm'
              : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
          }`}
        >
          🍽️ Menu Items ({totalItems})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex-1 text-center py-2 px-4 rounded-lg text-sm font-semibold tracking-wide transition-all ${
            activeTab === 'categories'
              ? 'bg-white text-forest-900 shadow-sm'
              : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
          }`}
        >
          📋 Categories ({categories.length})
        </button>
      </div>

      {/* ── TAB 1: MENU ITEMS ── */}
      {activeTab === 'items' && (
        <div className="space-y-4">
          {/* Filters & Search panel card */}
          <div className="card bg-white border border-stone-200 p-4 rounded-2xl shadow-sm">
            <form onSubmit={handleSearchSubmit} className="grid gap-4 sm:grid-cols-12 items-center">
              {/* Search text box */}
              <div className="relative sm:col-span-4">
                <input
                  type="text"
                  placeholder="Search item name/description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pr-10"
                />
                {search && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 font-bold"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Category selector */}
              <div className="sm:col-span-3">
                <select
                  value={categoryIdFilter}
                  onChange={(e) => {
                    setCategoryIdFilter(e.target.value);
                    setPage(1);
                  }}
                  className="input-field"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort by parameter */}
              <div className="sm:col-span-3">
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order);
                    setPage(1);
                  }}
                  className="input-field"
                >
                  <option value="display_order-asc">Sort: Display Order</option>
                  <option value="category-asc">Sort: Category (A-Z)</option>
                  <option value="name-asc">Sort: Name (A-Z)</option>
                  <option value="name-desc">Sort: Name (Z-A)</option>
                  <option value="price-asc">Sort: Price (Low to High)</option>
                  <option value="price-desc">Sort: Price (High to Low)</option>
                </select>
              </div>

              {/* Submit button */}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="btn-primary w-full py-2.5 bg-forest-900 text-white rounded-xl shadow hover:bg-forest-800 transition"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Items Table / Card layout */}
          <div className="card bg-white border border-stone-200 rounded-2xl overflow-hidden p-0 shadow-sm">
            {itemsLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-200 border-t-brand-600" />
                <p className="text-sm text-stone-500 font-medium">Querying menu directory...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-3 select-none">🍽️</div>
                <h3 className="text-base font-bold text-stone-800 font-display">No menu items found</h3>
                <p className="text-sm text-stone-500 mt-1 max-w-xs mx-auto">Try updating search filters or add a new menu item to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] font-bold border-b border-stone-100">
                      <th className="px-6 py-4">Image</th>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4 text-right">Price</th>
                      <th className="px-6 py-4 text-center">Special</th>
                      <th className="px-6 py-4 text-center">Available</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-stone-50/50 transition">
                        {/* Thumbnail image column */}
                        <td className="px-6 py-4">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="h-12 w-12 rounded-lg object-cover shadow-sm border border-stone-200"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-stone-100 border border-stone-200 text-lg select-none">
                              🍽️
                            </div>
                          )}
                        </td>

                        {/* Name/badges column */}
                        <td className="px-6 py-4 font-semibold text-stone-900">
                          <div>
                            <div>{item.name}</div>
                            <div className="flex gap-1.5 mt-1">
                              {item.is_vegetarian && (
                                <span className="rounded bg-green-50 px-1 py-0.5 text-[9px] font-bold uppercase tracking-wider text-green-700">
                                  Veg
                                </span>
                              )}
                              {item.is_spicy && (
                                <span className="rounded bg-red-50 px-1 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-700">
                                  Spicy
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category name */}
                        <td className="px-6 py-4 text-stone-600">{item.category_name}</td>

                        {/* Price */}
                        <td className="px-6 py-4 text-right font-medium text-stone-900">
                          {formatPrice(item.price)}
                        </td>

                        {/* Special quick status toggle */}
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleToggleSpecial(item)}
                            className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-semibold ${
                              item.is_featured
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                            } transition`}
                          >
                            {item.is_featured ? '⭐ Special' : 'Regular'}
                          </button>
                        </td>

                        {/* Available quick status toggle */}
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleToggleAvailable(item)}
                            className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${
                              item.is_available
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            } transition`}
                          >
                            {item.is_available ? 'Available' : 'Unavailable'}
                          </button>
                        </td>

                        {/* Action buttons */}
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => openItemModal(item)}
                            className="text-stone-600 hover:text-stone-900 font-bold hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteItemTarget(item)}
                            className="text-red-600 hover:text-red-800 font-bold hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {!itemsLoading && totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-stone-100 px-6 py-4 select-none">
                <span className="text-xs text-stone-500 font-medium">
                  Showing {items.length} of {totalItems} items
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="btn-secondary py-1 px-3 text-xs rounded-lg disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="btn-secondary py-1 px-3 text-xs rounded-lg disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: MENU CATEGORIES ── */}
      {activeTab === 'categories' && (
        <div className="card bg-white border border-stone-200 rounded-2xl overflow-hidden p-0 shadow-sm">
          {categories.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-3 select-none">📋</div>
              <h3 className="text-base font-bold text-stone-800 font-display">No categories found</h3>
              <p className="text-sm text-stone-500 mt-1 max-w-xs mx-auto">Add your first category to group your menu items properly.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[11px] font-bold border-b border-stone-100">
                    <th className="px-6 py-4">Sort Order</th>
                    <th className="px-6 py-4">Category Name</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-stone-50/50 transition">
                      {/* Sort order tag */}
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                          {cat.sort_order ?? 0}
                        </span>
                      </td>

                      {/* Name */}
                      <td className="px-6 py-4 font-semibold text-stone-900">{cat.name}</td>

                      {/* Description */}
                      <td className="px-6 py-4 text-stone-500 max-w-sm truncate">
                        {cat.description || <span className="italic text-stone-400">No description</span>}
                      </td>

                      {/* Status quick toggle */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleCategoryActive(cat)}
                          className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${
                            cat.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          } transition`}
                        >
                          {cat.is_active ? 'Active' : 'Hidden'}
                        </button>
                      </td>

                      {/* Action buttons */}
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => openCategoryModal(cat)}
                          className="text-stone-600 hover:text-stone-900 font-bold hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteCategoryTarget(cat)}
                          className="text-red-600 hover:text-red-800 font-bold hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── CREATE / EDIT MENU ITEM MODAL ── */}
      {itemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-100 my-8 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-stone-900 font-display">
                {selectedItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">Define pricing, description, category, and images.</p>
            </div>

            <form onSubmit={handleItemSubmit} className="space-y-4">
              {/* Item Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Lemon Black Tea"
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  className="input-field"
                />
              </div>

              {/* Category ID Select */}
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Category</label>
                <select
                  required
                  value={itemForm.category_id}
                  onChange={(e) => setItemForm({ ...itemForm, category_id: e.target.value })}
                  className="input-field"
                >
                  <option value="" disabled>Select category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price & Sort Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Price (Rs.)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g., 120"
                    value={itemForm.price}
                    onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Sort Order</label>
                  <input
                    type="number"
                    min="0"
                    value={itemForm.sort_order}
                    onChange={(e) => setItemForm({ ...itemForm, sort_order: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  placeholder="Write item ingredients or details..."
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  className="input-field h-20 resize-none"
                />
              </div>

              {/* Image Picker */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider">Item Image</label>
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-xl border border-stone-200 overflow-hidden bg-stone-50 flex items-center justify-center shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-2xl select-none">🍽️</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="item-file-input"
                    />
                    <label
                      htmlFor="item-file-input"
                      className="btn-secondary py-1.5 px-3 rounded-lg text-xs cursor-pointer select-none text-stone-700 border border-stone-300 hover:bg-stone-50"
                    >
                      Choose Image File
                    </label>
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-3 pt-2 bg-stone-50 p-3 rounded-xl border border-stone-200/50">
                <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={itemForm.is_vegetarian}
                    onChange={(e) => setItemForm({ ...itemForm, is_vegetarian: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  Vegetarian (Veg)
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={itemForm.is_spicy}
                    onChange={(e) => setItemForm({ ...itemForm, is_spicy: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  Spicy
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={itemForm.is_available}
                    onChange={(e) => setItemForm({ ...itemForm, is_available: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  In Stock (Available)
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={itemForm.is_featured}
                    onChange={(e) => setItemForm({ ...itemForm, is_featured: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  Featured Choice
                </label>
              </div>

              {/* Modal footer controls */}
              <div className="flex gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setItemModalOpen(false)}
                  className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-600 bg-stone-100 rounded-xl hover:bg-stone-200 transition"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-brand-600 rounded-xl hover:bg-brand-500 transition shadow-sm"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Save Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CREATE / EDIT CATEGORY MODAL ── */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-stone-100 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-stone-900 font-display">
                {selectedCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">Categories group your public menu items.</p>
            </div>

            <form onSubmit={handleCategorySubmit} className="space-y-4">
              {/* Category Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Appetizers"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="input-field"
                />
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Sort Order</label>
                <input
                  type="number"
                  min="0"
                  value={categoryForm.sort_order}
                  onChange={(e) => setCategoryForm({ ...categoryForm, sort_order: e.target.value })}
                  className="input-field"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  placeholder="Brief summary of category contents..."
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="input-field h-20 resize-none"
                />
              </div>

              {/* Active Toggle */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer select-none pt-1">
                  <input
                    type="checkbox"
                    checked={categoryForm.is_active}
                    onChange={(e) => setCategoryForm({ ...categoryForm, is_active: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  Active & Visible to Public
                </label>
              </div>

              {/* Modal footer controls */}
              <div className="flex gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-600 bg-stone-100 rounded-xl hover:bg-stone-200 transition"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-brand-600 rounded-xl hover:bg-brand-500 transition shadow-sm"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CUSTOM TAILWIND CONFIRMATION DIALOG: DELETE ITEM ── */}
      {deleteItemTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-stone-100 text-center space-y-4">
            <div className="text-3xl select-none">⚠️</div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 font-display">Delete Menu Item</h3>
              <p className="text-sm text-stone-500 mt-1 leading-relaxed">
                Are you sure you want to delete &quot;{deleteItemTarget.name}&quot;? This operation is permanent and cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteItemTarget(null)}
                className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-600 bg-stone-100 rounded-xl hover:bg-stone-200 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteItem}
                className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-red-600 rounded-xl hover:bg-red-700 transition shadow-sm shadow-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CUSTOM TAILWIND CONFIRMATION DIALOG: DELETE CATEGORY ── */}
      {deleteCategoryTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-stone-100 text-center space-y-4">
            <div className="text-3xl select-none">🛑 Danger</div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 font-display">Delete Category</h3>
              <p className="text-sm text-stone-500 mt-1 leading-relaxed">
                Deleting category &quot;{deleteCategoryTarget.name}&quot; will **permanently delete all menu items linked to it**! Are you sure you want to proceed?
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteCategoryTarget(null)}
                className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-600 bg-stone-100 rounded-xl hover:bg-stone-200 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCategory}
                className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-red-600 rounded-xl hover:bg-red-700 transition shadow-sm shadow-red-200"
              >
                Cascade Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
