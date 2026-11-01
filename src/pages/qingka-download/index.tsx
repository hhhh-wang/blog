import React from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'

import MyLayout from '@site/src/theme/MyLayout'
import styles from './styles.module.css'

const APK_URL =
  'https://ucdl.25pp.com/fs08/2025/09/09/7/110_3e23eba6bb39f3e17d05ac1cb81b60ca.apk?nrd=0&fname=%E8%BD%BB%E5%8D%A1%E8%AE%B0&productid=2011&packageid=900568632&pkg=plus.H51DF111F&vcode=100&yingid=wdj_web&pos=wdj_web%2Fdetail_normal_dl%2F0&appid=8440800&apprd=8440800&iconUrl=http%3A%2F%2Fandroid-artworks.25pp.com%2Ffs08%2F2025%2F09%2F09%2F5%2F110_2fc211868fe0867641a9ee5f24ee945a_con.png&did=5a6576a5901ecbade43c804805130c04&md5=c5f623b20a71b519fe9d1719a1921bd9'

const FEATURES = [
  { icon: 'ri:camera-3-line', title: '拍照识别', desc: '拍摄食物照片，AI自动识别热量和营养成分' },
  { icon: 'ri:pie-chart-2-line', title: '营养分析', desc: '生成营养摄入图表，直观展示饮食健康状况' },
  { icon: 'ri:heart-pulse-line', title: '健康目标', desc: '根据减脂、增肌等目标，智能推荐个性化食谱' },
  { icon: 'ri:water-flash-line', title: '全面记录', desc: '追踪体重、饮水量、运动数据，全方位健康管理' },
  { icon: 'ri:robot-line', title: 'AI营养顾问', desc: '智能分析饮食习惯，提供专业营养建议和改进方案' },
]

const SCREENSHOTS = [
  { src: 'https://bianliangrensheng.cn/gImage/content/qingka-app-recognize.png', caption: '智能食物识别' },
  { src: 'https://bianliangrensheng.cn/gImage/content/qingka-ai.png', caption: '详细营养分析' },
  { src: 'https://bianliangrensheng.cn/gImage/content/qingka-meal-details.png', caption: '健康数据追踪' },
  { src: 'https://bianliangrensheng.cn/gImage/content/qingka-data.png', caption: '全面数据统计' },
]

const FAQS = [
  {
    q: '轻卡记是免费的吗？',
    a: '轻卡记提供基础功能的免费版本，包括饮食记录和基本分析。高级功能如AI食物识别、个性化饮食方案需要订阅专业版，价格为￥15/月或￥120/年。',
  },
  {
    q: '食物识别准确率如何？',
    a: '我们的AI识别系统已覆盖超过10,000种常见食物，准确率达95%以上。对于复杂或不常见的食物，您也可以手动调整或输入数据。',
  },
  {
    q: '如何设置我的健康目标？',
    a: '在应用的"我的目标"页面，您可以选择减脂、增肌、健康饮食等目标，并设置理想体重、每周运动频率等参数，系统会据此生成个性化建议。',
  },
  {
    q: '数据安全性如何保障？',
    a: '我们采用端到端加密技术，确保您的健康数据安全。所有数据存储在符合隐私保护标准的服务器中，未经您的授权绝不会分享给第三方。',
  },
]

function SectionTitle({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
      <Icon icon={icon} className="text-green-600 dark:text-green-500" />
      {children}
    </h2>
  )
}

export default function QingkaDownloadPage() {
  return (
    <MyLayout
      title="轻卡记 - 智能健康饮食管理工具"
      description="轻卡记 - 一款简洁、高效、智能的健康管理应用，帮助您记录饮食、体重、运动数据，实现健康生活。"
    >
      <main>
        {/* Hero：左文案 + 右应用截图 */}
        <section className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="m-0 text-4xl font-bold">轻卡记</h1>
            <p className="mb-3 mt-2 text-xl font-medium text-green-600 dark:text-green-500">智能健康饮食管理助手</p>
            <p className="m-0 leading-7 text-secondary">拍照记录饮食，智能分析营养成分，科学规划健康生活</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={APK_URL}
                download="轻卡记.apk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white no-underline transition hover:bg-green-700 hover:no-underline dark:bg-green-500 dark:hover:bg-green-400"
              >
                <Icon icon="ri:download-2-line" width={18} />
                下载 APK
              </a>
              <a
                href="#download"
                className="inline-flex items-center gap-2 rounded-xl border border-solid border-border bg-background px-5 py-3 text-sm font-semibold text-text no-underline transition hover:border-primary/50 hover:text-primary hover:no-underline"
              >
                <Icon icon="ri:wechat-fill" width={18} />
                微信小程序
              </a>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <img
              src="https://bianliangrensheng.cn/gImage/content/qingka-home.png"
              alt="轻卡记应用截图"
              loading="lazy"
              className={`${styles.heroImage} mx-auto w-full max-w-xs rounded-2xl border border-solid border-border object-cover shadow-blog`}
            />
          </motion.div>
        </section>

        {/* 主要功能 */}
        <motion.section
          className="mt-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45 }}
        >
          <SectionTitle icon="ri:sparkling-2-line">主要功能</SectionTitle>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {FEATURES.map(feature => (
              <div
                key={feature.title}
                className="bg-blog shadow-blog rounded-xl border border-solid border-transparent p-4 transition duration-300 hover:-translate-y-1 hover:border-primary/40"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-600/10 dark:bg-green-500/15">
                  <Icon icon={feature.icon} width={22} className="text-green-600 dark:text-green-500" />
                </div>
                <h3 className="m-0 text-sm font-semibold">{feature.title}</h3>
                <p className="mb-0 mt-1 text-xs leading-5 text-secondary">{feature.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* 下载应用：Android / 微信小程序双卡 */}
        <motion.section
          id="download"
          className="mt-16 scroll-mt-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45 }}
        >
          <SectionTitle icon="ri:download-2-line">下载应用</SectionTitle>
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
            <div className="bg-blog shadow-blog flex flex-col items-center rounded-xl border border-solid border-transparent p-6 text-center">
              <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600/10 dark:bg-green-500/15">
                <Icon icon="ri:android-fill" width={30} className="text-green-600 dark:text-green-500" />
              </div>
              <h3 className="m-0 text-base font-semibold">Android 版本</h3>
              <p className="mb-4 mt-1 text-xs text-secondary">版本 1.0.0 · 大小 33MB</p>
              <a
                href={APK_URL}
                download="轻卡记.apk"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-2.5 text-sm font-semibold text-white no-underline transition hover:bg-green-700 hover:no-underline dark:bg-green-500 dark:hover:bg-green-400"
              >
                <Icon icon="ri:download-2-line" width={18} />
                下载 APK
              </a>
              <p className="mb-0 mt-3 inline-flex items-center gap-1 text-xs text-secondary">
                <Icon icon="ri:information-line" />
                下载后请允许安装未知来源应用
              </p>
            </div>
            <div className="bg-blog shadow-blog flex flex-col items-center rounded-xl border border-solid border-transparent p-6 text-center">
              <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600/10 dark:bg-green-500/15">
                <Icon icon="ri:wechat-fill" width={30} className="text-green-600 dark:text-green-500" />
              </div>
              <h3 className="m-0 text-base font-semibold">微信小程序</h3>
              <p className="mb-4 mt-1 text-xs text-secondary">随时随地记录健康数据</p>
              <div className="rounded-xl border border-solid border-border bg-background p-2">
                <img
                  src="https://bianliangrensheng.cn/gImage/content/qingka-miniprogram-code.jpg"
                  alt="微信小程序码"
                  loading="lazy"
                  className="h-36 w-36 rounded-lg object-cover"
                />
              </div>
              <p className="mb-0 mt-3 inline-flex items-center gap-1 text-xs text-secondary">
                <Icon icon="ri:information-line" />
                请使用微信扫描上方小程序码
              </p>
            </div>
          </div>
        </motion.section>

        {/* 应用截图：横向滑动浏览 */}
        <motion.section
          className="mt-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45 }}
        >
          <SectionTitle icon="ri:image-line">应用截图</SectionTitle>
          <div className={styles.screenshotStrip}>
            {SCREENSHOTS.map(screenshot => (
              <figure key={screenshot.src} className="m-0">
                <img
                  src={screenshot.src}
                  alt={screenshot.caption}
                  loading="lazy"
                  className="h-80 w-auto rounded-xl border border-solid border-border object-cover"
                />
                <figcaption className="mt-2 text-center text-xs text-secondary">{screenshot.caption}</figcaption>
              </figure>
            ))}
          </div>
        </motion.section>

        {/* 常见问题：折叠面板 */}
        <motion.section
          className="mt-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45 }}
        >
          <SectionTitle icon="ri:question-line">常见问题</SectionTitle>
          <div className="mx-auto flex max-w-3xl flex-col gap-3">
            {FAQS.map(faq => (
              <details
                key={faq.q}
                className="bg-blog shadow-blog group rounded-xl border border-solid border-transparent transition open:border-primary/30"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <Icon icon="ri:arrow-down-s-line" className="shrink-0 text-secondary transition group-open:rotate-180" />
                </summary>
                <p className="mb-0 px-4 pb-4 text-sm leading-6 text-secondary">{faq.a}</p>
              </details>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          className="mt-16 rounded-2xl bg-gradient-to-r from-[rgba(34,197,94,0.12)] to-[rgba(18,175,250,0.10)] p-8 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45 }}
        >
          <h2 className="m-0 text-xl font-semibold">开始使用轻卡记，科学管理健康生活</h2>
          <p className="mb-5 mt-2 text-sm text-secondary">成为首批体验者，一起探索智能健康管理的全新方式</p>
          <a
            href={APK_URL}
            download="轻卡记.apk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white no-underline transition hover:bg-green-700 hover:no-underline dark:bg-green-500 dark:hover:bg-green-400"
          >
            <Icon icon="ri:download-2-line" width={18} />
            立即下载
          </a>
        </motion.section>
      </main>
    </MyLayout>
  )
}
