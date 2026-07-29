"use client";

import React, { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";
import Loader from "@/components/Loader";
import { getSettings } from "@/services/settings";

interface SettingsData {
  about_text?: string;
  profile_image?: string;
}

export default function AboutPage() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch {}
      setLoading(false);
    }
    loadData();
  }, []);

  const getProfileImageUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      try {
        const parsed = new URL(url);
        const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/api\/v1\/?$/, "").replace(/\/$/, "");
        return `${base}${parsed.pathname}`;
      } catch {
        return url;
      }
    }
    const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/api\/v1\/?$/, "").replace(/\/$/, "");
    return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  return (
    <>
      <PageHeader
        title="About Me"
        description="Learn more about my background, philosophy, and expertise."
      />
      <Section title="My Journey" subtitle="Bridging the gap between software design and engineering.">
        {loading ? (
          <Loader size="lg" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
            {/* Biography Text (Left side) */}
            <div className="md:col-span-7 text-lg text-muted-foreground space-y-6">
              <p>
                {settings?.about_text ||
                  "I am a software engineer and designer dedicated to creating highly performant, accessible, and elegant web solutions. I have built platforms from scratch, optimized databases for high-traffic workloads, and crafted interactive frontends."}
              </p>
              <p>
                With years of full-stack development experience, I believe in clean code, modular architectures, and scalable cloud designs. I specialize in FastAPI, Python, Next.js, and TypeScript.
              </p>
            </div>

            {/* Profile Photo (Right side) */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative group">
                {/* Decorative background glow */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                
                {settings?.profile_image ? (
                  <img
                    src={getProfileImageUrl(settings.profile_image)}
                    alt="Profile Photo"
                    className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl object-cover shadow-2xl border border-border/50 transition-all duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl bg-secondary flex items-center justify-center text-sm text-muted-foreground shadow-2xl border border-border/50">
                    No Photo Uploaded
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Section>
    </>
  );
}
