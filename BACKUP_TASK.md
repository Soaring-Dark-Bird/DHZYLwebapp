# 大荒斩妖录 - 地图交互模式重构任务

## 任务概述

将当前的五方网格地图改为基于 `fullmap.png` 的精确热区交互系统。

---

## 核心需求

### 1. 地图热区映射

**分析 `fullmap.png`（位于 `/assets/images/maps/fullmap.png`）**

识别并定位以下实体：
- **怪兽**：烛龙(1级)、狌狌(10级)、鹿蜀(9级)、蠪蚳(8级) 等
- **采集物**：山铁、真火晶 等

为每个实体生成**百分比坐标**配置文件 `map-config.json`：

```json
{
  "monsters": [
    {
      "id": "zhulong",
      "name": "烛龙",
      "level": 1,
      "position": { "x": 50, "y": 25 },
      "hitboxRadius": 5
    },
    {
      "id": "shengsheng",
      "name": "狌狌",
      "level": 10,
      "position": { "x": 75, "y": 15 },
      "hitboxRadius": 5
    }
  ],
  "resources": [
    {
      "id": "mountain-iron",
      "name": "山铁",
      "position": { "x": 30, "y": 40 },
      "hitboxRadius": 4
    }
  ]
}
```

### 2. 透明交互层 (SVG Overlay)

- 在全屏背景图上覆盖透明 SVG 蒙层
- 为每个实体创建圆形/不规则点击热区
- **不需要正方形实线框**，直接以图片内容为准

### 3. 点击反馈逻辑

**点击怪兽**：
- 直接触发 `Blade_Logic_Engine` 进行战斗判定
- 根据 bladeLevel 判断：1级=对峙，10级=溃败

**点击采集物**：
- 弹出成功采集的 Toast 提示
- 更新背包状态

**点击动效**：
- 在点击位置生成"涟漪"动效
- 直接弹出采集或战斗窗口（无需进入二级地图）

### 4. 容错性设计

- 热区外有一定误差范围
- 点击图片附近区域也能触发效果

### 5. 怪物图片提取

- 从 fullmap.png 中提取所有生物/怪物的图片
- 用于战斗动画中的怪物显示

---

## 技术实现路径

### 方案 A：保持当前技术栈（纯 JS + Vite）

1. 创建 `map-config.json` 配置文件
2. 修改 `MapView.js` 使用 SVG 交互层
3. 在 `main.css` 中添加涟漪动画
4. 实现点击分发逻辑

### 方案 B：迁移到 React + Vite + Tailwind CSS

1. 初始化 React 项目
2. 使用 Tailwind 快速构建 UI
3. 利用 React 状态管理处理交互

**当前项目结构**：纯 JavaScript + Vite，建议采用方案 A

---

## 待使用的技能/MCP

| 技能 | 用途 |
|------|------|
| Vision_to_Hitbox_Mapper | 分析 fullmap.png，识别怪兽位置 |
| SVG_Interactive_Overlay_Generator | 生成透明 SVG 交互层 |
| Python Interpreter MCP | 使用 OpenCV/PIL 精确检测坐标 |
| 4.5V MCP (视觉分析) | 直接分析图片内容 |

---

## 调试工具

创建坐标探测器：
- 点击地图时在控制台打印 `x%, y%`
- 方便校对热区位置

---

## 测试要求

使用 Playwright 测试：
1. 成功加载地图
2. 成功点击各怪兽热区
3. 成功点击各采集物热区
4. 验证容错范围

---

## 文件清单

需要修改/创建的文件：
- `/assets/data/map-config.json` - 新建，热区配置
- `/src/ui/MapView.js` - 修改，使用 SVG 交互层
- `/styles/main.css` - 修改，添加涟漪动画
- `/src/main.js` - 修改，添加点击分发逻辑

---

## 当前项目状态

- Vite 开发服务器运行在 http://localhost:3000
- 背景图片：`/assets/images/background/background.png`
- 地图图片：`/assets/images/maps/fullmap.png`
- 已有五行配色方案和传统中国玄幻样式

---

## 重要说明

**重构完成后，删除此备份文档或重命名为 BACKUP_TASK_DONE.md**
