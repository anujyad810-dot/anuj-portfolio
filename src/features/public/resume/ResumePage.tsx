import React from 'react'
import { Download, FileText, ExternalLink, Mail } from 'lucide-react'
import { useSettings } from '@/lib/queries'
import { Button } from '@/components/ui/Button'
import { DecryptedText } from '@/components/reactbits'
import { Link } from 'react-router-dom'

export default function ResumePage() {
  const { data: settings } = useSettings()
  const resumeUrl = settings?.resume_url

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight">
            <DecryptedText text="Curriculum Vitae" speed={25} />
          </h1>
          <p className="text-sm sm:text-base text-muted mt-1">
            Current resume for Anuj Yadav — Full-Stack Developer & ML Enthusiast.
          </p>
        </div>

        {resumeUrl ? (
          <div className="flex items-center gap-3">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-panel px-4 py-2 text-xs sm:text-sm font-medium text-text hover:bg-border/60 transition-colors shadow-xs"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Open in New Tab</span>
            </a>
            <a
              href={resumeUrl}
              download="Anuj_Yadav_Resume.pdf"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2 text-xs sm:text-sm font-semibold text-[#07080a] hover:bg-accent/90 transition-all shadow-sm"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </a>
          </div>
        ) : null}
      </div>

      {/* Preview Container or Empty State */}
      {resumeUrl ? (
        <div className="w-full min-h-[750px] rounded-2xl border border-border bg-panel/85 backdrop-blur-md overflow-hidden shadow-lg">
          <iframe
            src={`${resumeUrl}#toolbar=0`}
            title="Resume PDF Preview"
            className="w-full h-full min-h-[750px] border-0"
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-panel/80 backdrop-blur-md p-12 sm:p-16 text-center space-y-4 max-w-xl mx-auto shadow-sm">
          <div className="h-16 w-16 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center mx-auto text-accent">
            <FileText className="h-8 w-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-text">Resume Available Upon Request</h3>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              The PDF resume is currently being updated. You can upload or refresh it anytime through
              the Admin Portal, or reach out to me directly.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <Link to="/contact">
              <Button variant="primary" size="md">
                <Mail className="h-4 w-4 mr-2" />
                <span>Contact Anuj Directly</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
