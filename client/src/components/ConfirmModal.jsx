/**
 * Reusable confirmation dialog — replaces all window.confirm() usage.
 *
 * Usage:
 *   const [confirm, setConfirm] = useState(null);
 *   <ConfirmModal
 *     isOpen={!!confirm}
 *     title="Delete Item"
 *     message={`Delete "${confirm?.name}"? This cannot be undone.`}
 *     confirmLabel="Delete"
 *     danger
 *     onConfirm={() => { doDelete(confirm.id); setConfirm(null); }}
 *     onCancel={() => setConfirm(null)}
 *   />
 */
export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  danger = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-stone-100 text-center space-y-4">
        <div className="text-3xl select-none">{danger ? '⚠️' : 'ℹ️'}</div>
        <div>
          <h3 className="text-lg font-bold text-stone-900">{title}</h3>
          <p className="text-sm text-stone-500 mt-1 leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-600 bg-stone-100 rounded-xl hover:bg-stone-200 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-white rounded-xl transition shadow-sm ${
              danger ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-600 hover:bg-brand-700'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
