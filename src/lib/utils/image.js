export function resolveImageUrl(path, fallback = 'https://images.unsplash.com/photo-1540039155733-d7696d54af58?w=800&auto=format&fit=crop&q=80') {
  if (!path) return fallback;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('data:image')) return path;
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  
  if (path.startsWith('/storage/')) {
    return backendUrl + path;
  }
  if (path.startsWith('storage/')) {
    return backendUrl + '/' + path;
  }
  return backendUrl + '/storage/' + path;
}