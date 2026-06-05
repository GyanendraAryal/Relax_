export function formatPrice(amount) {
  if (amount == null) return '—';
  return `Rs. ${Number(amount).toLocaleString('en-NP', { minimumFractionDigits: 0 })}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-NP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
