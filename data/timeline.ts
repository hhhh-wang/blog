// 开发历程时间线数据（与关于页「技术历程」保持同步）
export type TimelineItem = {
  period: string
  direction: string
  stack: string[]
  mode: string
}

const TIMELINE: TimelineItem[] = [
  {
    period: '2018-2019',
    direction: '微服务后端',
    stack: ['SpringBoot', 'SpringCloud'],
    mode: '坐班 · 深圳',
  },
  {
    period: '2020-2022',
    direction: '全栈开发',
    stack: ['Node.js', 'Nest.js', 'Uni-app'],
    mode: '远程办公',
  },
  {
    period: '2023-2024',
    direction: '全栈开发',
    stack: ['React', 'SpringBoot', 'Python'],
    mode: '坐班 · 深圳',
  },
  {
    period: '2025-至今',
    direction: '独立开发',
    stack: ['Vue', 'React', 'Node.js', 'SpringBoot', 'Python'],
    mode: '为自己打工',
  },
]

// 「现在的我」：原首页个人特点区块的内容，融合进时间线收尾
export type NowCard = {
  icon: string
  title: string
  description: string
}

const NOW_CARDS: NowCard[] = [
  {
    icon: 'logos:react',
    title: 'Web 前端开发',
    description: 'React / Vue / TypeScript / Tailwind，构建响应式、用户友好的界面',
  },
  {
    icon: 'logos:nodejs',
    title: '服务器后端',
    description: 'Node.js / NestJS / Spring Boot，独立设计并部署高性能后端系统',
  },
  {
    icon: 'mdi:heart',
    title: '热爱生活',
    description: '保持对新技术的好奇心，也热衷阅读和运动，积极心态持续突破',
  },
]

export { TIMELINE, NOW_CARDS }
