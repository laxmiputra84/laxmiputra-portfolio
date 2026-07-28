"use client";

import React, { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";
import Card from "@/components/Card";
import { getSkills } from "@/services/skills";
import Loader from "@/components/Loader";

interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSkills() {
      try {
        const data = await getSkills();
        setSkills(data);
      } catch {}
      setLoading(false);
    }
    loadSkills();
  }, []);

  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <>
      <PageHeader
        title="Technical Skills"
        description="Technologies, frameworks, and workflows I master."
      />
      <Section title="My Toolbelt">
        {loading ? (
          <Loader size="lg" />
        ) : skills.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No skills found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {categories.map((cat) => (
              <Card key={cat}>
                <h3 className="text-xl font-bold border-b border-border pb-2 mb-4 text-primary">
                  {cat}
                </h3>
                <ul className="space-y-4">
                  {skills
                    .filter((s) => s.category === cat)
                    .map((s) => (
                      <li key={s.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-foreground">{s.name}</span>
                          <span className="text-muted-foreground">{s.level}%</span>
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${s.level}%` }}
                          />
                        </div>
                      </li>
                    ))}
                </ul>
              </Card>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
