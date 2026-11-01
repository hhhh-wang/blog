import { useEffect, useState } from 'react'
import styles from './styles.module.css'

// 循环打出的模拟终端命令，想改文案直接编辑这个数组
const COMMANDS = [
  'bun run life --mode="独立开发"',
  'git commit -m "又踩一个坑，学到了"',
  'pnpm add 全栈技能 --save',
  'whoami # 全栈开发老登',
]

type Phase = 'typing' | 'holding' | 'deleting'

export default function Typewriter() {
  const [text, setText] = useState('')
  const [phase, setPhase] = useState<Phase>('typing')
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const command = COMMANDS[index]
    let timer: ReturnType<typeof setTimeout>

    if (phase === 'typing') {
      timer = setTimeout(() => {
        const next = command.slice(0, text.length + 1)
        setText(next)
        if (next === command) {
          setPhase('holding')
        }
      }, 90)
    } else if (phase === 'holding') {
      timer = setTimeout(() => setPhase('deleting'), 2200)
    } else {
      timer = setTimeout(() => {
        if (text.length === 0) {
          setPhase('typing')
          setIndex(i => (i + 1) % COMMANDS.length)
        } else {
          setText(text.slice(0, -1))
        }
      }, 35)
    }

    return () => clearTimeout(timer)
  }, [text, phase, index])

  return (
    <div className={styles.terminal}>
      <span className={styles.terminalPrompt}>➜ ~</span>
      <span className={styles.terminalText}>{text}</span>
      <span className={styles.terminalCursor} />
    </div>
  )
}
