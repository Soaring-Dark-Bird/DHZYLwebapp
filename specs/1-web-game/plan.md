# Implementation Plan: 大荒斩妖录 Web 应用

**Branch**: `1-web-game` | **Date**: 2025-01-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/1-web-game/spec.md`

## Summary

一个基于《山海经》的点击式浏览器游戏，玩家扮演"刀"这一主角，通过击败怪物收集材料，从10级山铁樵刀逐步升级到8级庖丁解牛刀。核心玩法包括等级压制战斗、材料合成升级、五方地图探索和刀具图鉴收集。本版本实现3把刀的完整体验，游戏时长约5-10分钟。

## Technical Context

**Language/Version**: JavaScript (ES2022+) + HTML5 + CSS3
**Primary Dependencies**: NEEDS CLARIFICATION - 框架选择（纯HTML/Vanilla JS vs React vs Vue）
**Storage**: localStorage（游戏进度保存）
**Testing**: NEEDS CLARIFICATION - 测试框架选择（Vitest/Jest/Mocha）
**Target Platform**: 现代浏览器（Chrome 90+, Firefox 88+, Safari 14+, Edge 90+）
**Project Type**: single - 单页Web应用，无后端服务
**Performance Goals**: 60 FPS 游戏体验，<3秒首屏加载，点击反馈<100ms
**Constraints**: 纯前端运行，无网络依赖，浏览器本地存储
**Scale/Scope**: 单用户，3把刀，2个主区域（南部+中部），约10种怪物，约15种材料

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Player-First Design ✅
- 快速升级节奏（3-5只怪升级）
- 即时反馈（点击<100ms响应）
- 一键秒杀选项给不同玩家选择

### II. Test-First (NON-NEGOTIABLE) ⚠️ NEEDS CLARIFICATION
- 需要选择测试框架
- 需要定义测试策略（单元���试/集成测试）
- TDD工作流程待规划

### III. Data-Driven Architecture ✅
- 刀具数据：JSON配置（名称、等级、描述、图片路径）
- 怪物数据：JSON配置（等级、名称、区域、掉落材料）
- 材料数据：JSON配置（等级、名称、用途）
- 区域数据：JSON配置（名称、等级范围、怪物列表、采集物）

### IV. Progressive Enhancement ✅
- Phase 1: 核心战斗+升级（10级刀→9级刀）
- Phase 2: 扩展到8级刀
- Phase 3: 后续版本7-1级刀

### V. Observability & Debuggability ⚠️ NEEDS CLARIFICATION
- 需要定义调试工具
- 需要定义日志策略
- 需要定义性能监控

### Quality Standards Check

| 标准 | 状态 | 说明 |
|------|------|------|
| Performance | ✅ | 60 FPS目标，<3秒加载，<100ms响应 |
| Reliability | ✅ | localStorage保存，降级处理 |
| Security | N/A | 纯前端单用户，无安全需求 |

## Project Structure

### Documentation (this feature)

```text
specs/1-web-game/
├── plan.md              # This file
├── research.md          # Phase 0 output - 框架选型调研
├── data-model.md        # Phase 1 output - 数据模型定义
├── quickstart.md        # Phase 1 output - 快速开始指南
├── contracts/           # Phase 1 output - 数据契约（JSON schema）
└── tasks.md             # Phase 2 output - 任务列表
```

### Source Code (repository root)

```text
index.html              # 入口HTML文件
assets/                 # 静态资源
├── images/
│   ├── knives/         # 刀具图片（3把）
│   ├── monsters/       # 怪物图片
│   ├── maps/           # 地图背景（MAP.png）
│   ├── items/          # 材料/采集物图片
│   └── ui/             # UI图标（小剑、问号等）
├── sounds/             # 音效文件
│   ├── hit/            # 击中音效（不同等级刀）
│   └── damage/         # 反伤音效
└── data/               # 游戏数据（JSON）
    ├── blades.json     # 刀具配置
    ├── monsters.json   # 怪物配置
    ├── materials.json  # 材料配置
    └── regions.json    # 区域配置

src/
├── core/               # 核心游戏逻辑
│   ├── GameState.js    # 游戏状态管理
│   ├── BattleSystem.js # 战斗系统
│   ├── UpgradeSystem.js # 升级系统
│   └── SaveSystem.js   # 存档系统
├── ui/                 # UI组件
│   ├── IntroScreen.js  # 开场动画
│   ├── MapView.js      # 地图视图
│   ├── RegionView.js   # 区域视图
│   ├── BattleView.js   # 战斗视图
│   ├── BladeGallery.js # 刀具图鉴
│   └── SettingsPanel.js # 设置面板
├── utils/              # 工具函数
│   ├── audio.js        # 音效管理
│   ├── animation.js    # 动画效果
│   └── storage.js      # localStorage封装
└── main.js             # 主入口

tests/
├── unit/               # 单元测试
├── integration/        # 集成测试
└── contract/           # 契约测试（JSON schema验证）

styles/
├── main.css            # 主样式
├── animations.css      # 动画样式
└── themes.css          # 主题样式（太虚荒凉风格）
```

**Structure Decision**: 选择单项目Web应用结构（Option 1）。游戏为纯前端单页应用，无需后端服务，所有逻辑运行在浏览器中。数据驱动架构，游戏内容通过JSON配置文件管理，便于后续扩展更多刀具和区域。

## Complexity Tracking

> **无 Constitution 违规需要说明**

本设计完全遵循 Constitution 原则：
- Player-First: 快速反馈和可选的一键秒杀
- Test-First: Vitest + TDD 工作流
- Data-Driven: JSON配置驱动所有游戏内容
- Progressive Enhancement: 分阶段扩展刀具和区域
- Observability: 调试工具 + 日志系统

---

## Phase 0: Research & Framework Selection ✅ COMPLETE

参见 [research.md](./research.md)

**决策**:
- 框架: Vanilla JS
- 构建: Vite
- CSS: 纯CSS + CSS变量
- 测试: Vitest
- 状态: 简单对象 + localStorage

---

## Phase 1: Design & Contracts ✅ COMPLETE

参见以下文档:
- [data-model.md](./data-model.md) - 数据模型设计
- [quickstart.md](./quickstart.md) - 快速开始指南
- [contracts/data-contracts.md](./contracts/data-contracts.md) - 数据契约定义

**交付物**:
- ✅ 5个数据模型定义（刀具、怪物、材料、区域、配方）
- ✅ 游戏状态结构
- ✅ JSON Schema 契约
- ✅ 快速开始指南
- ✅ 项目结构定义

---

## 下一步: Phase 2 - Task Generation

运行 `/speckit.tasks` 生成任务列表

### 需要澄清的技术选型

1. **前端框架**: 纯HTML/Vanilla JS vs React vs Vue
2. **构建工具**: 无构建 vs Vite vs Webpack
3. **CSS方案**: 纯CSS vs Tailwind vs CSS-in-JS
4. **测试框架**: Vitest vs Jest vs Mocha
5. **状态管理**: 简单对象 vs Zustand vs Redux

### 推荐方案（基于项目特点）

| 选型 | 推荐 | 理由 |
|------|------|------|
| 前端框架 | **Vanilla JS** | 单页简单游戏，无需框架复杂度 |
| 构建工具 | **Vite** | 快速开发，现代开发体验 |
| CSS方案 | **纯CSS + CSS变量** | 简单动画，无需额外依赖 |
| 测试框架 | **Vitest** | 与Vite集成，TDD友好 |
| 状态管理 | **简单对象+localStorage** | 游戏状态简单，无需复杂状态机 |

**最终决策等待用户确认**
