import React from 'react'
import { Heading, Form } from 'react-aria-components'
import { TextField } from './ui/TextField'
import { Dialog } from './ui/Dialog'
import { Select, SelectItem } from './ui/Select'
import { Button } from './ui/Button'
import type { Priority, Status, Task, TaskWithOptionalId } from '../types'

type Props = {
  item?: Task
  status: Status
  onItemSave: (item: TaskWithOptionalId) => void
}

export function FormDialog({ item, status, onItemSave }: Props) {
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
