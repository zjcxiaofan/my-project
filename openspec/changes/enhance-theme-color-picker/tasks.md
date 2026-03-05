## 1. 颜色工具函数

- [x] 1.1 创建颜色转换工具函数（HEX 转 HSL）
- [x] 1.2 创建颜色转换工具函数（HSL 转 HEX）
- [x] 1.3 实现基于主色自动生成配色方案的函数（primaryLight、primaryDark、gradient）

## 2. 主题 Store 扩展

- [x] 2.1 扩展 ThemeConfig 接口，添加 isCustom 标记
- [x] 2.2 添加自定义主题状态（currentMode、currentCustomColor）
- [x] 2.3 实现自定义主题配置生成逻辑（getCustomThemeConfig）
- [x] 2.4 扩展 localStorage 读写逻辑，支持自定义颜色持久化
- [x] 2.5 暴露新的 store 方法（setCustomColor、resetToPreset）

## 3. 颜色选择器组件

- [x] 3.1 创建 ColorPicker.vue 组件基础结构
- [x] 3.2 实现色相滑块（Hue Slider）
- [x] 3.3 实现饱和度/亮度面板（Saturation/Lightness Panel）
- [x] 3.4 添加 HEX 颜色输入框
- [x] 3.5 添加颜色预览块
- [x] 3.6 实现颜色选择确认/取消操作

## 4. 主题面板重构

- [x] 4.1 在 ThemeSwitcher 中添加标签页状态管理
- [x] 4.2 实现标签页切换 UI 和交互
- [x] 4.3 在预设主题标签页显示预设主题列表
- [x] 4.4 在自定义标签页集成颜色选择器组件
- [x] 4.5 添加"重置回预设"功能按钮
- [x] 4.6 优化面板响应式布局

## 5. 集成与测试

- [x] 5.1 在 App.vue 中验证自定义主题应用效果
- [x] 5.2 测试主题切换的动画过渡效果
- [x] 5.3 测试 localStorage 持久化功能
- [x] 5.4 测试不同浏览器兼容性
- [x] 5.5 修复发现的主要问题
