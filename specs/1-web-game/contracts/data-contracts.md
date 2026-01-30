# Data Contracts: 大荒斩妖录

**Feature**: 大荒斩妖录 Web 应用
**Date**: 2025-01-30
**Phase**: Phase 1 - Data Contracts

## 概述

本文档定义所有数据文件的 JSON Schema 契约，用于验证数据完整性和防止运行时错误。

---

## 1. blades.json Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://dahuang.schemas/blades.json",
  "title": "Blades",
  "type": "object",
  "required": ["blades"],
  "properties": {
    "blades": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "level", "name", "description", "image", "attackPower"],
        "properties": {
          "id": {
            "type": "string",
            "pattern": "^blade-[0-9]+$",
            "description": "刀具唯一标识"
          },
          "level": {
            "type": "integer",
            "minimum": 1,
            "maximum": 10,
            "description": "刀具等级（1-10，本版��8-10）"
          },
          "name": {
            "type": "string",
            "minLength": 1,
            "description": "刀具名称"
          },
          "description": {
            "type": "string",
            "minLength": 1,
            "description": "刀具描述"
          },
          "image": {
            "type": "string",
            "pattern": "^assets/images/knives/.+\\.png$",
            "description": "刀具图片路径"
          },
          "attackPower": {
            "type": "integer",
            "minimum": 1,
            "description": "攻击力"
          }
        }
      }
    }
  }
}
```

### 验证测试

```javascript
// tests/contracts/blades.test.js
import { readFileSync } from 'fs';
import { describe, it, expect } from 'vitest';

const schema = JSON.parse(readFileSync('specs/1-web-game/contracts/blades.json'));
const data = JSON.parse(readFileSync('assets/data/blades.json'));

describe('Blades Contract', () => {
  it('should validate blades.json structure', () => {
    expect(data).toHaveProperty('blades');
    expect(data.blades).toBeInstanceOf(Array);
  });

  it('should have at least 3 blades (v1.0)', () => {
    expect(data.blades.length).toBeGreaterThanOrEqual(3);
  });

  it('each blade should have required fields', () => {
    data.blades.forEach(blade => {
      expect(blade).toHaveProperty('id');
      expect(blade).toHaveProperty('level');
      expect(blade).toHaveProperty('name');
      expect(blade).toHaveProperty('image');
      expect(blade.id).toMatch(/^blade-[0-9]+$/);
    });
  });
});
```

---

## 2. monsters.json Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://dahuang.schemas/monsters.json",
  "title": "Monsters",
  "type": "object",
  "required": ["monsters"],
  "properties": {
    "monsters": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "level", "name", "description", "image", "region", "hp", "attackPower", "drops"],
        "properties": {
          "id": {
            "type": "string",
            "pattern": "^monster-[0-9]+-[0-9]+$",
            "description": "怪物唯一标识"
          },
          "level": {
            "type": "integer",
            "minimum": 1,
            "maximum": 10,
            "description": "怪物等级"
          },
          "name": {
            "type": "string",
            "description": "怪物名称"
          },
          "description": {
            "type": "string",
            "description": "怪物描述（来源《山海经》）"
          },
          "image": {
            "type": "string",
            "pattern": "^assets/images/monsters/.+\\.png$",
            "description": "怪物图片路径"
          },
          "region": {
            "type": "string",
            "enum": ["south", "central", "north", "east", "west"],
            "description": "所属区域"
          },
          "hp": {
            "type": "integer",
            "minimum": 1,
            "description": "血量"
          },
          "attackPower": {
            "type": "integer",
            "minimum": 0,
            "description": "攻击力（反伤用）"
          },
          "drops": {
            "type": "array",
            "minItems": 1,
            "maxItems": 2,
            "items": {
              "type": "object",
              "required": ["materialId", "quantity"],
              "properties": {
                "materialId": {
                  "type": "string",
                  "pattern": "^mat-[0-9]+-[0-9]+$"
                },
                "quantity": {
                  "type": "array",
                  "minItems": 2,
                  "maxItems": 2,
                  "items": { "type": "integer" },
                  "description": "[最小掉落, 最大掉落]"
                }
              }
            }
          }
        }
      }
    }
  }
}
```

### 验证测试

```javascript
// tests/contracts/monsters.test.js
import { readFileSync } from 'fs';
import { describe, it, expect } from 'vitest';

const data = JSON.parse(readFileSync('assets/data/monsters.json'));

describe('Monsters Contract', () => {
  it('should validate monsters.json structure', () => {
    expect(data).toHaveProperty('monsters');
    expect(data.monsters).toBeInstanceOf(Array);
  });

  it('each monster should have valid drops', () => {
    data.monsters.forEach(monster => {
      expect(monster.drops).toBeInstanceOf(Array);
      expect(monster.drops.length).toBeGreaterThan(0);
      expect(monster.drops.length).toBeLessThanOrEqual(2);
      monster.drops.forEach(drop => {
        expect(drop).toHaveProperty('materialId');
        expect(drop).toHaveProperty('quantity');
        expect(drop.quantity).toHaveLength(2);
      });
    });
  });

  it('monster level should match region level range', () => {
    // 南部: 10-9, 中部: 9-8
    data.monsters.forEach(monster => {
      if (monster.region === 'south') {
        expect(monster.level).toBeGreaterThanOrEqual(9);
        expect(monster.level).toBeLessThanOrEqual(10);
      }
    });
  });
});
```

---

## 3. materials.json Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://dahuang.schemas/materials.json",
  "title": "Materials",
  "type": "object",
  "required": ["materials"],
  "properties": {
    "materials": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "level", "name", "description", "type", "usedFor"],
        "properties": {
          "id": {
            "type": "string",
            "pattern": "^mat-[0-9]+-[0-9]+$"
          },
          "level": {
            "type": "integer",
            "minimum": 1,
            "maximum": 10
          },
          "name": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "image": {
            "type": "string",
            "pattern": "^assets/images/items/.+\\.png$"
          },
          "type": {
            "type": "string",
            "enum": ["drop", "gather"]
          },
          "usedFor": {
            "type": "array",
            "items": {
              "type": "string",
              "pattern": "^blade-[0-9]+$"
            }
          }
        }
      }
    }
  }
}
```

---

## 4. regions.json Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://dahuang.schemas/regions.json",
  "title": "Regions",
  "type": "object",
  "required": ["regions"],
  "properties": {
    "regions": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "name", "description", "image", "levelRange", "monsters", "gatherables"],
        "properties": {
          "id": {
            "type": "string",
            "enum": ["south", "central", "north", "east", "west"]
          },
          "name": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "image": {
            "type": "string",
            "pattern": "^assets/images/maps/.+\\.(png|jpg)$"
          },
          "levelRange": {
            "type": "array",
            "minItems": 2,
            "maxItems": 2,
            "items": { "type": "integer" }
          },
          "monsters": {
            "type": "array",
            "items": {
              "type": "string",
              "pattern": "^monster-[0-9]+-[0-9]+$"
            }
          },
          "gatherables": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["materialId", "name"],
              "properties": {
                "materialId": {
                  "type": "string",
                  "pattern": "^mat-[0-9]+-[0-9]+$"
                },
                "name": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    }
  }
}
```

---

## 5. recipes.json Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://dahuang.schemas/recipes.json",
  "title": "Upgrade Recipes",
  "type": "object",
  "required": ["recipes"],
  "properties": {
    "recipes": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["from", "to", "materials"],
        "properties": {
          "from": {
            "type": "string",
            "pattern": "^blade-[0-9]+$"
          },
          "to": {
            "type": "string",
            "pattern": "^blade-[0-9]+$"
          },
          "materials": {
            "type": "array",
            "minItems": 1,
            "items": {
              "type": "object",
              "required": ["materialId", "quantity"],
              "properties": {
                "materialId": {
                  "type": "string",
                  "pattern": "^mat-[0-9]+-[0-9]+$"
                },
                "quantity": {
                  "type": "integer",
                  "minimum": 1
                }
              }
            }
          }
        }
      }
    }
  }
}
```

### 验证测试

```javascript
// tests/contracts/recipes.test.js
import { readFileSync } from 'fs';
import { describe, it, expect } from 'vitest';

const data = JSON.parse(readFileSync('assets/data/recipes.json'));

describe('Recipes Contract', () => {
  it('should have valid upgrade chain', () => {
    // 检查升级链: blade-10 -> blade-9 -> blade-8
    const recipe10to9 = data.recipes.find(r => r.from === 'blade-10');
    const recipe9to8 = data.recipes.find(r => r.from === 'blade-9');

    expect(recipe10to9).toBeDefined();
    expect(recipe10to9.to).toBe('blade-9');

    expect(recipe9to8).toBeDefined();
    expect(recipe9to8.to).toBe('blade-8');
  });

  it('each recipe should have valid materials', () => {
    data.recipes.forEach(recipe => {
      expect(recipe.materials).toBeInstanceOf(Array);
      expect(recipe.materials.length).toBeGreaterThan(0);
      recipe.materials.forEach(mat => {
        expect(mat.materialId).toMatch(/^mat-[0-9]+-[0-9]+$/);
        expect(mat.quantity).toBeGreaterThan(0);
      });
    });
  });

  it('upgrade materials should match blade levels', () => {
    // 升级到9级刀需要10级和9级材料
    const recipe10to9 = data.recipes.find(r => r.from === 'blade-10');
    recipe10to9.materials.forEach(mat => {
      const level = parseInt(mat.materialId.split('-')[1]);
      expect(level === 9 || level === 10).toBe(true);
    });
  });
});
```

---

## GameState Schema (运行时)

```typescript
interface GameStateSchema {
  currentBlade: {
    id: string;      // blade-10, blade-9, blade-8
    level: number;   // 10, 9, 8
    unlocked: boolean;
  };
  inventory: {
    [materialId: string]: number;  // mat-10-1 -> 3
  };
  unlockedBlades: string[];  // ["blade-10", "blade-9"]
  settings: {
    sound: boolean;
    volume: number;    // 0-100
    screenShake: boolean;
    oneHitKill: boolean;
  };
  currentScreen: 'intro' | 'map' | 'region' | 'battle' | 'gallery' | 'settings';
  currentRegion: string | null;
  version: string;
  lastSaved: number;
}
```

### 验证测试

```javascript
// tests/contracts/GameState.test.js
import { describe, it, expect } from 'vitest';
import { GameState } from '../../src/core/GameState.js';

describe('GameState Contract', () => {
  it('should have default state structure', () => {
    const state = GameState.getState();

    expect(state).toHaveProperty('currentBlade');
    expect(state).toHaveProperty('inventory');
    expect(state).toHaveProperty('unlockedBlades');
    expect(state).toHaveProperty('settings');
    expect(state).toHaveProperty('currentScreen');
    expect(state).toHaveProperty('version');
  });

  it('should initialize with blade-10', () => {
    const state = GameState.getState();

    expect(state.currentBlade.id).toBe('blade-10');
    expect(state.currentBlade.level).toBe(10);
    expect(state.unlockedBlades).toContain('blade-10');
  });

  it('should validate inventory structure', () => {
    GameState.update({
      inventory: { 'mat-10-1': 3, 'mat-9-1': 2 }
    });

    const state = GameState.getState();
    expect(state.inventory['mat-10-1']).toBe(3);
    expect(state.inventory['mat-9-1']).toBe(2);
  });

  it('should save and load from localStorage', () => {
    GameState.update({ inventory: { 'mat-10-1': 999 } });
    GameState.save();

    const loaded = GameState.load();
    expect(loaded.inventory['mat-10-1']).toBe(999);
  });
});
```

---

## Phase 1 结论

**状态**: ✅ 完成

所有数据契约已定义：
- ✅ blades.json Schema
- ✅ monsters.json Schema
- ✅ materials.json Schema
- ✅ regions.json Schema
- ✅ recipes.json Schema
- ✅ GameState Schema
- ✅ 契约验证测试

**下一步**: 完成规划阶段，准备进入任务分解 (`/speckit.tasks`)
