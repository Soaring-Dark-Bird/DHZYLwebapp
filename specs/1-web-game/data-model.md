# Data Model: 大荒斩妖录

**Feature**: 大荒斩妖录 Web 应用
**Date**: 2025-01-30
**Phase**: Phase 1 - Data Model Design

## 概述

本文档定义游戏的核心数据结构，包括刀具、怪物、材料、区域等实体。所有数据以JSON格式存储在 `assets/data/` 目录下，支持热更新和版本扩展。

---

## 1. 刀具 (Blade)

### 数据结构

```typescript
interface Blade {
  id: string;           // 唯一标识: "blade-10", "blade-9", "blade-8"
  level: number;        // 等级: 10-8（本版本）
  name: string;         // 名称: "山铁樵刀"
  description: string;  // 描述
  image: string;        // 图片路径: "assets/images/knives/knife-10.png"
  unlocked: boolean;    // 是否解锁（运行时状态）
  attackPower: number;  // 攻击力（用于计算）
}
```

### 数据文件: `assets/data/blades.json`

```json
{
  "blades": [
    {
      "id": "blade-10",
      "level": 10,
      "name": "山铁樵刀",
      "description": "凡器，无灵无韵。刀形短直，木柄缠粗麻绳。",
      "image": "assets/images/knives/knife-10.png",
      "attackPower": 10
    },
    {
      "id": "blade-9",
      "level": 9,
      "name": "青骨短刀",
      "description": "镶青兕之骨，具百兽之气。刀形窄细微弯，苍青色骨柄。",
      "image": "assets/images/knives/knife-9.png",
      "attackPower": 20
    },
    {
      "id": "blade-8",
      "level": 8,
      "name": "庖丁解牛刀",
      "description": "缠灵犀藤，刃薄如翼。长一尺五，深褐色藤柄。",
      "image": "assets/images/knives/knife-8.png",
      "attackPower": 35
    }
  ]
}
```

---

## 2. 怪物 (Monster)

### 数据结构

```typescript
interface Monster {
  id: string;           // 唯一标识: "monster-10-1"
  level: number;        // 等级: 10-8
  name: string;         // 名称: "狌狌"
  description: string;  // 描述（来自《山海经》）
  image: string;        // 图片路径
  region: string;       // 所属区域: "south", "central"
  hp: number;           // 血量（战斗用）
  attackPower: number;  // 攻击力（反伤用）
  drops: MaterialDrop[]; // 掉落材料
}
```

### 数据文件: `assets/data/monsters.json`

```json
{
  "monsters": [
    {
      "id": "monster-10-1",
      "level": 10,
      "name": "狌狌",
      "description": "《南山经·招摇山》：状如禺而白耳，伏行人走",
      "image": "assets/images/monsters/monster-10-1.png",
      "region": "south",
      "hp": 100,
      "attackPower": 5,
      "drops": [
        { "materialId": "mat-10-1", "quantity": [1, 2] },
        { "materialId": "mat-10-2", "quantity": [1, 1] }
      ]
    },
    {
      "id": "monster-9-1",
      "level": 9,
      "name": "鹿蜀",
      "description": "《南山经·杻阳山》：状如马而白首，其文如虎而赤尾",
      "image": "assets/images/monsters/monster-9-1.png",
      "region": "south",
      "hp": 100,
      "attackPower": 5,
      "drops": [
        { "materialId": "mat-9-1", "quantity": [1, 2] },
        { "materialId": "mat-9-2", "quantity": [1, 1] }
      ]
    },
    {
      "id": "monster-9-2",
      "level": 9,
      "name": "青兕",
      "description": "《南山经·祷过山》：其状如牛，苍黑，一角",
      "image": "assets/images/monsters/monster-9-2.png",
      "region": "south",
      "hp": 100,
      "attackPower": 5,
      "drops": [
        { "materialId": "mat-9-3", "quantity": [1, 1] },
        { "materialId": "mat-9-4", "quantity": [1, 2] }
      ]
    },
    {
      "id": "monster-8-1",
      "level": 8,
      "name": "朏朏",
      "description": "《中山经·霍山》：其状如狸，白尾，有鬣",
      "image": "assets/images/monsters/monster-8-1.png",
      "region": "central",
      "hp": 100,
      "attackPower": 5,
      "drops": [
        { "materialId": "mat-8-1", "quantity": [1, 2] },
        { "materialId": "mat-8-2", "quantity": [1, 1] }
      ]
    },
    {
      "id": "monster-8-2",
      "level": 8,
      "name": "蠪蚳",
      "description": "《中山经·昆吾山》：其状如彘而有角",
      "image": "assets/images/monsters/monster-8-2.png",
      "region": "central",
      "hp": 100,
      "attackPower": 5,
      "drops": [
        { "materialId": "mat-8-3", "quantity": [1, 1] },
        { "materialId": "mat-8-4", "quantity": [1, 2] }
      ]
    }
  ]
}
```

---

## 3. 材料 (Material)

### 数据结构

```typescript
interface Material {
  id: string;           // 唯一标识: "mat-10-1"
  level: number;        // 等级: 10-8
  name: string;         // 名称: "山铁碎片"
  description: string;  // 描述
  image: string;        // 图片路径（可选）
  type: string;         // 类型: "drop", "gather"
  usedFor: string[];    // 用途: ["blade-9"]表示用于升级9级刀
}
```

### 数据文件: `assets/data/materials.json`

```json
{
  "materials": [
    {
      "id": "mat-10-1",
      "level": 10,
      "name": "山铁碎片",
      "description": "山铁经山野铁匠粗锻而成的碎片",
      "image": "assets/images/items/mat-10-1.png",
      "type": "drop",
      "usedFor": ["blade-9"]
    },
    {
      "id": "mat-10-2",
      "level": 10,
      "name": "狌狌皮毛",
      "description": "狌狌的皮毛，可用于制作刀柄",
      "image": "assets/images/items/mat-10-2.png",
      "type": "drop",
      "usedFor": ["blade-9"]
    },
    {
      "id": "mat-9-1",
      "level": 9,
      "name": "桂木纤维",
      "description": "桂木的纤维，用于制作刀柄",
      "image": "assets/images/items/mat-9-1.png",
      "type": "drop",
      "usedFor": ["blade-9", "blade-8"]
    },
    {
      "id": "mat-9-2",
      "level": 9,
      "name": "鹿蜀尾毛",
      "description": "鹿蜀的尾毛，用于装饰",
      "image": "assets/images/items/mat-9-2.png",
      "type": "drop",
      "usedFor": ["blade-8"]
    },
    {
      "id": "mat-9-3",
      "level": 9,
      "name": "青兕骨",
      "description": "青兕的骨头，坚韧异常",
      "image": "assets/images/items/mat-9-3.png",
      "type": "drop",
      "usedFor": ["blade-9"]
    },
    {
      "id": "mat-9-4",
      "level": 9,
      "name": "精铁",
      "description": "精炼的铁，用于锻造刀身",
      "image": "assets/images/items/mat-9-4.png",
      "type": "drop",
      "usedFor": ["blade-9", "blade-8"]
    },
    {
      "id": "mat-8-1",
      "level": 8,
      "name": "灵犀藤种子",
      "description": "灵犀藤的种子，蕴含灵气",
      "image": "assets/images/items/mat-8-1.png",
      "type": "drop",
      "usedFor": ["blade-8"]
    },
    {
      "id": "mat-8-2",
      "level": 8,
      "name": "朏朏皮毛",
      "description": "朏朏的皮毛，柔软坚韧",
      "image": "assets/images/items/mat-8-2.png",
      "type": "drop",
      "usedFor": ["blade-8"]
    },
    {
      "id": "mat-8-3",
      "level": 8,
      "name": "蠪蚳之角",
      "description": "蠪蚳的角，坚硬锋利",
      "image": "assets/images/items/mat-8-3.png",
      "type": "drop",
      "usedFor": ["blade-8"]
    },
    {
      "id": "mat-8-4",
      "level": 8,
      "name": "赤铜矿石",
      "description": "赤铜的原矿石",
      "image": "assets/images/items/mat-8-4.png",
      "type": "drop",
      "usedFor": ["blade-8"]
    }
  ]
}
```

---

## 4. 区域 (Region)

### 数据结构

```typescript
interface Region {
  id: string;           // 唯一标识: "south", "central"
  name: string;         // 名称: "南部区块"
  description: string;  // 描述
  image: string;        // 背景图路径
  levelRange: [number, number]; // 等级范围: [10, 9]
  monsters: string[];   // 怪物ID列表
  gatherables: Gatherable[]; // 采集物
}
```

### 数据文件: `assets/data/regions.json`

```json
{
  "regions": [
    {
      "id": "south",
      "name": "南部区块",
      "description": "南山经·招摇山一带，新手起步区域",
      "image": "assets/images/maps/map-south.png",
      "levelRange": [10, 9],
      "monsters": ["monster-10-1", "monster-9-1", "monster-9-2"],
      "gatherables": [
        { "materialId": "mat-10-1", "name": "山铁" },
        { "materialId": "mat-9-3", "name": "精铁" }
      ]
    },
    {
      "id": "central",
      "name": "中部区块",
      "description": "中山经·霍山一带，进阶区域",
      "image": "assets/images/maps/map-central.png",
      "levelRange": [9, 8],
      "monsters": ["monster-9-1", "monster-9-2", "monster-8-1", "monster-8-2"],
      "gatherables": [
        { "materialId": "mat-8-1", "name": "灵犀藤" },
        { "materialId": "mat-8-4", "name": "赤铜矿石" }
      ]
    }
  ]
}
```

---

## 5. 游戏状态 (GameState) - 运行时

### 数据结构

```typescript
interface GameState {
  // 当前刀具
  currentBlade: {
    id: string;
    level: number;
    unlocked: boolean;
  };

  // 材料库存
  inventory: Record<string, number>; // materialId -> quantity

  // 已解锁刀具
  unlockedBlades: string[]; // bladeId[]

  // 设置
  settings: {
    sound: boolean;         // 音效开关
    volume: number;         // 音量 0-100
    screenShake: boolean;   // 屏幕抖动
    oneHitKill: boolean;    // 一键秒杀
  };

  // 当前界面
  currentScreen: 'intro' | 'map' | 'region' | 'battle' | 'gallery' | 'settings';

  // 当前区域
  currentRegion: string | null;

  // 版本
  version: string;

  // 最后保存时间
  lastSaved: number;
}
```

### 默认状态

```javascript
const defaultGameState = {
  currentBlade: { id: 'blade-10', level: 10, unlocked: true },
  inventory: {},
  unlockedBlades: ['blade-10'],
  settings: {
    sound: true,
    volume: 50,
    screenShake: true,
    oneHitKill: false
  },
  currentScreen: 'intro',
  currentRegion: null,
  version: '1.0.0',
  lastSaved: Date.now()
}
```

---

## 6. 升级配方 (Upgrade Recipe)

### 数据结构

```typescript
interface UpgradeRecipe {
  from: string;    // 源刀具ID: "blade-10"
  to: string;      // 目标刀具ID: "blade-9"
  materials: {
    materialId: string;
    quantity: number;
  }[];
}
```

### 数据文件: `assets/data/recipes.json`

```json
{
  "recipes": [
    {
      "from": "blade-10",
      "to": "blade-9",
      "materials": [
        { "materialId": "mat-10-1", "quantity": 2 },
        { "materialId": "mat-9-3", "quantity": 2 },
        { "materialId": "mat-9-4", "quantity": 1 }
      ]
    },
    {
      "from": "blade-9",
      "to": "blade-8",
      "materials": [
        { "materialId": "mat-9-2", "quantity": 2 },
        { "materialId": "mat-8-1", "quantity": 2 },
        { "materialId": "mat-8-4", "quantity": 1 }
      ]
    }
  ]
}
```

---

## 数据验证 Schema

### JSON Schema 示例

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["blades"],
  "properties": {
    "blades": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "level", "name", "image"],
        "properties": {
          "id": { "type": "string" },
          "level": { "type": "number", "minimum": 8, "maximum": 10 },
          "name": { "type": "string" },
          "image": { "type": "string" }
        }
      }
    }
  }
}
```

---

## Phase 1 结论

**状态**: ✅ 完成

所有核心数据模型已定义：
- ✅ 3把刀具配置
- ✅ 5种怪物（南部3种+中部2种）
- ✅ 10种材料
- ✅ 2个区域
- ✅ 升级配方
- ✅ 游戏状态结构

**下一步**: Phase 1 - 创建快速开始指南和契约定义
