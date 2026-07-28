import React from "react";
import Container from "./Container";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card py-8 mt-auto">
      <Container className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Laxmiputra Hipparagi. All rights reserved.
        </p>
        <div className="flex gap-4">
          <a
            href="https://github.com/laxmiputra84"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="/contact"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </a>
        </div>
      </Container>
    </footer>
  );
}
