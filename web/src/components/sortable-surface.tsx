import type { ReactNode } from 'react'
import { Accessibility, PointerActivationConstraints, PointerSensor } from '@dnd-kit/dom'
import {
  DragDropProvider,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/react'
import { isSortable, useSortable } from '@dnd-kit/react/sortable'

import { componentLabels, type ComponentId } from '@/data/profile'

export type SortableSurfaceId =
  | 'builder'
  | 'preview'
  | 'languages'
  | 'repositories'
  | 'socials'
  | 'stats'

type SortableData = {
  itemId: string
  label: string
  surface: SortableSurfaceId
}

type SortableSurfaceProps<ItemId extends string> = {
  children: ReactNode
  items: ItemId[]
  onReorder: (activeId: ItemId, targetId: ItemId) => void
  surface: SortableSurfaceId
}

const pointerSensor = PointerSensor.configure({
  activatorElements: (source) => [source.element],
  activationConstraints(event) {
    if (event.pointerType === 'touch') {
      return [
        new PointerActivationConstraints.Delay({ value: 220, tolerance: 8 }),
      ]
    }

    return [new PointerActivationConstraints.Distance({ value: 6 })]
  },
  preventActivation(event, source) {
    if (!(event.target instanceof Element)) return false
    if (event.target.closest('[data-drag-handle]')) return false

    if (
      source.data.surface === 'preview' &&
      event.target.closest('[data-nested-dnd]')
    ) {
      return true
    }

    return event.target.closest('[data-no-drag]') !== null
  },
})

const accessibility = Accessibility.configure({
  announcements: {
    dragstart(event: DragStartEvent) {
      const { source } = event.operation
      if (!source) return
      return `Picked up ${source.data.label}.`
    },
    dragover(event: DragOverEvent) {
      const { source } = event.operation
      if (!source || !isSortable(source)) return
      return `${source.data.label} is now in position ${source.index + 1}.`
    },
    dragend(event: DragEndEvent) {
      const { source } = event.operation
      if (!source || !isSortable(source)) return
      if (event.canceled) return `Reordering ${source.data.label} was cancelled.`
      return `${source.data.label} was moved to position ${source.index + 1}.`
    },
  },
  screenReaderInstructions: {
    draggable:
      'Press Space or Enter to pick up this item. Use the arrow keys to move it, press Space or Enter to drop it, or Escape to cancel.',
  },
})

export function SortableSurface<ItemId extends string>({
  children,
  items,
  onReorder,
  surface,
}: SortableSurfaceProps<ItemId>) {
  const handleDragEnd = (event: DragEndEvent) => {
    if (event.canceled) return

    const { source } = event.operation
    if (!isSortable(source) || source.group !== surface) return

    const activeId = source.data.itemId as ItemId | undefined
    const targetId = items[source.index]

    if (!activeId || !targetId) return
    onReorder(activeId, targetId)
  }

  return (
    <DragDropProvider
      onDragEnd={handleDragEnd}
      plugins={(defaults) => [...defaults, accessibility]}
      sensors={(defaults) => [
        ...defaults.filter((sensor) => sensor !== PointerSensor),
        pointerSensor,
      ]}
    >
      {children}
    </DragDropProvider>
  )
}

export function useSectionSortable(
  id: ComponentId,
  index: number,
  surface: SortableSurfaceId,
) {
  return useItemSortable(id, index, surface, componentLabels[id])
}

export function useItemSortable<ItemId extends string>(
  id: ItemId,
  index: number,
  surface: SortableSurfaceId,
  label: string,
) {
  return useSortable<SortableData>({
    data: {
      itemId: id,
      label,
      surface,
    },
    group: surface,
    id: `${surface}:${id}`,
    index,
    transition: {
      duration: 180,
      easing: 'cubic-bezier(0.2, 0, 0, 1)',
      idle: true,
    },
  })
}
