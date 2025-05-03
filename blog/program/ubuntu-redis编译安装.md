---
id: 1025
slug: ubuntu-redis-compilation-installation
title: Ubuntu Redis编译安装：从源码到生产环境的完整指南
authors: bianliang
keywords: [Ubuntu, Redis, 数据库安装, 编译安装, Linux, 缓存数据库, 源码编译, Ubuntu Server]
tags: [Ubuntu, Redis, 环境配置, 数据库, 缓存]
description: 详细介绍在Ubuntu Server上从源码编译安装Redis并正确配置生产环境的完整步骤，帮助开发者搭建高性能Redis缓存服务
image: https://bianliangrensheng.cn/gImage/title/ubuntu-redis-cover.png
date: 2025-04-05
---

# Ubuntu Redis编译安装：从源码到生产环境的完整指南

Redis作为高性能的键值存储数据库，在现代应用架构中扮演着至关重要的角色。虽然可以通过apt快速安装Redis，但从源码编译安装能够获得最新版本、最佳性能以及更精细的定制能力。本文将详细介绍如何在Ubuntu系统上编译安装Redis并配置生产环境。
<!-- truncate -->

---

## 🖥️ 安装环境概述

在开始安装前，先了解下我们的操作环境和规划：

| 项目 | 详情 |
|------|------|
| 操作系统 | Ubuntu Server 22.04 LTS 64bit |
| Redis版本 | 7.2.4 |
| 源码包路径 | /download/redis-7.2.4.tar.gz |
| 目标安装路径 | /model/redis7 |
| 配置文件路径 | /model/redis7/conf |
| 数据存储路径 | /model/redis7/data |
| 日志路径 | /model/redis7/logs |

> **为什么选择编译安装？** 编译安装虽然步骤较多，但可以获得最新特性、最佳性能优化，以及对安装路径和配置的完全控制。

## 🚀 安装步骤详解

### 📦 一、安装编译依赖

Redis编译需要一些基础开发库和工具：

```bash
sudo apt update
sudo apt install -y build-essential tcl pkg-config libssl-dev
```

:::tip 依赖说明
- build-essential：提供编译软件所需的基本工具
- tcl：用于Redis测试
- pkg-config：帮助找到已安装库的信息
- libssl-dev：支持TLS加密连接
:::

### 📂 二、准备安装目录

创建所需的各种目录：

```bash
sudo mkdir -p /model/redis7
sudo mkdir -p /model/redis7/conf
sudo mkdir -p /model/redis7/data
sudo mkdir -p /model/redis7/logs
```

### 📦 三、解压源码包

将Redis源码包解压到临时位置：

```bash
cd /download
sudo tar -xzvf redis-7.2.4.tar.gz
```

### 🔨 四、编译Redis

进入源码目录并开始编译：

```bash
cd redis-7.2.4
sudo make
```

> 编译过程可能需要几分钟，具体时间取决于服务器性能。

可选但推荐：运行测试确保编译正确

```bash
sudo make test
```

### 📥 五、安装到指定路径

使用PREFIX参数将编译好的文件安装到我们的目标目录：

```bash
sudo make PREFIX=/model/redis7 install
```

这会将Redis的二进制文件安装到`/model/redis7/bin`目录下。

### ⚙️ 六、配置Redis

复制默认配置文件到我们的配置目录：

```bash
sudo cp /download/redis-7.2.4/redis.conf /model/redis7/conf/
```

编辑配置文件以允许外部访问和其他生产环境设置：

```bash
sudo nano /model/redis7/conf/redis.conf
```

需要修改的关键配置项：

```ini
# 允许所有IP访问
bind 0.0.0.0

# 关闭保护模式
protected-mode no

# 设置端口（默认是6379）
port 6379

# 以守护进程方式运行
daemonize yes

# 指定pid文件位置
pidfile /model/redis7/redis_6379.pid

# 指定日志文件位置
logfile "/model/redis7/logs/redis.log"

# 指定数据存储位置
dir /model/redis7/data

# 设置访问密码（强烈建议为安全性设置）
requirepass YourStrongPasswordHere
```

:::warning 安全提示
在生产环境中，**必须**设置一个强密码并考虑启用TLS加密！默认配置下的Redis实例容易受到攻击。
:::

### 🔄 七、创建系统服务

创建systemd服务文件以便系统管理Redis服务：

```bash
sudo nano /etc/systemd/system/redis7.service
```

添加以下内容：

```ini
[Unit]
Description=Redis In-Memory Data Store
After=network.target

[Service]
Type=forking
ExecStart=/model/redis7/bin/redis-server /model/redis7/conf/redis.conf
ExecStop=/model/redis7/bin/redis-cli -h 127.0.0.1 -p 6379 -a "YourStrongPasswordHere" shutdown
Restart=always
User=root
Group=root
RuntimeDirectory=redis
RuntimeDirectoryMode=0755

[Install]
WantedBy=multi-user.target
```

:::tip 服务文件说明
- Type=forking：表示进程会fork子进程然后退出
- ExecStop：使用redis-cli优雅地关闭Redis
- Restart=always：服务崩溃时自动重启
:::

记得将"YourStrongPasswordHere"替换为你在配置文件中设置的实际密码。

### 🌐 八、配置环境变量

创建环境变量配置文件：

```bash
sudo nano /etc/profile.d/redis7.sh
```

添加以下内容：

```bash
export PATH=$PATH:/model/redis7/bin
```

设置权限并应用：

```bash
sudo chmod +x /etc/profile.d/redis7.sh
source /etc/profile.d/redis7.sh
```

### ▶️ 九、启动Redis服务

重新加载systemd配置并启动Redis：

```bash
sudo systemctl daemon-reload
sudo systemctl start redis7
```

设置开机自启：

```bash
sudo systemctl enable redis7
```

检查服务状态：

```bash
sudo systemctl status redis7
```

如果看到"active (running)"状态，说明Redis服务已成功启动。

### ✅ 十、验证安装

测试Redis连接：

```bash
redis-cli
```

如果你设置了密码，需要先认证：

```
AUTH YourStrongPasswordHere
```

测试基本操作：

```
SET test "It works!"
GET test
```

如果能正确获取值，说明Redis安装和配置成功！

---

## 🔍 常见问题解决

### ❓ 无法编译

如果遇到编译错误：

- 确保已安装所有依赖
- 检查是否有足够的磁盘空间
- 查看detailed_error.log可以获取更多信息：`make > detailed_error.log 2>&1`

### ❓ 服务无法启动

如果Redis服务无法启动：

- 检查配置文件语法：`redis-server /model/redis7/conf/redis.conf --test-memory 1`
- 检查日志文件获取错误信息：`cat /model/redis7/logs/redis.log`
- 确认端口未被占用：`sudo lsof -i :6379`

### ❓ 无法远程连接

如果无法从远程主机连接Redis：

- 检查防火墙设置：`sudo ufw status`
- 如果启用了防火墙，允许Redis端口：`sudo ufw allow 6379/tcp`
- 再次确认bind设置为0.0.0.0且protected-mode设置为no

## 🚀 性能优化建议

对于生产环境，考虑以下Redis性能优化：

1. **内存设置**：设置`maxmemory`参数和合适的淘汰策略
   ```
   maxmemory 2gb
   maxmemory-policy allkeys-lru
   ```

2. **持久化配置**：根据需要调整RDB或AOF持久化
   ```
   # RDB持久化
   save 900 1
   save 300 10
   save 60 10000
   
   # AOF持久化
   appendonly yes
   appendfsync everysec
   ```

3. **连接参数**：调整最大客户端连接数
   ```
   maxclients 10000
   ```

4. **内核参数**：考虑调整Linux内核参数以优化Redis性能
   ```bash
   sudo sysctl -w vm.overcommit_memory=1
   sudo sysctl -w net.core.somaxconn=65535
   ```

## 📌 总结：Ubuntu上编译安装Redis的关键点

回顾整个安装过程，成功编译安装Redis的关键在于：

1. 安装正确且完整的依赖
2. 合理规划目录结构
3. 正确设置配置文件
4. 创建系统服务实现自动管理
5. 配置适当的安全措施

这种编译安装方式让你完全掌控Redis的各个方面，非常适合生产环境部署和特殊定制需求。

---

你有什么Redis安装或优化方面的问题？欢迎在评论区分享！
