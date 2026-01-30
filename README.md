# 大荒斩妖录

基于《山海经》的点击式网页游戏

## 简介

《大荒斩妖录》是一款单页Web游戏，玩家扮演"刀"这一主角，通过击败怪物收集材料，从10级山铁樵刀逐步升级到8级庖丁解牛刀。

## 技术栈

- **框架**: Vanilla JS (ES2022+)
- **构建工具**: Vite 5.x
- **样式**: 纯CSS + CSS变量
- **测试**: Vitest
- **存储**: localStorage

## 安装和运行

### 前置要求

- Node.js 18+
- npm 或 pnpm

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 游戏玩法

1. **开场动画**: 游戏启动时显示"大荒斩妖录"标题动画，可点击跳过
2. **五方地图**: 选择探索的区域（南部、中部、北部、东部、西部）
3. **战斗系统**: 点击怪物进行战斗
   - 刀等级 < 怪物等级：秒杀
   - 刀等级 = 怪物等级：进入战斗，需要点击攻击
   - 刀等级 > 怪物等级：怪物反伤极高
4. **材料收集**: 击败怪物获得材料掉落
5. **刀具升级**: 收集足够材料后升级刀具

## 项目结构

```
├── index.html              # 入口HTML
├── assets/                 # 静态资源
│   ├── data/              # 游戏数据JSON
│   ├── images/            # 图片
│   └── sounds/            # 音效
├── src/                   # 源代码
│   ├── core/              # 核心逻辑
│   ├── ui/                # UI组件
│   ├── utils/             # 工具函数
│   └── main.js            # 主入口
├── styles/                # 样式
├── specs/                 # 设计文档
└── tests/                 # 测试
```

## 本地存储

游戏进度保存在浏览器的 localStorage 中，键名为 `dahuang-save`。刷新页面后自动恢复。

清除存档：在浏览器控制台运行 `localStorage.removeItem('dahuang-save')`

## 开源协议

MIT License
