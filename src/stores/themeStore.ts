import { defineStore } from 'pinia'
import { generateThemeColors, normalizeHex, isValidHex } from '@/utils/colors'

export type ThemeColor = 'purple' | 'blue' | 'green' | 'orange' | 'pink' | 'red'
export type ThemeMode = 'preset' | 'custom'

export interface ThemeConfig {
  name: string
  primary: string
  primaryLight: string
  primaryDark: string
  gradient: string
  isCustom?: boolean
}

export const themeConfigs: Record<ThemeColor, ThemeConfig> = {
  purple: {
    name: '梦幻紫',
    primary: '#667eea',
    primaryLight: '#764ba2',
    primaryDark: '#5a67d8',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  blue: {
    name: '海洋蓝',
    primary: '#3b82f6',
    primaryLight: '#2563eb',
    primaryDark: '#1d4ed8',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
  },
  green: {
    name: '清新绿',
    primary: '#10b981',
    primaryLight: '#059669',
    primaryDark: '#047857',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
  },
  orange: {
    name: '活力橙',
    primary: '#f97316',
    primaryLight: '#ea580c',
    primaryDark: '#c2410c',
    gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
  },
  pink: {
    name: '樱花粉',
    primary: '#ec4899',
    primaryLight: '#db2777',
    primaryDark: '#be185d',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
  },
  red: {
    name: '热情红',
    primary: '#ef4444',
    primaryLight: '#dc2626',
    primaryDark: '#b91c1c',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
  }
}

const STORAGE_KEY = 'vue-todo-theme'
const STORAGE_KEY_CUSTOM = 'vue-todo-theme-custom'

export const useThemeStore = defineStore('theme', () => {
  // 从 localStorage 加载主题
  const loadTheme = (): ThemeColor => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && themeConfigs[stored as ThemeColor]) {
      return stored as ThemeColor
    }
    return 'purple'
  }

  // 从 localStorage 加载自定义颜色
  const loadCustomColor = (): string | null => {
    const stored = localStorage.getItem(STORAGE_KEY_CUSTOM)
    if (stored && isValidHex(stored)) {
      return normalizeHex(stored)
    }
    return null
  }

  const currentTheme = ref<ThemeColor>(loadTheme())
  const currentMode = ref<ThemeMode>('preset')
  const currentCustomColor = ref<string | null>(loadCustomColor())

  // 保存到 localStorage
  watch(currentTheme, (newTheme) => {
    localStorage.setItem(STORAGE_KEY, newTheme)
  })

  // 保存自定义颜色到 localStorage
  watch(currentCustomColor, (newColor) => {
    if (newColor) {
      localStorage.setItem(STORAGE_KEY_CUSTOM, newColor)
    }
  })

  // 获取当前主题配置
  const themeConfig = computed(() => themeConfigs[currentTheme.value])

  // 生成自定义主题配置
  const getCustomThemeConfig = (): ThemeConfig | null => {
    if (!currentCustomColor.value) {
      return null
    }
    const colors = generateThemeColors(currentCustomColor.value)
    return {
      name: '自定义',
      ...colors,
      isCustom: true
    }
  }

  // 获取当前生效的主题配置（考虑模式）
  const activeThemeConfig = computed((): ThemeConfig => {
    if (currentMode.value === 'custom' && currentCustomColor.value) {
      return getCustomThemeConfig()!
    }
    return themeConfigs[currentTheme.value]
  })

  // 切换主题
  const setTheme = (theme: ThemeColor) => {
    currentTheme.value = theme
    currentMode.value = 'preset'
  }

  // 设置自定义颜色
  const setCustomColor = (color: string) => {
    const normalizedColor = normalizeHex(color)
    if (isValidHex(normalizedColor)) {
      currentCustomColor.value = normalizedColor
      currentMode.value = 'custom'
    }
  }

  // 重置回预设主题
  const resetToPreset = () => {
    currentMode.value = 'preset'
    currentCustomColor.value = null
    localStorage.removeItem(STORAGE_KEY_CUSTOM)
  }

  // 切换到下一个主题
  const nextTheme = () => {
    const themes: ThemeColor[] = Object.keys(themeConfigs) as ThemeColor[]
    const currentIndex = themes.indexOf(currentTheme.value)
    const nextIndex = (currentIndex + 1) % themes.length
    currentTheme.value = themes[nextIndex]!
  }

  return {
    currentTheme,
    currentMode,
    currentCustomColor,
    themeConfig,
    activeThemeConfig,
    getCustomThemeConfig,
    setTheme,
    setCustomColor,
    resetToPreset,
    nextTheme,
    themes: Object.keys(themeConfigs) as ThemeColor[]
  }
})
