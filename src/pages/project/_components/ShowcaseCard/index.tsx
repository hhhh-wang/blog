import Link from '@docusaurus/Link'
import { Tags, type Project } from '@site/data/projects'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'

export default function ShowcaseCard({ project }: { project: Project }) {
  const linkUrl = project.ip || project.website

  return (
    <motion.article
      className="bg-blog shadow-blog group flex h-full flex-col overflow-hidden rounded-xl border border-solid border-transparent transition duration-300 hover:-translate-y-1 hover:border-primary/40"
      initial={{ y: 24, opacity: 0.001 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35 }}
    >
      {project.preview && (
        <Link href={linkUrl} className="block overflow-hidden no-underline hover:no-underline">
          <img
            src={project.preview}
            alt={project.title}
            loading="lazy"
            className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>
      )}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="m-0 line-clamp-1 text-base font-semibold">
          <Link
            href={linkUrl}
            className="text-text no-underline transition hover:text-primary hover:no-underline"
          >
            {project.title}
          </Link>
        </h3>
        <p className="m-0 line-clamp-2 flex-1 text-sm leading-5 text-secondary">{project.description}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.tags.map(tag => (
            <span
              key={tag}
              className="rounded-full px-2 py-0.5 text-xs"
              style={{
                color: Tags[tag].color,
                background: `${Tags[tag].color}15`,
              }}
            >
              {Tags[tag].label}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-auto flex items-center gap-4 border-t border-solid border-border px-4 py-2.5">
        {project.source && (
          <Link
            href={project.source}
            className="inline-flex items-center gap-1 text-xs text-secondary no-underline transition hover:text-primary hover:no-underline"
            onClick={e => e.stopPropagation()}
          >
            <Icon icon="ri:github-line" />
            源码
          </Link>
        )}
        <Link
          href={linkUrl}
          className="inline-flex items-center gap-1 text-xs text-secondary no-underline transition hover:text-primary hover:no-underline"
          onClick={e => e.stopPropagation()}
        >
          <Icon icon="ri:external-link-line" />
          在线访问
        </Link>
      </div>
    </motion.article>
  )
}
