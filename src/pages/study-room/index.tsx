import React, {useState, useEffect, useRef} from 'react';
import Layout from '@theme/Layout';
import {motion} from 'framer-motion';
import {cn} from '@site/src/lib/utils';
import styles from './study-room.module.css';

// 任务状态
type TaskStatus = 'pending' | 'inProgress' | 'completed';

// 任务类型
interface Task {
    id: string;
    content: string;
    status: TaskStatus;
    createdAt: number;
    completedAt?: number;
}

// 番茄记录类型
interface TomatoRecord {
    id: string;
    startTime: number;
    endTime: number;
    taskId?: string;
}

// 时间设置类型
interface TimeSettings {
    focusTime: number; // 专注时间（分钟）
    shortBreakTime: number; // 短休息时间（分钟）
    longBreakTime: number; // 长休息时间（分钟）
}

export default function StudyRoom() {
    // 番茄钟状态
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [isBreak, setIsBreak] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // 默认25分钟
    const [cycles, setCycles] = useState<number>(0);
    const [tomatoCount, setTomatoCount] = useState<number>(0);
    const [totalFocusTime, setTotalFocusTime] = useState<number>(0);

    // 时间设置
    const [timeSettings, setTimeSettings] = useState<TimeSettings>({
        focusTime: 25,
        shortBreakTime: 5,
        longBreakTime: 15
    });

    // 任务管理
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskInput, setNewTaskInput] = useState<string>('');
    const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

    // 历史记录
    const [tomatoRecords, setTomatoRecords] = useState<TomatoRecord[]>([]);

    // 计时器引用
    const timerRef = useRef<number | null>(null);

    // 新增：当用户未启动番茄钟时，圆框显示的时间
    useEffect(() => {
        if (!isRunning) {
            // 当没有运行时，圆框显示设置的专注时间
            setTimeLeft(timeSettings.focusTime * 60);
        }
    }, [timeSettings.focusTime, isRunning]);

    // 初始化：从localStorage加载数据
    useEffect(() => {
        const savedTasks = localStorage.getItem('tomato-tasks');
        if (savedTasks) {
            setTasks(JSON.parse(savedTasks));
        }

        const savedRecords = localStorage.getItem('tomato-records');
        if (savedRecords) {
            setTomatoRecords(JSON.parse(savedRecords));
        }

        const savedTimeSettings = localStorage.getItem('tomato-settings');
        if (savedTimeSettings) {
            setTimeSettings(JSON.parse(savedTimeSettings));
        }

        // 计算总专注时间
        const records = savedRecords ? JSON.parse(savedRecords) : [];
        const total = records.reduce((acc, record) => {
            return acc + (record.endTime - record.startTime) / 1000;
        }, 0);
        setTotalFocusTime(total);
        setTomatoCount(records.length);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    // 保存数据到localStorage
    useEffect(() => {
        localStorage.setItem('tomato-tasks', JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        localStorage.setItem('tomato-records', JSON.stringify(tomatoRecords));
    }, [tomatoRecords]);

    useEffect(() => {
        localStorage.setItem('tomato-settings', JSON.stringify(timeSettings));
    }, [timeSettings]);

    // 格式化时间函数
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // 开始番茄时钟
    const startTomato = () => {
        setIsRunning(true);
        setIsBreak(false);
        setTimeLeft(timeSettings.focusTime * 60);

        timerRef.current = window.setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    completeTomato();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // 开始休息
    const startBreak = () => {
        setIsRunning(true);
        setIsBreak(true);

        // 根据完成的番茄数决定休息时间
        const breakTime = (cycles + 1) % 4 === 0 ? timeSettings.longBreakTime : timeSettings.shortBreakTime;
        setTimeLeft(breakTime * 60);

        timerRef.current = window.setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    completeBreak();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // 停止计时器
    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setIsRunning(false);
        setTimeLeft(timeSettings.focusTime * 60);
    };

    // 完成一个番茄
    const completeTomato = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        setIsRunning(false);
        setCycles(prev => prev + 1);
        setTomatoCount(prev => prev + 1);
        setTotalFocusTime(prev => prev + timeSettings.focusTime * 60);

        // 创建记录
        const newRecord: TomatoRecord = {
            id: Date.now().toString(),
            startTime: Date.now() - timeSettings.focusTime * 60 * 1000,
            endTime: Date.now(),
            taskId: activeTaskId
        };

        setTomatoRecords(prev => [...prev, newRecord]);

        // 如果有活动任务，更新其状态
        if (activeTaskId) {
            setTasks(prev => 
                prev.map(task => 
                    task.id === activeTaskId 
                        ? { ...task, status: 'completed', completedAt: Date.now() } 
                        : task
                )
            );
            setActiveTaskId(null);
        }
    };

    // 完成休息
    const completeBreak = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        setIsRunning(false);
        setIsBreak(false);
        setTimeLeft(timeSettings.focusTime * 60);
    };

    // 添加任务
    const addTask = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newTaskInput.trim()) return;

        const newTask: Task = {
            id: Date.now().toString(),
            content: newTaskInput.trim(),
            status: 'pending',
            createdAt: Date.now()
        };

        setTasks(prev => [...prev, newTask]);
        setNewTaskInput('');
    };

    // 删除任务
    const deleteTask = (id: string) => {
        setTasks(prev => prev.filter(task => task.id !== id));
        if (activeTaskId === id) {
            setActiveTaskId(null);
        }
    };

    // 选择任务
    const selectTask = (id: string) => {
        setActiveTaskId(id);
    };

    // 更新时间设置
    const updateTimeSetting = (key: keyof TimeSettings, value: number) => {
        // 限制输入范围
        let validValue = Math.max(1, Math.min(60, value));
        
        setTimeSettings(prev => ({
            ...prev,
            [key]: validValue
        }));
    };

    return (
        <Layout
            title="开发自习室"
            description="使用番茄工作法提高工作效率，专注于编程和学习"
        >
            <main className={cn(styles.studyRoomContainer, "container margin-vert--lg")}>
                <h1 className="text-3xl font-bold text-center mb-8">开发自习室</h1>
                
                {/* 主要功能区域 - 三列布局 */}
                <div className={styles.mainContent}>
                    {/* 左侧 - 设置区域 */}
                    <motion.div
                        className={styles.settingsSection}
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5, delay: 0.4}}
                    >
                        <h2 className={styles.sectionTitle}>设置</h2>

                        <div className={styles.settingItem}>
                            <label className={styles.settingLabel}>时间设置:</label>
                            
                            <div className={styles.timeSettingsPanel}>
                                <div className={styles.timeSettingItem}>
                                    <label>专注时间 (分钟):</label>
                                    <div className={styles.timeInputGroup}>
                                        <button
                                            className={styles.timeAdjustButton}
                                            onClick={() => updateTimeSetting('focusTime', timeSettings.focusTime - 1)}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={timeSettings.focusTime}
                                            onChange={(e) => updateTimeSetting('focusTime', parseInt(e.target.value) || 25)}
                                            min="1"
                                            max="60"
                                            className={styles.timeInput}
                                        />
                                        <button
                                            className={styles.timeAdjustButton}
                                            onClick={() => updateTimeSetting('focusTime', timeSettings.focusTime + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.timeSettingItem}>
                                    <label>短休息时间 (分钟):</label>
                                    <div className={styles.timeInputGroup}>
                                        <button
                                            className={styles.timeAdjustButton}
                                            onClick={() => updateTimeSetting('shortBreakTime', timeSettings.shortBreakTime - 1)}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={timeSettings.shortBreakTime}
                                            onChange={(e) => updateTimeSetting('shortBreakTime', parseInt(e.target.value) || 5)}
                                            min="1"
                                            max="30"
                                            className={styles.timeInput}
                                        />
                                        <button
                                            className={styles.timeAdjustButton}
                                            onClick={() => updateTimeSetting('shortBreakTime', timeSettings.shortBreakTime + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.timeSettingItem}>
                                    <label>长休息时间 (分钟):</label>
                                    <div className={styles.timeInputGroup}>
                                        <button
                                            className={styles.timeAdjustButton}
                                            onClick={() => updateTimeSetting('longBreakTime', timeSettings.longBreakTime - 1)}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={timeSettings.longBreakTime}
                                            onChange={(e) => updateTimeSetting('longBreakTime', parseInt(e.target.value) || 15)}
                                            min="5"
                                            max="60"
                                            className={styles.timeInput}
                                        />
                                        <button
                                            className={styles.timeAdjustButton}
                                            onClick={() => updateTimeSetting('longBreakTime', timeSettings.longBreakTime + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.timePresets}>
                                    <button
                                        className={styles.presetButton}
                                        onClick={() => setTimeSettings({
                                            focusTime: 25,
                                            shortBreakTime: 5,
                                            longBreakTime: 15
                                        })}
                                    >
                                        标准 (25-5-15)
                                    </button>
                                    <button
                                        className={styles.presetButton}
                                        onClick={() => setTimeSettings({
                                            focusTime: 50,
                                            shortBreakTime: 10,
                                            longBreakTime: 30
                                        })}
                                    >
                                        长专注 (50-10-30)
                                    </button>
                                    <button
                                        className={styles.presetButton}
                                        onClick={() => setTimeSettings({
                                            focusTime: 15,
                                            shortBreakTime: 3,
                                            longBreakTime: 10
                                        })}
                                    >
                                        短专注 (15-3-10)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 中间 - 番茄钟区域 */}
                    <motion.div
                        className={cn(styles.timerSection, isBreak ? styles.breakMode : '')}
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5}}
                    >
                        <div className={styles.timerDisplay}>
                            <h2 className={styles.timerTitle}>{isBreak ? '休息时间' : '专注时间'}</h2>
                            <div className={styles.timerCircle}>
                                <span className={styles.time}>{formatTime(timeLeft)}</span>
                            </div>
                            <div className={styles.timerStats}>
                                <div>番茄：{tomatoCount} 个</div>
                                <div>循环：{cycles} 轮</div>
                                <div>总专注：{Math.floor(totalFocusTime / 60)} 分钟</div>
                            </div>
                        </div>

                        <div className={styles.timerControls}>
                            {!isRunning ? (
                                <>
                                    <button
                                        className={cn(styles.timerButton, styles.startButton)}
                                        onClick={startTomato}
                                    >
                                        开始专注 ({timeSettings.focusTime}分钟)
                                    </button>
                                    <button
                                        className={cn(styles.timerButton, styles.breakButton)}
                                        onClick={startBreak}
                                    >
                                        开始休息
                                    </button>
                                </>
                            ) : (
                                <button
                                    className={cn(styles.timerButton, styles.stopButton)}
                                    onClick={stopTimer}
                                >
                                    停止
                                </button>
                            )}
                        </div>

                        <div className={styles.progressIndicator}>
                            {Array.from({length: 12}, (_, i) => {
                                const hour = i + 8; // 从早上8点开始
                                const now = new Date();
                                const currentHour = now.getHours();
                                const isCurrentHourBlock = hour === currentHour;
                                
                                return (
                                    <div
                                        key={hour}
                                        className={cn(
                                            styles.hourBlock,
                                            isCurrentHourBlock ? styles.currentHour : ''
                                        )}
                                    >
                                        {hour}
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* 右侧 - 任务区域 */}
                    <motion.div
                        className={styles.tasksSection}
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5, delay: 0.5}}
                    >
                        <h2 className={styles.sectionTitle}>待办事项</h2>

                        <form onSubmit={addTask} className={styles.addTaskForm}>
                            <input
                                type="text"
                                value={newTaskInput}
                                onChange={(e) => setNewTaskInput(e.target.value)}
                                placeholder="输入新任务..."
                                className={styles.taskInput}
                            />
                            <button type="submit" className={styles.addButton}>添加</button>
                        </form>

                        <div className={styles.taskList}>
                            {tasks.length === 0 ? (
                                <div className={styles.emptyState}>暂无任务，添加一个吧！</div>
                            ) : (
                                tasks.map(task => (
                                    <motion.div
                                        key={task.id}
                                        className={cn(
                                            styles.taskItem,
                                            task.status === 'completed' ? styles.completedTask : '',
                                            task.id === activeTaskId ? styles.activeTask : ''
                                        )}
                                        initial={{opacity: 0, y: 10}}
                                        animate={{opacity: 1, y: 0}}
                                        transition={{duration: 0.3}}
                                    >
                                        <div className={styles.taskContent}>
                                            <span className={styles.taskText}>{task.content}</span>
                                            {task.status === 'completed' && (
                                                <span className={styles.completedTag}>已完成</span>
                                            )}
                                        </div>
                                        <div className={styles.taskActions}>
                                            {task.status !== 'completed' && (
                                                <button
                                                    className={styles.selectTaskButton}
                                                    onClick={() => selectTask(task.id)}
                                                    disabled={task.id === activeTaskId}
                                                >
                                                    选择
                                                </button>
                                            )}
                                            <button
                                                className={styles.deleteTaskButton}
                                                onClick={() => deleteTask(task.id)}
                                            >
                                                删除
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* 历史记录区域 - 单独一行 */}
                <motion.div
                    className={styles.historySection}
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5, delay: 0.6}}
                >
                    <h2 className={styles.sectionTitle}>历史记录</h2>

                    <div className={styles.historyList}>
                        {tomatoRecords.length === 0 ? (
                            <div className={styles.emptyState}>暂无记录</div>
                        ) : (
                            tomatoRecords.slice(-5).reverse().map(record => {
                                const recordTask = tasks.find(t => t.id === record.taskId);
                                const startDate = new Date(record.startTime);
                                const endDate = new Date(record.endTime);

                                return (
                                    <div key={record.id} className={styles.historyItem}>
                                        <div className={styles.historyTime}>
                                            {startDate.toLocaleTimeString()} - {endDate.toLocaleTimeString()}
                                        </div>
                                        <div className={styles.historyTask}>
                                            {recordTask ? recordTask.content : '无关联任务'}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </motion.div>

                {/* 说明区域 - 单独一行 */}
                <div className={styles.infoSection}>
                    <h2 className={styles.sectionTitle}>关于番茄工作法</h2>
                    <p>
                        番茄工作法是一种时间管理方法，使用定时器将工作分割成固定时长的专注时间块，称为"番茄"，中间穿插着短暂的休息。这种方法可以帮助提高工作效率，减少拖延，增强专注力。
                    </p>
                    <ul>
                        <li>每个番茄时间默认为25分钟，专注于单一任务（可在设置中自定义）</li>
                        <li>完成一个番茄后休息5分钟（可在设置中自定义）</li>
                        <li>每完成4个番茄，休息一个较长时间，默认15分钟（可在设置中自定义）</li>
                        <li>记录完成的番茄数量，追踪进度</li>
                    </ul>
                </div>
            </main>
        </Layout>
    );
} 