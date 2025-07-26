---
id: 1041
slug: frp-internal-network-penetration-tutorial
title: FRP内网穿透教程：轻松实现本地开发环境与公网的连接
authors: [bianliang]
tags: [FRP, 内网穿透, 支付回调, 本地开发, 服务器配置]
keywords: [FRP内网穿透,本地开发环境,支付回调测试,微信支付,支付宝支付,frp配置,内网映射,远程访问]
description: 详细介绍如何使用FRP实现内网穿透，解决本地开发环境接收支付回调的问题。包含服务器端与客户端的完整配置与启动方法，以及常见问题解答。
image: https://bianliangrensheng.cn/gImage/title/frp-network-penetration.png
date: 2025-07-20
---

# FRP内网穿透教程：轻松实现本地开发环境与公网的连接

当我们在进行支付功能开发时，经常会遇到一个问题：支付平台（如支付宝、微信支付）需要向我们的服务器发送支付结果回调，但我们的开发环境通常在本地电脑上。这篇文章将介绍如何使用FRP这款强大的内网穿透工具，让你的本地开发环境能够接收到这些回调请求。

<!-- truncate -->

## 1. FRP简介

### 1.1 什么是FRP
FRP (Fast Reverse Proxy) 是一个高性能的反向代理应用，可以帮助我们将NAT或防火墙后面的本地服务器暴露到公网上。它支持TCP、UDP、HTTP、HTTPS等多种协议，特别适合开发环境中测试第三方回调的场景。

### 1.2 为什么需要内网穿透
在开发支付功能时，支付平台完成用户支付后，会向我们预先设置的回调地址发送通知。但是：

- 本地开发环境通常没有公网IP
- 即使有公网IP，家庭宽带通常会被运营商封锁常用端口
- 企业网络可能有严格的防火墙策略

通过内网穿透，我们可以：
- 将本地开发环境与公网连接
- 接收并处理支付回调请求
- 实时调试支付流程，而无需部署到正式服务器

## 2. 环境准备

### 2.1 所需资源
- 一台有公网IP的服务器（阿里云、腾讯云等）
- FRP客户端和服务端程序

### 2.2 下载FRP
从GitHub上下载最新版本的FRP：
```bash
# 官方下载地址
https://github.com/fatedier/frp/releases
```

根据你的操作系统选择对应的版本：
- Windows: frp_x.xx.x_windows_amd64.zip
- Linux: frp_x.xx.x_linux_amd64.tar.gz
- MacOS: frp_x.xx.x_darwin_amd64.tar.gz

## 3. 服务器端配置

### 3.1 基本配置
在服务器上，我们需要配置并运行frps（FRP Server）。

创建`frps.toml`配置文件：

```toml
# frps.toml
bindPort = 7000
# 设置访问frps的认证token
auth.token = "1234567899"

# 如果需要访问仪表盘（可选）
webServer.addr = "0.0.0.0"
webServer.port = 7500
webServer.user = "admin"
webServer.password = "admin"
```

配置说明：
- `bindPort`: FRP服务端监听的端口，客户端将连接到这个端口
- `auth.token`: 用于客户端和服务端之间的认证
- `webServer`: 配置FRP的Web管理界面（可选）

### 3.2 启动服务
使用以下命令启动FRP服务端：

```bash
./frps -c frps.toml
```

如果你想让它在后台运行：

```bash
nohup ./frps -c frps.toml &
```

### 3.3 设置开机自启（可选）
在Linux系统中，你可以创建一个systemd服务：

```bash
sudo vim /etc/systemd/system/frps.service
```

添加以下内容：

```
[Unit]
Description=Frp Server Service
After=network.target

[Service]
Type=simple
User=nobody
Restart=on-failure
RestartSec=5s
ExecStart=/path/to/frps -c /path/to/frps.toml

[Install]
WantedBy=multi-user.target
```

然后启用并启动服务：

```bash
sudo systemctl enable frps
sudo systemctl start frps
```

## 4. 客户端配置

### 4.1 Windows环境配置
创建`frpc.toml`配置文件：

```toml
# frpc.toml
serverAddr = "106.52.209.18"  # 你的服务器IP
serverPort = 7000
auth.token = "1234567899"  # 必须与frps.toml中的token相同

[[proxies]]
name = "web"
type = "tcp"
localIP = "127.0.0.1"
localPort = 8080
remotePort = 9090  # 公网访问端口
```

配置说明：
- `serverAddr`: 服务器的公网IP
- `serverPort`: FRP服务端监听的端口
- `auth.token`: 与服务端配置中相同的认证令牌
- `proxies`: 代理配置
  - `name`: 代理名称
  - `type`: 协议类型
  - `localIP`: 本地服务IP
  - `localPort`: 本地服务端口
  - `remotePort`: 服务器上映射的端口

### 4.2 启动客户端
在Windows上，打开命令提示符或PowerShell，执行：

```bash
frpc.exe -c frpc.toml
```

### 4.3 HTTP/HTTPS协议配置
如果你需要HTTP/HTTPS协议的支持（比如使用域名访问），可以使用以下配置：

```toml
# frpc.toml中添加
[[proxies]]
name = "web-http"
type = "http"
localPort = 8080
customDomains = ["api.yourdomain.com"]
```

注意：使用HTTP/HTTPS协议需要在frps.toml中增加相应配置，并且需要将域名解析到服务器IP。

## 5. 支付回调测试

### 5.1 配置回调地址
在支付平台（如支付宝、微信支付）的开发者后台，将回调地址设置为：

```
http://你的服务器IP:9090/your-callback-path
```

或者使用HTTP类型代理时：

```
http://api.yourdomain.com/your-callback-path
```

### 5.2 本地服务准备
确保你的本地开发服务已经在配置的端口（如8080）上运行，并且有处理回调的路由。

### 5.3 测试流程
1. 启动FRP服务端和客户端
2. 启动本地开发服务
3. 发起一笔测试支付
4. 检查本地服务是否收到回调请求

## 6. 安全性考虑

:::warning 安全警告
内网穿透工具可能带来安全风险，建议：

1. 使用复杂的认证令牌（不要使用示例中的简单令牌）
2. 只开放必要的端口
3. 配置防火墙限制访问IP
4. 仅在开发测试环境中使用，生产环境应使用正规部署方式
5. 定期更换认证信息
:::

## 7. 常见问题解答

### Q: 客户端提示"login to server failed"怎么办？
A: 检查服务端和客户端的token是否一致，以及服务器的IP和端口是否正确。另外，确保服务器防火墙已开放对应端口。

### Q: 如何确认FRP连接是否正常？
A: 你可以通过访问公网IP:映射端口来测试连接是否成功。如果配置了Web管理界面，也可以登录查看连接状态。

### Q: 支付回调没有收到怎么办？
A: 请检查：
1. FRP客户端和服务端是否正常运行
2. 本地服务是否正常响应
3. 回调URL是否配置正确
4. 服务器防火墙是否开放了对应端口

### Q: 如何在Mac或Linux上配置客户端？
A: Mac/Linux配置与Windows类似，只是启动命令有所不同：
```bash
./frpc -c ./frpc.toml
```

## 8. 进阶使用

### 8.1 多服务映射
你可以在一个客户端配置文件中设置多个代理：

```toml
[[proxies]]
name = "web1"
type = "tcp"
localIP = "127.0.0.1"
localPort = 8080
remotePort = 9090

[[proxies]]
name = "web2"
type = "tcp"
localIP = "127.0.0.1"
localPort = 3000
remotePort = 9091
```

### 8.2 负载均衡（集群模式）
FRP支持集群模式，可以实现负载均衡：

```toml
# frps.toml
[[proxies]]
name = "web-cluster"
type = "tcp"
loadBalancer.group = "web"
loadBalancer.groupKey = "123"
remotePort = 9090
```

多个客户端可以加入同一个组，共同提供服务。

## 9. 参考资源

- [FRP 官方文档](https://github.com/fatedier/frp/blob/master/README.md)
- [FRP 常见问题](https://github.com/fatedier/frp/blob/master/README_zh.md)
- [内网穿透技术比较](https://www.zhihu.com/question/59440538)
- [支付宝开发文档-回调机制](https://opendocs.alipay.com/open/270/105902)
- [微信支付开发文档-通知回调](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_7)
