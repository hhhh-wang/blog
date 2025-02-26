---
id: 1012
slug: uniapp-horizontal-date-selector
title: uniapp选中日期移动到中间
authors: [bianliang]
tags: [uni-app, Vue, JavaScript, 前端开发, UI组件]
keywords: [uni-app开发, 日期选择器, 横向滚动, Vue组件, 移动端UI, 前端组件开发]
description: 详细介绍如何在uni-app中实现一个优雅的日期横向滚动选择器，包含完整的代码实现和最佳实践
image: https://bianliangrensheng.cn/gImage/title/select-date-move-center.png
---

# uniapp选中日期移动到中间

在移动端应用开发中，日期选择是一个常见且重要的交互需求。本文将详细介绍如何在uni-app中实现一个优雅的日期横向滚动选择器，它不仅外观精美，而且具有流畅的交互体验，能够显著提升用户体验。

<!-- truncate -->

:::tip 核心亮点
本组件实现了**选中项自动居中**、**平滑滚动动画**和**优雅的视觉反馈**，适用于各类需要日期选择的移动应用场景。
:::

## 1. 功能特点

### 1.1 核心功能
- ✨ 支持左右滚动选择日期
- 🎯 选中日期自动居中显示
- 🌊 平滑的滚动动画效果
- 🔆 选中项高亮和缩放效果
- 📅 同时展示日期和星期几信息

### 1.2 交互体验
- 🚀 流畅的滚动过渡效果
- ⚡ 即时的视觉反馈
- 💫 优雅的选中动画
- 🧩 自动居中对齐算法

## 实现效果

下面是组件的实际运行效果，可以看到日期项的平滑滚动和自动居中效果：

![日期选择器滚动效果](https://bianliangrensheng.cn/gImage/content/select-move%20-center.gif)

## 2. 技术栈

| 技术 | 用途 | 说明 |
|:------:|:------:|:------|
| **uni-app** | 开发框架 | 跨平台开发，一套代码多端运行 |
| **Vue** | 前端框架 | 组件化开发，响应式数据绑定 |
| **SCSS** | 样式语言 | 增强的CSS，提供嵌套、变量等特性 |
| **JavaScript** | 开发语言 | 实现业务逻辑和交互功能 |

## 3. 代码实现

### 3.1 组件结构

组件的模板结构采用了`scroll-view`作为滚动容器，内部使用flex布局排列日期项：

```vue
<template>
  <view class="date-selector">
    <scroll-view
      class="date-list"
      scroll-x
      :scroll-left="scrollLeft"
      scroll-with-animation
      @scroll="onScroll"
    >
      <view class="date-wrapper">
        <view
          v-for="(date, index) in dates"
          :key="index"
          :id="'date-' + index"
          :class="['date-item', { active: selectedIndex === index }]"
          @click="selectDate(index)"
        >
          <text class="day">{{ date.day }}</text>
          <text class="date">{{ date.weekday }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>
```

### 3.2 业务逻辑

核心业务逻辑包括日期数据生成、选择处理和居中算法实现：

```javascript
export default {
  data() {
    return {
      selectedIndex: 15, // 默认选中中间日期
      dates: [],
      scrollLeft: 0,
      itemWidth: 140,
      selectedDate: ''
    }
  },

  created() {
    this.generateDates()
  },

  mounted() {
    this.$nextTick(() => {
      if (this.dates.length > 0 && this.selectedIndex < this.dates.length) {
        this.selectedDate = this.dates[this.selectedIndex].fullDate
      }

      setTimeout(() => {
        this.centerSelectedDate(this.selectedIndex)
      }, 100)
    })
  },

  methods: {
    // 生成日期数据
    generateDates() {
      const today = new Date()
      const dates = []
      
      for (let i = -15; i < 15; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() + i)
        dates.push({
          day: date.getDate(),
          weekday: this.getWeekDay(date),
          fullDate: this.formatDate(date)
        })
      }
      
      this.dates = dates
    },

    // 选择日期
    selectDate(index) {
      this.selectedIndex = index
      if (this.dates.length > 0 && index < this.dates.length) {
        this.selectedDate = this.dates[index].fullDate
      }
      this.centerSelectedDate(index)
    },

    // 居中显示选中日期
    centerSelectedDate(index) {
      try {
        const query = uni.createSelectorQuery().in(this)
        query.select('#date-' + index).boundingClientRect()
        query.select('.date-list').boundingClientRect()

        query.exec(res => {
          if (!res[0] || !res[1]) return

          const dateItem = res[0]
          const scrollView = res[1]

          const centerPosition = dateItem.left - scrollView.left
          const targetScrollLeft = this.scrollLeft + centerPosition - (scrollView.width / 2) + (dateItem.width / 2)

          this.scrollLeft = Math.max(0, targetScrollLeft)
        })
      } catch (e) {
        console.error('计算scrollLeft出错', e)
      }
    },
    
    // 获取星期几
    getWeekDay(date) {
      const weekdays = ['日', '一', '二', '三', '四', '五', '六']
      return weekdays[date.getDay()]
    },
    
    // 格式化日期
    formatDate(date) {
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    
    // 滚动事件处理
    onScroll(e) {
      // 可以在这里添加滚动时的逻辑
    }
  }
}
```

### 3.3 样式设计

精心设计的样式确保了组件的美观和交互体验：

```scss
.date-selector {
  margin-bottom: 40rpx;
  background: linear-gradient(to right, rgba(255,255,255,0.5), rgba(255,255,255,0.8), rgba(255,255,255,0.5));
  padding: 20rpx 0;
  border-radius: 16rpx;

  .date-list {
    width: 100%;

    .date-wrapper {
      display: flex;
      padding: 0 40%;

      .date-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 100rpx;
        height: 120rpx;
        margin: 0 20rpx;
        border-radius: 20rpx;
        background: #f5f5f5;
        box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.05);
        transition: all 0.3s ease;

        .day {
          font-size: 36rpx;
          font-weight: 500;
          color: #333;
          margin-bottom: 4rpx;
        }

        .date {
          font-size: 24rpx;
          color: #666;
        }

        &.active {
          background: #e8f5e9;
          transform: scale(1.1);
          transition: all 0.3s;
          box-shadow: 0 4rpx 12rpx rgba(66,211,146,0.2);
          
          .day, .date {
            color: #42d392;
            font-weight: 600;
          }
        }
      }
    }
  }
}
```

## 4. 实现原理

### 4.1 滚动机制

组件的核心滚动机制基于以下几点：

1. 使用 `scroll-view` 实现横向滚动容器
2. 通过 `scroll-left` 属性控制滚动位置
3. 监听滚动事件实现动态交互
4. 使用 `scroll-with-animation` 实现平滑滚动

### 4.2 居中算法

居中算法是组件的核心，它确保选中的日期项始终居中显示：

```javascript
// 计算目标滚动位置
const centerPosition = dateItem.left - scrollView.left
const targetScrollLeft = this.scrollLeft + centerPosition - (scrollView.width / 2) + (dateItem.width / 2)
```

这个算法的工作原理是：
1. 计算选中项相对于滚动容器的偏移量
2. 计算需要滚动的距离，使选中项居中
3. 应用滚动动画实现平滑过渡

### 4.3 动画效果

组件的动画效果通过多种技术实现：

- 使用 CSS `transform` 实现选中项的缩放效果
- 添加 `transition` 实现平滑的状态过渡
- 利用 `scroll-with-animation` 实现滚动动画
- 应用 `box-shadow` 增强视觉层次感

## 5. 使用指南

### 5.1 组件注册

在项目中注册组件：

```javascript
// pages.json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "日期选择器"
      }
    }
  ]
}
```

### 5.2 页面使用

在页面中使用组件并监听日期变化事件：

```vue
<template>
  <view class="container">
    <date-selector @dateChange="onDateChange"/>
    
    <view class="selected-date" v-if="currentDate">
      <text>当前选择: {{currentDate}}</text>
    </view>
  </view>
</template>

<script>
import DateSelector from '@/components/date-selector'

export default {
  components: {
    DateSelector
  },
  data() {
    return {
      currentDate: ''
    }
  },
  methods: {
    onDateChange(date) {
      console.log('选择的日期:', date)
      this.currentDate = date
    }
  }
}
</script>
```

## 6. 性能优化

### 6.1 渲染优化

为确保组件的高性能，实施了以下优化措施：

- 使用 `v-show` 替代 `v-if` 减少 DOM 操作
- 合理使用 `nextTick` 和 `setTimeout` 确保 DOM 更新
- 避免频繁的样式计算和布局重排
- 使用 `key` 属性优化列表渲染

### 6.2 滚动优化

针对滚动性能的优化：

- 使用节流控制滚动事件触发频率
- 优化滚动位置计算逻辑
- 减少不必要的重绘和重排
- 使用 CSS 硬件加速提升动画性能

## 7. 注意事项

:::warning 开发提示
1. 确保正确设置 itemWidth 值，它影响居中计算
2. 注意处理滚动边界情况，防止越界
3. 添加适当的错误处理机制
4. 优化大量数据时的性能表现
5. 在低端设备上测试滚动性能
:::

## 8. 扩展功能

本组件还可以进一步扩展以下功能：

- 支持日期范围限制
- 添加特殊日期标记
- 自定义日期项样式
- 支持农历日期显示
- 添加年月快速切换

## 参考资源
- [uni-app 官方文档](https://uniapp.dcloud.net.cn/)
- [Vue.js 官方文档](https://cn.vuejs.org/)
- [scroll-view 组件文档](https://uniapp.dcloud.net.cn/component/scroll-view.html)
