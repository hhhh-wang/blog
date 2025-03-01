import Translate from '@docusaurus/Translate'
import { type Project, projects } from '@site/data/projects'
import Marquee from '@site/src/components/magicui/marquee'
import { Section } from '../Section'

const removeHttp = (url: string) => {
  return url.replace(/(^\w+:|^)\/\//, '')
}

const showProjects = projects.filter(i => i.preview)

const Slider = ({ items }: { items: Project[] }) => {
  return (
    <div className="relative flex min-h-[260px] items-center overflow-hidden">
      {/* 将布尔值 gradient 改为字符串值 "true" 这样可以避免 React 对非布尔属性使用布尔值的警告*/}
      <Marquee pauseOnHover gradient="true" className="[--duration:60s]">
        {items.map(item => {
          const linkUrl = item.ip || item.website
          return (
            <div className="mx-2 h-full w-48 md:w-96" key={item.title}>
              <a className="flex flex-col hover:no-underline" href={linkUrl} target="_blank" rel="noreferrer">
                <img
                  src={item.preview}
                  alt={item.title}
                  className="h-[120px] w-full rounded-lg object-cover md:h-[240px]"
                  loading="lazy"
                />
                <div className="w-full py-2 text-center">
                  <h2 className="m-0 overflow-hidden text-ellipsis whitespace-nowrap font-normal text-xl">
                    {item.title}
                  </h2>
                  <p className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-primary">
                    {removeHttp(item.website)}
                  </p>
                </div>
              </a>
            </div>
          )
        })}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-white dark:from-zinc-900"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-white dark:from-zinc-900"></div>
    </div>
  )
}

export default function ProjectSection() {
  return (
    <Section
      title={<Translate id="homepage.project.title">项目展示</Translate>}
      icon={'ri:projector-line'}
      href={'/project'}
    >
      <Slider items={showProjects} />
    </Section>
  )
}
