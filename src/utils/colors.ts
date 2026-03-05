/**
 * 颜色工具函数
 * 支持 HEX、HSL 颜色格式转换和配色方案生成
 */

export interface HSL {
  h: number
  s: number
  l: number
}

export interface RGB {
  r: number
  g: number
  b: number
}

export interface ThemeColors {
  primary: string
  primaryLight: string
  primaryDark: string
  gradient: string
}

/**
 * 将 HEX 颜色转换为 HSL
 */
export function hexToHsl(hex: string): HSL {
  // 移除 # 前缀
  hex = hex.replace(/^#/, '')

  // 解析 RGB 值
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255

  // 计算 HSL
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h *= 60
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

/**
 * 将 HSL 颜色转换为 HEX
 */
export function hslToHex(h: number, s: number, l: number): string {
  // 归一化值
  h = ((h % 360) + 360) % 360
  s = Math.max(0, Math.min(100, s)) / 100
  l = Math.max(0, Math.min(100, l)) / 100

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2

  let r = 0
  let g = 0
  let b = 0

  if (h >= 0 && h < 60) {
    r = c
    g = x
    b = 0
  } else if (h >= 60 && h < 120) {
    r = x
    g = c
    b = 0
  } else if (h >= 120 && h < 180) {
    r = 0
    g = c
    b = x
  } else if (h >= 180 && h < 240) {
    r = 0
    g = x
    b = c
  } else if (h >= 240 && h < 300) {
    r = x
    g = 0
    b = c
  } else if (h >= 300 && h < 360) {
    r = c
    g = 0
    b = x
  }

  // 转换为 0-255 范围
  const R = Math.round((r + m) * 255)
  const G = Math.round((g + m) * 255)
  const B = Math.round((b + m) * 255)

  // 转换为 HEX 字符串
  return `#${R.toString(16).padStart(2, '0')}${G.toString(16).padStart(2, '0')}${B.toString(16).padStart(2, '0')}`
}

/**
 * 调整 HSL 颜色的色相
 */
export function adjustHue(hsl: HSL, amount: number): HSL {
  return {
    ...hsl,
    h: ((hsl.h + amount) % 360 + 360) % 360
  }
}

/**
 * 调整 HSL 颜色的饱和度
 */
export function adjustSaturation(hsl: HSL, amount: number): HSL {
  return {
    ...hsl,
    s: Math.max(0, Math.min(100, hsl.s + amount))
  }
}

/**
 * 调整 HSL 颜色的亮度
 */
export function adjustLightness(hsl: HSL, amount: number): HSL {
  return {
    ...hsl,
    l: Math.max(0, Math.min(100, hsl.l + amount))
  }
}

/**
 * 根据主色生成完整的配色方案
 * 基于设计文档中的策略：
 * - primaryLight: 色相 +15°，饱和度 -10%
 * - primaryDark: 色相 -10°，亮度 -15%
 * - gradient: 从 primaryLight 到 primary 的线性渐变
 */
export function generateThemeColors(primary: string): ThemeColors {
  const hsl = hexToHsl(primary)

  // 生成浅色变体：色相 +15°，饱和度 -10%
  const lightHsl = adjustLightness(adjustSaturation(adjustHue(hsl, 15), -10), 5)
  const primaryLight = hslToHex(lightHsl.h, lightHsl.s, lightHsl.l)

  // 生成深色变体：色相 -10°，亮度 -15%
  const darkHsl = adjustLightness(adjustHue(hsl, -10), -15)
  const primaryDark = hslToHex(darkHsl.h, darkHsl.s, darkHsl.l)

  // 生成渐变色
  const gradient = `linear-gradient(135deg, ${primaryLight} 0%, ${primary} 100%)`

  return {
    primary,
    primaryLight,
    primaryDark,
    gradient
  }
}

/**
 * 验证 HEX 颜色格式是否有效
 */
export function isValidHex(hex: string): boolean {
  return /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i.test(hex.replace(/\s/g, ''))
}

/**
 * 标准化 HEX 颜色格式（添加 # 前缀，转换为大写）
 */
export function normalizeHex(hex: string): string {
  const cleanHex = hex.replace(/^#/, '').trim().toUpperCase()
  if (cleanHex.length === 3) {
    // 扩展简写格式 #FFF -> #FFFFFF
    return `#${cleanHex[0]}${cleanHex[0]}${cleanHex[1]}${cleanHex[1]}${cleanHex[2]}${cleanHex[2]}`
  }
  return `#${cleanHex}`
}
