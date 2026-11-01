import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from '@docusaurus/router';
import { HtmlClassNameProvider, PageMetadata, ThemeClassNames } from '@docusaurus/theme-common';
import { cn } from '@site/src/lib/utils';
import Translate, { translate } from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import { type Variants, motion } from 'framer-motion';
import { Icon } from '@iconify/react';
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
  return `${date.getFullYear()}-${month}-${day}`
}

// 归一化标签：插件数据里 tags 可能是字符串/对象/数组
const normalizeTags = tags => {
  if (Array.isArray(tags)) return tags
  if (tags && typeof tags === 'object') return [tags]
  if (typeof tags === 'string') return [{ label: tags }]
  return []
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

// 把所选分类的文章按年份分组（年份倒序、组内日期倒序）
function groupPostsByYear(posts) {
  const sorted = posts
    .slice()
    .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());
  const byYear = new Map();
  sorted.forEach(post => {
    const year = new Date(post.metadata.date).getFullYear();
    if (!byYear.has(year)) {
      byYear.set(year, []);
    }
    byYear.get(year).push(post);
  });
  // 注意：这里必须用 Array.from 而不是展开运算符——
  // 低版本编译目标会把迭代器展开降级为 [].concat(iterator)，导致元素不是键值对
  return Array.from(byYear.entries()).sort((a, b) => b[0] - a[0]);
}

export default function BlogCategoriesPage(): JSX.Element {
  // 获取站点配置，从中提取博客分类
  const { siteConfig } = useDocusaurusContext();
  const blogCategories = siteConfig.customFields?.blogCategories || {};
  const categoryKeys = Object.keys(blogCategories);

  // 使用 hook 获取博客数据
  const blogData = usePluginData('docusaurus-plugin-content-blog');
  const posts = blogData?.posts || [];

  // 使用配置中的分类信息进行分类
  const postsByCategories = groupPostsByCategories(posts, blogCategories);
  const totalCount = posts.length;

  // 选中分类：默认第一个，支持 ?category=xxx 同步（可分享、刷新保持）
  const location = useLocation();
  const history = useHistory();
  const [activeCategory, setActiveCategory] = useState(categoryKeys[0]);

  useEffect(() => {
    const query = new URLSearchParams(location.search).get('category');
    if (query && categoryKeys.includes(query) && query !== activeCategory) {
      setActiveCategory(query);
    }
  }, [location.search]);

  const selectCategory = (key: string) => {
    setActiveCategory(key);
    history.replace({ ...location, search: `?category=${key}` });
  };

  // 获取分类的文章数量
  const getCategoryCount = (category) => {
    return postsByCategories[category]?.length || 0;
  };

  // 当前分类的文章时间线（按年份分组）
  const activePosts = postsByCategories[activeCategory] || [];
  const postsByYear = useMemo(
    () => groupPostsByYear(activePosts),
    [activeCategory, posts],
  );

  return (
    <HtmlClassNameProvider className={ThemeClassNames.wrapper.blogPages}>
      <PageMetadata title={TITLE} description={DESCRIPTION} />
      <MyLayout>
        <div className={styles.categoriesContainer}>
          <h1 className={styles.pageTitle}>{TITLE}</h1>
          <p className={styles.description}>{DESCRIPTION}</p>

          <div className={styles.statsContainer}>
            当前共有 {totalCount} 篇文章，分为 {categoryKeys.length} 个分类
          </div>

          <div className={styles.categoryGrid}>
            {Object.entries(blogCategories).map(([categoryKey, category]) => {
              const isActive = activeCategory === categoryKey;
              return (
                <button
                  key={categoryKey}
                  type="button"
                  className={cn(styles.categoryCard, isActive && styles.active)}
                  style={{
                    '--cat-color': category.color,
                    boxShadow: isActive ? `0 0 0 3px ${category.color}26` : undefined,
                  } as React.CSSProperties}
                  onClick={() => selectCategory(categoryKey)}
                >
                  <span className={styles.categoryIcon}>
                    <Icon icon={category.icon} width={26} style={{ color: category.color }} />
                  </span>
                  <span className={styles.categoryInfo}>
                    <span className={styles.categoryName}>
                      {category.name}
                      <span className={styles.postCount}>{getCategoryCount(categoryKey)} 篇</span>
                    </span>
                    <span className={styles.categoryDescription}>{category.description}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <motion.div
            key={activeCategory}
            initial="from"
            animate="to"
            variants={variants}
            className={styles.timeline}
          >
            {activePosts.length === 0 ? (
              <p className={styles.emptyState}>该分类下暂无文章</p>
            ) : (
              postsByYear.map(([year, yearPosts]) => (
                <div key={year} className={styles.yearGroup}>
                  <div className={styles.yearBadge}>{year}</div>
                  <div className={styles.postsList}>
                    {yearPosts.map((post, i) => (
                      <motion.div
                        key={post.id}
                        custom={i}
                        initial="from"
                        animate="to"
                        variants={variants}
                      >
                        <Link to={post.metadata.permalink} className={styles.postLink}>
                          <span className={styles.postDate}>{formatDate(post.metadata.date)}</span>
                          <span className={styles.postTitle}>{post.metadata.title}</span>
                          <span className={styles.postTags}>
                            {normalizeTags(post.metadata.tags).slice(0, 2).map(tag => (
                              <span key={tag.permalink ?? tag.label} className={styles.postTag}>
                                {tag.label}
                              </span>
                            ))}
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </motion.div>
        </div>
      </MyLayout>
    </HtmlClassNameProvider>
  );
}
