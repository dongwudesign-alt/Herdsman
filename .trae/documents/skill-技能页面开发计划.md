# skill.html 技能面板页面开发计划

## 概要

依据 `功能文档/技能面板功能清单.md` 开发技能页面 `skill.html`（纯 HTML/CSS/JS 单文件、零构建、无图片），并打通导航入口。UI 风格以设置页 API 子页面组件体系为基准，左侧导航一比一复刻 index，右侧主体参照记忆页 route-view / ms-main 结构。

**交付物**：1 个新文件（`skill.html`）+ 2 处导航链接修改（`index.html`、`memory.html`）。

## 现状分析

- `index.html` 3026 行：`btnSkill` 是 `<button>` 死按钮，无跳转；`btnNewChat`（3030 行）同理。
- `memory.html` 1443 行：`btnSkill` 同样是死按钮；其 `sidebar-wrapper` / `route-view` / `ms-main` 结构可直接作为本页骨架。
- `setting.html` API 子页面（1732-1819 行）提供完整组件体系：`setting-section` / `setting-section-label` / `setting-row` / `toggle-switch` / `segment-group` / `segment-btn` / `port-stepper`。
- 设计 token（所有页面 `:root` 一致）：`--bg:#060606`、`--panel:rgba(255,255,255,0.025)`、`--glass`、`--border` 等；主卡片 `ms-main` 背景 `rgba(30,30,34,0.55)` + `backdrop-filter: blur(40px) saturate(140%)`、边框 `rgba(255,255,255,0.18)`、圆角 16px，带渐变描边 `::before` 与内部光晕 `::after`。
- 功能清单已通读：Skill 策略（2 个开关）、我的技能（搜索/分类/导入/筛选/刷新/用户目录/Runtime 栏/技能卡片）、技能广场（搜索/SkillHub 链接/分类/排序/安装）。

## 变更方案

### 1. 新增 `skill.html`（核心交付，单文件含全部 HTML/CSS/JS）

**页面骨架**（自上而下）：

1. **左侧导航（1:1 复刻 index/memory）**
   - 主侧栏 `sidebar`：首页/工作台/模型管理/路由策略 + 底部设置；logo 用内联 SVG 星形图标替代 `images/logo.png`（禁图约束）。
   - 次侧栏 `secondary-sidebar`：顶部「工作」+ 收起按钮（回 index）；列表：记忆（链接 memory.html）/ 技能（active，链接本页）/ 新对话（链接 index.html）+ 分隔符 +「历史对话」标题 + 8-10 条 `.sec-item`（含 hover 更多菜单、置顶/删除），复制 memory.html 文案结构。

2. **右侧主体 `ms-main`**
   - 头部：标题「技能」+ 关闭按钮（回 index.html）。
   - **Skill 策略卡片**：`setting-section` 内两行 `setting-row`，各配 `.toggle-switch`（默认 on）：启用 Skill 系统、监听本地 Skill 文件变化。
   - **子页签**：`.segment-group`（我的技能 / 技能广场），切换两个视图容器。
   - **我的技能视图**（`.skill-panel-section`，flex:1 撑满）：
     - 工具栏行：分类标签（全部/自定义/内置/SkillHub，`.scope-btn` 互斥）+ 搜索框（`.filter-search`）+ 导入下拉（从文件夹导入/从 ZIP 导入，`.filter-dropdown`）+ 来源下拉（全部来源/User/Workspace/Bundled）+ 依赖下拉（全部依赖状态/可用/需要设置）+ 有效性下拉（全部/生效/停用）+ 刷新按钮（`.add-btn`）。
     - 用户目录行：路径（等宽字体）+「复制路径」按钮。
     - Runtime 运行时栏：uv/node/pnpm/git/ffmpeg 五个芯片（`.sk-run-chip`，含版本号）+「刷新」。
     - 技能卡片网格 `#localGrid`：名称、来源章（user/workspace/bundled/hub/custom 变体）、简介（2 行截断）、启停开关（`.toggle-switch` 矮版）、更多菜单（详情/停用/卸载/复制名）；空态 `.sk-empty`。
   - **技能广场视图**：
     - 工具栏：搜索框 + SkillHub 官网外链（`#60a5fa` 蓝）。
     - 分类标签（全部/Pay Skill/办公效率/内容创作/开发编程/数据分析/设计多媒体/AI Agent）+ 排序分段（综合/下载最多/最新）。
     - 卡片网格 `#marketGrid`：名称、版本章、评分（★ 金）、下载量、标签、简介、安装按钮（安装后变「已安装」绿色禁用态）。

3. **通用确认弹窗 + toast**：`modal-overlay` / `modal-box`（沿用 setting.html 样式）+ `.sk-toast` 轻提示（底部居中、2s 自动消失），用于导入/安装/卸载确认与操作反馈。

**CSS 策略**：直接内联复制既有类（app-window、sidebar 系、sec 系、route-view、ms-main 系、setting-section/row、toggle-switch、segment-group、filter-bar/scope-btn/filter-search/filter-dropdown、modal 系、add-btn、noise），新增 `sk-` 前缀专用类（sk-tabbar、skill-panel-section、sk-toolbar-row、sk-runbar、sk-run-chip、sk-grid-wrap、sk-grid、sk-card、sk-card-icon、sk-card-source、sk-card-desc、sk-card-footer、sk-toggle-sm、sk-more-btn、sk-card-menu、sk-meta-row、sk-tags/sk-tag、sk-install-btn、sk-hub-link、sk-empty、sk-toast、sk-modal-actions、sk-btn-primary/ghost）。网格 `repeat(auto-fill, minmax(260px, 1fr))`，网格容器 `overflow-y:auto`（内容多时内部滚动）。

**JS 交互清单**（内联 `<script>`，数据驱动渲染 + 事件委托）：

| 交互 | 实现 |
|---|---|
| 侧栏收起/关闭按钮 | 回 index.html |
| 历史对话更多菜单 | 复用 sec-menu 开合/外部点击关闭/置顶/删除 |
| 策略开关 | `[data-switch]` click 切换 `.on` |
| 子页签切换 | segment-btn 互斥 active + 视图 display 切换 |
| 分类/筛选/搜索 | 状态互斥 → 调用 `renderLocal()` / `renderMarket()` |
| 导入技能 | 确认弹窗 → toast → 插入一条 mock 技能 |
| 刷新技能列表 | 按钮 loading 态 → 重绘 + toast |
| 复制路径 | `navigator.clipboard.writeText` + toast |
| Runtime 刷新 | 芯片 loading 态「检测中」→ 恢复 + toast |
| 卡片启停 | toggle 切换 + 卡片 `.off` 变暗 |
| 卡片更多菜单 | 详情弹窗 / 停用 / 卸载确认删除 / 复制名 |
| 广场排序 | downloads 降序 / version 最新 |
| 安装 | 确认弹窗 → `.installed` 态 + 下载量 +1 + toast |
| toast 通用 | `showToast(msg)` |

**Mock 数据**（字段即未来接口契约）：`SKILLS_LOCAL`（8-10 条，覆盖 3 来源 × 4 分类 × 2 依赖态 × 2 有效态）、`SKILLS_MARKET`（10-12 条，覆盖 8 分类）、`RUNTIME`（uv 0.5.21 / node v22.14.0 / pnpm 9.15.4 / git 2.47.1 / ffmpeg 7.0.2）、`USER_SKILL_DIR`。

### 2. 修改 `index.html`（1 行）

3026 行：`<button class="sec-action" id="btnSkill">...</button>` → `<a class="sec-action" href="skill.html" id="btnSkill">...</a>`（内部 SVG 与「技能」文本不变，与 `btnMemory` 写法对齐）。

### 3. 修改 `memory.html`（1 行）

1443 行：`btnSkill` 同样改为 `<a class="sec-action" href="skill.html" id="btnSkill">`，保持导航一致。

### 4. 可选（建议一并做）

`index.html` 3030 行 `btnNewChat` 改为 `<a class="sec-action" href="index.html" id="btnNewChat">`，与 memory.html 一致，消除死按钮。

## 假设与决策

- 单文件内联：与 memory/setting 一致，file:// 直开可用，无外部 CSS/JS。
- 无后端：交互全部前端模拟，数据写死在 JS 数组，后续接真实后端只需替换数据源。
- 禁图：主侧栏 logo 用内联 SVG 替代 `images/logo.png`；全部图标内联 SVG；噪点层沿用现有 data-URI（属 CSS 纹理，非图片文件）。
- 不动 index/memory 的 JS：grep 已确认 btnSkill/btnNewChat 无事件绑定，改链接无副作用。
- 风格统一优先：完全沿用现有玻璃拟态 tokens，不引入颠覆性新视觉；功能密度严格对照清单，避免加戏。

## 验证步骤

1. 导航回归：index.html、memory.html 的技能按钮均可跳转 skill.html；skill.html 内「记忆」→ memory.html、「新对话」/收起按钮/右上 X → index.html。
2. 视觉一致性：左侧导航与 index 1:1（68px 主栏 + 次栏、active 白条高亮）；主体为玻璃卡片质感；grep 确认无 `<img`、无外部图片 `url()`（仅允许 data:URI 噪点）。
3. 功能走查（仅文字/控制台方式，不截图）：两策略开关、子页签、分类互斥、搜索过滤、导入确认+插入、三筛选叠加、刷新、复制、Runtime 刷新、卡片启停、更多菜单（详情/停用/卸载）、排序（下载最多=降序）、安装（二次确认→已安装态）。
4. 边界：搜索无结果显示空态；窗口缩放工具栏换行、网格列数自适应；浏览器控制台零报错。
5. 通过本地静态服务 `http://127.0.0.1:8000/skill.html` 打开验证（沿用已启动的 8000 服务）。