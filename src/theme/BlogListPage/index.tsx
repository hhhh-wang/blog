import { HtmlClassNameProvider, PageMetadata, ThemeClassNames } from '@docusaurus/theme-common'
import { useHistory, useLocation } from '@docusaurus/router'
import { usePluginData } from '@docusaurus/useGlobalData'
import { cn } from '@site/src/lib/utils'
import BackToTopButton from '@theme/BackToTopButton'
import type { Props } from '@theme/BlogListPage'
import BlogListPaginator from '@theme/BlogListPaginator'
import SearchMetadata from '@theme/SearchMetadata'

import Translate from '@docusaurus/Translate'
import { Icon } from '@iconify/react'
import { useEffect, useMemo, useState } from 'react'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

import MyLayout from '../MyLayout'
import BlogPostGridItems, { type PostCardData } from '../BlogPostGridItems'

const formatDate = (dateString: string) => {
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

// 分页 items（主题数据形态：metadata/frontMatter 在 content 上）→ 卡片数据
function normalizeFromItems(items: Props['items']): PostCardData[] {
  return items.map(({ content }) => {
    const { metadata, frontMatter } = content
    const { title, permalink, date, tags, description, readingTime } = metadata
    return {
      title,
      permalink,
      date: formatDate(date),
      tags: normalizeTags(tags),
      description,
      readingTime: readingTime != null ? Math.ceil(readingTime) : undefined,
      sticky: frontMatter?.sticky,
    }
  })
}

// 插件全量 posts（metadata 里带 frontMatter）→ 卡片数据，按日期倒序
function normalizeFromPluginPosts(posts): PostCardData[] {
  return posts
    .map(post => {
      const m = post.metadata
      return {
        title: m.title,
        permalink: m.permalink,
        date: formatDate(m.date),
        tags: normalizeTags(m.tags),
        description: m.description,
        readingTime: m.readingTime != null ? Math.ceil(m.readingTime) : undefined,
        sticky: m.frontMatter?.sticky,
      }
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

function BlogListPageMetadata(props: Props): JSX.Element {
  const { metadata } = props
  const { blogDescription } = metadata

  return (
    <>
      <PageMetadata title="Blog" description={blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
    </>
  )
}

function BlogListPageContent(props: Props) {
  const { metadata, items } = props

  // 从配置文件获取分类信息（icon/color 供筛选 pills 展示）
  const { siteConfig } = useDocusaurusContext()
  const blogCategoriesConfig = siteConfig.customFields?.blogCategories || {}

  // 全量文章数据：分类计数与跨页筛选都以它为准（items 只有当前页）
  const blogData = usePluginData('docusaurus-plugin-content-blog') as {
    posts: { metadata: { source?: string; date: string } }[]
    postNum: number
  }
  const allPosts = blogData?.posts || []

  const categories = useMemo(
    () =>
      Object.entries(blogCategoriesConfig).map(([key, category]) => ({
        key,
        name: category.name,
        icon: category.icon,
        color: category.color,
        count: allPosts.filter(post =>
          (post.metadata?.source || '').includes(`/blog/${category.folder}/`),
        ).length,
      })),
    [blogCategoriesConfig, allPosts],
  )

  // 选中分类：默认全部，支持 ?category=xxx 同步（可分享、刷新保持）
  const location = useLocation()
  const history = useHistory()
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    const query = new URLSearchParams(location.search).get('category')
    if (query && (query === 'all' || blogCategoriesConfig[query]) && query !== activeCategory) {
      setActiveCategory(query)
    }
  }, [location.search])

  const selectCategory = (key: string) => {
    setActiveCategory(key)
    history.replace({ ...location, search: key === 'all' ? '' : `?category=${key}` })
  }

  const allViewPosts = useMemo(() => normalizeFromItems(items), [items])

  // 选了具体分类时，从全量文章里筛选（不受分页限制）
  const filteredPosts = useMemo(() => {
    if (activeCategory === 'all' || !blogCategoriesConfig[activeCategory]) {
      return null
    }
    const folder = blogCategoriesConfig[activeCategory].folder
    return normalizeFromPluginPosts(
      allPosts.filter(post => (post.metadata?.source || '').includes(`/blog/${folder}/`)),
    )
  }, [activeCategory, allPosts])

  const activeCategoryMeta = categories.find(category => category.key === activeCategory)

  return (
    <MyLayout>
      <h1 className="mb-2 text-center text-3xl font-semibold">
        <Translate id="theme.blog.title.new">博客</Translate>
      </h1>
      <p className="mb-6 text-center text-sm text-secondary">
        共 {blogData?.postNum ?? allPosts.length} 篇文章 · {categories.length} 个分类
      </p>

      <div className="my-4 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => selectCategory('all')}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border border-solid px-4 py-1.5 text-sm font-medium transition',
            activeCategory === 'all'
              ? 'border-transparent bg-primary text-white shadow-sm'
              : 'border-border text-secondary hover:border-primary/40 hover:text-primary',
          )}
        >
          全部文章
        </button>
        {categories.map(category => {
          const isActive = activeCategory === category.key
          return (
            <button
              key={category.key}
              type="button"
              onClick={() => selectCategory(category.key)}
              style={isActive ? { backgroundColor: category.color, borderColor: category.color } : undefined}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border border-solid px-4 py-1.5 text-sm font-medium transition',
                isActive
                  ? 'border-transparent text-white shadow-sm'
                  : 'border-border text-secondary hover:border-primary/40 hover:text-primary',
              )}
            >
              <Icon icon={category.icon} width={15} style={isActive ? undefined : { color: category.color }} />
              {category.name}
              <span className={cn('text-xs', isActive ? 'text-white/80' : 'text-secondary')}>{category.count}</span>
            </button>
          )
        })}
      </div>

      {filteredPosts ? (
        <>
          {activeCategoryMeta && (
            <div className="mb-1 mt-4 flex items-center gap-2 text-lg font-semibold">
              <Icon icon={activeCategoryMeta.icon} style={{ color: activeCategoryMeta.color }} />
              {activeCategoryMeta.name}
              <span className="text-sm font-normal text-secondary">{activeCategoryMeta.count} 篇</span>
            </div>
          )}
          {filteredPosts.length === 0 ? (
            <p className="py-16 text-center text-secondary">该分类下暂无文章</p>
          ) : (
            <BlogPostGridItems posts={filteredPosts} />
          )}
        </>
      ) : (
        <>
          <BlogPostGridItems posts={allViewPosts} />
          <BlogListPaginator metadata={metadata} />
        </>
      )}
      <BackToTopButton />
    </MyLayout>
  )
}

export default function BlogListPage(props: Props): JSX.Element {
  return (
    <HtmlClassNameProvider className={cn(ThemeClassNames.wrapper.blogPages, ThemeClassNames.page.blogListPage)}>
      <BlogListPageMetadata {...props} />
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  )
}
