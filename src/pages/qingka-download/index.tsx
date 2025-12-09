import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import styles from './styles.module.css';

export default function QingkaDownloadPage() {
    const [activeTab, setActiveTab] = useState<'android' | 'wechat'>('android');

    return (
        <Layout
            title="轻卡记 - 智能健康饮食管理工具"
            description="轻卡记 - 一款简洁、高效、智能的健康管理应用，帮助您记录饮食、体重、运动数据，实现健康生活。"
        >
            <main className="container margin-vert--lg">
                <div className={styles.heroSection}>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={styles.heroContent}
                    >
                        <h1 className={styles.heroTitle}>轻卡记</h1>
                        <p className={styles.heroSubtitle}>智能健康饮食管理助手</p>
                        <p className={styles.heroDescription}>
                            拍照记录饮食，智能分析营养成分，科学规划健康生活
                        </p>
                        
                    </motion.div>
                    <motion.div 
                        className={styles.heroImage}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <img src="https://bianliangrensheng.cn/gImage/content/qingka-home.png" alt="轻卡记应用截图" />
                    </motion.div>
                </div>

                <motion.div 
                    className={styles.featuresSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <h2 className={styles.sectionTitle}>主要功能</h2>
                    <div className={styles.featuresGrid}>
                        <div className={styles.featureCard}>
                            <Icon icon="ri:camera-3-line" className={styles.featureIcon} />
                            <h3>拍照识别</h3>
                            <p>拍摄食物照片，AI自动识别热量和营养成分</p>
                        </div>
                        <div className={styles.featureCard}>
                            <Icon icon="ri:pie-chart-2-line" className={styles.featureIcon} />
                            <h3>营养分析</h3>
                            <p>生成营养摄入图表，直观展示饮食健康状况</p>
                        </div>
                        <div className={styles.featureCard}>
                            <Icon icon="ri:heart-pulse-line" className={styles.featureIcon} />
                            <h3>健康目标</h3>
                            <p>根据减脂、增肌等目标，智能推荐个性化食谱</p>
                        </div>
                        <div className={styles.featureCard}>
                            <Icon icon="ri:water-flash-line" className={styles.featureIcon} />
                            <h3>全面记录</h3>
                            <p>追踪体重、饮水量、运动数据，全方位健康管理</p>
                        </div>
                        <div className={styles.featureCard}>
                            <Icon icon="ri:robot-line" className={styles.featureIcon} />
                            <h3>AI营养顾问</h3>
                            <p>智能分析饮食习惯，提供专业营养建议和改进方案</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    className={styles.downloadSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <h2 className={styles.sectionTitle}>下载应用</h2>
                    <div className={styles.tabs}>
                        <button 
                            className={`${styles.tab} ${activeTab === 'android' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('android')}
                        >
                            <Icon icon="ri:android-fill" width="20" className="mr-2" />
                            Android APK
                        </button>
                        <button 
                            className={`${styles.tab} ${activeTab === 'wechat' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab('wechat')}
                        >
                            <Icon icon="ri:wechat-fill" width="20" className="mr-2" />
                            微信小程序
                        </button>
                    </div>
 
                    <div className={styles.downloadContent}>
                        {activeTab === 'android' && (
                            <div className={styles.downloadCard}>
                                <Icon icon="ri:android-fill" className={styles.downloadIcon} />
                                <h3>Android 版本</h3>
                                <p>版本：1.0.0 | 大小：33MB</p>
                                <div className={styles.downloadButtons}>
                                    <a href="https://ucdl.25pp.com/fs08/2025/09/09/7/110_3e23eba6bb39f3e17d05ac1cb81b60ca.apk?nrd=0&fname=%E8%BD%BB%E5%8D%A1%E8%AE%B0&productid=2011&packageid=900568632&pkg=plus.H51DF111F&vcode=100&yingid=wdj_web&pos=wdj_web%2Fdetail_normal_dl%2F0&appid=8440800&apprd=8440800&iconUrl=http%3A%2F%2Fandroid-artworks.25pp.com%2Ffs08%2F2025%2F09%2F09%2F5%2F110_2fc211868fe0867641a9ee5f24ee945a_con.png&did=5a6576a5901ecbade43c804805130c04&md5=c5f623b20a71b519fe9d1719a1921bd9" 
                                       className={styles.downloadButton}
                                       download="轻卡记.apk"
                                       target="_blank"
                                       rel="noopener noreferrer"
                                    >
                                        <Icon icon="ri:download-2-line" width="22" className="mr-2" />
                                        下载 APK
                                    </a>
                                </div>
                                <p className={styles.downloadTip}>
                                    <Icon icon="ri:information-line" className="mr-1" />
                                    下载后请允许安装未知来源应用
                                </p>
                            </div>
                        )}
                        
                        {activeTab === 'wechat' && (
                            <div className={styles.downloadCard}>
                                <Icon icon="ri:wechat-fill" className={styles.downloadIcon} />
                                <h3>微信小程序版</h3>
                                <p>版本：1.0.0 | 随时随地记录健康数据</p>
                                <div className={styles.qrcodeContainer}>
                                    <img src="https://bianliangrensheng.cn/gImage/content/qingka-miniprogram-code.jpg" alt="微信小程序码" className={styles.qrcode} />
                                </div>
                                <p className={styles.downloadTip}>
                                    <Icon icon="ri:information-line" className="mr-1" />
                                    请使用微信扫描上方小程序码
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>

                <motion.div 
                    className={styles.screenshotSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <h2 className={styles.sectionTitle}>应用截图</h2>
                    <div className={styles.screenshotGrid}>
                        <div className={styles.screenshotCard}>
                            <img src="https://bianliangrensheng.cn/gImage/content/qingka-app-recognize.png" alt="食物识别界面" />
                            <p>智能食物识别</p>
                        </div>
                        <div className={styles.screenshotCard}>
                            <img src="https://bianliangrensheng.cn/gImage/content/qingka-ai.png" alt="营养分析" />
                            <p>详细营养分析</p>
                        </div>
                        <div className={styles.screenshotCard}>
                            <img src="https://bianliangrensheng.cn/gImage/content/qingka-meal-details.png" alt="健康统计" />
                            <p>健康数据追踪</p>
                        </div>
                        <div className={styles.screenshotCard}>
                            <img src="https://bianliangrensheng.cn/gImage/content/qingka-data.png" alt="数据统计" />
                            <p>全面数据统计</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    className={styles.faqSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <h2 className={styles.sectionTitle}>常见问题</h2>
                    <div className={styles.faqGrid}>
                        <div className={styles.faqCard}>
                            <h3>轻卡记是免费的吗？</h3>
                            <p>轻卡记提供基础功能的免费版本，包括饮食记录和基本分析。高级功能如AI食物识别、个性化饮食方案需要订阅专业版，价格为￥15/月或￥120/年。</p>
                        </div>
                        <div className={styles.faqCard}>
                            <h3>食物识别准确率如何？</h3>
                            <p>我们的AI识别系统已覆盖超过10,000种常见食物，准确率达95%以上。对于复杂或不常见的食物，您也可以手动调整或输入数据。</p>
                        </div>
                        <div className={styles.faqCard}>
                            <h3>如何设置我的健康目标？</h3>
                            <p>在应用的"我的目标"页面，您可以选择减脂、增肌、健康饮食等目标，并设置理想体重、每周运动频率等参数，系统会据此生成个性化建议。</p>
                        </div>
                        <div className={styles.faqCard}>
                            <h3>数据安全性如何保障？</h3>
                            <p>我们采用端到端加密技术，确保您的健康数据安全。所有数据存储在符合隐私保护标准的服务器中，未经您的授权绝不会分享给第三方。</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    className={styles.ctaSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                >
                    <h2>开始使用轻卡记，科学管理健康生活</h2>
                    <p>成为首批体验者，一起探索智能健康管理的全新方式</p>
                </motion.div>
            </main>
        </Layout>
    );
} 