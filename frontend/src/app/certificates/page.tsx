"use client";

import React, { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import Section from "@/components/Section";
import Card from "@/components/Card";
import Loader from "@/components/Loader";
import Button from "@/components/Button";
import { getCertificates } from "@/services/certificates";

interface CertificateData {
  id: number;
  name: string;
  issuing_organization: string;
  issue_date: string;
  expiration_date?: string;
  credential_id?: string;
  credential_url?: string;
  image_url?: string;
}

export default function CertificatesPage() {
  const [certs, setCerts] = useState<CertificateData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCerts() {
      try {
        const data = await getCertificates();
        setCerts(data);
      } catch {}
      setLoading(false);
    }
    fetchCerts();
  }, []);

  return (
    <>
      <PageHeader
        title="Certifications"
        description="Verify my professional certifications, badges, and credentials."
      />
      <Section>
        {loading ? (
          <Loader size="lg" />
        ) : certs.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              🏆
            </div>
            <h3 className="text-xl font-bold mb-2">No Certificates Found</h3>
            <p className="text-muted-foreground">
              Certificates are being loaded. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certs.map((c) => (
              <Card key={c.id} className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow">
                {c.image_url && (
                  <div className="h-48 w-full border-b border-border/50 overflow-hidden relative">
                    <img
                      src={c.image_url}
                      alt={c.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">{c.name}</h3>
                    <p className="text-sm font-medium text-primary mb-4">{c.issuing_organization}</p>
                    
                    <div className="space-y-2 text-xs text-muted-foreground mb-6">
                      <div>
                        <span className="font-semibold text-foreground">Issued:</span> {c.issue_date}
                      </div>
                      {c.expiration_date && (
                        <div>
                          <span className="font-semibold text-foreground">Expires:</span> {c.expiration_date}
                        </div>
                      )}
                      {c.credential_id && (
                        <div>
                          <span className="font-semibold text-foreground">Credential ID:</span> {c.credential_id}
                        </div>
                      )}
                    </div>
                  </div>

                  {c.credential_url && (
                    <a
                      href={c.credential_url}
                      target="_blank"
                      rel="noreferrer"
                      className="block w-full"
                    >
                      <Button variant="outline" className="w-full text-xs py-2">
                        Verify Credential
                      </Button>
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
