# 前端代码规范指南

> 适用于 Vue 3 + TypeScript + Element Plus 项目

## 目录

- [1. 命名规范](#1-命名规范)
- [2. TypeScript 规范](#2-typescript-规范)
- [3. Vue 组件规范](#3-vue-组件规范)
- [4. 代码组织](#4-代码组织)
- [5. 样式规范](#5-样式规范)
- [6. Git 提交规范](#6-git-提交规范)
- [7. 最佳实践](#7-最佳实践)

---

## 1. 命名规范

### 1.1 文件命名

| 类型 | 规范 | 示例 |
|------|------|------|
| Vue 组件 | PascalCase | `TodoItem.vue`, `UserProfile.vue` |
| 类型定义文件 | camelCase + `.ts` | `todo.ts`, `user.ts` |
| Store 文件 | camelCase + `Store.ts` | `todoStore.ts`, `userStore.ts` |
| 工具函数 | camelCase | `formatDate.ts`, `utils.ts` |
| 配置文件 | camel-case 或 kebab-case | `vite.config.ts`, `tsconfig.json` |

### 1.2 代码命名

```typescript
// ✅ 正确
interface Todo { }           // 接口：PascalCase
type FilterType = ...        // 类型：PascalCase
const todoStore = ...        // 变量：camelCase
const addTodo = () => {}     // 函数：camelCase
const STORAGE_KEY = '...'    // 常量：UPPER_SNAKE_CASE

// ❌ 错误
interface todo { }
const TodoStore = ...
const ADD_TODO = () => {}
```

### 1.3 组件Props 和 Emits

```typescript
// ✅ 正确
const props = defineProps<{
  todo: Todo
  isLoading?: boolean
}>()

const emit = defineEmits<{
  toggle: [id: number]
  delete: [id: number]
}>()

// ❌ 错误 - 使用 any
const props = defineProps<{
  todo: any
}>()
```

---

## 2. TypeScript 规范

### 2.1 类型定义

```typescript
// ✅ 使用 interface 定义对象类型
export interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: number
}

// ✅ 使用 type 定义联合类型
export type FilterType = 'all' | 'active' | 'completed'

// ✅ 类型导入集中管理
import type { Todo, FilterType } from '@/types/todo'
```

### 2.2 避免使用 any

```typescript
// ❌ 避免
const data: any = {}

// ✅ 使用 unknown 或具体类型
const data: unknown = {}
const data: Record<string, unknown> = {}
```

### 2.3 泛型使用

```typescript
// ✅ 泛型命名：T, U, V 或描述性名称
function wrapInArray<T>(item: T): T[] {
  return [item]
}

// ✅ 组件泛型
const GenericList = <T,>(props: { items: T[] }) => { ... }
```

---

## 3. Vue 组件规范

### 3.1 组件结构顺序

```vue
<script setup lang="ts">
<!-- 1. 导入语句 -->
<!-- 2. Props 定义 -->
<!-- 3. Emits 定义 -->
<!-- 4. 响应式数据 -->
<!-- 5. 计算属性 -->
<!-- 6. 监听器 -->
<!-- 7. 函数定义 -->
</script>

<template>
<!-- 模板内容 -->
</template>

<style scoped lang="scss">
<!-- 样式 -->
</style>
```

### 3.2 Props 定义

```typescript
// ✅ 使用 defineProps 配合类型注解
const props = defineProps<{
  title: string
  count?: number
  isActive?: boolean
}>()

// ✅ 需要默认值时使用 withDefaults
const props = withDefaults(defineProps<{
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
}>(), {
  size: 'medium',
  disabled: false
})
```

### 3.3 Emits 定义

```typescript
// ✅ 使用 defineEmits 配合类型注解
const emit = defineEmits<{
  change: [value: string]
  submit: [event: Event]
  delete: [id: number]
}>()

// ✅ 发送事件
emit('change', newValue)
```

### 3.4 导入顺序

```typescript
// 1. Vue 核心
import { ref, computed, watch } from 'vue'

// 2. 第三方库
import ElementPlus from 'element-plus'

// 3. 项目模块（按目录排序）
import { useTodoStore } from '@/stores/todoStore'
import TodoItem from '@/components/TodoItem.vue'
import type { Todo } from '@/types/todo'

// 4. 相对路径
import utils from './utils'
```

---

## 4. 代码组织

### 4.1 目录结构

```
src/
├── assets/           # 静态资源
├── components/       # 公共组件
├── composables/      # 组合式函数 (hooks)
├── router/           # 路由配置
├── stores/           # Pinia stores
├── styles/           # 全局样式
├── types/            # TypeScript 类型定义
├── utils/            # 工具函数
├── views/            # 页面组件
├── App.vue           # 根组件
└── main.ts           # 入口文件
```

### 4.2 Store 规范

```typescript
import { defineStore } from 'pinia'

export const useTodoStore = defineStore('todo', () => {
  // 1. 状态
  const todos = ref<Todo[]>([])

  // 2. 计算属性
  const completedCount = computed(() =>
    todos.value.filter(t => t.completed).length
  )

  // 3. Actions/方法
  const addTodo = (text: string) => { ... }
  const deleteTodo = (id: number) => { ... }

  // 4. 返回
  return {
    todos,
    completedCount,
    addTodo,
    deleteTodo
  }
})
```

---

## 5. 样式规范

### 5.1 SCSS 编写

```scss
// ✅ 使用嵌套，但不超过 3 层
.todo-app {
  .header {
    .title {
      color: #333;
    }
  }
}

// ✅ 使用变量
$primary-color: #667eea;
$spacing-md: 16px;

// ✅ 使用 mixin 复用
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### 5.2 类名命名

```scss
// ✅ 使用 kebab-case
.todo-item { }
.add-todo-card { }
.filter-section { }

// ✅ 组件内使用描述性类名
.custom-checkbox { }
.delete-btn { }

// ❌ 避免
.todoItem { }  // camelCase
TODO_ITEM { }  // UPPER_SNAKE_CASE
```

### 5.3 主题颜色

```scss
// 定义主题变量
$colors: (
  primary: #667eea,
  secondary: #764ba2,
  success: #11998e,
  danger: #ff6b6b,
);

// 使用
.primary-text {
  color: map-get($colors, primary);
}
```

---

## 6. Git 提交规范

### 6.1 Commit Message 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 6.2 Type 类型

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档更新 |
| `style` | 代码格式（不影响代码运行） |
| `refactor` | 重构（既不是新功能也不是 bug 修复） |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `chore` | 构建过程或辅助工具变动 |

### 6.3 示例

```bash
# ✅ 正确
feat: 添加用户登录功能
fix(todo): 修复删除待办事项 bug
docs: 更新 README
refactor(store): 重构 Pinia store 结构

# ❌ 错误
update code
fix bug
aaa
```

---

## 7. 最佳实践

### 7.1 响应式数据

```typescript
// ✅ 优先使用 ref
const count = ref(0)
const todos = ref<Todo[]>([])

// ✅ 对象使用 reactive
const state = reactive({
  loading: false,
  error: null
})

// ❌ 避免混用导致混乱
```

### 7.2 计算属性

```typescript
// ✅ 使用 computed 缓存计算结果
const completedTodos = computed(() =>
  todos.value.filter(t => t.completed)
)

// ❌ 避免在模板中直接计算
// <div v-for="todo in todos.filter(t => t.completed)">
```

### 7.3 事件处理

```typescript
// ✅ 使用具名函数
const handleClick = () => { ... }
<button @click="handleClick" />

// ✅ 内联简单操作
<button @click="count++" />

// ❌ 避免复杂内联逻辑
// <button @click="count++; save(); notify(); log();" />
```

### 7.4 条件渲染

```vue
<!-- ✅ 使用 v-if 处理条件 -->
<el-empty v-if="todos.length === 0" />

<!-- ✅ 使用 v-show 处理频繁切换 -->
<div v-show="isVisible" />

<!-- ❌ 避免在同一个元素使用 v-if 和 v-for -->
```

### 7.5 键值使用

```vue
<!-- ✅ 使用唯一 id 作为 key -->
<TodoItem v-for="todo in todos" :key="todo.id" />

<!-- ❌ 避免使用 index -->
<TodoItem v-for="(todo, index) in todos" :key="index" />
```

---

## 附录：推荐 VS Code 扩展

- [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) - Vue 官方扩展
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - 代码检查
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - 代码格式化
- [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) - 样式检查

---

## 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| 1.0.0 | 2026-03-04 | 初始版本 |
