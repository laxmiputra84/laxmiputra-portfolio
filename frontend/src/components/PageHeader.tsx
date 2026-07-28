import React from "react";
import Container from "./Container";

interface PageHeaderProps {
  title: string;
  description?: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="bg-muted py-12 sm:py-16 border-b border-border">
      <Container>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl">
            {description}
          </p>
        )}
      </Container>
    </div>
  );
}
