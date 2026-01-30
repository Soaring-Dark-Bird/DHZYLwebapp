# Research: 技术选型调研

**Feature**: 大荒斩妖录 Web 应用
**Date**: 2025-01-30
**Phase**: Phase 0 - Research & Framework Selection

## 决策记录

### 决策 1: 前端框架

**选项**: Vanilla JS vs React vs Vue vs Svelte

| 框架 | 优势 | 劣势 | 适用场景 |
|------|------|------|----------|
| Vanilla JS | 零依赖、加载快、完全控制 | 无组件化、手���管理DOM | 小型简单项目 |
| React | 生态丰富、组件化 | 打包体积大、学习曲线 | 复杂交互应用 |
| Vue | 渐进式、易上手 | 模板语法 | 中小型项目 |
| Svelte | 编译时优化、体积小 | 生态较小 | 轻量级应用 |

**决策**: **Vanilla JS**
**理由**:
- 本项目为单页简单游戏，无复杂状态管理需求
- 避免框架打包开销，符合<3秒加载目标
- 游戏状态简单（刀具等级、材料库存、当前界面）
- 可直接在浏览器中运行，无需构建步骤

**备选方案**: 如后续需要更复杂UI，可迁移到 Preact（React轻量版）

---

### 决策 2: 构建工具

**选项**: 无构建 vs Vite vs Webpack vs esbuild

| 工具 | 优势 | 劣势 | 开发体验 |
|------|------|------|----------|
| 无构建 | 最简单、零配置 | 无模块化、无热更新 | 小型原型 |
| Vite | 极快HMR、现代、易用 | 相对较新 | ⭐⭐⭐⭐⭐ |
| Webpack | 功能强大、生态成熟 | 配置复杂、慢 | ⭐⭐⭐ |
| esbuild | 极速编译 | 功能较少 | ⭐⭐⭐⭐ |

**决策**: **Vite**
**理由**:
- 极快的开发服务器启动和HMR
- 原生ES模块支持，开发时无需打包
- 生产环境使用Rollup优化打包
- 与Vitest测试框架无缝集成
- 符合现代前端开发最佳实践

**配置方案**:
```javascript
// vite.config.js
export default {
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  },
  server: {
    port: 3000,
    open: true
  }
}
```

---

### 决策 3: CSS方案

**选项**: 纯CSS vs Tailwind CSS vs CSS-in-JS vs Styled Components

| 方案 | 优势 | 劣势 | 适用场景 |
|------|------|------|----------|
| 纯CSS | 零依赖、浏览器原生 | 无变量（现代CSS有） | 简单项目 |
| Tailwind | 原子类、快速开发 | 打包体积大 | 中大型项目 |
| CSS-in-JS | 动态样式 | 运行时开销 | React应用 |
| Styled Components | 组件化 | 学习曲线 | React应用 |

**决策**: **纯CSS + CSS变量**
**理由**:
- 本项目UI相对简单（地图、战斗界面、设置）
- 使用CSS变量实现主题切换（太虚荒凉风格）
- 动画通过CSS @keyframes实现
- 避免Tailwind额外依赖（几百KB）
- 符合性能目标（60 FPS）

**CSS变量示例**:
```css
:root {
  --color-bg: #0a0a0f;
  --color-border: #3a3a4a;
  --color-accent: #c41e3a;
  --color-text: #e0e0e0;
  --font-main: 'Noto Serif SC', serif;
}
```

---

### 决策 4: 测试框架

**选项**: Vitest vs Jest vs Mocha vs Jasmine

| 框架 | 优势 | 劣势 | TDD支持 |
|------|------|------|---------|
| Vitest | 与Vite集成、快、API类似Jest | 相对较新 | ⭐⭐⭐⭐⭐ |
| Jest | 成熟、生态好 | 配置复杂、慢 | ⭐⭐⭐⭐ |
| Mocha | 灵活、轻量 | 需要额外配置断言库 | ⭐⭐⭐ |
| Jasmine | 零依赖 | 功能较少 | ⭐⭐⭐ |

**决策**: **Vitest**
**理由**:
- 与Vite构建工具完美集成
- 共享相同配置（vite.config.js）
- 极快的测试执行（模拟游戏战斗）
- Jest兼容API，易于上手
- 内置代码覆盖率
- 支持Watch模式（TDD必备）

**测试策略**:
- 单元测试: 游戏逻辑（BattleSystem, UpgradeSystem）
- 集成测试: 游戏流程（战斗→掉落→升级）
- 契约测试: JSON schema验证

---

### 决策 5: 状态管理

**选项**: 简单对象 vs Zustand vs Redux vs Pinia

| 方案 | 优势 | 劣势 | 适用场景 |
|------|------|------|----------|
| 简单对象 | 零依赖、简单 | 无时间旅行 | 小型状态 |
| Zustand | 轻量、API简洁 | React生态为主 | React应用 |
| Redux | 成熟、中间件 | 样板代码多 | 复杂应用 |
| Pinia | Vue官方 | Vue专用 | Vue应用 |

**决策**: **简单对象 + localStorage持久化**
**理由**:
- 游戏状态非常简单（刀等级、材料库存、设置）
- 无需时间旅行调试
- localStorage自动同步
- 零依赖

**状态结构**:
```javascript
const gameState = {
  blade: { level: 10, name: '山铁樵刀', image: '...' },
  inventory: { '10级山���': 3, '9级精铁': 2 },
  settings: { sound: true, oneHitKill: false },
  currentRegion: 'south',
  version: '1.0.0'
}
```

---

## 技术栈总结

### 最终选择

| 类别 | 技术 | 版本 |
|------|------|------|
| 运行环境 | 现代浏览器 | Chrome 90+ |
| 语言 | JavaScript | ES2022+ |
| 框架 | Vanilla JS | - |
| 构建工具 | Vite | 5.x |
| CSS | 纯CSS + CSS变量 | CSS3 |
| 测试框架 | Vitest | 1.x |
| 状态管理 | 简单对象 + localStorage | - |
| 存储 | localStorage | - |

### 项目依赖（package.json）

```json
{
  "name": "dahuang-zanyaolu",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "vitest": "^1.0.0",
    "@vitest/ui": "^1.0.0"
  }
}
```

### 备选方案（如需要）

如果项目复杂度增加，可迁移到：
- Preact: React的3KB轻量替代
- Zustand: 轻量状态管理（~1KB）
- Tailwind CSS: 原子化CSS（生产环境用JIT模式）

---

## Phase 0 结论

**状态**: ✅ 完成

所有技术选型已完成，推荐方案符合：
- Constitution原则（数据驱动、渐进增强）
- 性能目标（60 FPS、<3秒加载）
- 项目约束（单页、无后端、快速开发）

**下一步**: Phase 1 - 数据模型设计
