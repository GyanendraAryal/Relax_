export default function EmptyState({ title, description }) {
  return (
    <div className="py-16 text-center text-stone-500">
      <p className="text-lg font-medium text-stone-700">{title}</p>
      {description && <p className="mt-2 text-sm">{description}</p>}
    </div>
  );
}
