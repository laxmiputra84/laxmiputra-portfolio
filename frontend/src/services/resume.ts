import api from "./api";

export async function getActiveResume() {
  const response = await api.get("/resume/");
  return response.data;
}

export async function uploadResume(file: File, title: string = "My Resume") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  const response = await api.post("/resume/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function updateResumeTitle(title: string) {
  const response = await api.put("/resume/", { title });
  return response.data;
}

export async function deleteActiveResume() {
  const response = await api.delete("/resume/");
  return response.data;
}
