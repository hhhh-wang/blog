import type * as Preset from '@docusaurus/preset-classic'
import type { Config } from '@docusaurus/types'
import { themes } from 'prism-react-renderer'
import social from './data/social'
import type { GiscusConfig } from './src/components/Comment'

const beian = '湘ICP备2025099656号-2'
const beian1 = '湘公网安备43310002000135号'

const config: Config = {
  title: '变量人生',
  tagline: '外包接单，软件开发',
  url: 'https://bianliangrensheng.cn',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'bianliang',
  projectName: 'blog',
  customFields: {
    bio: '无论前路如何，探索与学习是我不断进化的动力',
    description:
        '这里是一片探索技术的乐园，记录着开发者的成长足迹。作为一个技术分享平台，网站采用现代化的 Docusaurus 框架打造，致力于为读者提供高质量的编程经验和项目实践心得。',
    deepseekApiKey: 'sk-4c308839e3614f5f856bb15808dd85ed',
    indexNow: {
      key: '78510668c3f04067a1358f3df2f70dd2'
    },
      // 博客分类配置
    blogCategories: {
      develop: {
        name: '开发教程',
        description: '各类技术开发教程和指南',
        folder: 'develop'
      },
      discuss: {
        name: '技术讨论',
        description: '关于技术、职业和生活的思考',
        folder: 'discuss'
      },
      lifestyle: {
        name: '生活随笔',
        description: '记录生活点滴和日常感悟',
        folder: 'lifestyle'
      },
      project: {
        name: '项目实践',
        description: '实际项目经验和最佳实践分享',
        folder: 'project'
      },
    },
  },


  themeConfig: {
    // announcementBar: {
    //   id: 'announcementBar-3',
    //   content: ``,
    // },
    image: 'img/index.png',
    metadata: [
      {
        name: 'author',
        content: '变量人生',
      },
      {
        name: 'keywords',
        content: 'blog, javascript, typescript, node, react, vue, web',
      },
      {
        name: 'keywords',
        content: 'Java开发, 小程序开发, TS全栈开发, 部署运维, 软件开发, 软件定制, 网站建设, 网站开发, 信息化, 项目管理, 前后端分离, 快速开发, 敏捷开发',
      },
    ],
    docs: {
      sidebar: {
        hideable: true,
      },
    },
    navbar: {
      logo: {
        alt: '变量人生',
        src: 'img/logo.webp',
        srcDark: 'img/logo.webp',
      },
      hideOnScroll: true,
      items: [
        { 
          label: '博客', 
          position: 'right', 
          to: 'blog',
          activeBaseRegex: '^/blog/?$|^/blog/page/|^/blog/archive/|^/blog/\\d{4}/'
        },
        { label: '分类', position: 'right', to: 'categories' },
        { 
          label: '标签', 
          position: 'right', 
          to: 'blog/tags',
          activeBaseRegex: '^/blog/tags'
        },
        { label: '项目', position: 'right', to: 'project' },
        { label: '友链', position: 'right', to: 'friends' },
        { label: '关于', position: 'right', to: 'about' },
        { label: '商务', position: 'right', to: 'business' },
        {
          label: '更多',
          position: 'right',
          items: [
            { label: '归档', to: 'blog/archive' },

            { label: '笔记', to: 'docs/skill' },
            { label: '工具推荐', to: 'docs/tools' },
          ],
        },
        // {
        //   type: 'localeDropdown',
        //   position: 'right',
        // },
      ],
    },
    footer: {
      style: 'light',
      copyright: `
        <div class="footer-wrapper">
          <div class="footer-content">
            <p class="beian-text">
              <a href="https://beian.miit.gov.cn/" class="beian-link">${beian}</a>
            </p>
            <p class="police-beian">
              <img src="/img/police.png" alt="police" class="police-icon"/>
              <a href="https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=${
                beian1.match(/\d+/)?.[0]
              }" class="beian-link">${beian1}</a>
            </p>
            <p class="copyright-text">
            <!-- 备案下方描述-->
              Copyright © 2020 - ${new Date().getFullYear()}. | Built with Docusaurus.
            </p>
          </div>
        </div>
      `,
    },
    //
    algolia: {
      appId: 'AF2UZBUJBQ',
      apiKey: 'd5c0943399a8883884022e0c25291a52',
      indexName: 'crawler_bianliang-blog',
    },
    prism: {
      theme: themes.oneLight,
      darkTheme: themes.oneDark,
      additionalLanguages: ['bash', 'json', 'java', 'python', 'php', 'graphql', 'rust', 'toml', 'protobuf', 'diff'],
      defaultLanguage: 'javascript',
      magicComments: [
        {
          className: 'theme-code-block-highlighted-line',
          line: 'highlight-next-line',
          block: { start: 'highlight-start', end: 'highlight-end' },
        },
        {
          className: 'code-block-error-line',
          line: 'This will error',
        },
      ],
    },
    //仓库调整
    giscus: {
      repo: 'hhhh-wang/blog',
      repoId: 'R_kgDONnA36Q',
      category: 'General',
      categoryId: 'DIC_kwDONnA36c4Cl5U2',
      theme: 'light',
      darkTheme: 'dark_dimmed',
    } satisfies Partial<GiscusConfig>,
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
    liveCodeBlock: { playgroundPosition: 'top' },
    zoom: {
      selector: '.markdown :not(em) > img',
      background: {
        light: 'rgb(255, 255, 255)',
        dark: 'rgb(50, 50, 50)',
      },
    },
  } satisfies Preset.ThemeConfig,
  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          sidebarPath: 'sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: ['./src/css/custom.css', './src/css/tweet-theme.css'],
        },
        sitemap: {
          priority: 0.5,
        },
        gtag: {
          trackingID: 'G-YZK05M1X66',
          anonymizeIP: true,
        },
        debug: process.env.NODE_ENV === 'development',
      } satisfies Preset.Options,
    ],
  ],
  plugins: [
    'docusaurus-plugin-image-zoom',
    '@docusaurus/plugin-ideal-image',
    // ['docusaurus-plugin-baidu-tongji', { token: 'c9a3849aa75f9c4a4e65f846cd1a5155' }],
    [
      '@docusaurus/plugin-pwa',
      {
        debug: process.env.NODE_ENV === 'development',
        offlineModeActivationStrategies: ['appInstalled', 'standalone', 'queryString'],
        pwaHead: [
          { tagName: 'link', rel: 'icon', href: '/img/logo.webp' },
          { tagName: 'link', rel: 'manifest', href: '/manifest.json' },
          { tagName: 'meta', name: 'theme-color', content: '#12affa' },
        ],
      },
    ],
    [
      'vercel-analytics',
      {
        debug: process.env.NODE_ENV === 'development',
        mode: 'auto',
      },
    ],
    [
      './src/plugin/plugin-content-blog', // 为了实现全局 blog 数据，必须改写 plugin-content-blog 插件
      {
        path: 'blog',
        editUrl: ({ locale, blogDirPath, blogPath, permalink }) =>
          `https://github.com/kuizuo/blog/edit/main/${blogDirPath}/${blogPath}`,
        editLocalizedFiles: false,
        blogDescription: '变量人生：探索人生变量与无限可能的记录',
        blogSidebarCount: 10,
        blogSidebarTitle: '博文',
        postsPerPage: 12,
        showReadingTime: true,
        readingTime: ({ content, frontMatter, defaultReadingTime }) =>
          defaultReadingTime({ content, options: { wordsPerMinute: 300 } }),
        feedOptions: {
          type: 'all',
          title: '变量人生',
          description: 'feedId:41215011978385457+userId:41840354283324416',
          // <!-- 备案下方描述-->
           copyright: `Copyright © ${new Date().getFullYear()} 变量人生 Built with Docusaurus.<p><a href="https://beian.miit.gov.cn/" class="footer_lin">${beian}</a></p>`,
        },
      },
    ],
    async function tailwindcssPlugin() {
      return {
        name: 'docusaurus-tailwindcss',
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(require('tailwindcss'))
          postcssOptions.plugins.push(require('autoprefixer'))
          return postcssOptions
        },
      }
    },
    async function injectMotto() {
      return {
        name: 'docusaurus-motto',
        injectHtmlTags() {
          return {
            headTags: [
              {
                tagName: 'script',
                innerHTML: `
    (${function () {
      console.log(
        `%c bianliang Blog %c https://github.com/hhhh-wang/blog`,
        'color: #fff; margin: 1em 0; padding: 5px 0; background: #12affa;',
        'margin: 1em 0; padding: 5px 0; background: #efefef;',
      )

      const motto = `
This Webisite Powered By bianliang Blog.
Written by Docusaurus, Coding with Love.
--------
Love what you do and do what you love.
`

      if (document.firstChild?.nodeType !== Node.COMMENT_NODE) {
        document.prepend(document.createComment(motto))
      }
    }.toString()})();`,
              },
            ],
          }
        },
      }
    },
  ],
  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'description',
        content: '变量人生的个人博客',
      },
    },
    {
      //seo优化，防止重复内容问题，提高网站在搜索引擎中的排名
      tagName: 'link',
      attributes: {
        rel: 'canonical',
        href: 'https://bianliangrensheng.cn',
      },
    },
    { //支持谷歌广告，让站点有一定的收益。
      tagName: 'script',
      attributes: {
        async: 'true',
        src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4860086622819454',
        crossorigin: 'anonymous',
      },
    },
  ],
  stylesheets: [
    'https://cdn.jsdelivr.net/npm/misans@4.0.0/lib/Normal/MiSans-Normal.min.css',
    'https://cdn.jsdelivr.net/npm/misans@4.0.0/lib/Normal/MiSans-Medium.min.css',
    'https://cdn.jsdelivr.net/npm/misans@4.0.0/lib/Normal/MiSans-Semibold.min.css',
  ],
  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN'],
  },
  onBrokenLinks: 'warn',
}

export default config
