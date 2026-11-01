import { translate } from '@docusaurus/Translate'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { groupByProjects, projectTypeMap, projects } from '@site/data/projects'
import { cn } from '@site/src/lib/utils'
import ShowcaseCard from './_components/ShowcaseCard'

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'
import { Icon } from '@iconify/react'

import MyLayout from '@site/src/theme/MyLayout'
import { upperFirst } from '@site/src/utils/jsUtils'
import styles from './styles.module.css'

const TITLE = translate({
  id: 'theme.project.title',
  message: '项目',
})
const DESCRIPTION = translate({
  id: 'theme.project.description',
  message: '人生充满不确定性，单纯的知识积累不如在变化中找到真正的应用与转化。这里是我在面对无数可能时，不断调整与进步的写照。',
})

// const GITHUB_URL = 'https://github.com/hhhh-wang'

type ProjectState = {
  scrollTopPosition: number
  focusedElementId: string | undefined
}

export function prepareUserState(): ProjectState | undefined {
  if (ExecutionEnvironment.canUseDOM) {
    return {
      scrollTopPosition: window.scrollY,
      focusedElementId: document.activeElement?.id,
    }
  }

  return undefined
}

function ShowcaseHeader() {
  // 统计信息：项目总数、开源数、产品数（按标签统计）
  const openSourceCount = projects.filter(project => project.tags.includes('opensource')).length
  const productCount = projects.filter(project => project.tags.includes('product')).length

  return (
    <section className="text-center">
      <h1 className="mb-2 text-3xl font-semibold">{TITLE}</h1>
      <p className="mb-2 text-sm text-secondary">{DESCRIPTION}</p>
      <p className="m-0 text-sm text-secondary">
        共 {projects.length} 个项目 · {openSourceCount} 个开源 · {productCount} 个产品
      </p>
    </section>
  )
}

function ShowcaseCards() {
  const { i18n } = useDocusaurusContext()
  const lang = i18n.currentLocale

  if (projects.length === 0) {
    return (
      <section className="margin-top--lg margin-bottom--xl">
        <div className="padding-vert--md container text-center">
          <h2>No result</h2>
        </div>
      </section>
    )
  }

  return (
    <section className="margin-top--lg margin-bottom--xl">
      <div className="container">
        {Object.entries(groupByProjects).map(([key, value]) => (
          <div key={key} className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              {upperFirst(lang === 'en' ? key : projectTypeMap[key])}
              <span className={cn('rounded-full px-2 py-0.5 text-xs font-normal', styles.groupCount)}>{value.length}</span>
            </h2>
            <div className={styles.showcaseList}>
              {value.map(project => (
                <ShowcaseCard key={project.title} project={project} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Showcase(): JSX.Element {
  return (
    <MyLayout title={TITLE} description={DESCRIPTION} maxWidth={1280}>
      <main className="margin-vert--lg">
        <ShowcaseHeader />
        <ShowcaseCards />
      </main>
    </MyLayout>
  )
}

export default Showcase
