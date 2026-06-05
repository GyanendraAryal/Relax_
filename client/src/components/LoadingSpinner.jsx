export default function LoadingSpinner({ className = '' }) {
  return (
    <div className={`flex justify-center py-12 ${className}`}>
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
    </div>
  );
}
