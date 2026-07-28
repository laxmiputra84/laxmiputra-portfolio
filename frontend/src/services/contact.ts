import api from "./api";

export async function submitContact(data: any) {
  const response = await api.post("/contact/", data);
  return response.data;
}

export async function getContactSubmissions() {
  const response = await api.get("/contact/");
  return response.data;
}

export async function deleteContactSubmission(id: number) {
  const response = await api.delete(`/contact/${id}`);
  return response.data;
}
