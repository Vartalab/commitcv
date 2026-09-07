import { useEffect, useState, type ReactNode } from 'react'
import {
  Check,
  ChevronRight,
  Download,
  GitBranch,
  Image,
  Monitor,
  Smartphone,
  Sparkles,
  X,
} from 'lucide-react'

import { BuilderSidebar } from '@/components/builder-sidebar'
import { ProfileCard } from '@/components/profile-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { TooltipProvider } from '@/components/ui/tooltip'
import {
  themeOptions,
  type ComponentId,
  type LanguageId,
  type ProfileElementId,
  type RepositoryId,
  type SocialId,
  type StatId,
  type TemplateId,
} from '@/data/profile'
import {
  readBuilderPreferences,
  reorderComponents,
  reorderItems,
  saveBuilderPreferences,
} from '@/lib/builder-preferences'
import { cn } from '@/lib/utils'

function FlowStep({
  active,
  complete,
  icon,
  label,
}: {
  active?: boolean
  complete?: boolean
  icon: ReactNode
  label: string
}) {
  return (
    <span
      className={cn(
        'flex items-center gap-2 text-stone-400',
        complete && 'text-emerald-800',
        active && 'text-brand-ink',
      )}
    >
      <i
        className={cn(
          'grid size-[22px] place-items-center rounded-full border border-stone-300 bg-white text-[10px] not-italic',
          complete && 'border-emerald-100 bg-emerald-50 text-emerald-600',
          active && 'border-brand-ink bg-brand-ink text-white',
        )}
      >
        {icon}
      </i>
      {label}
    </span>
  )
}

function ExportPanel({
  activeCount,
  onExport,
}: {
  activeCount: number
  onExport: () => void
}) {
  return (
    <Card className="mx-auto mt-3.5 grid max-w-[1180px] grid-cols-[auto_minmax(200px,1fr)_auto_auto] items-center gap-4 rounded-2xl border border-stone-200 bg-paper p-3.5 shadow-export-panel ring-0 max-[1040px]:grid-cols-[auto_1fr_auto] max-[760px]:grid-cols-[auto_1fr]">
      <span className="grid size-10 place-items-center rounded-xl bg-stone-100">
        <Image aria-hidden="true" className="size-4" />
      </span>

      <div>
        <span className="block text-[11px] font-bold tracking-[0.1em] text-stone-500 uppercase">
          Ready to share
        </span>
        <strong className="my-0.5 block text-sm">
          Export a crisp profile card
        </strong>
        <small className="block text-[11px] text-stone-500">
          1200 × 630 PNG · transparent-safe · social-ready
        </small>
      </div>

      <div className="flex gap-3 px-3 text-[11px] text-stone-500 max-[1040px]:hidden">
        <span className="inline-flex items-center gap-1 whitespace-nowrap">
          <Check aria-hidden="true" className="size-3 text-emerald-600" />
          Preview checked
        </span>
        <span className="inline-flex items-center gap-1 whitespace-nowrap">
          <Check aria-hidden="true" className="size-3 text-emerald-600" />
          {activeCount} sections included
        </span>
      </div>

      <Button
        className="h-10 bg-brand-ink px-4 shadow-primary-action hover:bg-brand-ink-hover max-[760px]:col-span-2 max-[760px]:w-full"
        onClick={onExport}
        size="lg"
      >
        <Download aria-hidden="true" />
        Download PNG
      </Button>
    </Card>
  )
}

function App() {
  const [builderPreferences, setBuilderPreferences] = useState(
    readBuilderPreferences,
  )
  const [template, setTemplate] = useState<TemplateId>('modern')
  const [themeIndex, setThemeIndex] = useState(0)
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop')
  const [exportMessage, setExportMessage] = useState('')
  const { collections, enabled, order, profileElements } = builderPreferences

  useEffect(() => {
    saveBuilderPreferences(builderPreferences)
  }, [builderPreferences])

  const toggleComponent = (id: ComponentId) => {
    setBuilderPreferences((current) => ({
      ...current,
      enabled: { ...current.enabled, [id]: !current.enabled[id] },
    }))
  }

  const reorderComponent = (activeId: ComponentId, targetId: ComponentId) => {
    setBuilderPreferences((current) => ({
      ...current,
      order: reorderComponents(current.order, activeId, targetId),
    }))
  }

  const toggleProfileElement = (id: ProfileElementId) => {
    setBuilderPreferences((current) => ({
      ...current,
      profileElements: {
        ...current.profileElements,
        [id]: !current.profileElements[id],
      },
    }))
  }

  const reorderLanguages = (activeId: LanguageId, targetId: LanguageId) => {
    setBuilderPreferences((current) => ({
      ...current,
      collections: {
        ...current.collections,
        languages: reorderItems(
          current.collections.languages,
          activeId,
          targetId,
        ),
      },
    }))
  }

  const reorderRepositories = (
    activeId: RepositoryId,
    targetId: RepositoryId,
  ) => {
    setBuilderPreferences((current) => ({
      ...current,
      collections: {
        ...current.collections,
        repositories: reorderItems(
          current.collections.repositories,
          activeId,
          targetId,
        ),
      },
    }))
  }

  const reorderSocials = (activeId: SocialId, targetId: SocialId) => {
    setBuilderPreferences((current) => ({
      ...current,
      collections: {
        ...current.collections,
        socials: reorderItems(current.collections.socials, activeId, targetId),
      },
    }))
  }

  const reorderStats = (activeId: StatId, targetId: StatId) => {
    setBuilderPreferences((current) => ({
      ...current,
      collections: {
        ...current.collections,
        stats: reorderItems(current.collections.stats, activeId, targetId),
      },
    }))
  }

  const hasVisibleProfileElement = Object.values(profileElements).some(Boolean)
  const activeCount = order.filter(
    (id) => enabled[id] && (id !== 'identity' || hasVisibleProfileElement),
  ).length
  const activeTheme = themeOptions[themeIndex]

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-app-canvas bg-app-glow text-brand-ink">
        <header className="sticky top-0 z-30 grid min-h-[74px] grid-cols-[1fr_auto_1fr] items-center border-b border-stone-900/10 bg-paper/90 px-7 py-3 backdrop-blur-xl max-[1040px]:grid-cols-[1fr_auto] max-[760px]:min-h-16 max-[760px]:px-4 max-[760px]:py-2.5">
          <Button
            asChild
            className="h-auto w-fit justify-start gap-3 p-0 hover:bg-transparent"
            variant="ghost"
          >
            <a aria-label="CommitCV home" href="#">
              <span className="grid size-10 place-items-center rounded-xl bg-brand-ink font-mono text-xs font-bold tracking-[-1px] text-white shadow-brand-mark">
                &lt;/&gt;
              </span>
              <span className="flex flex-col items-start">
                <strong className="text-base tracking-[-0.03em]">CommitCV</strong>
                <small className="text-[11px] font-normal text-stone-500 max-[760px]:hidden">
                  Profile studio
                </small>
              </span>
            </a>
          </Button>

          <nav
            aria-label="Creation progress"
            className="flex items-center gap-3 text-xs font-semibold max-[1040px]:hidden"
          >
            <FlowStep
              complete
              icon={<Check aria-hidden="true" className="size-3" />}
              label="Profile"
            />
            <ChevronRight aria-hidden="true" className="size-3.5 text-stone-400" />
            <FlowStep active icon="2" label="Compose" />
            <ChevronRight aria-hidden="true" className="size-3.5 text-stone-400" />
            <FlowStep icon="3" label="Export" />
          </nav>

          <div className="flex items-center justify-end gap-3">
            <span className="inline-flex items-center gap-2 text-[11px] text-stone-500 max-[760px]:hidden">
              <i className="size-1.5 rounded-full bg-emerald-600 shadow-status-ring" />
              All changes saved
            </span>
            <Button aria-label="Open GitHub" size="icon" variant="outline">
              <GitBranch aria-hidden="true" />
            </Button>
          </div>
        </header>

        <main className="grid min-h-[calc(100vh-74px)] grid-cols-[290px_minmax(0,1fr)] max-[1040px]:grid-cols-[250px_minmax(0,1fr)] max-[760px]:flex max-[760px]:flex-col">
          <BuilderSidebar
            enabled={enabled}
            onReorder={reorderComponent}
            onTemplateChange={setTemplate}
            onThemeChange={setThemeIndex}
            onToggle={toggleComponent}
            onToggleProfileElement={toggleProfileElement}
            order={order}
            profileElements={profileElements}
            template={template}
            themeIndex={themeIndex}
          />

          <section className="min-w-0 px-6 pt-4 pb-8 max-[760px]:px-3 max-[760px]:pt-3">
            <div className="mx-auto mb-3 flex h-10 max-w-[1180px] items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-2 text-xs font-semibold">
                  <i className="size-1.5 rounded-full bg-emerald-600 shadow-status-ring" />
                  Live preview
                </span>
                <Badge variant="outline" className="max-[640px]:hidden">
                  {templateLabel(template)}
                </Badge>
              </div>

              <Card
                aria-label="Preview size"
                className="flex-row gap-0.5 rounded-xl border border-stone-200 bg-white p-1 shadow-none ring-0"
              >
                <Button
                  aria-label="Desktop preview"
                  className={cn(
                    'size-7 rounded-lg text-stone-400',
                    viewport === 'desktop' &&
                      'bg-stone-200 text-stone-900 hover:bg-stone-200',
                  )}
                  onClick={() => setViewport('desktop')}
                  size="icon-sm"
                  variant="ghost"
                >
                  <Monitor aria-hidden="true" className="size-3.5" />
                </Button>
                <Button
                  aria-label="Mobile preview"
                  className={cn(
                    'size-7 rounded-lg text-stone-400',
                    viewport === 'mobile' &&
                      'bg-stone-200 text-stone-900 hover:bg-stone-200',
                  )}
                  onClick={() => setViewport('mobile')}
                  size="icon-sm"
                  variant="ghost"
                >
                  <Smartphone aria-hidden="true" className="size-3.5" />
                </Button>
              </Card>
            </div>

            <div className="relative mx-auto grid min-h-[620px] max-w-[1180px] place-items-center overflow-hidden rounded-3xl border border-stone-300 bg-stone-200/70 p-[clamp(24px,4vw,58px)] shadow-preview-frame max-[760px]:min-h-[500px] max-[760px]:rounded-2xl max-[760px]:px-3 max-[760px]:py-5">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-preview-grid opacity-50 [background-size:28px_28px]"
              />
              <span
                aria-hidden="true"
                className={cn(
                  'pointer-events-none absolute -top-36 -right-24 size-[300px] rounded-full opacity-15 blur-3xl',
                  activeTheme.backgroundClass,
                )}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-40 -left-24 size-[300px] rounded-full bg-amber-400 opacity-15 blur-3xl"
              />

              <div
                className={cn(
                  'relative z-10 w-full max-w-[880px] transition-[max-width] duration-300',
                  viewport === 'mobile' && 'max-w-[390px]',
                )}
              >
                <ProfileCard
                  collectionOrders={collections}
                  compact={viewport === 'mobile'}
                  enabled={enabled}
                  onReorder={reorderComponent}
                  onReorderLanguages={reorderLanguages}
                  onReorderRepositories={reorderRepositories}
                  onReorderSocials={reorderSocials}
                  onReorderStats={reorderStats}
                  order={order}
                  profileElements={profileElements}
                  template={template}
                  themeIndex={themeIndex}
                />
              </div>
            </div>

            <ExportPanel
              activeCount={activeCount}
              onExport={() =>
                setExportMessage(
                  'PNG export is shown as a design state in this prototype.',
                )
              }
            />

            <div className="mx-auto mt-3 flex max-w-[1180px] justify-end">
              <Card className="relative z-20 w-full max-w-[330px] flex-row gap-2 rounded-xl border border-prototype-border bg-prototype-surface p-3 text-[11px] leading-relaxed text-prototype-foreground shadow-prototype-card ring-0 max-[760px]:max-w-none">
                <Sparkles
                  aria-hidden="true"
                  className="mt-0.5 size-3.5 shrink-0 text-prototype-icon"
                />
                <span>
                  <strong className="mb-0.5 block text-xs text-prototype-heading">
                    Design prototype
                  </strong>
                  Dummy profile data is being used. GitHub fetching and real
                  PNG generation come next.
                </span>
              </Card>
            </div>
          </section>
        </main>

        <Card
          aria-live="polite"
          className={cn(
            'fixed bottom-6 left-1/2 z-50 flex-row items-center gap-2 rounded-xl border-0 bg-brand-ink px-4 py-2.5 text-[11px] text-white shadow-export-toast ring-0 transition duration-200',
            exportMessage
              ? '-translate-x-1/2 opacity-100'
              : 'pointer-events-none translate-y-3 -translate-x-1/2 opacity-0',
          )}
          role="status"
        >
          <span>{exportMessage}</span>
          {exportMessage && (
            <Button
              aria-label="Dismiss export message"
              className="size-6 text-white hover:bg-white/10 hover:text-white"
              onClick={() => setExportMessage('')}
              size="icon-xs"
              variant="ghost"
            >
              <X aria-hidden="true" className="size-3" />
            </Button>
          )}
        </Card>
      </div>
    </TooltipProvider>
  )
}

function templateLabel(template: TemplateId) {
  return template.charAt(0).toUpperCase() + template.slice(1) + ' template'
}

export default App
