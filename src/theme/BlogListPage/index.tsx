import { HtmlClassNameProvider, PageMetadata, ThemeClassNames } from '@docusaurus/theme-common'
import { cn } from '@site/src/lib/utils'
import BackToTopButton from '@theme/BackToTopButton'
import type { Props } from '@theme/BlogListPage'
import BlogListPaginator from '@theme/BlogListPaginator'
import BlogPostItems from '@theme/BlogPostItems'
import SearchMetadata from '@theme/SearchMetadata'

import Translate from '@docusaurus/Translate'
import { Icon } from '@iconify/react'
import { type ViewType, useViewType } from '@site/src/hooks/useViewType'
import BlogPostGridItems from '../BlogPostGridItems'

import MyLayout from '../MyLayout'
import { useState } from 'react'

interface BlogCategory {
  label: string
  folder: string
  count: number
}

interface BlogCategoriesProps {
  categories: BlogCategory[]
  activeCategory: string
  onSelectCategory: (category: string) => void
}

function BlogCategories({ categories, activeCategory, onSelectCategory }: BlogCategoriesProps) {
  return (
    <div className="my-8">
      <div className="flex flex-wrap gap-2 justify-center items-center">
        <button
          className={cn(
            'px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200',
            'hover:shadow-md hover:transform hover:scale-105',
            'border border-transparent',
            activeCategory === 'all'
              ? 'bg-primary text-white shadow-sm hover:bg-primary/90'
              : 'bg-gray-50 text-gray-600 hover:text-primary hover:border-primary/30',
            'dark:bg-gray-800/50 dark:text-gray-300 dark:hover:text-primary',
          )}
          onClick={() => onSelectCategory('all')}
        >
          全部文章
        </button>
        {categories.map((category) => (
          <button
            key={category.label}
            className={cn(
              'px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200',
              'hover:shadow-md hover:transform hover:scale-105',
              'border border-transparent',
              activeCategory === category.label
                ? 'bg-primary text-white shadow-sm hover:bg-primary/90'
                : 'bg-gray-50 text-gray-600 hover:text-primary hover:border-primary/30',
              'dark:bg-gray-800/50 dark:text-gray-300 dark:hover:text-primary',
            )}
            onClick={() => onSelectCategory(category.label)}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </div>
    </div>
  )
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

function ViewTypeSwitch({
  viewType,
  toggleViewType,
}: {
  viewType: ViewType
  toggleViewType: (viewType: ViewType) => void
}): JSX.Element {
  return (
    <div className="my-4 flex items-center justify-center">
      <Icon
        icon="ph:list"
        width="24"
        height="24"
        onClick={() => toggleViewType('list')}
        color={viewType === 'list' ? 'var(--ifm-color-primary)' : '#ccc'}
        className="cursor-pointer transition duration-500"
      />
      <Icon
        icon="ph:grid-four"
        width="24"
        height="24"
        onClick={() => toggleViewType('grid')}
        color={viewType === 'grid' ? 'var(--ifm-color-primary)' : '#ccc'}
        className="cursor-pointer transition duration-500"
      />
    </div>
  )
}

function BlogListPageContent(props: Props) {
  const { metadata, items } = props
  const { viewType, toggleViewType } = useViewType()
  const [activeCategory, setActiveCategory] = useState('all')

  const categories: BlogCategory[] = [
    { 
      label: '开发教程', 
      folder: 'develop',
      count: items.filter(item => 
        item.content.metadata.source.includes('/blog/develop/')
      ).length 
    },
    { 
      label: '技术讨论', 
      folder: 'discuss',
      count: items.filter(item => 
        item.content.metadata.source.includes('/blog/discuss/')
      ).length 
    },
    { 
      label: '生活随笔', 
      folder: 'lifestyle',
      count: items.filter(item => 
        item.content.metadata.source.includes('/blog/lifestyle/')
      ).length 
    },
    { 
      label: '项目实践', 
      folder: 'project',
      count: items.filter(item => 
        item.content.metadata.source.includes('/blog/project/')
      ).length 
    }
  ]

  const filteredItems = activeCategory === 'all' 
    ? items 
    : items.filter(item => {
        const category = categories.find(c => c.label === activeCategory)
        return category && item.content.metadata.source.includes(`/blog/${category.folder}/`)
      })

  return (
    <MyLayout>
      <h2 className="h2 mb-4 flex items-center justify-center text-center">
        <Translate id="theme.blog.title.new">博客</Translate>
      </h2>
      <p className="mb-4 text-center">变量人生：探索人生变量与无限可能的记录</p>

      <ViewTypeSwitch viewType={viewType} toggleViewType={toggleViewType} />

      <BlogCategories 
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />
      
      <div className="row">
        <div className={'col col--12'}>
          <>
            {viewType === 'list' && (
              <div className="mb-4">
                <BlogPostItems items={filteredItems} />
              </div>
            )}
            {viewType === 'grid' && <BlogPostGridItems items={filteredItems} />}
          </>
          <BlogListPaginator metadata={metadata} />
        </div>
      </div>
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
