import api from "./api";

export async function getSocialLinks() {
  const response = await api.get("/social-links/");
  return response.data;
}

export async function createSocialLink(data: any) {
  const response = await api.post("/social-links/", data);
  return response.data;
}

export async function updateSocialLink(id: number, data: any) {
  const response = await api.put(`/social-links/${id}`, data);
  return response.data;
}

export async function deleteSocialLink(id: number) {
  const response = await api.delete(`/social-links/${id}`);
  return response.data;
}
