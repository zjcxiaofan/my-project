<script setup lang="ts">
import type { Todo } from '@/types/todo'
import { Delete } from '@element-plus/icons-vue'

defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  toggle: [id: number]
  delete: [id: number]
}>()
</script>

<template>
  <div class="todo-item" :class="{ completed: todo.completed }">
    <el-checkbox
      class="custom-checkbox"
      :model-value="todo.completed"
      @change="emit('toggle', todo.id)"
    >
      <span class="todo-text">{{ todo.text }}</span>
    </el-checkbox>
    <el-button
      class="delete-btn"
      type="danger"
      :icon="Delete"
      text
      circle
      size="small"
      @click="emit('delete', todo.id)"
    />
  </div>
</template>

<style scoped lang="scss">
.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  background: #fff;
  border-radius: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    border-color: rgba(102, 126, 234, 0.2);
  }

  &.completed {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    opacity: 0.8;

    .todo-text {
      text-decoration: line-through;
      color: #9ca3af;
    }
  }
}

.custom-checkbox {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 12px;

  :deep(.el-checkbox__input) {
    flex-shrink: 0;
  }

  :deep(.el-checkbox__inner) {
    width: 22px;
    height: 22px;
    border-width: 2px;
    border-color: #d1d5db;
    transition: all 0.3s ease;
  }

  :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: transparent;
  }

  :deep(.el-checkbox__inner::after) {
    width: 5px;
    height: 10px;
    border-width: 2px;
  }

  .todo-text {
    font-size: 16px;
    color: #1a1a2e;
    font-weight: 500;
    transition: all 0.3s ease;
  }
}

.delete-btn {
  flex-shrink: 0;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
  color: white;

  .todo-item:hover & {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
