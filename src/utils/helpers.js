// Helper functions
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return 'N/A';
  }
};

export const truncateUrl = (url, maxLength = 50) => {
  return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
};
