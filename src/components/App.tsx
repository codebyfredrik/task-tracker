import React from 'react'
import { useMediaQuery, usePrevious } from '@react-hookz/web'
import {
  DropIndicator,
  GridList,
  GridListItem,
  isTextDropItem,
  useDragAndDrop,
  DialogTrigger,
  Heading,
  Form,
  Text,
  MenuTrigger,
  type Key
} from 'react-aria-components'
import { TextField } from './ui/TextField'
import { Dialog } from './ui/Dialog'
import { Select, SelectItem } from './ui/Select'
import { Modal } from './ui/Modal'
import { Menu, MenuItem } from './ui/Menu'
import { Switch } from './ui/Switch'
import { PlusIcon, MoreHorizontalIcon } from 'lucide-react'
import { ListData, useListData } from 'react-stately'
import { Button } from './ui/Button'
import { tasks } from '../data/tasks'
import type { Priority, Status, Task } from '../data/tasks'
import { generateId } from '../utils'

export function TaskBoard({
  multipleColumns = false,
  isLargeScreen = false
}: {
  multipleColumns?: boolean
  isLargeScreen?: boolean
}) {
  const list = useListData({
    initialItems: tasks,
    getKey: (item) => item.id
  })

  function handleItemSave(task: TaskWithOptionalId) {
    const nextTask: Task = {
      ...task,
      id: task.id || generateId()
    }

    if ('id' in task) {
      list.update(nextTask.id, nextTask)
    } else {
      list.append(nextTask)
    }
  }

  return multipleColumns && isLargeScreen ? (
    <div className="relative grid grid-cols-[repeat(3,minmax(340px,1fr))] items-start gap-4 overflow-auto px-4 pb-9">
      <List
        showTitle
        onItemSave={handleItemSave}
        status="not started"
        list={list}
        multipleColumns={multipleColumns}
        itemClassName="selected:bg-green-100 selected:border-green-500 dark:selected:bg-green-900 dark:selected:border-green-700"
      >
        <DialogTrigger>
          <Button
            aria-label="Add task"
            variant="secondary"
            className="flex w-full items-center"
          >
            <PlusIcon aria-hidden className="mr-4 inline size-5" /> Add task
          </Button>
          <Modal isDismissable>
            <FormDialog onItemSave={handleItemSave} status="not started" />
          </Modal>
        </DialogTrigger>
      </List>
      <List
        showTitle
        onItemSave={handleItemSave}
        status="in progress"
        list={list}
        multipleColumns={multipleColumns}
        itemClassName="selected:bg-green-100 snap-start selected:border-green-500 dark:selected:bg-green-900 dark:selected:border-green-700"
      >
        <DialogTrigger>
          <Button
            aria-label="Add task"
            variant="secondary"
            className="flex w-full items-center"
          >
            <PlusIcon aria-hidden className="mr-4 inline size-5" /> Add task
          </Button>
          <Modal isDismissable>
            <FormDialog onItemSave={handleItemSave} status="in progress" />
          </Modal>
        </DialogTrigger>
      </List>
      <List
        showTitle
        onItemSave={handleItemSave}
        status="completed"
        list={list}
        multipleColumns={multipleColumns}
        itemClassName="selected:bg-blue-100 selected:border-blue-500 dark:selected:bg-blue-900 dark:selected:border-blue-700"
      >
        <DialogTrigger>
          <Button
            aria-label="Add task"
            variant="secondary"
            className="flex w-full items-center"
          >
            <PlusIcon aria-hidden className="mr-4 inline size-5" /> Add task
          </Button>
          <Modal isDismissable>
            <FormDialog onItemSave={handleItemSave} status="completed" />
          </Modal>
        </DialogTrigger>
      </List>
    </div>
  ) : (
    <div className="relative px-4">
      <List
        onItemSave={handleItemSave}
        status="all"
        list={list}
        itemClassName="selected:bg-green-100 selected:border-green-500 dark:selected:bg-green-900 dark:selected:border-green-700"
      />
    </div>
  )
}

type TaskWithOptionalId = Omit<Task, 'id'> & { id?: string }

type FormDialogProps = {
  item?: Task
  status: Status
  onItemSave: (item: TaskWithOptionalId) => void
}

function FormDialog({ item, status, onItemSave }: FormDialogProps) {
  const [task, setTask] = React.useState<TaskWithOptionalId>(() => {
    const baseTask = {
      title: item?.title || '',
      description: item?.description || '',
      status: item?.status || status,
      priority: item?.priority
    }

    return item?.id ? { ...baseTask, id: item.id } : baseTask
  })

  const handleSubmit: React.ComponentProps<typeof Form>['onSubmit'] = (e) => {
    e.preventDefault()
    onItemSave(task)
  }

  return (
    <Dialog className="relative border border-black/10  outline outline-0">
      {({ close }) => (
        <>
          <Heading
            slot="title"
            className="mb-4 text-2xl font-semibold leading-6 text-slate-700 dark:text-zinc-300"
          >
            {item ? 'Edit task' : 'New task'}
          </Heading>
          <Form
            onSubmit={(e) => {
              handleSubmit(e)
              close()
            }}
          >
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <TextField
                label="Title"
                className="flex flex-col"
                defaultValue={task.title}
                onChange={(value: string) =>
                  setTask((currentTask) => ({
                    ...currentTask,
                    title: value
                  }))
                }
                isRequired
              />
              <TextField
                label="Description"
                className="flex flex-col"
                defaultValue={task.description}
                onChange={(value: string) =>
                  setTask((currentTask) => ({
                    ...currentTask,
                    description: value
                  }))
                }
                isRequired
              />
              <Select
                label="Status"
                name="status"
                isRequired
                defaultSelectedKey={task.status}
                onSelectionChange={(key) =>
                  setTask((currentTask) => ({
                    ...currentTask,
                    status: key as Status
                  }))
                }
              >
                <SelectItem id="not started" textValue="Not started">
                  Not started
                </SelectItem>
                <SelectItem id="in progress" textValue="In progress">
                  In progress
                </SelectItem>
                <SelectItem id="completed" textValue="Completed">
                  Completed
                </SelectItem>
              </Select>
              <Select
                label="Priority"
                name="priority"
                isRequired
                defaultSelectedKey={task.priority}
                onSelectionChange={(key) =>
                  setTask((currentTask) => ({
                    ...currentTask,
                    priority: key as Priority
                  }))
                }
              >
                <SelectItem id="low" textValue="Low">
                  Low
                </SelectItem>
                <SelectItem id="medium" textValue="Medium">
                  Medium
                </SelectItem>
                <SelectItem id="high" textValue="High">
                  High
                </SelectItem>
              </Select>
            </div>
            <div className="mt-8 flex justify-end gap-2">
              <Button variant="secondary" onPress={close}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {item ? 'Save' : 'Add'}
              </Button>
            </div>
          </Form>
        </>
      )}
    </Dialog>
  )
}

interface ListProps {
  children?: React.ReactNode
  list: ListData<Task>
  status: Status
  showTitle?: boolean
  onItemSave: (item: TaskWithOptionalId) => void
  itemClassName?: string
  multipleColumns?: boolean
}

function List({
  children,
  list,
  status,
  showTitle = false,
  onItemSave,
  itemClassName,
  multipleColumns = false
}: ListProps) {
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

interface CardProps {
  id: string
  item: Task
  status: Status
  onItemSave: (item: TaskWithOptionalId) => void
  onItemDelete: (id: string) => void
  className?: string
}

function Card({
  id,
  item,
  status,
  onItemSave,
  onItemDelete,
  className
}: CardProps) {
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

export function App() {
  const [isMultipleColumns, setMultipleColumns] = React.useState(false)
  const isMediumDeviceAndAbove = useMediaQuery(
    'only screen and (min-width : 768px)'
  )
  const previousIsMediumDeviceAndAbove = usePrevious(isMediumDeviceAndAbove)

  React.useEffect(() => {
    if (previousIsMediumDeviceAndAbove && !isMediumDeviceAndAbove) {
      setMultipleColumns(false)
    }
  }, [isMediumDeviceAndAbove, previousIsMediumDeviceAndAbove])

  return (
    <div className="relative flex min-h-screen justify-center bg-gradient-to-br from-pink1 to-indigo1 pb-4">
      <Switch
        className="absolute left-4 top-4 font-semibold"
        onChange={setMultipleColumns}
        isDisabled={!isMediumDeviceAndAbove}
        isSelected={isMultipleColumns}
      >
        Multiple columns
      </Switch>
      <div className="mt-14 w-full flex-col items-center justify-center">
        <TaskBoard
          multipleColumns={isMultipleColumns}
          isLargeScreen={isMediumDeviceAndAbove}
        />
      </div>
    </div>
  )
}
