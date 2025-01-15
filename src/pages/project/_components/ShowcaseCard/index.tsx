import Link from '@docusaurus/Link'
import { Project } from '@site/data/projects'
import { Tags } from '@site/data/projects'
import { motion } from 'framer-motion'

export default function ShowcaseCard({ project }: { project: Project }) {
  const linkUrl = project.ip || project.website

  return (
    <Link
      href={linkUrl}
      className="group no-underline"
      style={{ height: '100%' }}
    >
      <motion.div
        whileHover={{ y: -5 }}
        className="card h-full"
      >
        {project.preview && (
          <div className="card__image" style={{ height: '200px' }}>
            <img
              src={project.preview}
              alt={project.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        <div className="card__body">
          <div className="flex items-center justify-between">
            <h4 className="text-base m-0">{project.title}</h4>
          </div>
          <p className="text-sm text-gray-500 mt-2 mb-0">{project.description}</p>
          <div className="flex gap-2 mt-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full"
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
        {project.source && (
          <div className="card__footer">
            <Link
              href={project.source}
              className="button button--secondary button--sm"
              onClick={(e) => e.stopPropagation()}
            >
              源码
            </Link>
          </div>
        )}
      </motion.div>
    </Link>
  )
}
