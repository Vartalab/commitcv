import type { ReactNode } from 'react'
import {
  ArrowUpRight,
  Building2,
  GitBranch,
  GitFork,
  Globe2,
  Mail,
  MapPin,
  Star,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  SortableSurface,
  useItemSortable,
  useSectionSortable,
} from '@/components/sortable-surface'
import {
  componentLabels,
  contributions,
  languages,
  profile,
  profileStats,
  repositories,
  socialLinks,
  themeOptions,
  type ComponentId,
  type LanguageId,
  type ProfileElementId,
  type RepositoryId,
  type SocialId,
  type StatId,
  type TemplateId,
} from '@/data/profile'
import type { CollectionOrders } from '@/lib/builder-preferences'
import { cn } from '@/lib/utils'

type ProfileCardProps = {
  collectionOrders: CollectionOrders
  compact: boolean
  enabled: Record<ComponentId, boolean>
  order: ComponentId[]
  profileElements: Record<ProfileElementId, boolean>
  template: TemplateId
  themeIndex: number
  onReorder: (activeId: ComponentId, targetId: ComponentId) => void
  onReorderLanguages: (activeId: LanguageId, targetId: LanguageId) => void
  onReorderRepositories: (
    activeId: RepositoryId,
    targetId: RepositoryId,
  ) => void
  onReorderSocials: (activeId: SocialId, targetId: SocialId) => void
  onReorderStats: (activeId: StatId, targetId: StatId) => void
}

type ProfileSectionProps = {
  children: ReactNode
  developer: boolean
  id: ComponentId
}

type Repository = (typeof repositories)[number]
type SocialLink = (typeof socialLinks)[number]
type Theme = (typeof themeOptions)[number]

function SortablePreviewSection({
  children,
  developer,
  id,
  index,
}: {
  children: ReactNode
  developer: boolean
  id: ComponentId
  index: number
}) {
  const { isDragSource, ref } = useSectionSortable(
    id,
    index,
    'preview',
  )

  return (
    <div
      className={cn(
        'relative touch-pan-y cursor-grab select-none focus-visible:rounded-xl focus-visible:outline-1 focus-visible:-outline-offset-1',
        developer
          ? 'focus-visible:outline-developer-muted/60'
          : 'focus-visible:outline-stone-500/50',
        isDragSource && 'cursor-grabbing opacity-65',
      )}
      aria-label={'Drag to reorder ' + componentLabels[id]}
      ref={ref}
      tabIndex={0}
    >
      {children}
    </div>
  )
}

function ProfileSection({
  children,
  developer,
  id,
}: ProfileSectionProps) {
  return (
    <section>
      <div
        className={cn(
          'mb-3 flex items-center gap-2.5 text-[9px] font-bold tracking-[0.13em] uppercase',
          developer ? 'text-developer-muted' : 'text-profile-muted',
        )}
      >
        <span>{componentLabels[id]}</span>
        <Separator
          className={cn(
            'flex-1',
            developer ? 'bg-developer-border' : 'bg-profile-border',
          )}
        />
      </div>
      {children}
    </section>
  )
}

function RepositoryCard({
  compact,
  developer,
  index,
  repository,
}: {
  compact: boolean
  developer: boolean
  index: number
  repository: Repository
}) {
  const { isDragSource, isDropTarget, ref } = useItemSortable(
    repository.id,
    index,
    'repositories',
    repository.name + ' repository',
  )

  return (
    <Card
      aria-label={'Drag to reorder ' + repository.name + ' repository'}
      className={cn(
        'touch-pan-y cursor-grab gap-0 rounded-xl border p-3.5 shadow-none ring-0 select-none focus-visible:outline-1 focus-visible:-outline-offset-1',
        isDropTarget && 'outline-1 -outline-offset-1',
        isDragSource && 'cursor-grabbing opacity-65',
        developer
          ? 'border-developer-border bg-developer-panel text-inherit outline-developer-muted/60'
          : 'border-profile-border bg-profile-panel outline-stone-500/50',
      )}
      ref={ref}
      tabIndex={0}
    >
      <div
        className={cn(
          'flex items-center justify-between',
          developer ? 'text-developer-muted' : 'text-profile-muted',
        )}
      >
        <GitBranch aria-hidden="true" className="size-3.5" />
        <ArrowUpRight aria-hidden="true" className="size-3.5" />
      </div>
      <h4 className="mt-3 mb-1.5 overflow-hidden font-mono text-[11px] font-bold text-ellipsis whitespace-nowrap">
        {repository.name}
      </h4>
      <p
        className={cn(
          'overflow-hidden text-[9px] leading-relaxed',
          !compact && 'min-h-9 max-[600px]:min-h-0',
          developer ? 'text-developer-muted' : 'text-profile-muted',
        )}
      >
        {repository.description}
      </p>
      <div
        className={cn(
          'mt-3 flex items-center gap-2.5 text-[8px]',
          developer ? 'text-developer-muted' : 'text-profile-muted',
        )}
      >
        <span className="inline-flex items-center gap-1">
          <i className={cn('size-1.5 rounded-full', repository.colorClass)} />
          {repository.language}
        </span>
        <span className="inline-flex items-center gap-1">
          <Star aria-hidden="true" className="size-2.5" /> {repository.stars}
        </span>
        <span className="inline-flex items-center gap-1">
          <GitFork aria-hidden="true" className="size-2.5" /> {repository.forks}
        </span>
      </div>
    </Card>
  )
}

const socialIcons = {
  email: Mail,
  linkedin: GitBranch,
  portfolio: Globe2,
} satisfies Record<SocialId, typeof Mail>

function SocialCard({
  compact,
  developer,
  index,
  link,
  theme,
}: {
  compact: boolean
  developer: boolean
  index: number
  link: SocialLink
  theme: Theme
}) {
  const Icon = socialIcons[link.id]
  const { isDragSource, isDropTarget, ref } = useItemSortable(
    link.id,
    index,
    'socials',
    link.value + ' social link',
  )

  return (
    <Card
      aria-label={'Drag to reorder ' + link.value + ' social link'}
      className={cn(
        'min-w-0 touch-pan-y cursor-grab rounded-xl border shadow-none ring-0 select-none focus-visible:outline-1 focus-visible:-outline-offset-1',
        compact
          ? 'grid grid-cols-[14px_minmax(0,1fr)] items-center gap-x-1 gap-y-0 px-1.5 py-1 text-left'
          : 'grid grid-cols-[auto_minmax(0,1fr)] gap-x-2 gap-y-1 p-2.5',
        isDropTarget && 'outline-1 -outline-offset-1',
        isDragSource && 'cursor-grabbing opacity-65',
        developer
          ? 'border-developer-border bg-developer-panel text-inherit outline-developer-muted/60'
          : 'border-profile-border bg-profile-panel outline-stone-500/50',
      )}
      ref={ref}
      tabIndex={0}
    >
      <Icon
        aria-hidden="true"
        className={cn('row-span-2 size-3.5 self-center', theme.textClass)}
      />
      <small
        className={cn(
          'w-full overflow-hidden text-[7px] leading-tight text-ellipsis whitespace-nowrap',
          developer ? 'text-developer-muted' : 'text-profile-muted',
        )}
      >
        {link.value}
      </small>
      <strong className="w-full overflow-hidden text-[8px] leading-tight text-ellipsis whitespace-nowrap">
        {link.label}
      </strong>
    </Card>
  )
}

function ProfileHeader({
  compact,
  developer,
  minimal,
  profileElements,
  theme,
}: {
  compact: boolean
  developer: boolean
  minimal: boolean
  profileElements: Record<ProfileElementId, boolean>
  theme: Theme
}) {
  const showDetails =
    profileElements.name ||
    profileElements.availability ||
    profileElements.username ||
    profileElements.role

  return (
    <div
      className={cn(
        'relative flex items-center gap-4',
        compact && 'gap-3',
      )}
    >
      {profileElements.avatar && (
        <div
          aria-label={profile.name + ' avatar placeholder'}
          className={cn(
            'relative grid size-[76px] shrink-0 place-items-center rounded-3xl border-[5px] border-white bg-linear-to-br to-brand-ink text-white shadow-profile-avatar max-[600px]:size-[62px] max-[600px]:rounded-2xl',
            theme.gradientClass,
            minimal && 'rounded-full',
            developer && 'border-developer-canvas to-developer-highlight',
            compact && 'size-[62px] rounded-2xl',
          )}
        >
          <span className="text-[23px] font-bold tracking-[-0.06em]">
            {profile.initials}
          </span>
          <i
            className={cn(
              'absolute -right-0.5 -bottom-0.5 size-4 rounded-full border-4 bg-emerald-500',
              developer ? 'border-developer-canvas' : 'border-white',
            )}
          />
        </div>
      )}

      {showDetails && (
        <div className="min-w-0 flex-1">
          <div
            className={cn(
              'flex items-center gap-2.5 max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-1.5',
              compact && 'flex-col items-start gap-1.5',
            )}
          >
            {profileElements.name && (
              <h1 className="[overflow-wrap:anywhere] text-[clamp(24px,4cqw,36px)] leading-none font-semibold tracking-[-0.06em]">
                {profile.name}
              </h1>
            )}
            {profileElements.availability && (
              <Badge
                className={cn(
                  'border',
                  theme.borderClass,
                  developer ? 'bg-white/10' : theme.softClass,
                  theme.textClass,
                )}
              >
                Open to build
              </Badge>
            )}
          </div>
          {profileElements.username && (
            <p
              className={cn(
                'mt-2 mb-1 text-xs font-semibold',
                theme.textClass,
              )}
            >
              @{profile.username}
            </p>
          )}
          {profileElements.role && (
            <strong
              className={cn(
                'text-xs font-medium',
                developer ? 'text-developer-muted' : 'text-profile-muted',
              )}
            >
              {profile.role}
            </strong>
          )}
        </div>
      )}

      {profileElements.githubMark && (
        <span
          className={cn(
            'ml-auto grid size-10 shrink-0 place-items-center rounded-xl border max-[600px]:hidden',
            compact && 'hidden',
            developer
              ? 'border-developer-border bg-developer-panel'
              : 'border-profile-border bg-stone-50',
          )}
        >
          <GitBranch aria-hidden="true" className="size-4" />
        </span>
      )}
    </div>
  )
}

function StatsSection({
  compact,
  developer,
  onReorder,
  order,
}: {
  compact: boolean
  developer: boolean
  onReorder: (activeId: StatId, targetId: StatId) => void
  order: StatId[]
}) {
  const metricsById = new Map(profileStats.map((metric) => [metric.id, metric]))
  const orderedMetrics = order.flatMap((id) => {
    const metric = metricsById.get(id)
    return metric ? [metric] : []
  })

  return (
    <SortableSurface items={order} onReorder={onReorder} surface="stats">
      <div
        className={cn(
          'grid grid-cols-4 gap-px overflow-hidden rounded-xl ring-1 max-[600px]:grid-cols-2',
          compact && 'grid-cols-2',
          developer
            ? 'bg-developer-border ring-developer-border'
            : 'bg-profile-border ring-profile-border',
        )}
        data-nested-dnd
      >
        {orderedMetrics.map((metric, index) => (
          <SortableMetric
            developer={developer}
            index={index}
            key={metric.id}
            metric={metric}
          />
        ))}
      </div>
    </SortableSurface>
  )
}

function SortableMetric({
  developer,
  index,
  metric,
}: {
  developer: boolean
  index: number
  metric: (typeof profileStats)[number]
}) {
  const { isDragSource, isDropTarget, ref } = useItemSortable(
    metric.id,
    index,
    'stats',
    metric.label + ' statistic',
  )

  return (
    <div
      aria-label={'Drag to reorder ' + metric.label + ' statistic'}
      className={cn(
        'touch-pan-y cursor-grab p-4 select-none focus-visible:outline-1 focus-visible:-outline-offset-1',
        isDropTarget && 'outline-1 -outline-offset-1',
        isDragSource && 'cursor-grabbing opacity-65',
        developer
          ? 'bg-developer-panel outline-developer-muted/60'
          : 'bg-profile-subtle outline-stone-500/50',
      )}
      ref={ref}
      tabIndex={0}
    >
      <strong className="mb-1 block text-lg tracking-[-0.04em]">
        {metric.value}
      </strong>
      <span
        className={cn(
          'block text-[9px]',
          developer ? 'text-developer-muted' : 'text-profile-muted',
        )}
      >
        {metric.label}
      </span>
    </div>
  )
}

function LanguagesSection({
  developer,
  onReorder,
  order,
}: {
  developer: boolean
  onReorder: (activeId: LanguageId, targetId: LanguageId) => void
  order: LanguageId[]
}) {
  const languagesById = new Map(
    languages.map((language) => [language.id, language]),
  )
  const orderedLanguages = order.flatMap((id) => {
    const language = languagesById.get(id)
    return language ? [language] : []
  })

  return (
    <>
      <div
        aria-label="Programming language usage"
        className={cn(
          'flex h-2 overflow-hidden rounded-full',
          developer ? 'bg-developer-border' : 'bg-stone-200',
        )}
      >
        {orderedLanguages.map((language) => (
          <span
            className={cn(
              'h-full border-l-2 first:border-l-0',
              developer ? 'border-developer-canvas' : 'border-white',
              language.colorClass,
              language.widthClass,
            )}
            key={language.id}
          />
        ))}
      </div>
      <SortableSurface
        items={order}
        onReorder={onReorder}
        surface="languages"
      >
        <div
          className="mt-2.5 flex flex-wrap gap-x-4 gap-y-2"
          data-nested-dnd
        >
          {orderedLanguages.map((language, index) => (
            <SortableLanguage
              developer={developer}
              index={index}
              key={language.id}
              language={language}
            />
          ))}
        </div>
      </SortableSurface>
    </>
  )
}

function SortableLanguage({
  developer,
  index,
  language,
}: {
  developer: boolean
  index: number
  language: (typeof languages)[number]
}) {
  const { isDragSource, isDropTarget, ref } = useItemSortable(
    language.id,
    index,
    'languages',
    language.name + ' language',
  )

  return (
    <span
      aria-label={'Drag to reorder ' + language.name + ' language'}
      className={cn(
        'inline-flex touch-pan-y cursor-grab items-center gap-1.5 rounded text-[9px] font-semibold select-none focus-visible:outline-1 focus-visible:-outline-offset-1',
        isDropTarget && 'outline-1 -outline-offset-1',
        isDragSource && 'cursor-grabbing opacity-65',
        developer
          ? 'outline-developer-muted/60'
          : 'outline-stone-500/50',
      )}
      ref={ref}
      tabIndex={0}
    >
      <i className={cn('size-1.5 rounded-full', language.colorClass)} />
      {language.name}
      <small
        className={cn(
          'text-[8px]',
          developer ? 'text-developer-muted' : 'text-profile-muted',
        )}
      >
        {language.percentage}%
      </small>
    </span>
  )
}

function ContributionSection({
  compact,
  developer,
  theme,
}: {
  compact: boolean
  developer: boolean
  theme: Theme
}) {
  return (
    <Card
      className={cn(
        'grid grid-cols-[auto_1fr] items-center gap-5 rounded-xl border p-3.5 shadow-none ring-0',
        compact && 'gap-3 p-3',
        developer
          ? 'border-developer-border bg-developer-panel text-inherit'
          : 'border-profile-border bg-profile-panel',
      )}
    >
      <div>
        <strong className="block text-[11px] whitespace-nowrap">
          1,086 contributions
        </strong>
        <span
          className={cn(
            'mt-1 block text-[8px] whitespace-nowrap',
            developer ? 'text-developer-muted' : 'text-profile-muted',
          )}
        >
          in the last year
        </span>
      </div>
      <div
        aria-label="Contribution activity preview"
        className={cn(
          'grid auto-cols-[5px] grid-flow-col grid-rows-7 justify-end gap-[3px]',
        )}
      >
        {contributions.map((level, index) => (
          <i
            className={cn(
              'size-[5px] rounded-[2px]',
              theme.activityClasses[level],
            )}
            key={index + '-' + level}
          />
        ))}
      </div>
    </Card>
  )
}

export function ProfileCard({
  collectionOrders,
  compact,
  enabled,
  onReorder,
  onReorderLanguages,
  onReorderRepositories,
  onReorderSocials,
  onReorderStats,
  order,
  profileElements,
  template,
  themeIndex,
}: ProfileCardProps) {
  const developer = template === 'developer'
  const minimal = template === 'minimal'
  const theme = themeOptions[themeIndex]
  const hasVisibleProfileElement = Object.values(profileElements).some(Boolean)
  const visibleOrder = order.filter(
    (id) =>
      enabled[id] && (id !== 'identity' || hasVisibleProfileElement),
  )
  const repositoriesById = new Map(
    repositories.map((repository) => [repository.id, repository]),
  )
  const orderedRepositories = collectionOrders.repositories.flatMap((id) => {
    const repository = repositoriesById.get(id)
    return repository ? [repository] : []
  })
  const socialLinksById = new Map(
    socialLinks.map((link) => [link.id, link]),
  )
  const orderedSocialLinks = collectionOrders.socials.flatMap((id) => {
    const link = socialLinksById.get(id)
    return link ? [link] : []
  })

  const sections: Record<ComponentId, ReactNode> = {
    identity: (
      <ProfileHeader
        compact={compact}
        developer={developer}
        minimal={minimal}
        profileElements={profileElements}
        theme={theme}
      />
    ),
    about: (
      <ProfileSection developer={developer} id="about">
        <p className="max-w-3xl [overflow-wrap:anywhere] text-[15px] leading-relaxed tracking-[-0.015em]">
          {profile.bio}
        </p>
        <div
          className={cn(
            'mt-3 flex flex-wrap gap-3.5 text-[10px]',
            developer ? 'text-developer-muted' : 'text-profile-muted',
          )}
        >
          <span className="inline-flex items-center gap-1.5">
            <MapPin aria-hidden="true" className="size-3" /> {profile.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Building2 aria-hidden="true" className="size-3" /> Independent
          </span>
        </div>
      </ProfileSection>
    ),
    stats: (
      <ProfileSection developer={developer} id="stats">
        <StatsSection
          compact={compact}
          developer={developer}
          onReorder={onReorderStats}
          order={collectionOrders.stats}
        />
      </ProfileSection>
    ),
    languages: (
      <ProfileSection developer={developer} id="languages">
        <LanguagesSection
          developer={developer}
          onReorder={onReorderLanguages}
          order={collectionOrders.languages}
        />
      </ProfileSection>
    ),
    repositories: (
      <ProfileSection developer={developer} id="repositories">
        <SortableSurface
          items={collectionOrders.repositories}
          onReorder={onReorderRepositories}
          surface="repositories"
        >
          <div
            className={cn(
              'grid grid-cols-3 gap-2 max-[600px]:grid-cols-1',
              compact && 'grid-cols-1',
            )}
            data-nested-dnd
          >
            {orderedRepositories.map((repository, index) => (
              <RepositoryCard
                compact={compact}
                developer={developer}
                index={index}
                key={repository.id}
                repository={repository}
              />
            ))}
          </div>
        </SortableSurface>
      </ProfileSection>
    ),
    contributions: (
      <ProfileSection developer={developer} id="contributions">
        <ContributionSection
          compact={compact}
          developer={developer}
          theme={theme}
        />
      </ProfileSection>
    ),
    socials: (
      <ProfileSection developer={developer} id="socials">
        <SortableSurface
          items={collectionOrders.socials}
          onReorder={onReorderSocials}
          surface="socials"
        >
          <div
            className={cn(
              'grid grid-cols-3 gap-2',
              compact && 'gap-1.5',
            )}
            data-nested-dnd
          >
            {orderedSocialLinks.map((link, index) => (
              <SocialCard
                compact={compact}
                developer={developer}
                index={index}
                key={link.id}
                link={link}
                theme={theme}
              />
            ))}
          </div>
        </SortableSurface>
      </ProfileSection>
    ),
  }

  return (
    <Card
      className={cn(
        'relative w-full gap-0 overflow-hidden border py-0 shadow-profile-card ring-0',
        developer
          ? 'border-developer-outline bg-developer-canvas text-developer-foreground'
          : 'border-stone-900/10 bg-paper text-profile-foreground',
        minimal
          ? 'rounded-lg shadow-profile-minimal'
          : 'rounded-3xl',
      )}
    >
      {!minimal && (
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute -top-32 left-1/3 h-60 w-[420px] rounded-full bg-linear-to-br to-transparent opacity-15 blur-3xl',
            theme.gradientClass,
            developer && 'opacity-25',
          )}
        />
      )}

      <SortableSurface
        items={visibleOrder}
        onReorder={onReorder}
        surface="preview"
      >
        <div
          className={cn(
            'relative grid gap-6 px-8 py-6 max-[600px]:px-5 max-[600px]:py-5',
            compact && 'px-5 py-5',
          )}
        >
          {visibleOrder.map((id, index) => (
            <SortablePreviewSection
              developer={developer}
              id={id}
              index={index}
              key={id}
            >
              {sections[id]}
            </SortablePreviewSection>
          ))}
        </div>
      </SortableSurface>

      <footer
        className={cn(
          'relative flex items-center justify-between border-t px-8 py-3 text-[8px] max-[600px]:px-5',
          compact && 'px-5',
          developer
            ? 'border-developer-border bg-developer-panel text-developer-muted'
            : 'border-profile-border bg-profile-subtle text-profile-muted',
        )}
      >
        <span className="inline-flex items-center gap-1.5">
          <i className={cn('size-1.5 rounded-full', theme.backgroundClass)} />
          Built from public GitHub activity
        </span>
        <span>commitcv.dev</span>
      </footer>
    </Card>
  )
}
