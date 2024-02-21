import { generateId } from '../utils'

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

export const tasksWithoutId: Array<Omit<Task, 'id'>> = [
  {
    title: 'Grocery shopping',
    description: 'Buy fruits, vegetables, and other household items.',
    date: '2023-09-15',
    status: 'in progress',
    category: ['Personal', 'Shopping'],
    priority: 'high'
  },
  {
    title: 'Car maintenance',
    description:
      "Take the car for an oil change and general inspection. This includes checking the tire pressure, brake pads, and fluid levels. It's also a good opportunity to clean the interior and exterior of the car.",
    date: '2023-09-16',
    status: 'in progress',
    category: ['Personal', 'Vehicle'],
    priority: 'medium'
  },
  {
    title: 'Prepare presentation',
    description: 'Prepare a presentation for the next team meeting.',
    date: '2023-09-17',
    status: 'not started',
    category: ['Work', 'Presentation'],
    priority: 'high'
  },
  {
    title: 'Dentist appointment',
    description: 'Go to the dentist for a regular check-up.',
    date: '2023-09-18',
    status: 'completed',
    category: ['Personal', 'Health'],
    priority: 'low'
  },
  {
    title: 'Laundry',
    description: 'Do the laundry.',
    date: '2023-09-19',
    status: 'not started',
    category: ['Personal', 'Household'],
    priority: 'low'
  },
  {
    title: 'Pay bills',
    description: 'Pay the monthly utility and credit card bills.',
    date: '2023-09-21',
    status: 'completed',
    category: ['Personal', 'Finance'],
    priority: 'high'
  },
  {
    title: 'Plan vacation',
    description: 'Plan the upcoming family vacation.',
    date: '2023-09-22',
    status: 'not started',
    category: ['Personal', 'Travel'],
    priority: 'medium'
  },
  {
    title: 'Gym workout',
    description: 'Go to the gym for a workout session.',
    date: '2023-09-23',
    status: 'in progress',
    category: ['Personal', 'Fitness'],
    priority: 'medium'
  },
  {
    title: 'Prepare report',
    description: 'Prepare the quarterly sales report.',
    date: '2023-09-24',
    status: 'in progress',
    category: ['Work', 'Reporting'],
    priority: 'high'
  }
]

export const tasks: Array<Task> = tasksWithoutId.map((task) => ({
  ...task,
  id: generateId()
}))
