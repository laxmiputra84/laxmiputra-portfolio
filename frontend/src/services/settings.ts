import api from "./api";

export async function getSettings() {
  const response = await api.get("/settings/");
  return response.data;
}

export async function updateSettings(data: any) {
  const response = await api.put("/settings/", data);
  return response.data;
}

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/upload/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}
