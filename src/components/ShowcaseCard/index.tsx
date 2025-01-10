import Link from '@docusaurus/Link'
import { Project } from '@site/data/projects'
import { cn } from '@site/src/lib/utils'

export default function ShowcaseCard({ project }: { project: Project }) {
  return (
    <Link
      href={project.website}
      className="group no-underline"
      style={{ height: '100%' }}
    >
      <div className="card shadow--md transition-transform hover:-translate-y-1">
        {project.preview && (
          <div className="card__image">
            <img
              src={project.preview}
              alt={project.title}
              className="object-cover"
              loading="lazy"
            />
          </div>
        )}
        <div className="card__body">
          <div className="flex items-center justify-between">
            <h4 className="text-base m-0">{project.title}</h4>
          </div>
          <p className="text-sm text-gray-500 mt-2 mb-0">{project.description}</p>
        </div>
        {project.source && (
          <div className="card__footer">
            <div className="button button--secondary button--sm">
              源码
            </div>
          </div>
        )}
      </div>
    </Link>
  )
} 