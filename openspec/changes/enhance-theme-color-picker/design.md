## Context

当前主题切换功能已实现 6 种预设主题色，使用 `themeStore` 管理主题状态，通过 CSS 变量实现动态主题切换。用户反馈希望能够自定义主题颜色，而不仅限于预设选项。

**技术栈：**
- Vue 3 + Composition API
- Pinia 状态管理
- Element Plus UI 组件库
- SCSS + CSS 变量
- localStorage 持久化

**约束条件：**
- 保持与现有主题系统的兼容性
- 自定义颜色需要能够生成渐变色
- 颜色选择器需要直观易用

## Goals / Non-Goals

**Goals:**
- 添加自定义颜色选择器，支持用户选择任意颜色
- 自动根据用户选择的主色生成渐变色方案
- 自定义主题持久化存储
- 保持预设主题与自定义主题的无缝切换

**Non-Goals:**
- 不支持多套自定义主题配置（仅保存当前自定义颜色）
- 不支持主题导入/导出功能
- 不支持深色模式切换

## Decisions

### 1. 颜色选择器实现方式

**决策：** 使用原生 HTML5 颜色输入 + 自定义 HSL 滑块组合

**理由：**
- Element Plus 的 ColorPicker 组件功能完整但体积较大
- 原生 `<input type="color">` 支持系统级颜色选择器
- 自定义 HSL 滑块提供更精细的控制

**备选方案：**
- 使用 `@vueform/slider` 等第三方滑块库 → 增加依赖
- 完全自定义颜色选择器 → 开发成本高

### 2. 渐变色生成策略

**决策：** 基于主色自动生成渐变（固定色相偏移）

**实现：**
- `primaryLight`: 主色色相 + 15°，饱和度 -10%
- `primaryDark`: 主色色相 -10°，亮度 -15%
- `gradient`: 从 primaryLight 到 primary 的线性渐变

**理由：**
- 无需用户手动配置多个颜色
- 保持与预设主题一致的视觉风格

### 3. 数据结构设计

**决策：** 扩展 ThemeConfig 接口，添加 `isCustom` 标记

```typescript
interface ThemeConfig {
  name: string
  primary: string
  primaryLight: string
  primaryDark: string
  gradient: string
  isCustom?: boolean  // 标记是否为自定义主题
}
```

**理由：**
- 保持与现有接口兼容
- 便于 UI 区分显示预设和自定义主题

### 4. 存储策略

**决策：** 在现有 localStorage key 基础上扩展

```typescript
// 保持现有主题 key
localStorage.setItem('vue-todo-theme', themeId)
// 新增自定义颜色 key
localStorage.setItem('vue-todo-theme-custom', customColorHex)
```

**理由：**
- 向后兼容，不影响现有用户
- 自定义颜色独立存储，逻辑清晰

## Risks / Trade-offs

### [风险] 渐变色生成效果不如预设主题

**缓解：**
- 预设主题使用设计师精心调配的渐变色
- 自定义颜色生成的渐变色作为"最佳努力"方案
- 在 UI 上提示用户"预设主题效果更佳"

### [风险] 颜色选择器在小屏幕上体验不佳

**缓解：**
- 响应式设计，移动端调整布局
- 支持点击输入框直接输入 HEX 颜色值

### [Trade-off] 渐变色算法简单 vs 精准控制

选择简单算法，牺牲部分精准度换取用户体验的简洁性。如果用户反馈强烈，后续可以升级为更复杂的色彩引擎。
