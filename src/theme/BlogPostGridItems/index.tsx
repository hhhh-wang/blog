import Link from '@docusaurus/Link'
import { cn } from '@site/src/lib/utils'
import Tag from '@site/src/theme/Tag'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'

import styles from './styles.module.css'

// 归一化后的文章卡片数据（由 BlogListPage 统一整理，兼容分页 items 与插件全量 posts 两种来源）
export type PostCardData = {
  title: string
  permalink: string
  date: string
  tags: { label: string; permalink?: string; description?: string }[]
  description?: string
  readingTime?: number
  sticky?: number
}

export default function BlogPostGridItems({ posts }: { posts: PostCardData[] }): JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-4 py-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, i) => (
        <motion.article
          key={post.permalink}
          className="h-full"
          initial={{ y: 24, opacity: 0.001 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.35, delay: (i % 3) * 0.05 }}
        >
          <Link
            href={post.permalink}
            className={cn(
              'bg-blog shadow-blog group relative flex h-full flex-col gap-2 rounded-xl border border-solid border-transparent p-5 no-underline transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:no-underline',
              post.sticky && styles.blogSticky,
            )}
          >
            <h4 className="m-0 text-base font-semibold leading-6 text-text transition group-hover:text-primary">
              {post.title}
            </h4>
            {post.description && (
              <p className="m-0 line-clamp-2 flex-1 text-sm leading-5 text-secondary">{post.description}</p>
            )}
            <div className="mt-auto flex items-center justify-between gap-2 pt-2">
              <div className={cn(styles.blogTags, 'flex min-w-0 items-center gap-1.5 text-xs text-secondary')}>
                {post.tags.slice(0, 2).map(tag =>
                  tag.permalink ? (
                    <Tag
                      key={tag.permalink}
                      label={tag.label}
                      description={tag.description}
                      permalink={tag.permalink}
                      className="tag"
                    />
                  ) : (
                    <span key={tag.label} className="text-xs text-secondary">
                      {tag.label}
                    </span>
                  ),
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2.5 text-xs text-secondary">
                {post.readingTime != null && (
                  <span className="inline-flex items-center gap-0.5 whitespace-nowrap">
                    <Icon icon="ri:time-line" />
                    {post.readingTime} 分钟
                  </span>
                )}
                <span className="inline-flex items-center gap-0.5 whitespace-nowrap">
                  <Icon icon="ri:calendar-line" />
                  {post.date}
                </span>
              </div>
            </div>
          </Link>
        </motion.article>
      ))}
    </div>
  )
}
