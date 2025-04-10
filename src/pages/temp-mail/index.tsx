import React, { useState, useEffect, useRef } from 'react';
import { HtmlClassNameProvider, PageMetadata, ThemeClassNames } from '@docusaurus/theme-common';
import Translate, { translate } from '@docusaurus/Translate';
import { motion } from 'framer-motion';
import axios from 'axios';
import MyLayout from '../../theme/MyLayout';
import clsx from 'clsx';
import styles from './styles.module.css';

// 定义API基础URL
const API_BASE_URL = 'http://127.0.0.1:8080/tempmail';

// 页面标题和描述
const TITLE = translate({
  id: 'theme.tempmail.title',
  message: '临时邮箱',
});

const DESCRIPTION = translate({
  id: 'theme.tempmail.description',
  message: '免费临时邮箱服务，接收验证码和临时邮件，保护您的隐私',
});

// 定义邮件类型接口
interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  html?: string;
  date: string;
  uuid?: string;  // 添加uuid字段
  fromAddress?: string;  // 添加发件人地址
  toAddress?: string;  // 添加收件人地址
  fromName?: string;  // 添加发件人名称
  content?: string;  // 添加邮件内容
  timestamp?: number;  // 添加时间戳
  read?: boolean;  // 添加已读状态
  [key: string]: any;
}

// 格式化日期
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

// 提取纯文本内容
const extractTextFromHtml = (html: string | undefined): string => {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

// 处理 HTML 邮件内容
const processHtmlContent = (html: string): string => {
  if (!html) return '';
  
  // 解码 HTML 实体
  const decodedHtml = html.replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  
  // 提取隐藏的纯文本内容（如果有）
  const hiddenTextMatch = decodedHtml.match(/<div[^>]*style="[^"]*display:none[^"]*"[^>]*>(.*?)<\/div>/s);
  if (hiddenTextMatch) {
    return hiddenTextMatch[1].trim();
  }
  
  return decodedHtml;
};

// 修改邮件内容显示组件
const EmailContent = ({ email }: { email: Email }) => {
  const processedContent = processHtmlContent(email.html || email.content || '');
  
  return (
    <div className={styles.emailBody}>
      {processedContent ? (
        <div 
          className={styles.htmlContent}
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      ) : (
        <div className={styles.plainTextContent}>
          {email.body || '(空白邮件)'}
        </div>
      )}
    </div>
  );
};

export default function TempMailPage(): React.ReactNode {
  // 状态管理
  const [mailToken, setMailToken] = useState<string>('');
  const [mailAddress, setMailAddress] = useState<string>('');
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [waiting, setWaiting] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>('');
  
  // 定时器引用
  const emailCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const emailWaitTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // 复制到剪贴板
  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setSuccess('已复制到剪贴板');
        setTimeout(() => setSuccess(''), 2000);
      })
      .catch((err: Error) => {
        setError('复制失败，请手动复制');
        setTimeout(() => setError(''), 2000);
      });
  };
  
  // 初始化获取token
  const initMailbox = async (): Promise<string | null> => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.post(`${API_BASE_URL}/init`);
      if (response.data.code === 200) {
        setMailToken(response.data.token);
        return response.data.token;
      } else {
        throw new Error(response.data.msg || '初始化邮箱失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '初始化邮箱失败，请稍后再试';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // 生成临时邮箱
  const generateEmail = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      setEmails([]);
      setSelectedEmail(null);
      
      // 确保有token
      let token = mailToken;
      if (!token) {
        const newToken = await initMailbox();
        if (!newToken) return;
        token = newToken;
      }
      
      const headers = { Authorization: token };
      const response = await axios.post(`${API_BASE_URL}/generate`, {}, { headers });
      
      if (response.data.code === 200) {
        setMailAddress(response.data.address);
        setSuccess('邮箱生成成功！');
        setTimeout(() => setSuccess(''), 2000);
        
        // 开始定时检查邮件
        startCheckingEmails();
      } else {
        throw new Error(response.data.msg || '生成邮箱失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '生成邮箱失败，请稍后再试';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // 一次性获取邮箱（初始化 + 生成）
  const getEmail = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      setEmails([]);
      setSelectedEmail(null);
      
      const response = await axios.post(`${API_BASE_URL}/getEmail`);
      
      if (response.data.code === 200) {
        setMailToken(response.data.token);
        setMailAddress(response.data.address);
        setSuccess('邮箱生成成功！');
        setTimeout(() => setSuccess(''), 2000);
        
        // 开始定时检查邮件
        startCheckingEmails();
      } else {
        throw new Error(response.data.msg || '获取邮箱失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取邮箱失败，请稍后再试';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // 获取邮件列表
  const fetchEmails = async (): Promise<void> => {
    if (!mailToken || !mailAddress) return;
    
    try {
      const headers = { Authorization: mailToken };
      const response = await axios.get(`${API_BASE_URL}/emails`, { headers });
      
      if (response.data.code === 200) {
        setEmails(response.data.list || []);
      }
    } catch (error) {
      console.error('获取邮件失败:', error);
      // 不显示错误，因为这是自动轮询
    }
  };
  
  // 开始定时检查邮件
  const startCheckingEmails = (): void => {
    // 清除之前的定时器
    if (emailCheckInterval.current) {
      clearInterval(emailCheckInterval.current);
    }
    
    // 立即执行一次
    fetchEmails();
    
    // 设置定时器，每5秒检查一次
    emailCheckInterval.current = setInterval(fetchEmails, 5000);
  };
  
  // 等待包含关键词的邮件
  const waitForEmail = async (): Promise<void> => {
    if (!mailToken || !mailAddress || !keyword.trim()) {
      setError('请先生成邮箱并输入关键词');
      return;
    }
    
    try {
      setWaiting(true);
      setError('');
      
      const headers = { Authorization: mailToken };
      const params = { keyword: keyword.trim(), timeout: 60000 }; // 60秒超时
      
      // 显示正在等待的消息
      setSuccess('正在等待包含关键词的邮件，最多等待60秒...');
      
      const response = await axios.post(`${API_BASE_URL}/waitForEmail`, params, { headers });
      
      if (response.data.code === 200) {
        // 找到了邮件
        if (response.data.email) {
          setSelectedEmail(response.data.email);
          setSuccess('已找到包含关键词的邮件！');
          
          // 刷新邮件列表
          fetchEmails();
        }
      } else {
        throw new Error(response.data.msg || '未找到包含关键词的邮件');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '等待邮件失败，请稍后再试';
      setError(errorMessage);
    } finally {
      setWaiting(false);
      setSuccess('');
    }
  };
  
  // 获取邮件内容
  const fetchEmailContent = async (uuid: string): Promise<void> => {
    if (!mailToken || !uuid) return;
    
    try {
      setLoading(true);
      setError('');
      
      const headers = { Authorization: mailToken };
      const response = await axios.get(`${API_BASE_URL}/emails/content/${uuid}`, { headers });
      
      if (response.data.code === 200) {
        const emailData = response.data.data;
        setSelectedEmail({
          id: uuid,
          from: emailData.fromName || emailData.fromAddress || '未知发件人',
          to: emailData.toAddress || mailAddress,
          subject: emailData.subject || '(无主题)',
          body: emailData.content || '',
          html: emailData.content,
          date: new Date(emailData.timestamp).toISOString(),
          uuid: emailData.uuid,
          fromAddress: emailData.fromAddress,
          toAddress: emailData.toAddress,
          fromName: emailData.fromName,
          content: emailData.content,
          timestamp: emailData.timestamp,
          read: emailData.read
        });
      } else {
        throw new Error(response.data.msg || '获取邮件内容失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取邮件内容失败，请稍后再试';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // 修改邮件点击事件处理
  const handleEmailClick = (email: Email): void => {
    if (email.uuid) {
      fetchEmailContent(email.uuid);
    } else {
      setSelectedEmail(email);
    }
  };
  
  // 组件卸载时清除定时器
  useEffect(() => {
    return () => {
      if (emailCheckInterval.current) {
        clearInterval(emailCheckInterval.current);
      }
      if (emailWaitTimeout.current) {
        clearTimeout(emailWaitTimeout.current);
      }
    };
  }, []);

  return (
    <HtmlClassNameProvider className={ThemeClassNames.wrapper.blogPages}>
      <PageMetadata title={TITLE} description={DESCRIPTION} />
      <MyLayout>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>{TITLE}</h1>
            <p className={styles.description}>{DESCRIPTION}</p>
          </div>
          
          {/* 控制面板 */}
          <div className={styles.controlPanel}>
            <div className={styles.addressContainer}>
              {mailAddress ? (
                <div className={styles.emailDisplay}>
                  <span className={styles.emailAddress}>{mailAddress}</span>
                  <button 
                    className={styles.copyButton}
                    onClick={() => copyToClipboard(mailAddress)}
                    disabled={loading}
                  >
                    复制
                  </button>
                </div>
              ) : (
                <div className={styles.placeholder}>
                  <span>尚未生成邮箱地址</span>
                </div>
              )}
            </div>
            
            <div className={styles.buttonGroup}>
              <button 
                className={clsx(styles.button, styles.primaryButton)}
                onClick={getEmail}
                disabled={loading || waiting}
              >
                {loading ? '正在生成...' : '生成新邮箱'}
              </button>
              
              {mailAddress && (
                <button 
                  className={clsx(styles.button, styles.secondaryButton)}
                  onClick={fetchEmails}
                  disabled={loading || waiting}
                >
                  刷新邮件
                </button>
              )}
            </div>
            
            {/* 等待特定邮件 */}
            <div className={styles.keywordContainer}>
              <input
                type="text"
                className={styles.keywordInput}
                placeholder="输入关键词 (如：验证码)"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                disabled={!mailAddress || waiting}
              />
              <button 
                className={clsx(styles.button, styles.infoButton)}
                onClick={waitForEmail}
                disabled={!mailAddress || !keyword.trim() || waiting || loading}
              >
                {waiting ? '等待中...' : '等待此关键词邮件'}
              </button>
            </div>
            
            {/* 消息提示 */}
            {error && <div className={styles.errorMessage}>{error}</div>}
            {success && <div className={styles.successMessage}>{success}</div>}
          </div>
          
          {/* 邮件展示区 */}
          <div className={styles.emailContainer}>
            <div className={styles.emailList}>
              <h2 className={styles.sectionTitle}>收件箱</h2>
              {emails.length === 0 ? (
                <div className={styles.emptyState}>
                  {mailAddress ? '暂无邮件，请等待接收' : '请先生成邮箱'}
                </div>
              ) : (
                <div className={styles.emailItems}>
                  {emails.map((email) => (
                    <motion.div
                      key={email.id}
                      className={clsx(
                        styles.emailItem,
                        selectedEmail && selectedEmail.id === email.id && styles.selectedItem
                      )}
                      onClick={() => handleEmailClick(email)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={styles.emailSender}>{email.from || '未知发件人'}</div>
                      <div className={styles.emailSubject}>{email.subject || '(无主题)'}</div>
                      <div className={styles.emailDate}>{formatDate(email.date)}</div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
            <div className={styles.emailContent}>
              <h2 className={styles.sectionTitle}>邮件内容</h2>
              {selectedEmail ? (
                <motion.div
                  className={styles.emailDetailContainer}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.emailHeader}>
                    <h3 className={styles.emailDetailSubject}>{selectedEmail.subject || '(无主题)'}</h3>
                    <div className={styles.emailMeta}>
                      <div className={styles.emailFrom}>
                        <strong>发件人:</strong> {selectedEmail.fromName || selectedEmail.fromAddress || '未知'}
                      </div>
                      <div className={styles.emailTo}>
                        <strong>收件人:</strong> {selectedEmail.toAddress || mailAddress}
                      </div>
                      <div className={styles.emailTimestamp}>
                        <strong>时间:</strong> {formatDate(selectedEmail.date)}
                      </div>
                    </div>
                  </div>
                  <EmailContent email={selectedEmail} />
                </motion.div>
              ) : (
                <div className={styles.emptyState}>
                  {emails.length > 0 ? '请选择一封邮件查看内容' : '暂无邮件可显示'}
                </div>
              )}
            </div>
          </div>
          
          {/* 使用说明 */}
          <div className={styles.instructionsContainer}>
            <h2 className={styles.sectionTitle}>使用说明</h2>
            <div className={styles.instructions}>
              <ol>
                <li>点击"生成新邮箱"按钮获取一个临时邮箱地址</li>
                <li>复制邮箱地址，用于接收验证码或测试邮件</li>
                <li>收到的邮件会自动显示在收件箱中（每5秒自动刷新一次）</li>
                <li>如需等待包含特定内容的邮件（如验证码），可以输入关键词并点击"等待此关键词邮件"</li>
                <li>注意：每个IP每天最多可以生成3个临时邮箱</li>
                <li>临时邮箱的内容不会保存，刷新页面后将丢失</li>
              </ol>
            </div>
          </div>
          
          {/* 隐私说明 */}
          <div className={styles.privacyContainer}>
            <h2 className={styles.sectionTitle}>隐私说明</h2>
            <div className={styles.privacy}>
              <p>
                临时邮箱服务用于接收验证码、测试邮件等临时用途，请勿用于接收重要邮件。
                邮箱内容不会长期保存，且可能被他人查看，请勿用于接收包含个人隐私信息的邮件。
              </p>
            </div>
          </div>
        </div>
      </MyLayout>
    </HtmlClassNameProvider>
  );
}
