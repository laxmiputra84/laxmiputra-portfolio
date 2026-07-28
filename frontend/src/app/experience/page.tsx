"use client";

import React, { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";
import Card from "@/components/Card";
import { getExperiences } from "@/services/experience";
import { getEducations } from "@/services/education";
import Loader from "@/components/Loader";

interface Experience {
  id: number;
  company: string;
  role: string;
  location?: string;
  start_date: string;
  end_date?: string;
  description: string;
  current: boolean;
}

interface Education {
  id: number;
  institution: string;
  degree: string;
  field_of_study?: string;
  start_date: string;
  end_date?: string;
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [expData, eduData] = await Promise.all([getExperiences(), getEducations()]);
        setExperiences(expData);
        setEducations(eduData);
      } catch {}
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <>
      <PageHeader
        title="Work & Education"
        description="A chronology of my professional experience and academic background."
      />
      <Section title="Career Timeline">
        {loading ? (
          <Loader size="lg" />
        ) : (
          <div className="max-w-4xl mx-auto space-y-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 border-l-4 border-primary pl-3">Professional Experience</h3>
              {experiences.length === 0 ? (
                <p className="text-muted-foreground">No experience items found.</p>
              ) : (
                <div className="space-y-6">
                  {experiences.map((j) => (
                    <Card key={j.id} className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div>
                        <h4 className="text-2xl font-bold">{j.role}</h4>
                        <h5 className="text-lg text-primary font-medium">{j.company} {j.location && `| ${j.location}`}</h5>
                        <p className="mt-2 text-muted-foreground whitespace-pre-line">{j.description}</p>
                      </div>
                      <span className="text-sm font-semibold bg-secondary px-3 py-1 rounded-full text-secondary-foreground shrink-0 self-start md:self-auto">
                        {j.start_date} - {j.end_date || "Present"}
                      </span>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6 border-l-4 border-purple-600 pl-3">Education History</h3>
              {educations.length === 0 ? (
                <p className="text-muted-foreground">No education items found.</p>
              ) : (
                <div className="space-y-6">
                  {educations.map((edu) => (
                    <Card key={edu.id} className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div>
                        <h4 className="text-2xl font-bold">{edu.degree}</h4>
                        <h5 className="text-lg text-purple-600 font-medium">
                          {edu.institution} {edu.field_of_study && `| ${edu.field_of_study}`}
                        </h5>
                      </div>
                      <span className="text-sm font-semibold bg-secondary px-3 py-1 rounded-full text-secondary-foreground shrink-0 self-start md:self-auto">
                        {edu.start_date} - {edu.end_date || "Present"}
                      </span>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Section>
    </>
  );
}
