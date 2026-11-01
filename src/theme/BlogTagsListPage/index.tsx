import { HtmlClassNameProvider, PageMetadata, ThemeClassNames, translateTagsPageTitle } from '@docusaurus/theme-common'
import { usePluginData } from '@docusaurus/useGlobalData'
import { cn } from '@site/src/lib/utils'
import Link from '@docusaurus/Link'
import type { Props } from '@theme/BlogTagsListPage'
import SearchMetadata from '@theme/SearchMetadata'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'

import MyLayout from '../MyLayout'

// 热门标签阈值：文章数达到该值的标签进入「热门标签」卡片区
const HOT_TAG_MIN_COUNT = 3
// 热门标签最多展示数量
const HOT_TAG_MAX_COUNT = 12

type TagItem = Props['tags'][number]

function TagPill({ tag }: { tag: TagItem }) {
  return (
    <Link
      href={tag.permalink}
      className="inline-flex items-center gap-1.5 rounded-full border border-solid border-border px-3 py-1 text-sm text-secondary no-underline transition hover:border-primary/50 hover:text-primary hover:no-underline"
    >
      {tag.label}
      <span className="bg-blog-shade rounded-full px-1.5 py-px text-xs leading-4">{tag.count}</span>
    </Link>
  )
}

function HotTagCard({ tag, index }: { tag: TagItem; index: number }) {
  return (
    <motion.div
      initial={{ y: 24, opacity: 0.001 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: (index % 4) * 0.05 }}
    >
      <Link
        href={tag.permalink}
        className="bg-blog shadow-blog group flex items-center justify-between rounded-xl border border-solid border-transparent p-4 no-underline transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:no-underline"
      >
        <div className="min-w-0">
          <div className="truncate font-semibold text-text transition group-hover:text-primary">{tag.label}</div>
          <div className="mt-1 text-xs text-secondary">{tag.count} 篇文章</div>
        </div>
        <Icon
          icon="ri:arrow-right-up-line"
          width={20}
          className="ml-3 shrink-0 text-secondary transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
        />
      </Link>
    </motion.div>
  )
}

export default function BlogTagsListPage({ tags }: Props): JSX.Element {
  const title = translateTagsPageTitle()

  const blogData = usePluginData('docusaurus-plugin-content-blog') as { postNum: number }
  const postNum = blogData?.postNum ?? 0

  // 高频标签进热门区（按文章数倒序），其余按热度倒序紧凑排列
  // 注：不用按字母分组——中文标签按首字分组会产生大量单标签组，观感更乱
  const hotTags = [...tags]
    .filter(tag => tag.count >= HOT_TAG_MIN_COUNT)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, HOT_TAG_MAX_COUNT)
  const hotPermalinks = new Set(hotTags.map(tag => tag.permalink))
  const restTags = tags
    .filter(tag => !hotPermalinks.has(tag.permalink))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))

  return (
    <HtmlClassNameProvider className={cn(ThemeClassNames.wrapper.blogPages, ThemeClassNames.page.blogTagsListPage)}>
      <PageMetadata title={title} />
      <SearchMetadata tag="blog_tags_list" />
      <MyLayout>
        <h1 className="mb-2 text-center text-3xl font-semibold">{title}</h1>
        <p className="mb-6 text-center text-sm text-secondary">
          共 {tags.length} 个标签 · {postNum} 篇文章
        </p>

        {hotTags.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-3 flex items-center gap-1.5 text-base font-semibold">
              <Icon icon="ri:fire-line" className="text-primary" />
              热门标签
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {hotTags.map((tag, i) => (
                <HotTagCard key={tag.permalink} tag={tag} index={i} />
              ))}
            </div>
          </section>
        )}

        {restTags.length > 0 && (
          <section>
            <h2 className="mb-3 flex items-center gap-1.5 text-base font-semibold">
              <Icon icon="ri:price-tag-3-line" className="text-primary" />
              更多标签
            </h2>
            <div className="flex flex-wrap gap-2">
              {restTags.map(tag => (
                <TagPill key={tag.permalink} tag={tag} />
              ))}
            </div>
          </section>
        )}
      </MyLayout>
    </HtmlClassNameProvider>
  )
}
