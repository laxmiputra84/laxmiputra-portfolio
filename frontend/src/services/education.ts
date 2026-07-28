import api from "./api";

export async function getEducations() {
  const response = await api.get("/education/");
  return response.data;
}

export async function createEducation(data: any) {
  const response = await api.post("/education/", data);
  return response.data;
}

export async function updateEducation(id: number, data: any) {
  const response = await api.put(`/education/${id}`, data);
  return response.data;
}

export async function deleteEducation(id: number) {
  const response = await api.delete(`/education/${id}`);
  return response.data;
}
