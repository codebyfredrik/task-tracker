import { PlusIcon } from 'lucide-react'
import * as React from 'react'
import { DialogTrigger } from 'react-aria-components'
import { useListData } from 'react-stately'

import { FormDialog } from './FormDialog'
import { List } from './List'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'
import { tasks } from '../data/tasks'
import type { Task, TaskWithOptionalId } from '../types'
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
