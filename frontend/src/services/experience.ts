import api from "./api";

export async function getExperiences() {
  const response = await api.get("/experience/");
  return response.data;
}

export async function createExperience(data: any) {
  const response = await api.post("/experience/", data);
  return response.data;
}

export async function updateExperience(id: number, data: any) {
  const response = await api.put(`/experience/${id}`, data);
  return response.data;
}

export async function deleteExperience(id: number) {
  const response = await api.delete(`/experience/${id}`);
  return response.data;
}
