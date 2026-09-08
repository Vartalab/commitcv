import { describe, expect, it } from 'vitest'

import {
  defaultBuilderPreferences,
  parseBuilderPreferences,
  reorderComponents,
  reorderItems,
  sanitizeCollectionOrders,
  sanitizeComponentOrder,
  sanitizeEnabledComponents,
  sanitizeProfileElements,
} from '@/lib/builder-preferences'

describe('builder preferences', () => {
  it('falls back to image-first defaults for missing or invalid storage', () => {
    expect(parseBuilderPreferences(null)).toEqual(defaultBuilderPreferences)
    expect(parseBuilderPreferences('{invalid json')).toEqual(
      defaultBuilderPreferences,
    )
    expect(parseBuilderPreferences(JSON.stringify({ version: 2 }))).toEqual(
      defaultBuilderPreferences,
    )
    expect(defaultBuilderPreferences.order[0]).toBe('identity')
  })

  it('removes unknown and duplicate ids and appends newly supported sections', () => {
    expect(
      sanitizeComponentOrder([
        'stats',
        'unknown',
        'stats',
        'about',
        'identity',
      ]),
    ).toEqual([
      'stats',
      'about',
      'identity',
      'languages',
      'repositories',
      'contributions',
      'socials',
    ])
  })

  it('preserves stored visibility and enables missing sections safely', () => {
    expect(
      sanitizeEnabledComponents({
        about: false,
        identity: true,
        stats: 'false',
      }),
    ).toMatchObject({
      about: false,
      identity: true,
      stats: true,
      socials: true,
    })
  })

  it('preserves individual profile-element visibility safely', () => {
    expect(
      sanitizeProfileElements({
        avatar: false,
        name: true,
        role: 'false',
      }),
    ).toMatchObject({
      avatar: false,
      name: true,
      role: true,
      username: true,
    })
  })

  it('sanitizes each nested collection without allowing cross-group ids', () => {
    expect(
      sanitizeCollectionOrders({
        repositories: ['tiny-colors', 'email', 'tiny-colors'],
        socials: ['email', 'orbit-notes'],
        stats: ['followers'],
        languages: ['rust', 'unknown'],
      }),
    ).toEqual({
      repositories: ['tiny-colors', 'orbit-notes', 'kinetic-ui'],
      socials: ['email', 'portfolio', 'linkedin'],
      stats: ['followers', 'repositories', 'following', 'contributions'],
      languages: ['rust', 'typescript', 'react', 'other'],
    })
  })

  it('moves only known source and target sections', () => {
    const order = [...defaultBuilderPreferences.order]
    expect(reorderComponents(order, 'identity', 'stats')).toEqual([
      'about',
      'stats',
      'identity',
      'languages',
      'repositories',
      'contributions',
      'socials',
    ])
    expect(reorderComponents(order, 'identity', 'identity')).toBe(order)
  })

  it('reorders individual items without mutating invalid collections', () => {
    const repositories = ['orbit-notes', 'kinetic-ui', 'tiny-colors'] as const
    const order = [...repositories]

    expect(reorderItems(order, 'orbit-notes', 'tiny-colors')).toEqual([
      'kinetic-ui',
      'tiny-colors',
      'orbit-notes',
    ])
    expect(reorderItems(order, 'orbit-notes', 'orbit-notes')).toBe(order)
  })
})
