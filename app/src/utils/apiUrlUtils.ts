export const getApiBaseUrl = () => {
  // In browser environments
  if (typeof window !== "undefined") {
    // Dynamically get the current hostname
    return `${window.location.protocol}//${window.location.hostname}:3001`;
  }

  // In server environments
  return "http://localhost:3001";
};
