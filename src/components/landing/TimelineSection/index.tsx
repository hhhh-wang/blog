import Translate from '@docusaurus/Translate'
import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'
import { NOW_CARDS, TIMELINE } from '@site/data/timeline'
import { Section } from '../Section'
import styles from './styles.module.css'

export default function TimelineSection() {
  return (
    <Section title={<Translate id="homepage.timeline.title">开发历程</Translate>} icon="ri:road-map-line">
      <div className={styles.timeline}>
        {TIMELINE.map((item, i) => (
          <motion.div
            key={item.period}
            className={styles.timelineItem}
            initial={{ y: 30, opacity: 0.001 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <span className={styles.dot} />
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.period}>{item.period}</span>
                <h3 className={styles.direction}>{item.direction}</h3>
                <span className={styles.mode}>
                  <Icon icon="ri:briefcase-4-line" />
                  {item.mode}
                </span>
              </div>
              <div className={styles.stack}>
                {item.stack.map(tech => (
                  <span key={tech} className={styles.stackPill}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className={styles.nowGrid}>
        {NOW_CARDS.map((card, i) => (
          <motion.div
            key={card.title}
            className={styles.nowCard}
            initial={{ y: 30, opacity: 0.001 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Icon icon={card.icon} className={styles.nowIcon} width={28} />
            <div>
              <h4 className={styles.nowTitle}>{card.title}</h4>
              <p className={styles.nowDescription}>{card.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
