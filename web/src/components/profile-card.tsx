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

import {
  SortableSurface,
  useItemSortable,
  useSectionSortable,
} from '@/components/sortable-surface'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
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
  type TextSizeId,
} from '@/data/profile'
import type { CollectionOrders } from '@/lib/builder-preferences'
import { cn } from '@/lib/utils'

type ProfileCardProps = {
  collectionOrders: CollectionOrders
  compact: boolean
  enabled: Record<ComponentId, boolean>
  onReorder: (activeId: ComponentId, targetId: ComponentId) => void
  onReorderLanguages: (activeId: LanguageId, targetId: LanguageId) => void
  onReorderRepositories: (
    activeId: RepositoryId,
    targetId: RepositoryId,
  ) => void
  onReorderSocials: (activeId: SocialId, targetId: SocialId) => void
  onReorderStats: (activeId: StatId, targetId: StatId) => void
  order: ComponentId[]
  profileElements: Record<ProfileElementId, boolean>
  template: TemplateId
  textSize: TextSizeId
  themeIndex: number
}

type ProfileSectionProps = {
  children: ReactNode
  id: ComponentId
}

type Repository = (typeof repositories)[number]
type SocialLink = (typeof socialLinks)[number]
type Theme = (typeof themeOptions)[number]

function SortablePreviewSection({
  children,
  id,
  index,
}: {
  children: ReactNode
  id: ComponentId
  index: number
}) {
  const { isDragSource, ref } = useSectionSortable(id, index, 'preview')

  return (
    <div
      aria-label={'Drag to reorder ' + componentLabels[id]}
      className={cn(
        'relative touch-pan-y cursor-grab select-none focus-visible:rounded-xl focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-profile-theme-muted/60',
        isDragSource && 'cursor-grabbing opacity-65',
      )}
      ref={ref}
      tabIndex={0}
    >
      {children}
    </div>
  )
}

function ProfileSection({ children, id }: ProfileSectionProps) {
  return (
    <section>
      <div className="profile-type-heading mb-3 flex items-center gap-2.5 font-bold tracking-[0.13em] text-profile-theme-muted uppercase">
        <span>{componentLabels[id]}</span>
        <Separator className="flex-1 bg-profile-theme-border" />
      </div>
      {children}
    </section>
  )
}

function RepositoryCard({
  compact,
  index,
  repository,
}: {
  compact: boolean
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
        'touch-pan-y cursor-grab gap-0 rounded-xl border border-profile-theme-border bg-profile-theme-panel p-3.5 text-inherit shadow-none ring-0 select-none focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-profile-theme-muted/60',
        isDropTarget &&
          'outline-1 -outline-offset-1 outline-profile-theme-muted/60',
        isDragSource && 'cursor-grabbing opacity-65',
      )}
      ref={ref}
      tabIndex={0}
    >
      <div className="flex items-center justify-between text-profile-theme-muted">
        <GitBranch aria-hidden="true" className="size-3.5" />
        <ArrowUpRight aria-hidden="true" className="size-3.5" />
      </div>
      <h4 className="profile-type-repository mt-3 mb-1.5 overflow-hidden font-mono font-bold text-ellipsis whitespace-nowrap">
        {repository.name}
      </h4>
      <p
        className={cn(
          'profile-type-description overflow-hidden leading-relaxed text-profile-theme-muted',
          !compact && 'min-h-9 max-[600px]:min-h-0',
        )}
      >
        {repository.description}
      </p>
      <div className="profile-type-detail mt-3 flex items-center gap-2.5 text-profile-theme-muted">
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
  dark,
  index,
  link,
  theme,
}: {
  compact: boolean
  dark: boolean
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
        'min-w-0 touch-pan-y cursor-grab rounded-xl border border-profile-theme-border bg-profile-theme-panel text-inherit shadow-none ring-0 select-none focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-profile-theme-muted/60',
        compact
          ? 'grid grid-cols-[14px_minmax(0,1fr)] items-center gap-x-1 gap-y-0 px-1.5 py-1 text-left'
          : 'grid grid-cols-[auto_minmax(0,1fr)] gap-x-2 gap-y-1 p-2.5',
        isDropTarget &&
          'outline-1 -outline-offset-1 outline-profile-theme-muted/60',
        isDragSource && 'cursor-grabbing opacity-65',
      )}
      ref={ref}
      tabIndex={0}
    >
      <Icon
        aria-hidden="true"
        className={cn(
          'row-span-2 size-3.5 self-center',
          dark ? theme.darkTextClass : theme.textClass,
        )}
      />
      <small className="profile-type-social-label w-full overflow-hidden leading-tight text-ellipsis whitespace-nowrap text-profile-theme-muted">
        {link.value}
      </small>
      <strong className="profile-type-social-value w-full overflow-hidden leading-tight text-ellipsis whitespace-nowrap">
        {link.label}
      </strong>
    </Card>
  )
}

function ProfileHeader({
  compact,
  dark,
  minimal,
  profileElements,
  theme,
}: {
  compact: boolean
  dark: boolean
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
            'relative grid size-[76px] shrink-0 place-items-center rounded-3xl border-[5px] border-profile-theme-canvas bg-linear-to-br to-profile-theme-highlight text-white shadow-profile-avatar max-[600px]:size-[62px] max-[600px]:rounded-2xl',
            theme.gradientClass,
            minimal && 'rounded-full',
            compact && 'size-[62px] rounded-2xl',
          )}
        >
          <span className="profile-type-avatar font-bold tracking-[-0.06em]">
            {profile.initials}
          </span>
          <i className="absolute -right-0.5 -bottom-0.5 size-4 rounded-full border-4 border-profile-theme-canvas bg-emerald-500" />
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
              <h1 className="profile-type-display [overflow-wrap:anywhere] leading-none font-semibold tracking-[-0.06em]">
                {profile.name}
              </h1>
            )}
            {profileElements.availability && (
              <Badge
                className={cn(
                  'profile-type-label border',
                  theme.borderClass,
                  dark ? 'bg-white/10' : theme.softClass,
                  dark ? theme.darkTextClass : theme.textClass,
                )}
              >
                Open to build
              </Badge>
            )}
          </div>
          {profileElements.username && (
            <p
              className={cn(
                'profile-type-label mt-2 mb-1 font-semibold',
                dark ? theme.darkTextClass : theme.textClass,
              )}
            >
              @{profile.username}
            </p>
          )}
          {profileElements.role && (
            <strong className="profile-type-label font-medium text-profile-theme-muted">
              {profile.role}
            </strong>
          )}
        </div>
      )}

      {profileElements.githubMark && (
        <span
          className={cn(
            'ml-auto grid size-10 shrink-0 place-items-center rounded-xl border border-profile-theme-border bg-profile-theme-panel max-[600px]:hidden',
            compact && 'hidden',
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
  onReorder,
  order,
}: {
  compact: boolean
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
          'grid grid-cols-4 gap-px overflow-hidden rounded-xl bg-profile-theme-border ring-1 ring-profile-theme-border max-[600px]:grid-cols-2',
          compact && 'grid-cols-2',
        )}
        data-nested-dnd
      >
        {orderedMetrics.map((metric, index) => (
          <SortableMetric index={index} key={metric.id} metric={metric} />
        ))}
      </div>
    </SortableSurface>
  )
}

function SortableMetric({
  index,
  metric,
}: {
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
        'touch-pan-y cursor-grab bg-profile-theme-subtle p-4 select-none focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-profile-theme-muted/60',
        isDropTarget &&
          'outline-1 -outline-offset-1 outline-profile-theme-muted/60',
        isDragSource && 'cursor-grabbing opacity-65',
      )}
      ref={ref}
      tabIndex={0}
    >
      <strong className="profile-type-stat mb-1 block tracking-[-0.04em]">
        {metric.value}
      </strong>
      <span className="profile-type-description block text-profile-theme-muted">
        {metric.label}
      </span>
    </div>
  )
}

function LanguagesSection({
  onReorder,
  order,
}: {
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
        className="flex h-2 overflow-hidden rounded-full bg-profile-theme-border"
      >
        {orderedLanguages.map((language) => (
          <span
            className={cn(
              'h-full border-l-2 border-profile-theme-canvas first:border-l-0',
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
  index,
  language,
}: {
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
        'profile-type-description inline-flex touch-pan-y cursor-grab items-center gap-1.5 rounded font-semibold select-none focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-profile-theme-muted/60',
        isDropTarget &&
          'outline-1 -outline-offset-1 outline-profile-theme-muted/60',
        isDragSource && 'cursor-grabbing opacity-65',
      )}
      ref={ref}
      tabIndex={0}
    >
      <i className={cn('size-1.5 rounded-full', language.colorClass)} />
      {language.name}
      <small className="profile-type-detail text-profile-theme-muted">
        {language.percentage}%
      </small>
    </span>
  )
}

function ContributionSection({
  compact,
  theme,
}: {
  compact: boolean
  theme: Theme
}) {
  return (
    <Card
      className={cn(
        'grid grid-cols-[auto_1fr] items-center gap-5 rounded-xl border border-profile-theme-border bg-profile-theme-panel p-3.5 text-inherit shadow-none ring-0',
        compact && 'gap-3 p-3',
      )}
    >
      <div>
        <strong className="profile-type-repository block whitespace-nowrap">
          1,086 contributions
        </strong>
        <span className="profile-type-detail mt-1 block text-profile-theme-muted whitespace-nowrap">
          in the last year
        </span>
      </div>
      <div
        aria-label="Contribution activity preview"
        className="grid auto-cols-[5px] grid-flow-col grid-rows-7 justify-end gap-[3px]"
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
  textSize,
  themeIndex,
}: ProfileCardProps) {
  const dark = template === 'developer' || template === 'midnight'
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
        dark={dark}
        minimal={minimal}
        profileElements={profileElements}
        theme={theme}
      />
    ),
    about: (
      <ProfileSection id="about">
        <p className="profile-type-body max-w-3xl [overflow-wrap:anywhere] leading-relaxed tracking-[-0.015em]">
          {profile.bio}
        </p>
        <div className="profile-type-meta mt-3 flex flex-wrap gap-3.5 text-profile-theme-muted">
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
      <ProfileSection id="stats">
        <StatsSection
          compact={compact}
          onReorder={onReorderStats}
          order={collectionOrders.stats}
        />
      </ProfileSection>
    ),
    languages: (
      <ProfileSection id="languages">
        <LanguagesSection
          onReorder={onReorderLanguages}
          order={collectionOrders.languages}
        />
      </ProfileSection>
    ),
    repositories: (
      <ProfileSection id="repositories">
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
      <ProfileSection id="contributions">
        <ContributionSection compact={compact} theme={theme} />
      </ProfileSection>
    ),
    socials: (
      <ProfileSection id="socials">
        <SortableSurface
          items={collectionOrders.socials}
          onReorder={onReorderSocials}
          surface="socials"
        >
          <div
            className={cn('grid grid-cols-3 gap-2', compact && 'gap-1.5')}
            data-nested-dnd
          >
            {orderedSocialLinks.map((link, index) => (
              <SocialCard
                compact={compact}
                dark={dark}
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
        'profile-card relative w-full gap-0 overflow-hidden border border-profile-theme-outline bg-profile-theme-canvas py-0 text-profile-theme-foreground shadow-profile-card ring-0',
        minimal ? 'rounded-lg shadow-profile-minimal' : 'rounded-3xl',
      )}
      data-template={template}
      data-text-size={textSize}
    >
      {!minimal && (
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute -top-32 left-1/3 h-60 w-[420px] rounded-full bg-linear-to-br to-transparent opacity-15 blur-3xl',
            theme.gradientClass,
            dark && 'opacity-25',
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
            <SortablePreviewSection id={id} index={index} key={id}>
              {sections[id]}
            </SortablePreviewSection>
          ))}
        </div>
      </SortableSurface>

      <footer
        className={cn(
          'profile-type-detail relative flex items-center justify-between border-t border-profile-theme-border bg-profile-theme-subtle px-8 py-3 text-profile-theme-muted max-[600px]:px-5',
          compact && 'px-5',
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
