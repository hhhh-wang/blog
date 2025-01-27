export const Friends: Friend[] = [
  {
    title: '峰华前端工程师',
    description: '致力于帮助你以最直观、最快速的方式学会前端开发',
    website: 'https://zxuqian.cn',
    avatar: '/img/friend/zxuqian.png',
  },
  {
    title: '愧怍',
    description: '在这里我会分享各类技术栈所遇到问题与解决方案',
    website: 'https://kuizuo.cn',
    avatar: '/img/friend/kuizuo.png',
  },

  {
    title: '鲸落',
    description: '心中无女人，代码自然神',
    website: 'https://www.xiaojunnan.cn',
    avatar: '/img/friend/xiaojunnan.png',
  },
  {
    title: 'LineXic书屋',
    description: '念念不忘，必有回响',
    website: 'https://linexic.top',
    avatar: '/img/friend/linexic.png',
  },
]

export type Friend = {
  title: string
  description: string
  website: string
  avatar?: string
}
