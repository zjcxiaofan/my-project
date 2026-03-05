## Why

当前主题切换功能仅支持 6 种预设主题色，用户无法自定义主题颜色。为了提供更个性化的用户体验，需要添加自定义调色板功能，让用户可以自行选择任意颜色作为主题色。

## What Changes

- 新增自定义颜色选择器组件，支持色相/饱和度/亮度调节
- 支持预设主题色与自定义颜色的混合使用
- 自定义主题色保存到 localStorage，支持持久化
- 主题切换面板 UI 重构，分设"预设主题"和"自定义"两个标签页
- 支持一键重置回预设主题

## Capabilities

### New Capabilities
- `custom-color-picker`: 自定义颜色选择器组件，支持 HSL/RGB 颜色模式、色相滑块、饱和度面板、亮度调节
- `theme-store-enhanced`: 扩展主题 store，支持自定义主题色的存储和管理
- `theme-panel-tabs`: 主题面板标签页切换功能，分离预设主题和自定义主题

### Modified Capabilities
- (无)

## Impact

- 修改 `ThemeSwitcher.vue` 组件，增加标签页和自定义颜色选择器
- 扩展 `themeStore.ts`，添加自定义主题色状态和管理方法
- 可能需要新增颜色工具函数（RGB/HSL 转换、颜色混合等）
- 自定义主题色存储在 localStorage，与现有主题设置共存
