export const projects: Project[] = [
    {
        title: '变量人生的小站',
        description: '🦖 基于 Docusaurus 静态网站生成器实现个人博客',
        preview: 'https://cdn.jsdelivr.net/gh/hhhh-wang/MyPic@main/blog/img/blog-index.png',
        website: 'http://bianliangrensheng.cn',
        ip: 'http://106.52.209.18',
        source: 'https://github.com/hhhh-wang/blog',
        tags: ['opensource', 'design', 'favorite'],
        type: 'web',
    },
    {
        title: '省心租房小程序',
        description: '🍋 使用Uni-app、Vue3 构建的租房小程序',
        preview: 'https://cdn.jsdelivr.net/gh/hhhh-wang/MyPic@main/blog/img/rent-ease-index.png',
        website: 'http://www.rent-ease-admin:8080/house',
        ip: 'http://106.52.209.18:8080/house',
        source: 'https://github.com/hhhh-wang/rent-ease',
        tags: ['product', 'design', 'favorite'],
        type: 'web',
    },
    {
        title: '省心租房后台管理系统',
        description: '🎁基于 SpringBoot框架',
        preview: 'https://cdn.jsdelivr.net/gh/hhhh-wang/MyPic@main/blog/img/rent-ease-admin-index.png',
        website: 'http://www.rent-ease-admin.com/house',
        ip: 'http://106.52.209.18:1234/house',
        source: 'https://github.com/hhhh-wang/rent-ease-admin',
        tags: ['product', 'design', 'favorite'],
        type: 'web',
    },
    {
        title: 'React18后端管理系统脚手架',
        description: '📦基于 React18 ',
        preview: 'https://cdn.jsdelivr.net/gh/hhhh-wang/MyPic@main/blog/img/analysis2.png',
        website: 'http://www.sapling-react.online/#/login',
        ip: 'http://www.sapling-react.online/',
        source: 'https://github.com/hhhh-wang/react-admin',
        tags: ['opensource', 'design', 'favorite'],
        type: 'web',
    },

]

export type Tag = {
    label: string
    description: string
    color: string
}

export type TagType = 'favorite' | 'opensource' | 'product' | 'design' | 'large' | 'personal'

export type ProjectType = 'web' | 'app' | 'commerce' | 'personal' | 'toy' | 'other'

export const projectTypeMap = {
    web: '🖥️ 商业项目',
    app: '💫 应用',
    commerce: '商业项目',
    // personal: '👨‍💻 个人',
    // toy: '🔫 玩具',
    // other: '🗃️ 其他',
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
