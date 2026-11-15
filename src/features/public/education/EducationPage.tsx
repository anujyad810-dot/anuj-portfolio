import React, { useState } from 'react'
import { GraduationCap, Award, Calendar, ExternalLink, X, Building2, CheckCircle2 } from 'lucide-react'
import { useEducation, useCertificates } from '@/lib/queries'
import { SpotlightCard, DecryptedText } from '@/components/reactbits'

export default function EducationPage() {
  const { data: educationList = [], isLoading: eduLoading } = useEducation()
  const { data: certificates = [], isLoading: certsLoading } = useCertificates()

  const [lightboxCert, setLightboxCert] = useState<any | null>(null)

  return (
    <div className="space-y-16 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-border/60 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight">
          <DecryptedText text="Education & Certifications" speed={25} />
        </h1>
        <p className="text-sm sm:text-base text-muted mt-1.5">
          Academic foundations, technical coursework, and certified credentials.
        </p>
      </div>

      {/* 1. Education Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2.5 text-xl font-bold text-text">
          <GraduationCap className="h-6 w-6 text-accent" />
          <h2>Academic Background</h2>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {educationList.map((edu) => (
            <div
              key={edu.id}
              className="rounded-2xl border border-border bg-panel/75 backdrop-blur-md p-6 sm:p-7 space-y-3 hover:border-accent/50 hover:shadow-[0_0_20px_-5px_rgba(56,189,248,0.12)] transition-all shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-bold text-lg text-text">{edu.degree}</h3>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-bg border border-border px-3 py-1 text-xs text-muted w-fit">
                  <Calendar className="h-3.5 w-3.5 text-accent" />
                  <span>
                    {edu.start_year} — {edu.end_year || 'Present'}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-accent font-semibold">
                <Building2 className="h-4 w-4" />
                <span>{edu.institute}</span>
              </div>

              {edu.description && (
                <p className="text-xs sm:text-sm text-muted leading-relaxed pt-1">
                  {edu.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 2. Certificates Section */}
      <section className="space-y-6 pt-4 border-t border-border/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xl font-bold text-text">
            <Award className="h-6 w-6 text-amber-400" />
            <h2>Verified Certificates</h2>
          </div>
          <span className="text-xs text-muted font-medium">
            {certificates.length} credentials
          </span>
        </div>

        {certificates.length === 0 ? (
          <div className="rounded-2xl border border-border bg-panel p-10 text-center text-xs text-muted">
            No public certificates currently published.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <SpotlightCard
                key={cert.id}
                onClick={() => cert.image_url && setLightboxCert(cert)}
                className="p-5 flex flex-col justify-between hover:border-accent/60 transition-all cursor-pointer group rounded-2xl"
              >
                <div className="space-y-4">
                  {cert.image_url ? (
                    <div className="h-36 w-full rounded-xl border border-border/60 bg-bg overflow-hidden relative">
                      <img
                        src={cert.image_url}
                        alt={cert.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-32 w-full rounded-xl border border-border/60 bg-bg/60 flex items-center justify-center text-muted">
                      <Award className="h-10 w-10 text-amber-400/70" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <h3 className="font-bold text-sm sm:text-base text-text group-hover:text-accent transition-colors">
                      {cert.title}
                    </h3>
                    <p className="text-xs text-muted font-medium">
                      Issued by: {cert.issuer}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted">
                  <span>{cert.issued_on}</span>
                  {cert.image_url && (
                    <span className="text-accent flex items-center gap-1 font-medium group-hover:underline">
                      <span>View Credential</span>
                      <ExternalLink className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </SpotlightCard>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      {lightboxCert && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setLightboxCert(null)}
        >
          <button
            onClick={() => setLightboxCert(null)}
            className="absolute top-5 right-5 text-white hover:text-accent p-2 rounded-lg bg-panel/80 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="max-w-3xl w-full text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxCert.image_url}
              alt={lightboxCert.title}
              className="max-h-[80vh] mx-auto object-contain rounded-2xl shadow-2xl border border-border"
            />
            <div className="text-text space-y-1">
              <p className="font-bold text-lg">{lightboxCert.title}</p>
              <p className="text-xs sm:text-sm text-muted">
                {lightboxCert.issuer} • {lightboxCert.issued_on}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
