import React from "react";
import { twMerge } from "tailwind-merge";
import Container from "./Container";

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  containerClassName?: string;
}

export default function Section({
  children,
  className,
  title,
  subtitle,
  containerClassName,
  ...props
}: SectionProps) {
  return (
    <section className={twMerge("py-16 sm:py-24", className)} {...props}>
      <Container className={containerClassName}>
        {(title || subtitle) && (
          <div className="mb-12 text-center">
            {title && (
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
