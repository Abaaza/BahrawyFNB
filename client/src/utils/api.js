export function getApiBase() {
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  return base.replace(/\/+$/, '');
}
