import Link from "next/link";
import Section from "@/components/Section";
import Button from "@/components/Button";

export default function NotFound() {
  return (
    <Section className="flex flex-col items-center justify-center flex-1 text-center min-h-[70vh]">
      <h1 className="text-9xl font-black text-primary mb-4">404</h1>
      <h2 className="text-3xl font-extrabold text-foreground mb-4">Page Not Found</h2>
      <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/">
        <Button size="lg">Go Back Home</Button>
      </Link>
    </Section>
  );
}
