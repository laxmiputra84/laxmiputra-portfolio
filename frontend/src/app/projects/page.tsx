"use client";

import React, { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Loader from "@/components/Loader";
import { getProjects } from "@/services/projects";
import { motion } from "framer-motion";

interface Project {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  full_description?: string;
  image_url?: string;
  github_url?: string;
  live_url?: string;
  technologies: string[];
  featured: boolean;
  display_order: number;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    setError(false);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } },
  };

  return (
    <>
      <PageHeader
        title="My Projects"
        description="A showcase of full-stack systems, tools, and platforms I have built."
      />
      <Section title="Featured Works">
        {loading ? (
          // Skeleton Loader Cards
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-secondary rounded-xl h-[420px] w-full" />
            ))}
          </div>
        ) : error ? (
          // Error Recovery State
          <div className="text-center py-12">
            <p className="text-red-500 font-semibold mb-4">Failed to load projects. Please check your connection.</p>
            <Button onClick={loadProjects}>Retry Loading</Button>
          </div>
        ) : projects.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              📂
            </div>
            <h3 className="text-xl font-bold mb-2">No Projects Added Yet</h3>
            <p className="text-muted-foreground">Admin hasn't posted any portfolio projects.</p>
          </div>
        ) : (
          // Projects Grid List
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full"
          >
            {projects.map((p) => (
              <motion.div key={p.id} variants={cardVariants} className="h-full">
                <Card className="flex flex-col h-full justify-between overflow-hidden relative group">
                  <div>
                    {/* Project Image Frame */}
                    {p.image_url ? (
                      <div className="h-48 w-full rounded-lg overflow-hidden mb-6 border border-border/30 relative">
                        <img
                          src={p.image_url}
                          alt={p.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {p.featured && (
                          <span className="absolute top-3 right-3 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white bg-primary rounded shadow-lg">
                            Featured
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="h-48 w-full rounded-lg bg-secondary flex items-center justify-center text-muted-foreground text-sm mb-6 border border-border/30 relative">
                        No Preview Available
                        {p.featured && (
                          <span className="absolute top-3 right-3 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white bg-primary rounded shadow-lg">
                            Featured
                          </span>
                        )}
                      </div>
                    )}

                    <h3 className="text-2xl font-extrabold mb-3 text-foreground group-hover:text-primary transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 line-clamp-3">
                      {p.short_description}
                    </p>
                    
                    {/* Technology Badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {p.technologies.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 text-[11px] font-bold bg-secondary text-secondary-foreground rounded"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Links */}
                  <div className="flex gap-4 mt-auto">
                    {p.github_url && (
                      <a href={p.github_url} target="_blank" rel="noreferrer" className="flex-1">
                        <Button variant="outline" className="w-full">
                          GitHub
                        </Button>
                      </a>
                    )}
                    {p.live_url && (
                      <a href={p.live_url} target="_blank" rel="noreferrer" className="flex-1">
                        <Button className="w-full">Live Demo</Button>
                      </a>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </Section>
    </>
  );
}
