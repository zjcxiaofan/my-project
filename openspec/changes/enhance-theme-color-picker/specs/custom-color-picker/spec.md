## ADDED Requirements

### Requirement: 用户可以选择自定义颜色

系统 SHALL 提供一个颜色选择器，允许用户从整个色域中选择任意颜色作为主题色。

#### Scenario: 用户通过色相滑块选择颜色
- **WHEN** 用户在色相滑块上点击或拖动
- **THEN** 系统实时更新预览颜色

#### Scenario: 用户通过饱和度面板选择颜色
- **WHEN** 用户在饱和度面板上点击或拖动
- **THEN** 系统实时更新预览颜色的饱和度和亮度

#### Scenario: 用户输入 HEX 颜色值
- **WHEN** 用户在颜色输入框中输入有效的 HEX 颜色代码（如 #ff5733）
- **THEN** 系统解析该颜色并更新预览

### Requirement: 系统自动生成配色方案

系统 SHALL 根据用户选择的主色自动生成配套的浅深色和渐变色。

#### Scenario: 生成主色的浅色变体
- **WHEN** 用户选择了一个主色
- **THEN** 系统生成 primaryLight 颜色（色相 +15°，饱和度 -10%）

#### Scenario: 生成主色的深色变体
- **WHEN** 用户选择了一个主色
- **THEN** 系统生成 primaryDark 颜色（色相 -10°，亮度 -15%）

#### Scenario: 生成渐变色配置
- **WHEN** 用户确认选择颜色
- **THEN** 系统生成从 primaryLight 到 primary 的线性渐变配置

### Requirement: 颜色选择器预览功能

系统 SHALL 实时预览用户选择的颜色效果。

#### Scenario: 实时预览主题色
- **WHEN** 用户在颜色选择器中调整颜色
- **THEN** 主题面板实时显示当前选中颜色的预览块

#### Scenario: 显示当前主题应用效果
- **WHEN** 用户打开主题面板
- **THEN** 显示当前主题色在应用中的实际效果示例
