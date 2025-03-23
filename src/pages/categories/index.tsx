import React, { useState } from 'react';
import { HtmlClassNameProvider, PageMetadata, ThemeClassNames } from '@docusaurus/theme-common';
import { cn } from '@site/src/lib/utils';
import Translate, { translate } from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import { type Variants, motion } from 'framer-motion';
import { usePluginData } from '@docusaurus/useGlobalData';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import MyLayout from '../../theme/MyLayout';
import styles from './styles.module.css';

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

// 按分类整理文章 - 从配置获取分类信息
function groupPostsByCategories(posts, blogCategories) {
  const categorizedPosts = {};
  
  // 初始化分类
  Object.keys(blogCategories).forEach(categoryKey => {
    categorizedPosts[categoryKey] = [];
  });
  
  // 分类文章 - 根据source路径
  if (posts) {
    posts.forEach(post => {
      const source = post.metadata?.source || '';
      
      // 遍历所有分类，查找匹配
      let matched = false;
      Object.entries(blogCategories).forEach(([key, category]) => {
        if (source.includes(`/blog/${category.folder}/`)) {
          categorizedPosts[key].push(post);
          matched = true;
        }
      });
      
      // 如果没有匹配任何分类，添加到第一个分类（默认分类）
      if (!matched && Object.keys(blogCategories).length > 0) {
        const defaultCategoryKey = Object.keys(blogCategories)[0];
        categorizedPosts[defaultCategoryKey].push(post);
      }
    });
  }
  
  return categorizedPosts;
}

export default function BlogCategoriesPage(): JSX.Element {
  const [activeCategory, setActiveCategory] = useState(null);
  
  // 获取站点配置，从中提取博客分类
  const {siteConfig} = useDocusaurusContext();
  const blogCategories = siteConfig.customFields?.blogCategories || {};
  
  // 使用 hook 获取博客数据
  const blogData = usePluginData('docusaurus-plugin-content-blog');
  const posts = blogData?.posts || [];
  
  // 使用配置中的分类信息进行分类
  const postsByCategories = groupPostsByCategories(posts, blogCategories);
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
            当前共有 {totalCount} 篇文章，分为 {Object.keys(blogCategories).length} 个分类
          </div>
          
          {Object.entries(blogCategories).map(([categoryKey, category]) => (
            <motion.div 
              key={categoryKey}
              initial="from" 
              animate="to" 
              variants={variants}
              className={cn(styles.categoryCard, activeCategory === categoryKey && styles.expanded)}
              onClick={() => toggleCategory(categoryKey)}
            >
              <div className={styles.categoryHeader}>
                <div className={styles.categoryTitle}>
                  <h2>
                    {category.name}
                    <span className={styles.postCount}>
                      {getCategoryCount(categoryKey)}篇文章
                    </span>
                  </h2>
                </div>
                <p>{category.description}</p>
              </div>

              {activeCategory === categoryKey && postsByCategories[categoryKey] && (
                <motion.div 
                  className={styles.postsContainer}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  {postsByCategories[categoryKey].length === 0 ? (
                    <p className="text-center margin-vert--md">该分类下暂无文章</p>
                  ) : (
                    postsByCategories[categoryKey].map((post, i) => (
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