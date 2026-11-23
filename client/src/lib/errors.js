export function getErrorMessage(err, fallback) {
  if (err.response?.data?.error) {
    return err.response.data.error;
  }
  if (err.code === "ERR_NETWORK" || !err.response) {
    return "Can't reach the server. Make sure the backend is running and reachable.";
  }
  return fallback;
}
