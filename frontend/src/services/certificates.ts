import api from "./api";

export async function getCertificates() {
  const response = await api.get("/certificates/");
  return response.data;
}

export async function createCertificate(data: any) {
  const response = await api.post("/certificates/", data);
  return response.data;
}

export async function updateCertificate(id: number, data: any) {
  const response = await api.put(`/certificates/${id}`, data);
  return response.data;
}

export async function deleteCertificate(id: number) {
  const response = await api.delete(`/certificates/${id}`);
  return response.data;
}
