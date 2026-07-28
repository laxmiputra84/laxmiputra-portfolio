import api from "./api";

export async function getSkills() {
  const response = await api.get("/skills/");
  return response.data;
}

export async function createSkill(data: any) {
  const response = await api.post("/skills/", data);
  return response.data;
}

export async function updateSkill(id: number, data: any) {
  const response = await api.put(`/skills/${id}`, data);
  return response.data;
}

export async function deleteSkill(id: number) {
  const response = await api.delete(`/skills/${id}`);
  return response.data;
}

export async function importResumeSkills(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/skills/import-resume", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function saveImportedSkills(skills: any[]) {
  const response = await api.post("/skills/import-resume/save", skills);
  return response.data;
}
