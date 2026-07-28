import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";
import Card from "@/components/Card";

const SERVICES = [
  {
    title: "Full Stack Development",
    desc: "End-to-end development of robust backend APIs (FastAPI) and modern, highly interactive UI/UX (Next.js, React).",
  },
  {
    title: "Database Design & Optimization",
    desc: "Structuring clean entity-relationship schemas, database migrations via Alembic, and performance Tuning.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="Services Provided"
        description="Professional capabilities I bring to projects."
      />
      <Section title="Expertise Areas">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {SERVICES.map((s, idx) => (
            <Card key={idx}>
              <h3 className="text-xl font-bold mb-3">{s.title}</h3>
              <p className="text-muted-foreground">{s.desc}</p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
