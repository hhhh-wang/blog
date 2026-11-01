export const projects: Project[] = [
    {
        title: '变量人生的小站',
        description: '🦖 基于 Docusaurus 静态网站生成器实现个人博客',
        preview: 'https://bianliangrensheng.cn/gImage/title/blog-index.png',
        website: 'https://bianliangrensheng.cn',
        ip: 'https://bianliangrensheng.cn',
        source: 'https://github.com/hhhh-wang/blog',
        tags: ['opensource', 'design', 'favorite'],
        type: 'web',
    },
    {
        title: '省心租房小程序',
        description: '🍋 使用Uni-app、Vue3 构建的高效租房小程序',
        preview: 'https://bianliangrensheng.cn/gImage/title/rent-ease-index.png',
        website: 'https://rent-app.bianliangrensheng.cn',
        ip: 'https://rent-app.bianliangrensheng.cn',
        source: 'https://github.com/hhhh-wang/rent-ease',
        tags: ['product', 'design', 'favorite'],
        type: 'web',
    },
    {
        title: '省心租房后台管理系统',
        description: '🎁基于 SpringBoot、SpringMVC、Mybatis 框架，可用于所有的Web应用程序（暂时下架）',
        preview: 'https://bianliangrensheng.cn/gImage/title/rent-ease-admin-index.png',
        website: 'https://rent-ease-admin.bianliangrensheng.cn',
        ip: 'https://rent-ease-admin.bianliangrensheng.cn',
        source: 'https://github.com/hhhh-wang/rent-ease-admin',
        tags: ['product', 'design', 'favorite'],
        type: 'web',
    },
    {
        title: '轻量级 React Admin 中后台模板',
        description: '📦 为开发者提供的轻量级、易上手且可扩展的后台管理解决方案，基于 React 18 hooks 构建，后端使用 NestJS、TypeORM',
        preview: 'https://bianliangrensheng.cn/gImage/title/analysis2.png',
        website: 'https://sapling-react.bianliangrensheng.cn/#/login',
        ip: 'https://sapling-react.bianliangrensheng.cn',
        source: 'https://github.com/hhhh-wang/react-admin',
        tags: ['opensource', 'design', 'favorite'],
        type: 'web',
    },
    {
        title: '萌爪联盟抓娃娃机',
        description: '🎮 线上抓娃娃机互动平台，让用户随时随地体验抓娃娃的乐趣',
        preview: 'https://bianliangrensheng.cn/gImage/title/mengzhua-lianmeng.png',
        website: 'https://qnsharing.com',
        ip: 'https://qnsharing.com',
        source: null,
        tags: ['product', 'design', 'teamwork'],
        type: 'web',
    },

    {
        title: '健康饮食',
        description: '🥗 基于Uni-app、Vue3构建的饮食管理小程序（还在开发中，有一些明显的BUG会在后续修复）',
        preview: 'https://bianliangrensheng.cn/gImage/title/health-bite-cover.png',
        website: 'https://lite-calorie.bianliangrensheng.cn',
        ip: 'https://lite-calorie.bianliangrensheng.cn',
        source: 'https://github.com/hhhh-wang/health-bite',
        tags: ['product', 'personal', 'ongoing'],
        type: 'ongoing',
    },
    {
        title: '健康饮食后端服务',
        description: '🍽️ 基于SpringBoot构建的饮食管理系统后端与API，包含饮食数据分析、营养计算等功能，接入支付与AI，同步编写软件著作权（最近比较忙还没有来得及部署）',
        preview: 'https://bianliangrensheng.cn/gImage/title/health-bite-backend.png',
        website: 'https://health-bite-api.bianliangrensheng.cn',
        ip: 'https://health-bite-admin.bianliangrensheng.cn',
        source: 'https://github.com/hhhh-wang/health-bite-admin',
        tags: ['product', 'personal', 'ongoing'],
        type: 'ongoing',
    },
    {
        title: 'Boss慧眼',
        description: '👀 一款帮助求职者提高简历投递效率的Chrome插件，可以过滤掉不在线的HR，提高沟通效率',
        preview: 'https://bianliangrensheng.cn/gImage/title/boss-huiyan.png',
        website: 'https://github.com/hhhh-wang/boss-huiyan',
        ip: 'https://github.com/hhhh-wang/boss-huiyan',
        source: 'https://github.com/hhhh-wang/boss-huiyan',
        tags: ['opensource', 'tools', 'personal'],
        type: 'tools',
    },
    {
        title: '专注自习室',
        description: '⏱️ 基于番茄工作法的时间管理工具，帮助用户提高工作效率和专注力',
        preview: 'https://bianliangrensheng.cn/gImage/title/study-room.png',
        website: 'https://bianliangrensheng.cn/focus-study-room',
        ip: 'https://bianliangrensheng.cn/focus-study-room',
        source: 'https://github.com/hhhh-wang/blog',
        tags: ['opensource', 'tools', 'personal'],
        type: 'tools',
    },
]

export type Tag = {
    label: string
    description: string
    color: string
}

export type TagType = 'favorite' | 'opensource' | 'product' | 'design' | 'large' | 'personal' | 'teamwork' | 'tools' | 'ongoing'

export type ProjectType = 'web' | 'app' | 'commerce' | 'personal' | 'toy' | 'other' | 'teamwork' | 'tools' | 'ongoing'

export const projectTypeMap = {
    web: '🖥️ 商业项目',
    app: '💫 应用',
    commerce: '商业项目',
    ongoing: '🚀 进行中',
    tools: '🛠️ 实用工具',
    teamwork: '🤝 合作'
}

export type Project = {
    title: string
    description: string
    preview?: string
    website: string  // 展示用的字段 可以随意写www.baidu.com
    ip?: string     //实际跳转用的字段
    source?: string | null
    tags: TagType[]
    type: ProjectType
}

export const Tags: Record<TagType, Tag> = {
    favorite: {
        label: '喜爱',
        description: '我最喜欢的网站，一定要去看看!',
        color: '#e9669e',
    },
    opensource: {
        label: '开源',
        description: '开源项目可以提供灵感!',
        color: '#39ca30',
    },
    product: {
        label: '产品',
        description: '与产品相关的项目!',
        color: '#dfd545',
    },
    design: {
        label: '设计',
        description: '设计漂亮的网站!',
        color: '#a44fb7',
    },
    large: {
        label: '大型',
        description: '大型项目，原多于平均数的页面',
        color: '#8c2f00',
    },
    personal: {
        label: '个人',
        description: '个人项目',
        color: '#12affa',
    },
    teamwork: {
        label: '合作',
        description: '合作项目',
        color: '#0891b2'
    },
    tools: {
        label: '工具',
        description: '实用的前端开发工具',
        color: '#555555'
    },
    ongoing: {
        label: '进行中',
        description: '正在进行的项目',
        color: '#007bff'
    }
}

export const TagList = Object.keys(Tags) as TagType[]

export const groupByProjects = projects.reduce(
    (group, project) => {
        const {type} = project
        group[type] = group[type] ?? []
        group[type].push(project)
        return group
    },
    {} as Record<ProjectType, Project[]>,
)
