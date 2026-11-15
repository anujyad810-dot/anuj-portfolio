import React, { createContext, useContext, useState, useCallback } from 'react'
import * as RadixToast from '@radix-ui/react-toast'
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastItem {
  id: string
  title: string
  description?: string
  type?: ToastType
}

interface ToastContextType {
  toast: (options: { title: string; description?: string; type?: ToastType }) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = useCallback(({ title, description, type = 'info' }: { title: string; description?: string; type?: ToastType }) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, title, description, type }])
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      <RadixToast.Provider swipeDirection="right">
        {children}
        {toasts.map((t) => (
          <RadixToast.Root
            key={t.id}
            onOpenChange={(open) => !open && removeToast(t.id)}
            className={cn(
              'flex items-start gap-3 rounded-md border border-border p-4 shadow-lg transition-all data-[state=open]:animate-slide-in',
              t.type === 'success' && 'bg-panel border-green/40 text-text',
              t.type === 'error' && 'bg-panel border-red-500/40 text-text',
              t.type === 'info' && 'bg-panel border-accent/40 text-text'
            )}
          >
            <div className="mt-0.5 shrink-0">
              {t.type === 'success' && <CheckCircle2 className="h-4 w-4 text-green" />}
              {t.type === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
              {t.type === 'info' && <Info className="h-4 w-4 text-accent" />}
            </div>
            <div className="flex-1">
              <RadixToast.Title className="text-xs font-mono font-semibold text-text">
                {t.title}
              </RadixToast.Title>
              {t.description && (
                <RadixToast.Description className="text-xs font-mono text-muted mt-0.5">
                  {t.description}
                </RadixToast.Description>
              )}
            </div>
            <RadixToast.Close className="rounded p-1 text-muted hover:text-text">
              <X className="h-3.5 w-3.5" />
            </RadixToast.Close>
          </RadixToast.Root>
        ))}
        <RadixToast.Viewport className="fixed bottom-4 right-4 z-[9999] flex max-h-screen w-80 flex-col gap-2 outline-none" />
      </RadixToast.Provider>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
