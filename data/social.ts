export type Social = {
    github?: string
    x?: string
    juejin?: string
    qq?: string
    wx?: string
    cloudmusic?: string
    zhihu?: string
    email?: string
    discord?: string
    bilibili?: string
}

type SocialValue = {
    href?: string
    title: string
    icon: string
    color: string
}

const social: Social = {
    github: 'https://github.com/hhhh-wang',
    x: 'https://twitter.com/kunwang853028',
    juejin: 'https://juejin.cn/user/3120872724108442',
    wx: 'https://bianliangrensheng.cn/gImage/wechat.png',
    // qq: 'https://img..cn/qq.png',
    // zhihu: 'https://www.zhihu.com/people/',
    // cloudmusic: 'https://music.163.com/#/user/home?',
    email: 'mailto:kun64855@gmail.com',
    // discord: 'https://discord.gg/',
    bilibili: 'https://space.bilibili.com/336186486',
}

const socialSet: Record<keyof Social | 'rss', SocialValue> = {
    github: {
        href: social.github,
        title: 'GitHub',
        icon: 'ri:github-line',
        color: '#010409',
    },
    juejin: {
        href: social.juejin,
        title: '掘金',
        icon: 'simple-icons:juejin',
        color: '#1E81FF',
    },
    x: {
        href: social.x,
        title: 'X',
        icon: 'ri:twitter-x-line',
        color: '#000',
    },
    wx: {
        href: social.wx,
        title: '微信',
        icon: 'ri:wechat-2-line',
        color: '#07c160',
    },
    zhihu: {
        href: social.zhihu,
        title: '知乎',
        icon: 'ri:zhihu-line',
        color: '#1772F6',
    },
    discord: {
        href: social.discord,
        title: 'Discord',
        icon: 'ri:discord-line',
        color: '#5A65F6',
    },
    qq: {
        href: social.qq,
        title: 'QQ',
        icon: 'ri:qq-line',
        color: '#1296db',
    },
    email: {
        href: social.email,
        title: '邮箱',
        icon: 'ri:mail-line',
        color: '#D44638',
    },
    // cloudmusic: {
    //     href: social.cloudmusic,
    //     title: '网易云',
    //     icon: 'ri:netease-cloud-music-line',
    //     color: '#C20C0C',
    // },
    bilibili: {
        href: social.bilibili,
        title: '哔哩哔哩',
        icon: 'ri:bilibili-line',
        color: '#FB7299',
    },
    rss: {
        href: '/blog/rss.xml',
        title: 'RSS',
        icon: 'ri:rss-line',
        color: '#FFA501',
    },
}

export default socialSet
