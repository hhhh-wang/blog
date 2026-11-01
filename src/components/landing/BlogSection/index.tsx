import Link from '@docusaurus/Link'
import Translate from '@docusaurus/Translate'
import type { BlogPost } from '@docusaurus/plugin-content-blog'
import { usePluginData } from '@docusaurus/useGlobalData'
import { cn } from '@site/src/lib/utils'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import { Section } from '../Section'

const FEATURED_POSTS_COUNT = 5

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

// 归一化标签：插件数据里 tags 可能是字符串/对象/数组
const normalizeTags = (tags: unknown): { label: string; permalink?: string }[] => {
  if (Array.isArray(tags)) return tags
  if (tags && typeof tags === 'object') return [tags as { label: string }]
  if (typeof tags === 'string') return [{ label: tags }]
  return []
}

function PostTags({ post }: { post: BlogPost }) {
  const tags = normalizeTags(post.metadata.tags).slice(0, 2)
  if (tags.length === 0) {
    return null
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map(tag => (
        <Link
          key={tag.permalink}
          href={tag.permalink}
          className="bg-blog-shade rounded-full px-2 py-0.5 text-xs text-secondary no-underline transition hover:no-underline hover:text-primary"
        >
          {tag.label}
        </Link>
      ))}
    </div>
  )
}

function PostCover({ post, className }: { post: BlogPost; className?: string }) {
  const { title, frontMatter } = post.metadata
  const [failed, setFailed] = useState(false)

  if (frontMatter?.image && !failed) {
    return (
      <div className={cn('overflow-hidden', className)}>
        <img
          src={frontMatter.image}
          alt={title}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
    )
  }
  return (
    <div
      className={cn(
        'flex items-center justify-center bg-gradient-to-br from-[rgba(18,175,250,0.18)] to-[rgba(18,175,250,0.04)]',
        className,
      )}
    >
      <Icon icon="ri:quill-pen-line" className="h-14 w-14 text-primary opacity-50" />
    </div>
  )
}

function FeaturedCard({ post }: { post: BlogPost }) {
  const { metadata } = post
  return (
    <motion.article
      className="bg-blog shadow-blog group h-full"
      initial={{ y: 40, opacity: 0.001 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link href={metadata.permalink} className="flex h-full flex-col no-underline hover:no-underline">
        <PostCover post={post} className="h-52 w-full md:h-64" />
        <div className="flex flex-1 flex-col gap-2 p-5">
          <h3 className="m-0 text-xl font-semibold transition group-hover:text-primary">{metadata.title}</h3>
          <p className="m-0 line-clamp-3 flex-1 text-sm leading-6 text-secondary">{metadata.description}</p>
          <div className="flex items-center justify-between gap-2">
            <PostTags post={post} />
            <span className="flex items-center gap-1 text-xs text-secondary">
              <Icon icon="ri:calendar-line" />
              {formatDate(metadata.date)}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

function SmallCard({ post }: { post: BlogPost }) {
  const { metadata } = post
  return (
    <motion.article
      className="bg-blog shadow-blog group h-full"
      initial={{ y: 40, opacity: 0.001 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link href={metadata.permalink} className="flex h-full flex-col gap-2 p-4 no-underline hover:no-underline">
        <h4 className="m-0 line-clamp-2 text-base font-medium transition group-hover:text-primary">
          {metadata.title}
        </h4>
        <p className="m-0 line-clamp-2 flex-1 text-xs leading-5 text-secondary">{metadata.description}</p>
        <span className="flex items-center gap-1 text-xs text-secondary">
          <Icon icon="ri:calendar-line" />
          {formatDate(metadata.date)}
        </span>
      </Link>
    </motion.article>
  )
}

export default function BlogSection(): JSX.Element {
  const blogData = usePluginData('docusaurus-plugin-content-blog') as {
    posts: BlogPost[]
    postNum: number
    tagNum: number
  }

  const posts = blogData.posts.slice(0, FEATURED_POSTS_COUNT)
  const [featured, ...rest] = posts

  if (blogData.postNum === 0) {
    return <>作者还没开始写博文哦...</>
  }

  return (
    <Section title={<Translate id="homepage.blog.title">近期博客</Translate>} icon="ri:quill-pen-line" href={'/blog'}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {featured && (
          <div className="lg:col-span-3">
            <FeaturedCard post={featured} />
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2">
          {rest.map(post => (
            <SmallCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </Section>
  )
}
