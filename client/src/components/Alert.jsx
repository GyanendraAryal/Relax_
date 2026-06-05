export default function Alert({ type = 'error', message, onClose }) {
  if (!message) return null;
  const styles =
    type === 'success'
      ? 'bg-green-50 text-green-800 border-green-200'
      : 'bg-red-50 text-red-800 border-red-200';
  return (
    <div className={`mb-4 rounded-lg border px-4 py-3 text-sm ${styles}`}>
      <div className="flex justify-between gap-2">
        <span>{message}</span>
        {onClose && (
          <button type="button" onClick={onClose} className="font-bold">
            ×
          </button>
        )}
      </div>
    </div>
  );
}
