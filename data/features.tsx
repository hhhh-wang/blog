import Translate, { translate } from '@docusaurus/Translate'
import { Icon } from '@iconify/react'
import FrontendSvg from '@site/static/svg/undraw_frontend.svg'
import BackendSvg from '@site/static/svg/undraw_backend.svg'
import LifestyleSvg from '@site/static/svg/undraw_lifestyle.svg'

export type FeatureItem = {
  title: string | React.ReactNode
  description: string | React.ReactNode
  header: React.ReactNode
  icon?: React.ReactNode
}

const FEATURES: FeatureItem[] = [
  {
    title: translate({
      id: 'homepage.feature.frontend',
      message: 'Web前端开发',
    }),
    description: (
      <Translate>
        熟悉前端开发的核心技术栈，能够高效构建响应式、用户友好的网页界面，擅长使用 React 和 Vue 开发单页应用，精通使用 Tailwind 提高开发效率，拥有良好的 TypeScript 和 HTML/CSS 编写习惯。
      </Translate>
    ),
    header: <FrontendSvg className={'h-auto w-full'} height={150} role="img" />,
    icon: <Icon icon="logos:react" className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: translate({
      id: 'homepage.feature.backend',
      message: '服务器后端',
    }),
    description: (
      <Translate>
        掌握 Node.js 和 NestJS 技术栈，能够搭建高效的后端服务，熟悉 Spring Boot 生态，在企业级应用开发中有丰富的经验。能够独立设计并部署高性能、高可用的后端系统。
      </Translate>
    ),
    header: <BackendSvg className={'h-auto w-full'} height={150} role="img" />,
    icon: <Icon icon="logos:nodejs" className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: translate({
      id: 'homepage.feature.lifestyle',
      message: '热爱生活',
    }),
    description: (
      <Translate>
        对技术充满热情，始终保持对新技术的好奇心，积极参与技术社区交流与分享，乐于学习新兴技术。除了编程，我也热衷于阅读和运动、坚信保持积极心态和创造性思维能帮助我在工作中不断突破。
      </Translate>
    ),
    header: <LifestyleSvg className={'h-auto w-full'} height={150} role="img" />,
    icon: <Icon icon="mdi:heart" className="h-4 w-4 text-neutral-500" />,
  },
]

export default FEATURES
