import api from "./api";

export async function loginUser(username: string, password: string) {
  // Use raw urlencoded string format to ensure cross-browser compatibility and exact form serialization
  const payload = `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

  const response = await api.post("/auth/login", payload, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return response.data;
}

export async function getProfile() {
  const response = await api.get("/auth/me");
  return response.data;
}

export async function refreshToken() {
  const response = await api.post("/auth/refresh");
  return response.data;
}

export async function logoutUser() {
  const response = await api.post("/auth/logout");
  return response.data;
}

export async function registerUser(data: any) {
  const response = await api.post("/auth/register", data);
  return response.data;
}
