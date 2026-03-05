<script setup lang="ts">
import { useThemeStore, type ThemeColor, themeConfigs } from '@/stores/themeStore'
import { MagicStick, Close, Check, RefreshLeft } from '@element-plus/icons-vue'
import ColorPicker from '@/components/ColorPicker.vue'

const themeStore = useThemeStore()
const showPanel = ref(false)
const activeTab = ref<'preset' | 'custom'>('preset')

// 临时颜色存储（用于颜色选择器）
const tempColor = ref(themeStore.currentCustomColor || '#667eea')

const selectTheme = (theme: ThemeColor) => {
  themeStore.setTheme(theme)
  activeTab.value = 'preset'
}

const closePanel = () => {
  showPanel.value = false
}

const openPanel = () => {
  showPanel.value = !showPanel.value
  tempColor.value = themeStore.currentCustomColor || themeStore.activeThemeConfig.primary
}

const handleColorUpdate = (color: string) => {
  tempColor.value = color
}

const handleColorConfirm = (color: string) => {
  themeStore.setCustomColor(color)
  activeTab.value = 'preset'
  closePanel()
}

const handleColorCancel = () => {
  tempColor.value = themeStore.currentCustomColor || themeStore.activeThemeConfig.primary
}

const handleResetToPreset = () => {
  themeStore.resetToPreset()
  tempColor.value = '#667eea'
}

const isUsingCustom = computed(() => themeStore.currentMode === 'custom')
</script>

<template>
  <div class="theme-switcher">
    <!-- 主题切换按钮 -->
    <el-button class="theme-btn" :icon="MagicStick" circle size="small" @click="openPanel" />

    <!-- 主题选择面板 -->
    <Transition name="slide">
      <div class="theme-panel" v-if="showPanel">
        <div class="panel-header">
          <span>选择主题色</span>
          <el-button :icon="Close" text size="small" @click="closePanel" />
        </div>

        <!-- 标签页 -->
        <div class="tabs">
          <button
            :class="['tab', { active: activeTab === 'preset' }]"
            @click="activeTab = 'preset'"
          >
            预设主题
          </button>
          <button
            :class="['tab', { active: activeTab === 'custom' }]"
            @click="activeTab = 'custom'"
          >
            自定义
          </button>
        </div>

        <!-- 预设主题标签页 -->
        <div class="preset-content" v-show="activeTab === 'preset'">
          <div class="theme-options">
            <button
              v-for="theme in themeStore.themes"
              :key="theme"
              :class="['theme-option', { active: themeStore.currentTheme === theme }]"
              :style="{ background: themeConfigs[theme].gradient }"
              @click="selectTheme(theme)"
            >
              <el-icon
                v-if="themeStore.currentTheme === theme && themeStore.currentMode === 'preset'"
                :size="20"
              >
                <Check />
              </el-icon>
            </button>
          </div>
          <div class="theme-name">{{ themeStore.activeThemeConfig.name }}</div>
        </div>

        <!-- 自定义标签页 -->
        <div class="custom-content" v-show="activeTab === 'custom'">
          <ColorPicker
            :model-value="tempColor"
            :show-preview="true"
            @update:model-value="handleColorUpdate"
            @confirm="handleColorConfirm"
            @cancel="handleColorCancel"
          />

          <!-- 重置按钮 -->
          <el-button
            class="reset-btn"
            v-if="isUsingCustom"
            :icon="RefreshLeft"
            text
            size="small"
            @click="handleResetToPreset"
          >
            重置回预设
          </el-button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.theme-switcher {
  position: relative;
  overflow: visible;
}

.theme-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(30deg);
  }
}

.theme-panel {
  position: absolute;
  width: 280px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 999;
  transform-origin: top left;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e9ecef;

  span {
    font-size: 14px;
    font-weight: 600;
    color: #1a1a2e;
  }
}

// 标签页样式
.tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  padding: 4px;
  background: #f1f3f5;
  border-radius: 12px;

  .tab {
    flex: 1;
    padding: 8px 12px;
    border: none;
    background: transparent;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    color: #495057;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }

    &.active {
      background: white;
      color: #1a1a2e;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
  }
}

.preset-content {
  .theme-options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .theme-option {
    width: 100%;
    aspect-ratio: 1;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &.active {
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
    }
  }

  .theme-name {
    text-align: center;
    font-size: 12px;
    color: #6b7280;
    margin-top: 12px;
  }
}

.custom-content {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .reset-btn {
    width: 100%;
    margin-top: 4px;
    color: #6b7280;

    &:hover {
      color: #ef4444;
      background: rgba(239, 68, 68, 0.1);
    }
  }
}

// 滑入动画
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}
</style>
