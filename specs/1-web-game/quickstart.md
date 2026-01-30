# Quickstart: 大荒斩妖录

**Feature**: 大荒斩妖录 Web 应用
**Date**: 2025-01-30
**Phase**: Phase 1 - Quickstart Guide

## 项目启动

### 前置要求

- Node.js 18+
- npm 或 pnpm
- 现代浏览器（Chrome 90+, Firefox 88+, Safari 14+, Edge 90+）

### 安装步骤

```bash
# 1. 进入项目目录
cd E:/dahuangzhanyaolu

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 浏览器打开 http://localhost:3000
```

### 构建

```bash
# 生产环境构建
npm run build

# 预览构建结果
npm run preview
```

---

## 快速开发指南

### 项目结构

```
E:/dahuangzhanyaolu/
├── index.html              # 入口HTML
├── assets/                 # 静态资源
│   ├── data/              # 游戏数据（JSON）
│   │   ├── blades.json
│   │   ├── monsters.json
│   │   ├── materials.json
│   │   ├── regions.json
│   │   └── recipes.json
│   ├── images/            # 图片
│   │   ├── knives/        # 刀具图片
│   │   ├── monsters/      # 怪物图片
│   │   ├── maps/          # 地图背景
│   │   ├── items/         # 材料图片
│   │   └── ui/            # UI图标
│   └── sounds/            # 音效
│       ├── hit/           # 击中音效
│       └── damage/        # 反伤音效
├── src/                   # 源代码
│   ├── core/              # 核心逻辑
│   ├── ui/                # UI组件
│   ├── utils/             # 工具函数
│   └── main.js            # 入口
├── tests/                 # 测试
├── styles/                # 样式
└── vite.config.js         # Vite配置
```

---

## 核心游戏流程

### 1. 开场 → 地图

```javascript
// 用户首次访问
1. 播放开场动画（5-8秒，可跳过）
2. 进入五方地图主界面
3. 显示5个区域（东、西、南、北、中）
```

### 2. 选择区域 → 怪物列表

```javascript
// 用户点击区域
1. 进入区域二级界面
2. 显示该区域的怪物列表
3. 显示问号按钮（查看掉落信息）
```

### 3. 点击怪物 → 战斗/秒杀

```javascript
// 根据等级压制规则
if (bladeLevel < monsterLevel) {
  // 秒杀：直接获得材料
  showInstantKillEffect();
  addMaterialsToInventory();
} else if (bladeLevel === monsterLevel) {
  // 进入战斗
  enterBattle();
  // 显示刀意值（血条）
  // 玩家点击攻击，怪物反伤
} else {
  // 溃败：刀意值迅速归零
  showDefeat();
}
```

### 4. 收集材料 → 升级

```javascript
// 检查材料是否足够
if (hasMaterialsForUpgrade(currentBlade)) {
  showUpgradeButton();
}

// 点击升级
upgradeBlade();
// 播放升级特效
// 更新刀具图片
```

---

## 游戏数据配置

### 添加新怪物

```json
// assets/data/monsters.json
{
  "id": "monster-9-3",
  "level": 9,
  "name": "瞿如",
  "description": "《山海经》...",
  "image": "assets/images/monsters/monster-9-3.png",
  "region": "south",
  "hp": 100,
  "attackPower": 5,
  "drops": [
    { "materialId": "mat-9-5", "quantity": [1, 2] }
  ]
}
```

### 添加新材料

```json
// assets/data/materials.json
{
  "id": "mat-9-5",
  "level": 9,
  "name": "瞿如羽毛",
  "description": "瞿如的羽毛",
  "image": "assets/images/items/mat-9-5.png",
  "type": "drop",
  "usedFor": ["blade-8"]
}
```

### 修改升级配方

```json
// assets/data/recipes.json
{
  "from": "blade-9",
  "to": "blade-8",
  "materials": [
    { "materialId": "mat-9-2", "quantity": 3 },
    { "materialId": "mat-8-1", "quantity": 2 }
  ]
}
```

---

## 核心组件API

### GameState 状态管理

```javascript
import { GameState } from './src/core/GameState.js';

// 获取当前状态
const state = GameState.getState();

// 更新状态
GameState.update({
  currentBlade: { id: 'blade-9', level: 9 }
});

// 保存到localStorage
GameState.save();

// 从localStorage加载
GameState.load();
```

### BattleSystem 战斗系统

```javascript
import { BattleSystem } from './src/core/BattleSystem.js';

// 开始战斗
BattleSystem.startBattle(monster);

// 玩家攻击
BattleSystem.playerAttack();

// 怪物反伤
BattleSystem.monsterCounterAttack();

// 检查战斗结果
const result = BattleSystem.checkBattleResult();
// { winner: 'player' | 'monster' | 'none' }
```

### UpgradeSystem 升级系统

```javascript
import { UpgradeSystem } from './src/core/UpgradeSystem.js';

// 检查是否可升级
const canUpgrade = UpgradeSystem.canUpgrade('blade-10');

// 获取升级所需材料
const required = UpgradeSystem.getRequiredMaterials('blade-10');

// 执行升级
UpgradeSystem.upgrade('blade-10');
```

---

## 调试技巧

### 开发者工具

```javascript
// 浏览器控制台
localStorage.getItem('dahuang-save');  // 查看存档
localStorage.removeItem('dahuang-save'); // 清除存档

// 查看游戏状态
console.log(GameState.getState());

// 直接修改状态（测试用）
GameState.update({
  inventory: { 'mat-10-1': 999 }
});
```

### 快速测试

```javascript
// 一键升级所有刀具
GameState.unlockedBlades = ['blade-10', 'blade-9', 'blade-8'];

// 添加所有材料
Object.keys(materials).forEach(id => {
  GameState.inventory[id] = 999;
});

// 开启一键秒杀
GameState.update({
  settings: { ...GameState.getState().settings, oneHitKill: true }
});
```

---

## 测试

### 运行测试

```bash
# 运行所有测试
npm test

# 监听模式（TDD）
npm test -- --watch

# 测试UI
npm run test:ui

# 覆盖率报告
npm run test:coverage
```

### 测试文件示例

```javascript
// tests/unit/BattleSystem.test.js
import { describe, it, expect } from 'vitest';
import { BattleSystem } from '../../src/core/BattleSystem.js';

describe('BattleSystem', () => {
  it('should calculate instant kill when blade level < monster level', () => {
    const result = BattleSystem.calculateOutcome(10, 7);
    expect(result.type).toBe('instant_kill');
  });

  it('should enter battle when blade level === monster level', () => {
    const result = BattleSystem.calculateOutcome(10, 10);
    expect(result.type).toBe('battle');
  });
});
```

---

## 常见问题

### Q: 图片加载失败？

**A**: 检查图片路径是否正确，确保 `assets/images/` 目录下有对应文件。

### Q: 存档丢失？

**A**: 检查浏览器是否支持 localStorage，清除浏览器缓存可能导致存档丢失。

### Q: 音效不播放？

**A**: 检查浏览器自动播放策略，用户需要先与页面交互才能播放音频。

### Q: 性能问题？

**A**: 使用浏览器开发者工具检查Performance标签，优化动画和渲染。

---

## Phase 1 结论

**状态**: ✅ 完成

快速开始指南已创建，包含：
- ✅ 安装和启动步骤
- ✅ 核心游戏流程说明
- ✅ 数据配置示例
- ✅ 核心组件API
- ✅ 调试技巧
- ✅ 测试指南

**下一步**: Phase 2 - 创建任务列表 (`/speckit.tasks`)
