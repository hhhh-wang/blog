// eslint-disable-next-line @typescript-eslint/no-var-requires
const blogPluginExports = require('@docusaurus/plugin-content-blog')
const { default: blogPlugin } = blogPluginExports
const { submitToIndexNow } = require('./IndexNow');

async function blogPluginEnhanced(context, options) {
  const blogPluginInstance = await blogPlugin(context, options)
  const { postsPerPage } = options
  const { siteConfig } = context;
  const siteUrl = siteConfig.url;
  
  // 从配置中获取 IndexNow 设置
  const indexNowConfig = siteConfig.customFields?.indexNow || {};
  const host = new URL(siteUrl).hostname;

  return {
    ...blogPluginInstance,
    async contentLoaded({ content, allContent, actions }) {
      // Sort blog with sticky
      content.blogPosts.sort((a, b) => (b.metadata.frontMatter.sticky || 0) - (a.metadata.frontMatter.sticky || 0))

      // Group posts by postsPerPage
      const groupedPosts = Array.from({ length: Math.ceil(content.blogPosts.length / postsPerPage) }, (_, i) => ({
        items: content.blogPosts.slice(i * postsPerPage, (i + 1) * postsPerPage).map(post => post.id),
      }))

      // Update paginated blog list
      content.blogListPaginated.forEach((page, i) => {
        page.items = groupedPosts[i] ? groupedPosts[i].items : []
      })

      // Create default plugin pages
      await blogPluginInstance.contentLoaded({ content, allContent, actions })

      // Create your additional pages
      const { blogTags } = content
      const { setGlobalData } = actions

      setGlobalData({
         //posts: content.blogPosts.slice(0, 10), // Only store 10 posts
         //posts: content.blogPosts
        // 只保留必要字段来减小存储体积
        posts: content.blogPosts.map(post => ({
          id: post.id,
          metadata: {
            permalink: post.metadata.permalink,
            title: post.metadata.title,
            description: post.metadata.description,
            date: post.metadata.date,
            source: post.metadata.source, // 添加 source 字段用于分类
            tags: post.metadata.tags,  // 保留标签信息用于分类功能
            frontMatter: {
              image: post.metadata.frontMatter?.image || null
            }
          }
        })),
        postNum: content.blogPosts.length,
        tagNum: Object.keys(blogTags).length,
      })

      // 收集所有博客文章的 URL
      const urlList = content.blogPosts.map(post => {
        // 确保 URL 正确生成
        const path = post.metadata.permalink;
        if (!path) {
          console.warn('Post permalink is undefined:', post.id);
          return null;
        }
        return `${siteUrl}${path}`;
      }).filter(Boolean); // 过滤掉 null 值

      // 如果有有效的 URL 且配置了 IndexNow key 才提交
      if (urlList.length > 0 && indexNowConfig.key) {
        try {
          await submitToIndexNow(urlList, {
            host,
            key: indexNowConfig.key
          });
          console.log('Successfully submitted URLs to IndexNow:', urlList);
        } catch (error) {
          console.error('Failed to submit URLs to IndexNow:', error.response?.data || error.message);
        }
      } else {
        if (!indexNowConfig.key) {
          console.warn('IndexNow key not configured in docusaurus.config.ts');
        }
        if (urlList.length === 0) {
          console.warn('No valid URLs found to submit to IndexNow');
        }
      }
    },
  }
}

module.exports = Object.assign({}, blogPluginExports, {
  default: blogPluginEnhanced,
});
