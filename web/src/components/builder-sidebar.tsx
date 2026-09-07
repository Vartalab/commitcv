import type { ComponentType } from 'react'
import {
  BarChart3,
  FolderGit2,
  GripVertical,
  Languages,
  LayoutTemplate,
  Link2,
  Rows3,
  SlidersHorizontal,
  UserRound,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  SortableSurface,
  useSectionSortable,
} from '@/components/sortable-surface'
import {
  componentLabels,
  profile,
  profileElementIds,
  profileElementLabels,
  templateOptions,
  themeOptions,
  type ComponentId,
  type ProfileElementId,
  type TemplateId,
} from '@/data/profile'
import { cn } from '@/lib/utils'

const icons: Record<ComponentId, ComponentType<{ className?: string }>> = {
  identity: UserRound,
  about: UserRound,
  stats: BarChart3,
  languages: Languages,
  repositories: FolderGit2,
  contributions: Rows3,
  socials: Link2,
}

type BuilderSidebarProps = {
  enabled: Record<ComponentId, boolean>
  order: ComponentId[]
  profileElements: Record<ProfileElementId, boolean>
  template: TemplateId
  themeIndex: number
  onToggle: (id: ComponentId) => void
  onToggleProfileElement: (id: ProfileElementId) => void
  onReorder: (activeId: ComponentId, targetId: ComponentId) => void
  onTemplateChange: (id: TemplateId) => void
  onThemeChange: (index: number) => void
}

type ComponentRowProps = {
  id: ComponentId
  index: number
  enabled: boolean
  avatarClass: string
  onToggle: (id: ComponentId) => void
}

function ComponentRow({
  id,
  index,
  enabled,
  avatarClass,
  onToggle,
}: ComponentRowProps) {
  const Icon = icons[id]
  const label = componentLabels[id]
  const { handleRef, isDragSource, isDropTarget, ref } = useSectionSortable(
    id,
    index,
    'builder',
  )

  return (
    <div
      className={cn(
        'grid min-h-14 touch-pan-y grid-cols-[24px_34px_minmax(0,1fr)_auto] items-center gap-2 rounded-xl border border-transparent px-2 py-1.5 transition-[border-color,background-color,box-shadow,opacity] select-none hover:border-stone-200 hover:bg-white hover:shadow-component-hover',
        isDropTarget && 'border-stone-300 bg-white shadow-component-hover',
        isDragSource && 'cursor-grabbing opacity-70',
      )}
      ref={ref}
    >
      <Button
        aria-label={'Drag to reorder ' + label}
        className="size-6 touch-none cursor-grab rounded-md text-stone-400 hover:bg-stone-200 hover:text-stone-900 active:cursor-grabbing"
        data-drag-handle
        ref={handleRef}
        size="icon-xs"
        variant="ghost"
      >
        <GripVertical aria-hidden="true" className="size-3.5" />
      </Button>

      <span
        className={cn(
          'grid size-8 place-items-center rounded-lg bg-stone-100 text-stone-600',
          id === 'identity' &&
            'bg-linear-to-br to-brand-ink text-[10px] font-bold text-white',
          id === 'identity' && avatarClass,
        )}
      >
        {id === 'identity' ? (
          profile.initials
        ) : (
          <Icon aria-hidden="true" className="size-4" />
        )}
      </span>

      <label
        className="overflow-hidden text-xs font-semibold text-ellipsis whitespace-nowrap"
        htmlFor={id}
      >
        {label}
      </label>

      <Switch
        aria-label={'Show ' + label}
        checked={enabled}
        data-no-drag
        id={id}
        onCheckedChange={() => onToggle(id)}
      />
    </div>
  )
}

function TemplateThumbnail({ template }: { template: TemplateId }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex h-12 w-[70px] shrink-0 flex-col gap-1 overflow-hidden rounded-lg p-2',
        template === 'minimal' && 'bg-stone-100',
        template === 'modern' && 'bg-orange-50',
        template === 'developer' && 'bg-developer-thumbnail',
      )}
    >
      <i
        className={cn(
          'h-2 w-[45%] rounded-full bg-stone-400',
          template === 'modern' && 'bg-orange-500',
          template === 'developer' && 'bg-emerald-400',
        )}
      />
      <i
        className={cn(
          'h-1 w-[85%] rounded-full bg-stone-300',
          template === 'developer' && 'bg-slate-600',
        )}
      />
      <i
        className={cn(
          'h-1 w-2/3 rounded-full bg-stone-300',
          template === 'developer' && 'bg-slate-600',
        )}
      />
    </span>
  )
}

export function BuilderSidebar({
  enabled,
  order,
  profileElements,
  template,
  themeIndex,
  onToggle,
  onToggleProfileElement,
  onReorder,
  onTemplateChange,
  onThemeChange,
}: BuilderSidebarProps) {
  const activeCount = Object.values(enabled).filter(Boolean).length

  return (
    <aside className="min-h-[calc(100vh-74px)] border-r border-stone-200 bg-white/80 max-[760px]:min-h-0 max-[760px]:w-full max-[760px]:border-r-0 max-[760px]:border-b">
      <div className="sticky top-[74px] px-5 py-7 max-[760px]:static max-[760px]:w-full max-[760px]:px-4 max-[760px]:py-5">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="mb-1 text-[10px] font-bold tracking-[0.12em] text-stone-500 uppercase">
              Build your profile
            </p>
            <h2 className="text-[22px] font-semibold tracking-[-0.045em]">
              Make it yours
            </h2>
          </div>
          <Badge variant="secondary">
            {activeCount}/{order.length}
          </Badge>
        </div>

        <Tabs defaultValue="components" className="w-full">
          <TabsList className="grid h-10 w-full grid-cols-2 rounded-xl bg-stone-200/70 p-1">
            <TabsTrigger value="components" className="rounded-lg">
              Components
            </TabsTrigger>
            <TabsTrigger value="templates" className="rounded-lg">
              Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="components" className="mt-5">
            <SortableSurface
              items={order}
              onReorder={onReorder}
              surface="builder"
            >
              <div className="flex flex-col gap-1 max-[760px]:grid max-[760px]:grid-cols-2 max-[460px]:grid-cols-1">
                {order.map((id, index) => (
                  <ComponentRow
                    avatarClass={themeOptions[themeIndex].gradientClass}
                    enabled={enabled[id]}
                    id={id}
                    index={index}
                    key={id}
                    onToggle={onToggle}
                  />
                ))}
              </div>
            </SortableSurface>

            <Card className="mt-3 gap-2.5 rounded-xl border border-stone-200 bg-white p-3 shadow-none ring-0">
              <div className="flex items-start gap-2">
                <SlidersHorizontal
                  aria-hidden="true"
                  className="mt-0.5 size-3.5 shrink-0 text-stone-500"
                />
                <div>
                  <strong className="block text-[11px]">Profile elements</strong>
                  <p className="mt-0.5 text-[9px] leading-snug text-stone-500">
                    Fine-tune the header without changing its responsive layout.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {profileElementIds.map((id) => (
                  <div
                    className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-1.5 rounded-lg bg-stone-100 px-2 py-1.5"
                    key={id}
                  >
                    <label
                      className="overflow-hidden text-[9px] font-medium text-ellipsis whitespace-nowrap"
                      htmlFor={`profile-element-${id}`}
                    >
                      {profileElementLabels[id]}
                    </label>
                    <Switch
                      aria-label={`Show ${profileElementLabels[id]}`}
                      checked={profileElements[id]}
                      id={`profile-element-${id}`}
                      onCheckedChange={() => onToggleProfileElement(id)}
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="mt-5 flex-row gap-2 rounded-xl border border-builder-note-border bg-builder-note-surface p-3 text-builder-note-foreground shadow-none ring-0 max-[760px]:hidden">
              <LayoutTemplate
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-builder-note-icon"
              />
              <div>
                <strong className="block text-[11px] text-stone-800">
                  README-friendly layout
                </strong>
                <p className="mt-1 text-[10px] leading-relaxed">
                  Reorder sections and repeated items without changing the
                  responsive layout.
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="mt-5">
            <div className="flex flex-col gap-2">
              {templateOptions.map((option) => (
                <Button
                  className={cn(
                    'h-auto w-full justify-start gap-3 whitespace-normal rounded-xl border-stone-200 bg-white p-2 text-left shadow-none hover:border-stone-800 hover:bg-white hover:shadow-template-hover',
                    template === option.id &&
                      'border-stone-800 ring-2 ring-stone-900/10',
                  )}
                  key={option.id}
                  onClick={() => onTemplateChange(option.id)}
                  variant="outline"
                >
                  <TemplateThumbnail template={option.id} />
                  <span className="min-w-0">
                    <strong className="mb-1 block text-xs">
                      {option.name}
                    </strong>
                    <small className="block text-[9px] leading-snug font-normal text-stone-500">
                      {option.description}
                    </small>
                  </span>
                </Button>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-stone-200 pt-4">
              <div>
                <p className="mb-1 text-[10px] font-bold tracking-[0.12em] text-stone-500 uppercase">
                  Accent
                </p>
                <strong className="text-xs">
                  {themeOptions[themeIndex].name}
                </strong>
              </div>
              <div
                aria-label="Accent colour"
                className="flex gap-2"
                role="radiogroup"
              >
                {themeOptions.map((option, index) => (
                  <Button
                    aria-checked={themeIndex === index}
                    aria-label={option.name}
                    className={cn(
                      'size-6 rounded-full border-[3px] border-white p-0 ring-1 ring-stone-300 hover:scale-105',
                      option.swatchClass,
                      themeIndex === index && 'ring-2 ring-stone-900',
                    )}
                    key={option.name}
                    onClick={() => onThemeChange(index)}
                    role="radio"
                    size="icon-xs"
                    variant="ghost"
                  />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </aside>
  )
}
