import { defineStore } from 'pinia'
import type { Todo, FilterType } from '@/types/todo'

const STORAGE_KEY = 'vue-todo-list'

export const useTodoStore = defineStore('todo', () => {
  // 从 localStorage 加载数据
  const loadTodos = (): Todo[] => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return []
      }
    }
    return []
  }

  const todos = ref<Todo[]>(loadTodos())
  const filter = ref<FilterType>('all')

  // 保存到 localStorage
  watch(
    todos,
    (newTodos) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos))
    },
    { deep: true }
  )

  // 添加待办
  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now()
    }
    todos.value.unshift(newTodo)
  }

  // 切换完成状态
  const toggleTodo = (id: number) => {
    const todo = todos.value.find((t) => t.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }

  // 删除待办
  const deleteTodo = (id: number) => {
    todos.value = todos.value.filter((t) => t.id !== id)
  }

  // 清空已完成
  const clearCompleted = () => {
    todos.value = todos.value.filter((t) => !t.completed)
  }

  // 筛选后的待办列表
  const filteredTodos = () => {
    switch (filter.value) {
      case 'active':
        return todos.value.filter((t) => !t.completed)
      case 'completed':
        return todos.value.filter((t) => t.completed)
      default:
        return todos.value
    }
  }

  // 统计
  const activeCount = () => todos.value.filter((t) => !t.completed).length
  const completedCount = () => todos.value.filter((t) => t.completed).length

  return {
    todos,
    filter,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    filteredTodos,
    activeCount,
    completedCount
  }
})
