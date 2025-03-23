import React, { useState } from 'react';
import { HtmlClassNameProvider, PageMetadata, ThemeClassNames } from '@docusaurus/theme-common';
import { cn } from '@site/src/lib/utils';
import Translate, { translate } from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import { type Variants, motion } from 'framer-motion';
import { usePluginData } from '@docusaurus/useGlobalData';
import MyLayout from '../../theme/MyLayout';
import styles from './styles.module.css';

// 分类数据
const CATEGORIES = {
  develop: {
    name: '开发教程',
    description: '各类技术开发教程和指南',
  },
  discuss: {
    name: '技术讨论',
    description: '关于技术、职业和生活的思考',
  },
  lifestyle: {
    name: '生活随笔',
    description: '记录生活点滴和日常感悟',
  },
  project: {
    name: '项目实践',
    description: '实际项目经验和最佳实践分享',
  },
};

// 页面标题和描述
const TITLE = translate({
  id: 'theme.blog.categories.title',
  message: '文章分类',
});

const DESCRIPTION = translate({
  id: 'theme.blog.categories.description',
  message: '按照不同主题浏览文章，发现更多精彩内容',
});

// 格式化日期函数
const formatDate = dateString => {
  const date = new Date(dateString)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}-${day}`
}

// 动画效果
const variants: Variants = {
  from: { opacity: 0.01, y: 20 },
  to: i => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 100,
      bounce: 0.2,
      duration: 0.3,
      delay: i * 0.05,
    },
  }),
};

// 按分类整理文章 - 简化版，直接根据路径分类
function groupPostsByCategories(posts) {
  const categorizedPosts = {};
  
  // 初始化分类
  Object.keys(CATEGORIES).forEach(category => {
    categorizedPosts[category] = [];
  });
  
  // 分类文章 - 仅根据source路径
  if (posts) {
    posts.forEach(post => {
      const source = post.metadata?.source || '';
      
      // 简单路径匹配
      if (source.includes('blog/develop/')) {
        categorizedPosts['develop'].push(post);
      } else if (source.includes('blog/discuss/')) {
        categorizedPosts['discuss'].push(post);
      } else if (source.includes('blog/lifestyle/')) {
        categorizedPosts['lifestyle'].push(post);
      } else if (source.includes('blog/project/')) {
        categorizedPosts['project'].push(post);
      } else {
        // 默认分类到开发教程
        categorizedPosts['develop'].push(post);
      }
    });
  }
  
  return categorizedPosts;
}

export default function BlogCategoriesPage(): JSX.Element {
  const [activeCategory, setActiveCategory] = useState(null);
  
  // 使用 hook 获取博客数据
  const blogData = usePluginData('docusaurus-plugin-content-blog');
  const posts = blogData?.posts || [];
  
  // 使用修改后的逻辑进行分类
  const postsByCategories = groupPostsByCategories(posts);
  const totalCount = posts.length;
  
  // 获取分类的文章数量
  const getCategoryCount = (category) => {
    return postsByCategories[category]?.length || 0;
  };
  
  // 切换分类显示
  const toggleCategory = (category) => {
    if (activeCategory === category) {
      setActiveCategory(null);
    } else {
      setActiveCategory(category);
    }
  };
  
  return (
    <HtmlClassNameProvider className={ThemeClassNames.wrapper.blogPages}>
      <PageMetadata title={TITLE} description={DESCRIPTION} />
      <MyLayout>
        <div className={styles.categoriesContainer}>
          <h1 className={styles.title}>{TITLE}</h1>
          <p className={styles.description}>{DESCRIPTION}</p>
          
          <div className={styles.statsContainer}>
            当前共有 {totalCount} 篇文章，分为 {Object.keys(CATEGORIES).length} 个分类
          </div>
          
          {Object.keys(CATEGORIES).map((category) => (
            <motion.div 
              key={category}
              initial="from" 
              animate="to" 
              variants={variants}
              className={cn(styles.categoryCard, activeCategory === category && styles.expanded)}
              onClick={() => toggleCategory(category)}
            >
              <div className={styles.categoryHeader}>
                <div className={styles.categoryTitle}>
                  <h2>
                    {CATEGORIES[category].name}
                    <span className={styles.postCount}>
                      {getCategoryCount(category)}篇文章
                    </span>
                  </h2>
                </div>
                <p>{CATEGORIES[category].description}</p>
              </div>

              {activeCategory === category && postsByCategories[category] && (
                <motion.div 
                  className={styles.postsContainer}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  {postsByCategories[category].length === 0 ? (
                    <p className="text-center margin-vert--md">该分类下暂无文章</p>
                  ) : (
                    postsByCategories[category].map((post, i) => (
                      <motion.div 
                        key={post.id} 
                        className={styles.postLinkWrapper}
                        initial="from"
                        animate="to"
                        custom={i}
                        variants={variants}
                      >
                        <Link
                          to={post.metadata.permalink}
                          className={styles.postLink}
                        >
                          <div className={styles.postItem}>
                            <span className={styles.postTitle}>{post.metadata.title}</span>
                            <span className={styles.postDate}>{formatDate(post.metadata.date)}</span>
                          </div>
                        </Link>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </MyLayout>
    </HtmlClassNameProvider>
  );
} 