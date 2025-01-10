module.exports = {
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        blog: {
          blogTitle: '博客',
          blogDescription: '变量人生的博客',
          blogSidebarCount: 7,
          blogSidebarTitle: 'Recent',
          showReadingTime: true,
          postsPerPage: 10,
          // 添加默认作者
          authorsMapPath: 'authors.yml',
          defaultAuthor: {
            name: '变量人生',
            url: 'https://github.com/hhhh-wang'
          },
          onInlineAuthors: 'ignore'
        },
      },
    ],
  ],
} 