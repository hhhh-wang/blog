import Translate from '@docusaurus/Translate'
import Link from '@docusaurus/Link'
import { type Project, projects, Tags } from '@site/data/projects'
import { cn } from '@site/src/lib/utils'
import { MagicCard, MagicContainer } from '@site/src/components/magicui/magic-card'
import { Section } from '../Section'

const removeHttp = (url: string) => {
  return url.replace(/(^\w+:|^)\/\//, '')
}

const FEATURED_PROJECTS_COUNT = 5
const showProjects = projects.filter(i => i.preview).slice(0, FEATURED_PROJECTS_COUNT)

function ProjectCard({ project, large }: { project: Project; large?: boolean }) {
  const linkUrl = project.ip || project.website
  return (
    <MagicCard
      className={cn('overflow-hidden border border-solid border-border p-px', large && 'md:col-span-2')}
      borderColor="var(--ifm-color-primary)"
      size={420}
    >
      <Link
        href={linkUrl}
        className="group flex h-full flex-col rounded-[15px] bg-background no-underline hover:no-underline"
      >
        <div className="overflow-hidden rounded-t-[15px]">
          <img
            src={project.preview}
            alt={project.title}
            loading="lazy"
            className="h-44 w-full object-cover transition duration-500 group-hover:scale-105 md:h-52"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-4">
          <h3 className="m-0 line-clamp-1 text-base font-medium transition group-hover:text-primary">
            {project.title}
          </h3>
          <p className="m-0 line-clamp-2 flex-1 text-sm leading-5 text-secondary">{project.description}</p>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
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
            <span className="text-xs text-secondary">{removeHttp(linkUrl)}</span>
          </div>
        </div>
      </Link>
    </MagicCard>
  )
}

export default function ProjectSection() {
  return (
    <Section
      title={<Translate id="homepage.project.title">项目展示</Translate>}
      icon={'ri:projector-line'}
      href={'/project'}
    >
      <MagicContainer className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {showProjects.map((project, i) => (
          <ProjectCard key={project.title} project={project} large={i === 0} />
        ))}
      </MagicContainer>
    </Section>
  )
}
