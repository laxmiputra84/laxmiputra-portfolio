"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Section from "@/components/Section";
import Button from "@/components/Button";
import { getSettings } from "@/services/settings";
import Loader from "@/components/Loader";

interface SettingsData {
  hero_title?: string;
  hero_subtitle?: string;
  about_text?: string;
}

export default function HomePage() {
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

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[70vh]">
        <Loader size="lg" />
      </div>
    );
  }

  const title = settings?.hero_title || "Designing & Building Scalable Apps";
  const subtitle = settings?.hero_subtitle || "Senior Full Stack Engineer & Software Architect";

  return (
    <Section className="flex flex-col items-center justify-center flex-1 text-center min-h-[75vh]">
      <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 rounded-full mb-6 animate-pulse">
        Available for Hire
      </span>
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl mb-6">
        {title.split("\n").map((line, i) => (
          <React.Fragment key={i}>
            {i > 0 && <br />}
            <span className={i > 0 ? "bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent" : "text-foreground"}>
              {line}
            </span>
          </React.Fragment>
        ))}
      </h1>
      <p className="max-w-2xl text-xl text-muted-foreground mb-8">
        {settings?.about_text || "I specialize in robust backends (FastAPI, Python) and elegant frontend user experiences (Next.js, Tailwind, TypeScript)."}
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/projects">
          <Button size="lg">View My Work</Button>
        </Link>
        <Link href="/contact">
          <Button variant="outline" size="lg">
            Let's Talk
          </Button>
        </Link>
      </div>
    </Section>
  );
}
