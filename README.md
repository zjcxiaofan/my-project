# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此代码仓库中工作提供指导。

## 命令

```bash
npm run dev      # 启动开发服务器 (Vite)
npm run build    # 类型检查并构建
npm run preview  # 预览生产构建
```

## 架构

**技术栈**: Vue 3 + TypeScript + Vite + Pinia + Element Plus

**目录结构**:
- `src/main.ts` - 应用入口，注册 Pinia 和 Element Plus
- `src/App.vue` - 主组件，包含待办事项 UI
- `src/components/TodoItem.vue` - 单个待办事项组件
- `src/stores/todoStore.ts` - Pinia store，管理待办状态并持久化到 localStorage
- `src/types/todo.ts` - TypeScript 类型定义 (`Todo`, `FilterType`)
- `src/style.scss` - 全局样式和 Element Plus 样式覆盖
- `vite.config.ts` - 配置 Element Plus 组件自动导入

**状态管理**: Pinia store (`useTodoStore`) 负责:
- 待办事项 CRUD 操作 (添加、切换完成状态、删除、清空已完成)
- 筛选功能 (全部/进行中/已完成)
- 通过 watcher 自动持久化到 localStorage

**UI**: 使用 Element Plus 组件，自定义紫色渐变主题 (#667eea → #764ba2)，毛玻璃效果和流畅动画。

## 代码规范

- **代码风格指南**: 参见 [`CODE_STYLE_GUIDE.md`](./CODE_STYLE_GUIDE.md)
- **代码审查**: 使用 `/skill code-review` 命令进行代码审核

### 使用 code-review agent

```bash
# 审查特定文件
/skill code-review src/components/MyComponent.vue

# 审查所有更改后提交
/skill code-review
```

审查维度：
- 命名规范（文件、变量、组件）
- TypeScript 类型安全
- Vue 组件结构顺序
- 代码组织（导入顺序、Store 结构）
- 样式规范（SCSS、类名）
- 最佳实践（ref/computed、key 使用）

## 提交规范

### Commit Message 格式

```
<类型>: <描述>

[可选的正文]

[可选的脚注]
```

### 类型说明

| 类型 | 说明 |
|------|------|
| `feat` | 新增功能 |
| `fix` | 修复 bug |
| `docs` | 文档更新 |
| `style` | 代码格式调整（不影响代码运行） |
| `refactor` | 重构（既不是新增功能也不是 bug 修复） |
| `perf` | 性能优化 |
| `test` | 添加或修改测试 |
| `chore` | 构建工具、依赖管理、配置文件等变更 |
| `ci` | CI/CD 配置变更 |
| `revert` | 回滚提交 |

### 书写规则

1. **标题行**
   - 使用中文
   - 首字母无需大写
   - 不以句号结尾
   - 长度不超过 50 个字符
   - 使用祈使句风格，如"添加功能"而非"添加了功能"

2. **正文（可选）**
   - 详细描述改动内容和动机
   - 说明变更原因和预期效果
   - 每行不超过 72 个字符

3. **脚注（可选）**
   - 关联 Issue：`Closes #123` 或 `Refs #456`
   - 破坏性变更：`BREAKING CHANGE: 描述不兼容的变更`

### 示例

```
feat: 添加待办事项筛选功能

新增按状态筛选待办事项的功能
- 全部：显示所有待办
- 进行中：显示未完成的待办
- 已完成：显示已完成的待办

Closes #42
```

```
fix: 修复待办事项删除后状态异常

删除待办后未正确更新筛选状态，导致显示空白

Refs #58
```

```
refactor: 重构 TodoStore 状态管理逻辑

提取通用的状态处理方法，减少代码重复

BREAKING CHANGE: useTodoStore 的 filter 方法签名变更
```
