import { useEffect, useState } from 'react';
import { menuApi } from '../../api/menu.api.js';
import LoadingSpinner from '../../components/LoadingSpinner.jsx';
import Alert from '../../components/Alert.jsx';
import { formatPrice } from '../../utils/format.js';

export default function MenuMgmt() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState('');
  const [itemForm, setItemForm] = useState({
    category_id: '',
    name: '',
    description: '',
    price: '',
    is_vegetarian: false,
    is_featured: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [catForm, setCatForm] = useState({ name: '', description: '' });

  const load = () =>
    Promise.all([menuApi.getCategories(), menuApi.getItems()]).then(([c, i]) => {
      setCategories(c);
      setItems(i);
    });

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const addCategory = async (e) => {
    e.preventDefault();
    try {
      await menuApi.createCategory(catForm);
      setCatForm({ name: '', description: '' });
      await load();
      setAlert('Category added');
    } catch (err) {
      setAlert(err.message);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    try {
      await menuApi.createItem(
        { ...itemForm, category_id: Number(itemForm.category_id), price: Number(itemForm.price) },
        imageFile
      );
      setItemForm({ category_id: '', name: '', description: '', price: '', is_vegetarian: false, is_featured: false });
      setImageFile(null);
      await load();
      setAlert('Menu item added');
    } catch (err) {
      setAlert(err.message);
    }
  };

  const deleteItem = async (id) => {
    if (!confirm('Delete this item?')) return;
    await menuApi.deleteItem(id);
    await load();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold">Menu Management</h1>
      <Alert type="success" message={alert} onClose={() => setAlert('')} />

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <form onSubmit={addCategory} className="card space-y-3">
          <h2 className="font-semibold">Add Category</h2>
          <input className="input-field" placeholder="Name" value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} required />
          <textarea className="input-field" placeholder="Description" value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} />
          <button type="submit" className="btn-primary">Add Category</button>
        </form>

        <form onSubmit={addItem} className="card space-y-3">
          <h2 className="font-semibold">Add Menu Item</h2>
          <select className="input-field" value={itemForm.category_id} onChange={(e) => setItemForm({ ...itemForm, category_id: e.target.value })} required>
            <option value="">Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input className="input-field" placeholder="Name" value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} required />
          <input className="input-field" placeholder="Price" type="number" value={itemForm.price} onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })} required />
          <textarea className="input-field" placeholder="Description" value={itemForm.description} onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} />
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0])} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={itemForm.is_vegetarian} onChange={(e) => setItemForm({ ...itemForm, is_vegetarian: e.target.checked })} /> Vegetarian
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={itemForm.is_featured} onChange={(e) => setItemForm({ ...itemForm, is_featured: e.target.checked })} /> Featured
          </label>
          <button type="submit" className="btn-primary">Add Item</button>
        </form>
      </div>

      <div className="card mt-8 overflow-x-auto">
        <h2 className="mb-4 font-semibold">All Items ({items.length})</h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-stone-500">
              <th className="py-2">Name</th>
              <th>Category</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-stone-100">
                <td className="py-3 font-medium">{item.name}</td>
                <td>{item.category_name}</td>
                <td>{formatPrice(item.price)}</td>
                <td>
                  <button type="button" onClick={() => deleteItem(item.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
