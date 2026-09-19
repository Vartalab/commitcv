import { arrayMove } from '@dnd-kit/helpers'

import {
  componentIds,
  languages,
  profileElementIds,
  profileStats,
  repositories,
  socialLinks,
  templateOptions,
  textSizeOptions,
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

const BUILDER_PREFERENCES_KEY = 'commitcv:builder-preferences:v1'
const BUILDER_PREFERENCES_VERSION = 1
const LEGACY_APPEARANCE_KEY = 'commitcv-builder-preferences'

export type BuilderPreferences = {
  collections: CollectionOrders
  enabled: Record<ComponentId, boolean>
  order: ComponentId[]
  profileElements: Record<ProfileElementId, boolean>
  template: TemplateId
  textSize: TextSizeId
  themeIndex: number
}

export type CollectionOrders = {
  languages: LanguageId[]
  repositories: RepositoryId[]
  socials: SocialId[]
  stats: StatId[]
}

const defaultEnabled = Object.fromEntries(
  componentIds.map((id) => [id, true]),
) as Record<ComponentId, boolean>

const defaultProfileElements = Object.fromEntries(
  profileElementIds.map((id) => [id, true]),
) as Record<ProfileElementId, boolean>

export const defaultBuilderPreferences: BuilderPreferences = {
  collections: {
    languages: languages.map(({ id }) => id),
    repositories: repositories.map(({ id }) => id),
    socials: socialLinks.map(({ id }) => id),
    stats: profileStats.map(({ id }) => id),
  },
  enabled: defaultEnabled,
  order: [...componentIds],
  profileElements: defaultProfileElements,
  template: 'modern',
  textSize: 'medium',
  themeIndex: 0,
}

function sanitizeOrder<T extends string>(value: unknown, allowedIds: T[]): T[] {
  const uniqueIds = new Set<T>()

  if (Array.isArray(value)) {
    value.forEach((id) => {
      if (typeof id === 'string' && allowedIds.includes(id as T)) {
        uniqueIds.add(id as T)
      }
    })
  }

  allowedIds.forEach((id) => uniqueIds.add(id))
  return [...uniqueIds]
}

function isComponentId(value: unknown): value is ComponentId {
  return typeof value === 'string' && componentIds.includes(value as ComponentId)
}

export function sanitizeComponentOrder(value: unknown): ComponentId[] {
  return sanitizeOrder(
    Array.isArray(value) ? value.filter(isComponentId) : value,
    componentIds,
  )
}

export function sanitizeCollectionOrders(value: unknown): CollectionOrders {
  const stored =
    typeof value === 'object' && value !== null
      ? (value as Record<string, unknown>)
      : {}

  return {
    languages: sanitizeOrder(
      stored.languages,
      languages.map(({ id }) => id),
    ),
    repositories: sanitizeOrder(
      stored.repositories,
      repositories.map(({ id }) => id),
    ),
    socials: sanitizeOrder(
      stored.socials,
      socialLinks.map(({ id }) => id),
    ),
    stats: sanitizeOrder(
      stored.stats,
      profileStats.map(({ id }) => id),
    ),
  }
}

export function sanitizeEnabledComponents(
  value: unknown,
): Record<ComponentId, boolean> {
  const stored =
    typeof value === 'object' && value !== null
      ? (value as Record<string, unknown>)
      : {}

  return Object.fromEntries(
    componentIds.map((id) => [
      id,
      typeof stored[id] === 'boolean' ? stored[id] : true,
    ]),
  ) as Record<ComponentId, boolean>
}

export function sanitizeProfileElements(
  value: unknown,
): Record<ProfileElementId, boolean> {
  const stored =
    typeof value === 'object' && value !== null
      ? (value as Record<string, unknown>)
      : {}

  return Object.fromEntries(
    profileElementIds.map((id) => [
      id,
      typeof stored[id] === 'boolean' ? stored[id] : true,
    ]),
  ) as Record<ProfileElementId, boolean>
}

export function sanitizeTemplate(value: unknown): TemplateId {
  return templateOptions.some(({ id }) => id === value)
    ? (value as TemplateId)
    : defaultBuilderPreferences.template
}

export function sanitizeTextSize(value: unknown): TextSizeId {
  return textSizeOptions.some(({ id }) => id === value)
    ? (value as TextSizeId)
    : defaultBuilderPreferences.textSize
}

export function sanitizeThemeIndex(value: unknown): number {
  return typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 0 &&
    value < themeOptions.length
    ? value
    : defaultBuilderPreferences.themeIndex
}

export function parseBuilderPreferences(value: string | null): BuilderPreferences {
  if (!value) return structuredClone(defaultBuilderPreferences)

  try {
    const stored = JSON.parse(value) as Record<string, unknown>

    if (stored.version !== BUILDER_PREFERENCES_VERSION) {
      return structuredClone(defaultBuilderPreferences)
    }

    return {
      collections: sanitizeCollectionOrders(stored.collections),
      enabled: sanitizeEnabledComponents(stored.enabled),
      order: sanitizeComponentOrder(stored.order),
      profileElements: sanitizeProfileElements(stored.profileElements),
      template: sanitizeTemplate(stored.template),
      textSize: sanitizeTextSize(stored.textSize),
      themeIndex: sanitizeThemeIndex(stored.themeIndex),
    }
  } catch {
    return structuredClone(defaultBuilderPreferences)
  }
}

export function readBuilderPreferences(): BuilderPreferences {
  if (typeof window === 'undefined') {
    return structuredClone(defaultBuilderPreferences)
  }

  try {
    const stored = window.localStorage.getItem(BUILDER_PREFERENCES_KEY)
    if (stored) return parseBuilderPreferences(stored)

    const legacyAppearance = JSON.parse(
      window.localStorage.getItem(LEGACY_APPEARANCE_KEY) ?? '{}',
    ) as Record<string, unknown>

    return {
      ...structuredClone(defaultBuilderPreferences),
      template: sanitizeTemplate(legacyAppearance.template),
      textSize: sanitizeTextSize(legacyAppearance.textSize),
      themeIndex: sanitizeThemeIndex(legacyAppearance.themeIndex),
    }
  } catch {
    return structuredClone(defaultBuilderPreferences)
  }
}

export function saveBuilderPreferences(preferences: BuilderPreferences) {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(
      BUILDER_PREFERENCES_KEY,
      JSON.stringify({
        version: BUILDER_PREFERENCES_VERSION,
        collections: sanitizeCollectionOrders(preferences.collections),
        enabled: sanitizeEnabledComponents(preferences.enabled),
        order: sanitizeComponentOrder(preferences.order),
        profileElements: sanitizeProfileElements(preferences.profileElements),
        template: sanitizeTemplate(preferences.template),
        textSize: sanitizeTextSize(preferences.textSize),
        themeIndex: sanitizeThemeIndex(preferences.themeIndex),
      }),
    )
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }
}

export function reorderComponents(
  order: ComponentId[],
  activeId: ComponentId,
  targetId: ComponentId,
): ComponentId[] {
  return reorderItems(order, activeId, targetId)
}

export function reorderItems<T extends string>(
  order: T[],
  activeId: T,
  targetId: T,
): T[] {
  const from = order.indexOf(activeId)
  const to = order.indexOf(targetId)

  if (from < 0 || to < 0 || from === to) return order
  return arrayMove(order, from, to)
}
