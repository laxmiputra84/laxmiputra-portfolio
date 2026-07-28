import api from "./api";

export async function getProjects() {
  const response = await api.get("/projects/");
  return response.data;
}

export async function getFeaturedProjects() {
  const response = await api.get("/projects/featured");
  return response.data;
}

export async function createProject(data: any) {
  const response = await api.post("/projects/", data);
  return response.data;
}

export async function updateProject(id: number, data: any) {
  const response = await api.put(`/projects/${id}`, data);
  return response.data;
}

export async function deleteProject(id: number) {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
}
