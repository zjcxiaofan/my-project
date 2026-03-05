<script setup lang="ts">
import { useTodoStore } from '@/stores/todoStore'
import { useThemeStore } from '@/stores/themeStore'
import TodoItem from '@/components/TodoItem.vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
import type { FilterType } from '@/types/todo'
import { EditPen, Plus, Delete, List, Calendar, Check, Clock } from '@element-plus/icons-vue'

const todoStore = useTodoStore()
const themeStore = useThemeStore()
const newTodoText = ref('')

const handleAddTodo = () => {
  const text = newTodoText.value.trim()
  if (text) {
    todoStore.addTodo(text)
    newTodoText.value = ''
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleAddTodo()
  }
}

const setFilter = (filter: FilterType) => {
  todoStore.filter = filter
}

const isActive = (filter: FilterType) => {
  return todoStore.filter === filter
}
</script>

<template>
  <div class="todo-app" :style="{ background: themeStore.activeThemeConfig.gradient }">
    <div class="app-container">
      <!-- 头部区域 -->
      <header class="header">
        <div class="header-content">
          <div class="icon-wrapper" :style="{ background: themeStore.activeThemeConfig.gradient }">
            <el-icon :size="40"><Calendar /></el-icon>
          </div>
          <div class="title-wrapper">
            <h1>我的待办</h1>
            <p class="subtitle">今天也要元气满满哦</p>
          </div>
          <div class="header-actions">
            <ThemeSwitcher />
          </div>
        </div>
        <div class="stats">
          <div class="stat-item">
            <el-icon><List /></el-icon>
            <span class="stat-num">{{ todoStore.todos.length }}</span>
            <span class="stat-label">总数</span>
          </div>
          <div
            class="stat-item active"
            :style="{ background: themeStore.activeThemeConfig.gradient }"
          >
            <el-icon><Clock /></el-icon>
            <span class="stat-num">{{ todoStore.activeCount() }}</span>
            <span class="stat-label">进行中</span>
          </div>
          <div class="stat-item completed">
            <el-icon><Check /></el-icon>
            <span class="stat-num">{{ todoStore.completedCount() }}</span>
            <span class="stat-label">已完成</span>
          </div>
        </div>
      </header>

      <!-- 添加任务区域 -->
      <div class="add-todo-card">
        <div class="input-wrapper">
          <el-input
            v-model="newTodoText"
            placeholder="今天想要完成什么呢？"
            size="large"
            clearable
            @keydown="handleKeydown"
          >
            <template #prefix>
              <el-icon><EditPen /></el-icon>
            </template>
          </el-input>
          <el-button
            class="add-btn"
            type="primary"
            size="large"
            @click="handleAddTodo"
            :icon="Plus"
          >
            添加任务
          </el-button>
        </div>
      </div>

      <!-- 筛选区域 -->
      <div class="filter-section">
        <div class="filter-tabs">
          <button :class="['filter-tab', { active: isActive('all') }]" @click="setFilter('all')">
            <span>全部</span>
            <span class="count">{{ todoStore.todos.length }}</span>
          </button>
          <button
            :class="['filter-tab', { active: isActive('active') }]"
            @click="setFilter('active')"
          >
            <span>进行中</span>
            <span class="count">{{ todoStore.activeCount() }}</span>
          </button>
          <button
            :class="['filter-tab', { active: isActive('completed') }]"
            @click="setFilter('completed')"
          >
            <span>已完成</span>
            <span class="count">{{ todoStore.completedCount() }}</span>
          </button>
        </div>
        <el-button
          class="clear-btn"
          v-if="todoStore.completedCount() > 0"
          type="danger"
          size="small"
          :icon="Delete"
          plain
          @click="todoStore.clearCompleted"
        >
          清空已完成
        </el-button>
      </div>

      <!-- 任务列表 -->
      <div class="todo-list">
        <TransitionGroup name="list">
          <TodoItem
            v-for="todo in todoStore.filteredTodos()"
            :key="todo.id"
            :todo="todo"
            @toggle="todoStore.toggleTodo"
            @delete="todoStore.deleteTodo"
          />
        </TransitionGroup>
      </div>

      <!-- 空状态 -->
      <Transition name="fade">
        <el-empty
          class="empty-state"
          v-if="todoStore.filteredTodos().length === 0"
          :description="
            todoStore.filter === 'completed' ? '还没有已完成的任务' : '还没有添加任务哦'
          "
          :image-size="100"
        >
          <template #image>
            <div class="empty-image" :style="{ background: themeStore.activeThemeConfig.gradient }">
              <el-icon :size="48"><List /></el-icon>
            </div>
          </template>
        </el-empty>
      </Transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
.todo-app {
  width: 100%;
  min-height: 100vh;
  padding: 40px 20px;
  transition: background 0.3s ease;
}

.app-container {
  max-width: 640px;
  margin: 0 auto;
}

// 头部样式
.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 28px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 9;

  .header-content {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
    position: relative;
  }

  .icon-wrapper {
    width: 64px;
    height: 64px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
    transition: background 0.3s ease;
  }

  .header-actions {
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    gap: 8px;
  }

  .title-wrapper {
    h1 {
      font-size: 28px;
      font-weight: 700;
      color: #1a1a2e;
      margin: 0 0 4px 0;
    }

    .subtitle {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
    }
  }

  .stats {
    display: flex;
    gap: 12px;

    .stat-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-radius: 16px;
      transition: all 0.3s ease;

      .el-icon {
        font-size: 20px;
        color: #6b7280;
        margin-bottom: 8px;
      }

      .stat-num {
        font-size: 24px;
        font-weight: 700;
        color: #1a1a2e;
      }

      .stat-label {
        font-size: 12px;
        color: #6b7280;
        margin-top: 4px;
      }

      &.active {
        background: v-bind('themeStore.activeThemeConfig.gradient');

        .el-icon,
        .stat-num,
        .stat-label {
          color: white;
        }
      }

      &.completed {
        background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);

        .el-icon,
        .stat-num,
        .stat-label {
          color: white;
        }
      }
    }
  }
}

// 添加任务卡片
.add-todo-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  .input-wrapper {
    display: flex;
    gap: 12px;

    .add-btn {
      background: v-bind('themeStore.activeThemeConfig.gradient');
      border: none;
      padding: 0 32px;
      font-weight: 600;
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
      }
    }
  }
}

// 筛选区域
.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 16px 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

  .filter-tabs {
    display: flex;
    gap: 8px;

    .filter-tab {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 18px;
      border: none;
      background: #f1f3f5;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 500;
      color: #495057;
      cursor: pointer;
      transition: all 0.3s ease;

      .count {
        background: rgba(0, 0, 0, 0.1);
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 12px;
      }

      &:hover {
        background: #e9ecef;
        transform: translateY(-2px);
      }

      &.active {
        background: v-bind('themeStore.activeThemeConfig.gradient');
        color: white;

        .count {
          background: rgba(255, 255, 255, 0.2);
        }
      }
    }
  }

  .clear-btn {
    font-weight: 500;

    :deep(.el-button__text) {
      color: #fff;
    }
  }
}

// 任务列表
.todo-list {
  min-height: 15px;
}

// 空状态
.empty-state {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-top: -12px;

  .empty-image {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin: 0 auto 16px;
    transition: background 0.3s ease;
  }

  :deep(.el-empty__description) {
    color: #6b7280;
    font-size: 14px;
  }
}

// 列表动画
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

// 淡入动画
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
