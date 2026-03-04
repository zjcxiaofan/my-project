// 待办事项类型定义
export interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: number
}

export type FilterType = 'all' | 'active' | 'completed'
