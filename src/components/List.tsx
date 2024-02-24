import { PlusIcon } from 'lucide-react'
import * as React from 'react'
import {
  DialogTrigger,
  DropIndicator,
  GridList,
  isTextDropItem,
  useDragAndDrop
} from 'react-aria-components'
import type { ListData } from 'react-stately'

import { Card } from './Card'
import { FormDialog } from './FormDialog'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'
import type { Status, Task, TaskWithOptionalId } from '../types'

type List = {
  children?: React.ReactNode
  list: ListData<Task>
  status: Status
  showTitle?: boolean
  onItemSave: (item: TaskWithOptionalId) => void
  itemClassName?: string
  multipleColumns?: boolean
}

export function List({
  children,
  list,
  status,
  showTitle = false,
  onItemSave,
  itemClassName,
  multipleColumns = false
}: List) {
  const items =
    status === 'all'
      ? list.items
      : list.items.filter((t) => t.status === status)

  const { dragAndDropHooks } = useDragAndDrop({
    // Provide drag data in a custom format as well as plain text.
    getItems(keys) {
      return [...keys].map((id) => ({
        'issue-id': String(id),
        'text/plain': list.getItem(id).title
      }))
    },

    renderDropIndicator(target) {
      return (
        <DropIndicator
          target={target}
          className="drop-target:visible -mx-2 -my-1.5 h-0 translate-y-[-5px]"
        >
          <svg height={10} className="w-full fill-none stroke-pink-500">
            <circle cx={5} cy={5} r={5 - 1} strokeWidth={2} />
            <line
              x1={20}
              x2="100%"
              transform="translate(-10 0)"
              y1={5}
              y2={5}
              strokeWidth={2}
            />
            <circle
              cx="100%"
              cy={5}
              r={5 - 1}
              transform="translate(-5 0)"
              strokeWidth={2}
            />
          </svg>
        </DropIndicator>
      )
    },

    // Accept drops with the custom format.
    acceptedDragTypes: ['issue-id'],

    // Ensure items are always moved rather than copied.
    getDropOperation: () => 'move',

    // Handle drops between items from other lists.
    async onInsert(e) {
      const ids = await Promise.all(
        e.items.filter(isTextDropItem).map((item) => item.getText('issue-id'))
      )
      for (const id of ids) {
        list.update(id, { ...list.getItem(id), status })
      }
      if (e.target.dropPosition === 'before') {
        list.moveBefore(e.target.key, ids)
      } else if (e.target.dropPosition === 'after') {
        list.moveAfter(e.target.key, ids)
      }
    },

    // Handle drops on the collection when empty.
    async onRootDrop(e) {
      const ids = await Promise.all(
        e.items.filter(isTextDropItem).map((item) => item.getText('issue-id'))
      )
      for (const id of ids) {
        list.update(id, { ...list.getItem(id), status })
      }
    },

    // Handle reordering items within the same list.
    onReorder(e) {
      if (e.target.dropPosition === 'before') {
        list.moveBefore(e.target.key, e.keys)
      } else if (e.target.dropPosition === 'after') {
        list.moveAfter(e.target.key, e.keys)
      }
    }
  })

  function handleItemDelete(id: string) {
    list.remove(id)
  }

  return (
    <section className="relative flex flex-col gap-2">
      <header>
        {showTitle && (
          <h3 className="my-0 inline-block font-semibold text-zinc-200 dark:text-slate-200">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </h3>
        )}
        <div className="flex items-end justify-between">
          <span className="text-sm leading-3 text-zinc-50 dark:text-zinc-400">
            {items.length} {items.length === 1 ? 'task' : 'tasks'}
          </span>
          {!multipleColumns && (
            <DialogTrigger>
              <Button
                aria-label="Add task"
                variant="secondary"
                className="size-9 shrink-0 p-0"
              >
                <PlusIcon aria-hidden className="inline size-5" />
              </Button>
              <Modal isDismissable>
                <FormDialog onItemSave={onItemSave} status="all" />
              </Modal>
            </DialogTrigger>
          )}
        </div>
      </header>
      <div className="relative">
        <GridList
          items={items}
          aria-label={status}
          selectionMode="multiple"
          dragAndDropHooks={dragAndDropHooks}
          renderEmptyState={() => 'No tasks.'}
          className={`data-drop-target:bg-blue-200 dark:drop-target:bg-blue-800/60 drop-target:outline-2 relative flex flex-col gap-3 rounded-xl border border-black/10 bg-white/70 bg-clip-padding p-2 text-gray-700 shadow-xl outline outline-0 -outline-offset-2 outline-blue-500 backdrop-blur empty:items-center empty:justify-center md:p-4 ${
            multipleColumns ? 'md:pb-16' : ''
          } dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-400`}
        >
          {(item) => (
            <Card
              id={item.id}
              item={item}
              status={status}
              onItemSave={onItemSave}
              onItemDelete={handleItemDelete}
              className={itemClassName}
            />
          )}
        </GridList>
        {children && multipleColumns && (
          <div className="absolute inset-x-4 bottom-4">{children}</div>
        )}
      </div>
    </section>
  )
}
