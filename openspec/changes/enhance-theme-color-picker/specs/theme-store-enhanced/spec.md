## ADDED Requirements

### Requirement: 支持自定义主题色存储

系统 SHALL 支持将用户自定义的主题色保存到 localStorage，并在页面刷新后保持。

#### Scenario: 保存自定义主题色
- **WHEN** 用户通过颜色选择器选择了一个自定义颜色
- **THEN** 系统将自定义颜色的 HEX 值保存到 localStorage，key 为 'vue-todo-theme-custom'

#### Scenario: 加载自定义主题色
- **WHEN** 页面初始化时
- **THEN** 系统从 localStorage 读取自定义主题色（如果存在）并恢复到状态中

### Requirement: 主题状态管理扩展

主题 store SHALL 支持同时管理预设主题和自定义主题两种模式。

#### Scenario: 切换到自定义主题模式
- **WHEN** 用户选择自定义颜色
- **THEN** currentMode 设置为 'custom'，currentCustomColor 更新为用户选择的颜色

#### Scenario: 切换回预设主题
- **WHEN** 用户点击任意预设主题
- **THEN** currentMode 设置为 'preset'，currentTheme 更新为选中的预设主题

#### Scenario: 获取当前主题配置
- **WHEN** 组件访问 themeConfig
- **THEN** 根据 currentMode 返回预设主题配置或自定义颜色生成的配置

### Requirement: 自定义主题配置生成

系统 SHALL 根据自定义主色动态生成完整的主题配置对象。

#### Scenario: 生成自定义主题配置
- **WHEN** 用户设置了一个自定义颜色
- **THEN** 系统生成包含 name、primary、primaryLight、primaryDark、gradient 的完整配置对象

#### Scenario: 自定义主题标识
- **WHEN** 访问自定义主题的 name 属性
- **THEN** 显示 "自定义" 或 "Custom" 标识
