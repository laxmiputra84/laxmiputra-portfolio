"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Container from "@/components/Container";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Loader from "@/components/Loader";
import Modal from "@/components/Modal";
import { showToast } from "@/components/Toast";
import { getProjects, createProject, updateProject, deleteProject } from "@/services/projects";
import { getSkills, createSkill, updateSkill, deleteSkill, importResumeSkills, saveImportedSkills } from "@/services/skills";
import { getExperiences, createExperience, updateExperience, deleteExperience } from "@/services/experience";
import { getEducations, createEducation, updateEducation, deleteEducation } from "@/services/education";
import { getCertificates, createCertificate, updateCertificate, deleteCertificate } from "@/services/certificates";
import { getSettings, updateSettings, uploadFile } from "@/services/settings";
import { getActiveResume, uploadResume, deleteActiveResume } from "@/services/resume";
import { getContactSubmissions, deleteContactSubmission } from "@/services/contact";
import { useAuth } from "@/context/AuthContext";

type Tab = "projects" | "skills" | "experience" | "education" | "certificates" | "resume" | "messages" | "settings";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [educations, setEducations] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [activeResumeState, setActiveResumeState] = useState<any>(null);

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalTitle, setModalTitle] = useState("");

  // Resume Import Modal States
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importSaving, setImportSaving] = useState(false);
  const [importedPreview, setImportedPreview] = useState<{
    new_skills: any[];
    existing_skills: any[];
    total_detected: number;
  } | null>(null);
  const [selectedImportSkills, setSelectedImportSkills] = useState<{ [key: string]: boolean }>({});

  // Form Inputs
  const [projectForm, setProjectForm] = useState({
    title: "",
    slug: "",
    short_description: "",
    full_description: "",
    technologies: "",
    github_url: "",
    live_url: "",
    image_url: "",
    featured: false,
    display_order: 0
  });
  const [skillForm, setSkillForm] = useState({ name: "", category: "Frontend", level: 90, icon_name: "" });
  const [experienceForm, setExperienceForm] = useState({ company: "", role: "", location: "", start_date: "", end_date: "", description: "", current: false });
  const [educationForm, setEducationForm] = useState({ institution: "", degree: "", field_of_study: "", start_date: "", end_date: "", description: "" });
  const [certificateForm, setCertificateForm] = useState({ name: "", issuing_organization: "", issue_date: "", expiration_date: "", credential_id: "", credential_url: "", image_url: "" });
  const [settingsForm, setSettingsForm] = useState({ site_name: "", hero_title: "", hero_subtitle: "", contact_email: "", contact_phone: "", about_text: "", profile_image: "" });
  
  // Resume specific upload states
  const [uploadingResumeFile, setUploadingResumeFile] = useState(false);
  const [resumeTitleForm, setResumeTitleForm] = useState("My Resume");

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingProjImage, setUploadingProjImage] = useState(false);
  const [uploadingCertImage, setUploadingCertImage] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    setLoading(true);
    try {
      const [proj, sk, exp, edu, certs, msg, setts] = await Promise.all([
        getProjects(),
        getSkills(),
        getExperiences(),
        getEducations(),
        getCertificates(),
        getContactSubmissions(),
        getSettings()
      ]);
      setProjects(proj);
      setSkills(sk);
      setExperiences(exp);
      setEducations(edu);
      setCertificates(certs);
      setMessages(msg);
      setSettings(setts);
      if (setts) {
        setSettingsForm({
          site_name: setts.site_name || "",
          hero_title: setts.hero_title || "",
          hero_subtitle: setts.hero_subtitle || "",
          contact_email: setts.contact_email || "",
          contact_phone: setts.contact_phone || "",
          about_text: setts.about_text || "",
          profile_image: setts.profile_image || "",
        });
      }
      // Load active resume if any
      try {
        const res = await getActiveResume();
        setActiveResumeState(res);
        setResumeTitleForm(res.title);
      } catch {
        setActiveResumeState(null);
      }
    } catch (err) {
      showToast("Error loading dashboard data.", "error");
    } finally {
      setLoading(false);
    }
  }

  // --- Resume CRUD Handlers ---
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    if (file.type !== "application/pdf") {
      showToast("Only PDF files are supported.", "error");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast("File exceeds 10 MB limit.", "error");
      return;
    }

    setUploadingResumeFile(true);
    try {
      const res = await uploadResume(file, resumeTitleForm);
      showToast("Resume uploaded successfully!");
      setActiveResumeState(res);
      loadAllData();
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Upload failed.";
      showToast(msg, "error");
    } finally {
      setUploadingResumeFile(false);
    }
  };

  const handleResumeDelete = async () => {
    if (!confirm("Are you sure you want to delete your active resume?")) return;
    try {
      await deleteActiveResume();
      showToast("Resume deleted.");
      setActiveResumeState(null);
      loadAllData();
    } catch {
      showToast("Deletion failed.", "error");
    }
  };

  // Helper formatting size
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Convert local app/uploads/resume/filename to public server HTTP path
  const getPdfUrl = (path: string) => {
    const relativePath = path.startsWith("app/") ? path.slice(4) : path;
    const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/api\/v1\/?$/, "").replace(/\/$/, "");
    return `${base}/${relativePath.replace(/\\/g, "/")}`;
  };

  // --- Image Upload Handler for Settings ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingImage(true);
    try {
      const res = await uploadFile(file);
      const fileUrl = res.file_url;
      const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/api\/v1\/?$/, "").replace(/\/$/, "");
      const fullUrl = `${base}${fileUrl}`;
      setSettingsForm((prev) => ({ ...prev, profile_image: fullUrl }));
      showToast("Profile image uploaded successfully!");
    } catch (err) {
      showToast("Failed to upload image.", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  // --- Image Upload Handler for Projects ---
  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingProjImage(true);
    try {
      const res = await uploadFile(file);
      const fileUrl = res.file_url;
      const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/api\/v1\/?$/, "").replace(/\/$/, "");
      const fullUrl = `${base}${fileUrl}`;
      setProjectForm((prev) => ({ ...prev, image_url: fullUrl }));
      showToast("Project image uploaded successfully!");
    } catch (err) {
      showToast("Failed to upload project image.", "error");
    } finally {
      setUploadingProjImage(false);
    }
  };

  // --- Image Upload Handler for Certificates ---
  const handleCertImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingCertImage(true);
    try {
      const res = await uploadFile(file);
      const fileUrl = res.file_url;
      const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/api\/v1\/?$/, "").replace(/\/$/, "");
      const fullUrl = `${base}${fileUrl}`;
      setCertificateForm((prev) => ({ ...prev, image_url: fullUrl }));
      showToast("Certificate image uploaded successfully!");
    } catch (err) {
      showToast("Failed to upload certificate image.", "error");
    } finally {
      setUploadingCertImage(false);
    }
  };

  // --- Skill Import Resume Handlers ---
  const handleResumeFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setImportLoading(true);
    setImportModalOpen(true);
    setImportedPreview(null);
    try {
      const res = await importResumeSkills(file);
      setImportedPreview(res);
      const initialSelected: { [key: string]: boolean } = {};
      res.new_skills.forEach((s: any) => {
        initialSelected[s.name] = true;
      });
      setSelectedImportSkills(initialSelected);
      showToast("Resume parsed successfully!");
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Failed to parse resume.";
      showToast(msg, "error");
      setImportModalOpen(false);
    } finally {
      setImportLoading(false);
    }
  };

  const toggleImportSkillSelect = (skillName: string) => {
    setSelectedImportSkills((prev) => ({
      ...prev,
      [skillName]: !prev[skillName]
    }));
  };

  const handleSaveImportedSkills = async () => {
    if (!importedPreview) return;
    const skillsToSave = importedPreview.new_skills.filter(s => selectedImportSkills[s.name]);
    if (skillsToSave.length === 0) {
      showToast("No new skills selected.", "error");
      return;
    }
    setImportSaving(true);
    try {
      const res = await saveImportedSkills(skillsToSave);
      showToast(`Successfully saved ${res.saved} skills!`);
      setImportModalOpen(false);
      loadAllData();
    } catch {
      showToast("Failed to save imported skills.", "error");
    } finally {
      setImportSaving(false);
    }
  };

  // --- CRUD Project Operations ---
  const handleOpenProjectModal = (item: any = null) => {
    if (item) {
      setEditingItem(item);
      setProjectForm({
        title: item.title,
        slug: item.slug || "",
        short_description: item.short_description || "",
        full_description: item.full_description || "",
        technologies: Array.isArray(item.technologies) ? item.technologies.join(", ") : (item.technologies || ""),
        github_url: item.github_url || "",
        live_url: item.live_url || "",
        image_url: item.image_url || "",
        featured: item.featured || false,
        display_order: item.display_order || 0
      });
      setModalTitle("Edit Project");
    } else {
      setEditingItem(null);
      setProjectForm({
        title: "",
        slug: "",
        short_description: "",
        full_description: "",
        technologies: "",
        github_url: "",
        live_url: "",
        image_url: "",
        featured: false,
        display_order: 0
      });
      setModalTitle("Add Project");
    }
    setModalOpen(true);
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...projectForm,
      technologies: projectForm.technologies.split(",").map(t => t.trim()).filter(Boolean),
      display_order: parseInt(projectForm.display_order as any) || 0
    };
    try {
      if (editingItem) {
        await updateProject(editingItem.id, payload);
        showToast("Project updated successfully!");
      } else {
        await createProject(payload);
        showToast("Project created successfully!");
      }
      setModalOpen(false);
      loadAllData();
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Operation failed.";
      showToast(msg, "error");
    }
  };

  const handleProjectDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteProject(id);
      showToast("Project deleted.");
      loadAllData();
    } catch {
      showToast("Deletion failed.", "error");
    }
  };

  // --- CRUD Skill Operations ---
  const handleOpenSkillModal = (item: any = null) => {
    if (item) {
      setEditingItem(item);
      setSkillForm({ name: item.name, category: item.category, level: item.level, icon_name: item.icon_name || "" });
      setModalTitle("Edit Skill");
    } else {
      setEditingItem(null);
      setSkillForm({ name: "", category: "Frontend", level: 90, icon_name: "" });
      setModalTitle("Add Skill");
    }
    setModalOpen(true);
  };

  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateSkill(editingItem.id, skillForm);
        showToast("Skill updated!");
      } else {
        await createSkill(skillForm);
        showToast("Skill added!");
      }
      setModalOpen(false);
      loadAllData();
    } catch {
      showToast("Operation failed.", "error");
    }
  };

  const handleSkillDelete = async (id: number) => {
    if (!confirm("Delete this skill?")) return;
    try {
      await deleteSkill(id);
      showToast("Skill deleted.");
      loadAllData();
    } catch {
      showToast("Deletion failed.", "error");
    }
  };

  // --- CRUD Experience Operations ---
  const handleOpenExperienceModal = (item: any = null) => {
    if (item) {
      setEditingItem(item);
      setExperienceForm({ company: item.company, role: item.role, location: item.location || "", start_date: item.start_date, end_date: item.end_date || "", description: item.description, current: item.current });
      setModalTitle("Edit Experience");
    } else {
      setEditingItem(null);
      setExperienceForm({ company: "", role: "", location: "", start_date: "", end_date: "", description: "", current: false });
      setModalTitle("Add Experience");
    }
    setModalOpen(true);
  };

  const handleExperienceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateExperience(editingItem.id, experienceForm);
        showToast("Experience updated!");
      } else {
        await createExperience(experienceForm);
        showToast("Experience added!");
      }
      setModalOpen(false);
      loadAllData();
    } catch {
      showToast("Operation failed.", "error");
    }
  };

  const handleExperienceDelete = async (id: number) => {
    if (!confirm("Delete this experience?")) return;
    try {
      await deleteExperience(id);
      showToast("Experience deleted.");
      loadAllData();
    } catch {
      showToast("Deletion failed.", "error");
    }
  };

  // --- CRUD Education Operations ---
  const handleOpenEducationModal = (item: any = null) => {
    if (item) {
      setEditingItem(item);
      setEducationForm({ institution: item.institution, degree: item.degree, field_of_study: item.field_of_study || "", start_date: item.start_date, end_date: item.end_date || "", description: item.description || "" });
      setModalTitle("Edit Education");
    } else {
      setEditingItem(null);
      setEducationForm({ institution: "", degree: "", field_of_study: "", start_date: "", end_date: "", description: "" });
      setModalTitle("Add Education");
    }
    setModalOpen(true);
  };

  const handleEducationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateEducation(editingItem.id, educationForm);
        showToast("Education updated!");
      } else {
        await createEducation(educationForm);
        showToast("Education added!");
      }
      setModalOpen(false);
      loadAllData();
    } catch {
      showToast("Operation failed.", "error");
    }
  };

  const handleEducationDelete = async (id: number) => {
    if (!confirm("Delete this education?")) return;
    try {
      await deleteEducation(id);
      showToast("Education deleted.");
      loadAllData();
    } catch {
      showToast("Deletion failed.", "error");
    }
  };

  // --- CRUD Certificates Operations ---
  const handleOpenCertificateModal = (item: any = null) => {
    if (item) {
      setEditingItem(item);
      setCertificateForm({
        name: item.name,
        issuing_organization: item.issuing_organization,
        issue_date: item.issue_date,
        expiration_date: item.expiration_date || "",
        credential_id: item.credential_id || "",
        credential_url: item.credential_url || "",
        image_url: item.image_url || ""
      });
      setModalTitle("Edit Certificate");
    } else {
      setEditingItem(null);
      setCertificateForm({ name: "", issuing_organization: "", issue_date: "", expiration_date: "", credential_id: "", credential_url: "", image_url: "" });
      setModalTitle("Add Certificate");
    }
    setModalOpen(true);
  };

  const handleCertificateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPayload = Object.fromEntries(
      Object.entries(certificateForm).map(([k, v]) => [k, v === "" ? null : v])
    );
    try {
      if (editingItem) {
        await updateCertificate(editingItem.id, cleanPayload);
        showToast("Certificate updated!");
      } else {
        await createCertificate(cleanPayload);
        showToast("Certificate added!");
      }
      setModalOpen(false);
      loadAllData();
    } catch {
      showToast("Operation failed.", "error");
    }
  };

  const handleCertificateDelete = async (id: number) => {
    if (!confirm("Delete this certificate?")) return;
    try {
      await deleteCertificate(id);
      showToast("Certificate deleted.");
      loadAllData();
    } catch {
      showToast("Deletion failed.", "error");
    }
  };

  // --- Settings Submission ---
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanForm = Object.fromEntries(
      Object.entries(settingsForm).map(([k, v]) => [k, v === "" ? null : v])
    );
    try {
      await updateSettings(cleanForm);
      showToast("Settings updated successfully!");
      loadAllData();
    } catch {
      showToast("Failed to update settings.", "error");
    }
  };

  // --- Contact Messages Submission ---
  const handleMessageDelete = async (id: number) => {
    if (!confirm("Delete this message log?")) return;
    try {
      await deleteContactSubmission(id);
      showToast("Message deleted.");
      loadAllData();
    } catch {
      showToast("Deletion failed.", "error");
    }
  };

  return (
    <Container className="py-12 flex-1 flex flex-col md:flex-row gap-8">
      {/* Sidebar Links */}
      <aside className="w-full md:w-64 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 border-b md:border-b-0 md:border-r border-border pr-0 md:pr-6">
        <h2 className="text-xl font-bold mb-4 hidden md:block">Dashboard</h2>
        {[
          { id: "projects", label: "Projects" },
          { id: "skills", label: "Skills" },
          { id: "experience", label: "Experience" },
          { id: "education", label: "Education" },
          { id: "certificates", label: "Certificates" },
          { id: "resume", label: "Resume" },
          { id: "messages", label: "Messages" },
          { id: "settings", label: "Settings" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`px-4 py-2.5 rounded-lg text-left text-sm font-semibold transition-colors shrink-0 cursor-pointer ${
              activeTab === tab.id
                ? "bg-primary text-white"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
        <button
          onClick={logout}
          className="px-4 py-2.5 rounded-lg text-left text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 shrink-0 mt-0 md:mt-auto cursor-pointer"
        >
          Sign Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1">
        {loading ? (
          <Loader size="lg" />
        ) : (
          <div>
            {/* PROJECTS TAB */}
            {activeTab === "projects" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">Manage Projects</h3>
                  <Button onClick={() => handleOpenProjectModal()}>Add Project</Button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {projects.map((p) => (
                    <Card key={p.id} className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-4">
                        {p.image_url && (
                          <img
                            src={p.image_url}
                            alt={p.title}
                            className="h-12 w-12 rounded object-cover border border-border"
                          />
                        )}
                        <div>
                          <h4 className="text-lg font-bold">{p.title}</h4>
                          <p className="text-xs text-muted-foreground">Order: {p.display_order} | Featured: {p.featured ? "Yes" : "No"}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenProjectModal(p)}>
                          Edit
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleProjectDelete(p.id)}>
                          Delete
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* SKILLS TAB */}
            {activeTab === "skills" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">Manage Skills</h3>
                  <div className="flex gap-3">
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      id="resume-skills-import-file"
                      onChange={handleResumeFileImport}
                      className="hidden"
                    />
                    <label
                      htmlFor="resume-skills-import-file"
                      className="inline-flex items-center justify-center font-semibold rounded-lg px-4 py-2 text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer transition-colors"
                    >
                      Import Skills from Resume
                    </label>
                    <Button onClick={() => handleOpenSkillModal()}>Add Skill</Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {skills.map((s) => (
                    <Card key={s.id} className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold">{s.name}</h4>
                        <p className="text-xs text-muted-foreground">{s.category} | {s.level}%</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenSkillModal(s)}>
                          Edit
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleSkillDelete(s.id)}>
                          Delete
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* EXPERIENCE TAB */}
            {activeTab === "experience" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">Manage Experience</h3>
                  <Button onClick={() => handleOpenExperienceModal()}>Add Experience</Button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {experiences.map((exp) => (
                    <Card key={exp.id} className="flex justify-between items-center gap-4">
                      <div>
                        <h4 className="text-lg font-bold">{exp.role}</h4>
                        <p className="text-sm text-primary font-semibold">{exp.company} | {exp.start_date} - {exp.end_date || "Present"}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenExperienceModal(exp)}>
                          Edit
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleExperienceDelete(exp.id)}>
                          Delete
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* EDUCATION TAB */}
            {activeTab === "education" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">Manage Education</h3>
                  <Button onClick={() => handleOpenEducationModal()}>Add Education</Button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {educations.map((edu) => (
                    <Card key={edu.id} className="flex justify-between items-center gap-4">
                      <div>
                        <h4 className="text-lg font-bold">{edu.degree}</h4>
                        <p className="text-sm text-purple-600 font-semibold">{edu.institution} | {edu.start_date} - {edu.end_date || "Present"}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenEducationModal(edu)}>
                          Edit
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleEducationDelete(edu.id)}>
                          Delete
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* CERTIFICATES TAB */}
            {activeTab === "certificates" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">Manage Certificates</h3>
                  <Button onClick={() => handleOpenCertificateModal()}>Add Certificate</Button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {certificates.map((c) => (
                    <Card key={c.id} className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-4">
                        {c.image_url && (
                          <img
                            src={c.image_url}
                            alt={c.name}
                            className="h-12 w-12 rounded object-cover border border-border"
                          />
                        )}
                        <div>
                          <h4 className="text-lg font-bold">{c.name}</h4>
                          <p className="text-xs text-muted-foreground">{c.issuing_organization} | Issued: {c.issue_date}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenCertificateModal(c)}>
                          Edit
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleCertificateDelete(c.id)}>
                          Delete
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* RESUME TAB */}
            {activeTab === "resume" && (
              <div>
                <h3 className="text-2xl font-bold mb-6">Manage Resume</h3>
                <Card className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Resume Document Title</label>
                    <input
                      type="text"
                      value={resumeTitleForm}
                      onChange={(e) => setResumeTitleForm(e.target.value)}
                      className="w-full max-w-md px-3 py-2 border border-border bg-background rounded-lg text-foreground focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Upload Resume File (PDF only)</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="application/pdf"
                        id="dashboard-resume-file"
                        onChange={handleResumeUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="dashboard-resume-file"
                        className="inline-flex items-center justify-center font-semibold rounded-lg px-4 py-2 text-sm bg-primary text-white hover:bg-primary/95 cursor-pointer transition-colors"
                      >
                        {uploadingResumeFile ? "Uploading..." : activeResumeState ? "Replace Resume PDF" : "Upload Resume PDF"}
                      </label>
                      {activeResumeState && (
                        <Button variant="danger" onClick={handleResumeDelete}>
                          Delete Resume
                        </Button>
                      )}
                    </div>
                  </div>

                  {activeResumeState ? (
                    <div className="border-t border-border pt-6 space-y-4">
                      <h4 className="font-bold text-lg text-primary">Active Resume Info</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-secondary/20 p-4 rounded-lg">
                        <div>
                          <span className="block font-semibold">Title</span>
                          <span>{activeResumeState.title}</span>
                        </div>
                        <div>
                          <span className="block font-semibold">File Name</span>
                          <span>{activeResumeState.file_name}</span>
                        </div>
                        <div>
                          <span className="block font-semibold">File Size</span>
                          <span>{formatBytes(activeResumeState.file_size)}</span>
                        </div>
                        <div>
                          <span className="block font-semibold">Uploaded At</span>
                          <span>{new Date(activeResumeState.uploaded_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="h-[400px] border border-border rounded-lg overflow-hidden">
                        <iframe
                          src={`${getPdfUrl(activeResumeState.file_path)}#toolbar=0`}
                          className="w-full h-full"
                          title="Resume Preview"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed border-border p-8 rounded-lg text-center text-muted-foreground text-sm">
                      No active resume uploaded. Upload a PDF file above to publish your CV.
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === "settings" && (
              <div>
                <h3 className="text-2xl font-bold mb-6">Profile Settings</h3>
                <Card>
                  <form onSubmit={handleSettingsSubmit} className="space-y-6">
                    {/* Profile Picture Uploader */}
                    <div>
                      <label className="block text-sm font-semibold mb-2">Profile Image</label>
                      <div className="flex items-center gap-6">
                        {settingsForm.profile_image ? (
                          <img
                            src={settingsForm.profile_image}
                            alt="Profile"
                            className="h-20 w-20 rounded-full object-cover border border-border"
                          />
                        ) : (
                          <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center text-xs text-muted-foreground border border-border">
                            No Image
                          </div>
                        )}
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            id="profile-image-file"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <label
                            htmlFor="profile-image-file"
                            className="inline-flex items-center justify-center font-medium rounded-lg px-4 py-2 text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer transition-colors"
                          >
                            {uploadingImage ? "Uploading..." : "Upload Image"}
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1">Site Title</label>
                      <input
                        type="text"
                        value={settingsForm.site_name}
                        onChange={(e) => setSettingsForm({ ...settingsForm, site_name: e.target.value })}
                        className="w-full px-3 py-2 border border-border bg-background rounded-lg text-foreground focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-1">Hero Main Title</label>
                        <input
                          type="text"
                          value={settingsForm.hero_title}
                          onChange={(e) => setSettingsForm({ ...settingsForm, hero_title: e.target.value })}
                          className="w-full px-3 py-2 border border-border bg-background rounded-lg text-foreground focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">Hero Subtitle</label>
                        <input
                          type="text"
                          value={settingsForm.hero_subtitle}
                          onChange={(e) => setSettingsForm({ ...settingsForm, hero_subtitle: e.target.value })}
                          className="w-full px-3 py-2 border border-border bg-background rounded-lg text-foreground focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">About Me Bio</label>
                      <textarea
                        value={settingsForm.about_text}
                        onChange={(e) => setSettingsForm({ ...settingsForm, about_text: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-border bg-background rounded-lg text-foreground focus:outline-none"
                      />
                    </div>
                    <Button type="submit">Save Changes</Button>
                  </form>
                </Card>
              </div>
            )}

            {/* MESSAGES TAB */}
            {activeTab === "messages" && (
              <div>
                <h3 className="text-2xl font-bold mb-6">Contact Inquiries</h3>
                {messages.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No messages received.</p>
                ) : (
                  <div className="space-y-4">
                    {messages.map((m) => (
                      <Card key={m.id} className="relative">
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <div>
                            <h4 className="font-bold text-lg">{m.subject}</h4>
                            <p className="text-sm text-primary font-medium">From: {m.name} ({m.email})</p>
                          </div>
                          <Button variant="danger" size="sm" onClick={() => handleMessageDelete(m.id)}>
                            Delete
                          </Button>
                        </div>
                        <p className="text-muted-foreground whitespace-pre-line text-sm mt-4 p-3 bg-muted rounded-lg">
                          {m.message}
                        </p>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* CRUD Project/Skill/Experience/Education/Certificates Modals */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle}>
        {activeTab === "projects" && (
          <form onSubmit={handleProjectSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Slug</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ecommerce-cloud"
                  value={projectForm.slug}
                  onChange={(e) => setProjectForm({ ...projectForm, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Short Description</label>
              <input
                type="text"
                required
                value={projectForm.short_description}
                onChange={(e) => setProjectForm({ ...projectForm, short_description: e.target.value })}
                className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Full Description</label>
              <textarea
                value={projectForm.full_description}
                onChange={(e) => setProjectForm({ ...projectForm, full_description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg"
              />
            </div>
            
            {/* Project Image Uploader */}
            <div>
              <label className="block text-sm font-semibold mb-1">Project Image</label>
              <div className="flex items-center gap-4">
                {projectForm.image_url && (
                  <img
                    src={projectForm.image_url}
                    alt="Project Preview"
                    className="h-12 w-12 rounded object-cover border border-border"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  id="project-image-file"
                  onChange={handleProjectImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="project-image-file"
                  className="inline-flex items-center justify-center font-medium rounded-lg px-3 py-1.5 text-xs bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer transition-colors"
                >
                  {uploadingProjImage ? "Uploading..." : "Upload Project Image"}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Technologies (comma separated)</label>
              <input
                type="text"
                required
                placeholder="e.g. Next.js, FastAPI, MySQL"
                value={projectForm.technologies}
                onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">GitHub URL</label>
                <input
                  type="text"
                  value={projectForm.github_url}
                  onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })}
                  className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Live URL</label>
                <input
                  type="text"
                  value={projectForm.live_url}
                  onChange={(e) => setProjectForm({ ...projectForm, live_url: e.target.value })}
                  className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-sm font-semibold mb-1">Display Order</label>
                <input
                  type="number"
                  value={projectForm.display_order}
                  onChange={(e) => setProjectForm({ ...projectForm, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg"
                />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  id="featured"
                  checked={projectForm.featured}
                  onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="featured" className="text-sm font-semibold">Featured Project</label>
              </div>
            </div>
            <Button type="submit" className="w-full">Save Project</Button>
          </form>
        )}

        {activeTab === "skills" && (
          <form onSubmit={handleSkillSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Skill Name</label>
              <input
                type="text"
                required
                value={skillForm.name}
                onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Category</label>
              <select
                value={skillForm.category}
                onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg focus:outline-none"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="DevOps">DevOps</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Proficiency Level (0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                required
                value={skillForm.level}
                onChange={(e) => setSkillForm({ ...skillForm, level: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg"
              />
            </div>
            <Button type="submit" className="w-full">Save Skill</Button>
          </form>
        )}

        {activeTab === "experience" && (
          <form onSubmit={handleExperienceSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Company</label>
              <input
                type="text"
                required
                value={experienceForm.company}
                onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Role / Title</label>
              <input
                type="text"
                required
                value={experienceForm.role}
                onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })}
                className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Location</label>
              <input
                type="text"
                value={experienceForm.location}
                onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })}
                className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Start Date</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. June 2023"
                  value={experienceForm.start_date}
                  onChange={(e) => setExperienceForm({ ...experienceForm, start_date: e.target.value })}
                  className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">End Date</label>
                <input
                  type="text"
                  placeholder="e.g. Present"
                  disabled={experienceForm.current}
                  value={experienceForm.current ? "Present" : experienceForm.end_date}
                  onChange={(e) => setExperienceForm({ ...experienceForm, end_date: e.target.value })}
                  className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg disabled:opacity-50"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 py-2">
              <input
                type="checkbox"
                id="current-job"
                checked={experienceForm.current}
                onChange={(e) => setExperienceForm({ ...experienceForm, current: e.target.checked })}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="current-job" className="text-sm font-semibold">Currently Work Here</label>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Description</label>
              <textarea
                required
                value={experienceForm.description}
                onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg"
              />
            </div>
            <Button type="submit" className="w-full">Save Experience</Button>
          </form>
        )}

        {activeTab === "education" && (
          <form onSubmit={handleEducationSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Institution</label>
              <input
                type="text"
                required
                value={educationForm.institution}
                onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })}
                className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Degree</label>
              <input
                type="text"
                required
                placeholder="e.g. Bachelor of Science"
                value={educationForm.degree}
                onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
                className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Field of Study</label>
              <input
                type="text"
                value={educationForm.field_of_study}
                onChange={(e) => setEducationForm({ ...educationForm, field_of_study: e.target.value })}
                className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Start Date</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aug 2017"
                  value={educationForm.start_date}
                  onChange={(e) => setEducationForm({ ...educationForm, start_date: e.target.value })}
                  className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">End Date</label>
                <input
                  type="text"
                  placeholder="e.g. May 2021"
                  value={educationForm.end_date}
                  onChange={(e) => setEducationForm({ ...educationForm, end_date: e.target.value })}
                  className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Description / Notes</label>
              <textarea
                value={educationForm.description}
                onChange={(e) => setEducationForm({ ...educationForm, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg"
              />
            </div>
            <Button type="submit" className="w-full">Save Education</Button>
          </form>
        )}

        {activeTab === "certificates" && (
          <form onSubmit={handleCertificateSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Certificate Name</label>
                <input
                  type="text"
                  required
                  value={certificateForm.name}
                  onChange={(e) => setCertificateForm({ ...certificateForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Issuing Organization</label>
                <input
                  type="text"
                  required
                  value={certificateForm.issuing_organization}
                  onChange={(e) => setCertificateForm({ ...certificateForm, issuing_organization: e.target.value })}
                  className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Issue Date</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. January 2024"
                  value={certificateForm.issue_date}
                  onChange={(e) => setCertificateForm({ ...certificateForm, issue_date: e.target.value })}
                  className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Expiration Date</label>
                <input
                  type="text"
                  placeholder="e.g. January 2026 (Optional)"
                  value={certificateForm.expiration_date}
                  onChange={(e) => setCertificateForm({ ...certificateForm, expiration_date: e.target.value })}
                  className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Credential ID</label>
                <input
                  type="text"
                  value={certificateForm.credential_id}
                  onChange={(e) => setCertificateForm({ ...certificateForm, credential_id: e.target.value })}
                  className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Credential URL</label>
                <input
                  type="text"
                  value={certificateForm.credential_url}
                  onChange={(e) => setCertificateForm({ ...certificateForm, credential_url: e.target.value })}
                  className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-lg"
                />
              </div>
            </div>

            {/* Certificate Image Uploader */}
            <div>
              <label className="block text-sm font-semibold mb-1">Certificate Image / Badge</label>
              <div className="flex items-center gap-4">
                {certificateForm.image_url && (
                  <img
                    src={certificateForm.image_url}
                    alt="Certificate Preview"
                    className="h-12 w-12 rounded object-cover border border-border"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  id="cert-image-file"
                  onChange={handleCertImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="cert-image-file"
                  className="inline-flex items-center justify-center font-medium rounded-lg px-3 py-1.5 text-xs bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer transition-colors"
                >
                  {uploadingCertImage ? "Uploading..." : "Upload Certificate Image"}
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full">Save Certificate</Button>
          </form>
        )}
      </Modal>

      {/* Resume Skills Import Preview Modal */}
      <Modal isOpen={importModalOpen} onClose={() => setImportModalOpen(false)} title="Import Skills from Resume">
        {importLoading ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <Loader size="lg" />
            <p className="mt-4 text-sm text-muted-foreground animate-pulse">Uploading and parsing resume...</p>
          </div>
        ) : importedPreview ? (
          <div className="space-y-6">
            <div>
              <h4 className="text-base font-bold text-primary mb-2">
                New Skills Found ({importedPreview.new_skills.length})
              </h4>
              {importedPreview.new_skills.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No new skills detected.</p>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-2 border border-border/50 p-3 rounded-lg bg-secondary/20">
                  {importedPreview.new_skills.map((s) => (
                    <label key={s.name} className="flex items-center gap-3 py-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!selectedImportSkills[s.name]}
                        onChange={() => toggleImportSkillSelect(s.name)}
                        className="h-4 w-4 rounded border-border text-primary"
                      />
                      <div>
                        <span className="text-sm font-semibold text-foreground">{s.name}</span>
                        <span className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded ml-2 font-medium">
                          {s.category} | {s.level}%
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h4 className="text-base font-bold text-muted-foreground mb-2">
                Existing Skills Skipped ({importedPreview.existing_skills.length})
              </h4>
              {importedPreview.existing_skills.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No existing skills matched.</p>
              ) : (
                <div className="max-h-36 overflow-y-auto space-y-1.5 border border-border/30 p-3 rounded-lg bg-secondary/10">
                  {importedPreview.existing_skills.map((s) => (
                    <div key={s.name} className="text-xs text-muted-foreground flex justify-between">
                      <span>{s.name}</span>
                      <span>{s.category} ({s.level}%)</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={handleSaveImportedSkills}
              isLoading={importSaving}
              className="w-full"
              disabled={importedPreview.new_skills.filter(s => selectedImportSkills[s.name]).length === 0}
            >
              Save Selected Skills
            </Button>
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground py-8">Select a file to begin.</p>
        )}
      </Modal>
    </Container>
  );
}
