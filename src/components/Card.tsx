import React from 'react'
import {
  GridListItem,
  Text,
  MenuTrigger,
  type Key
} from 'react-aria-components'
import { MoreHorizontalIcon } from 'lucide-react'
import { Modal } from './ui/Modal'
import { Menu, MenuItem } from './ui/Menu'
import { Button } from './ui/Button'
import { FormDialog } from './FormDialog'
import type { Status, Task, TaskWithOptionalId } from '../types'

type Props = {
  id: string
  item: Task
  status: Status
  onItemSave: (item: TaskWithOptionalId) => void
  onItemDelete: (id: string) => void
  className?: string
}

export function Card({
  id,
  item,
  status,
  onItemSave,
  onItemDelete,
  className
}: Props) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  function handleMenuAction(key: Key) {
    if (key === 'edit') {
      setIsDialogOpen(true)
    }

    if (key === 'delete') {
      onItemDelete(item.id)
    }
  }

  return (
    <GridListItem
      id={id}
      textValue={item.title}
      className={`selected:shadow-md dragging:opacity-50 group grid cursor-default select-none grid-cols-8 grid-rows-[auto_auto] gap-1 rounded-lg border border-solid border-black/10 bg-white/80 bg-clip-padding p-3 text-slate-700 outline outline-0 outline-offset-2 outline-blue-500 transition forced-color-adjust-none hover:border-black/20 hover:shadow-md focus-visible:outline-2 dark:border-white/10 dark:bg-zinc-900/70 dark:text-slate-200 dark:hover:border-white/20 forced-colors:!border-[ButtonBorder] forced-colors:!text-[ButtonText] forced-colors:outline-[Highlight] ${className}`}
    >
      <div className="col-span-7 truncate font-bold">{item.title}</div>
      <Text
        slot="description"
        className="col-span-7 line-clamp-2 text-sm text-slate-500 dark:text-zinc-300 forced-colors:!text-inherit"
      >
        {item.description}
      </Text>
      <div className="col-start-8 col-end-8 row-span-2 row-start-1 flex items-center justify-end">
        <MenuTrigger>
          <Button aria-label="Menu" variant="icon">
            <MoreHorizontalIcon className="size-4" />
          </Button>
          <Menu
            onAction={handleMenuAction}
            selectionMode="single"
            placement="top left"
          >
            <MenuItem key="edit" id="edit">
              Edit
            </MenuItem>
            <MenuItem key="delete" id="delete">
              Delete
            </MenuItem>
          </Menu>
        </MenuTrigger>
        <Modal
          isOpen={isDialogOpen}
          isDismissable
          onOpenChange={() => setIsDialogOpen(false)}
        >
          <FormDialog item={item} onItemSave={onItemSave} status={status} />
        </Modal>
      </div>
    </GridListItem>
  )
}
