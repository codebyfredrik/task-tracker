export type Priority = 'low' | 'medium' | 'high'

export type Status = 'not started' | 'in progress' | 'completed' | 'all'

export type Task = {
  id: string
  title: string
  description: string
  date?: string
  status: Status
  priority?: Priority
  category?: Array<string>
}

export type TaskWithOptionalId = Omit<Task, 'id'> & { id?: string }
