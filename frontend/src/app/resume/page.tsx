"use client";

import React, { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Loader from "@/components/Loader";
import { getActiveResume } from "@/services/resume";

interface ResumeData {
  title: string;
  file_name: string;
  file_path: string;
  file_size: number;
  uploaded_at: string;
}

export default function ResumePage() {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResume() {
      try {
        const data = await getActiveResume();
        setResume(data);
      } catch {}
      setLoading(false);
    }
    loadResume();
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Convert local app/uploads/resume/filename to public server HTTP path
  const getPdfUrl = (path: string) => {
    // Strip "app/" prefix because it is mounted on "/uploads"
    const relativePath = path.startsWith("app/") ? path.slice(4) : path;
    return `http://localhost:8000/${relativePath.replace(/\\/g, "/")}`;
  };

  return (
    <>
      <PageHeader
        title="Curriculum Vitae"
        description="Review my technical background, academic history, and qualifications."
      />
      <Section>
        {loading ? (
          <Loader size="lg" />
        ) : !resume ? (
          // Empty State
          <div className="max-w-md mx-auto text-center py-16">
            <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              📄
            </div>
            <h3 className="text-xl font-bold mb-2">No Resume Available</h3>
            <p className="text-muted-foreground mb-6">
              The resume is currently being updated by the administrator. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto w-full">
            {/* Meta Data Panel */}
            <div className="lg:col-span-4 space-y-6">
              <Card>
                <h3 className="text-xl font-bold mb-4 text-primary">{resume.title}</h3>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <div>
                    <span className="block font-semibold text-foreground">File Name</span>
                    <span>{resume.file_name}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-foreground">File Size</span>
                    <span>{formatBytes(resume.file_size)}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-foreground">Last Updated</span>
                    <span>{formatDate(resume.uploaded_at)}</span>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <a href={getPdfUrl(resume.file_path)} download className="block w-full">
                    <Button className="w-full">Download Resume</Button>
                  </a>
                  <a href={getPdfUrl(resume.file_path)} target="_blank" rel="noreferrer" className="block w-full">
                    <Button variant="outline" className="w-full">
                      View Fullscreen
                    </Button>
                  </a>
                </div>
              </Card>
            </div>

            {/* PDF Preview Iframe Panel */}
            <div className="lg:col-span-8">
              <Card className="p-0 overflow-hidden h-[600px] border border-border/50 rounded-xl shadow-2xl relative">
                <iframe
                  src={`${getPdfUrl(resume.file_path)}#toolbar=0`}
                  className="w-full h-full border-none"
                  title="Resume Preview"
                />
              </Card>
            </div>
          </div>
        )}
      </Section>
    </>
  );
}
