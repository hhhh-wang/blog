import { type Variants, motion } from 'framer-motion'

import Translate from '@docusaurus/Translate'
import Link from '@docusaurus/Link'
import SocialLinks from '@site/src/components/SocialLinks'
import { MovingButton } from '../../magicui/moving-border'
import Typewriter from './Typewriter'
import styles from './styles.module.css'

const variants: Variants = {
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 100,
      duration: 0.3,
      delay: i * 0.15,
    },
  }),
  hidden: { opacity: 0, y: 30 },
}

function Name() {
  return (
    <motion.div
      className={styles.hero_text}
      custom={1}
      initial="hidden"
      animate="visible"
      variants={variants}
      onMouseMove={e => {
        e.currentTarget.style.setProperty('--x', `${e.clientX}px`)
        e.currentTarget.style.setProperty('--y', `${e.clientY}px`)
      }}
    >
      <Translate id="homepage.hero.greet">你好! 我是</Translate>
      <span
        className={styles.name}
        onMouseMove={e => {
          const bounding = e.currentTarget.getBoundingClientRect()
          e.currentTarget.style.setProperty('--mouse-x', `${bounding.x}px`)
          e.currentTarget.style.setProperty('--mouse-y', `${bounding.y}px`)
        }}
      >
        <Translate id="homepage.hero.name">变量人生</Translate>
      </span>
      <span className="ml-1">👋</span>
    </motion.div>
  )
}

export default function Hero() {
  return (
    <motion.div className={styles.hero}>
      <div className={styles.intro}>
        <Name />
        <motion.p custom={2} initial="hidden" animate="visible" variants={variants} className={styles.tagline}>
          <Translate id="homepage.hero.tagline">
            一名全栈开发的老登，前端后端一把抓，bug报错两手接。这里记录我在技术与工具间的翻滚和挣扎，力求用最不费脑的方式，讲清楚最烧脑的内容。
          </Translate>
        </motion.p>
        <motion.div custom={3} initial="hidden" animate="visible" variants={variants}>
          <Typewriter />
        </motion.div>
        <motion.div custom={4} initial="hidden" animate="visible" variants={variants}>
          <SocialLinks />
        </motion.div>
        <motion.div
          className="mt-4 flex flex-wrap items-center justify-center gap-3"
          custom={5}
          initial="hidden"
          animate="visible"
          variants={variants}
        >
          <Link
            href="/blog"
            className="rounded-2xl border-0 bg-primary px-5 py-3 font-semibold text-white no-underline transition hover:no-underline hover:opacity-90"
          >
            <Translate id="homepage.hero.readBlog">看博客</Translate>
          </Link>
          <MovingButton
            borderRadius="1.25rem"
            className="relative z-10 flex items-center rounded-2xl border border-neutral-200 border-solid bg-background px-5 py-3 text-center font-semibold text-base dark:border-neutral-800"
          >
            <a href={'/about'} className="font-semibold">
              <Translate id="hompage.hero.introduce">自我介绍</Translate>
            </a>
          </MovingButton>
        </motion.div>
      </div>
    </motion.div>
  )
}
