export const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:8000"
  : "https://google.com";

export const SUBMIT_URL = `${API_BASE_URL}/submit`;
