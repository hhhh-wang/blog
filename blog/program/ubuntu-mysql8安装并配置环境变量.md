---
id: 1038
slug: ubuntu-mysql8-installation-environment-setup
title: Ubuntu MySQL8安装并配置环境变量：完整指南
authors: bianliang
keywords: [Ubuntu, MySQL8, 数据库安装, 环境变量, Linux, 开发环境, MySQL配置, Ubuntu Server]
tags: [Ubuntu, MySQL, 环境配置, 数据库]
description: 详细介绍在Ubuntu Server上手动安装MySQL8数据库并正确配置环境变量的完整步骤，帮助开发者快速搭建MySQL数据库环境
image: https://bianliangrensheng.cn/gImage/title/ubuntu-mysql-cover.png
date: 2025-03-28
---

# Ubuntu MySQL8安装并配置环境变量：完整指南

在后端开发和数据应用中，MySQL仍然是最流行的关系型数据库之一。本文将分享如何在Ubuntu系统上手动安装MySQL8并正确配置环境变量，这种方式虽然比使用apt安装复杂，但能让你更好地理解MySQL的工作原理和配置细节。
<!-- truncate -->

---

## 🖥️ 安装环境概述

在开始安装前，先了解下我们的操作环境和规划：

| 项目 | 详情 |
|------|------|
| 操作系统 | Ubuntu Server 22.04 LTS 64bit |
| 安装包路径 | /download/mysql-8.0.36-linux-glibc2.28-x86_64.tar.xz |
| 目标安装路径 | /model/mysql8 |
| 数据存储路径 | /model/mysql8/data |
| 日志路径 | /model/mysql8/logs |

> **注意**：这种手动安装方式比使用 apt 安装（`sudo apt install mysql-server`）要复杂，且不会自动处理依赖、系统集成（如 AppArmor）、服务管理脚本更新等问题。建议在了解其含义的情况下进行操作。

## 🚀 安装步骤详解

### 📦 一、安装依赖

MySQL 二进制发行版需要一些基础库才能正常运行：

```bash
sudo apt update
sudo apt install libaio1 libncurses5 -y
```

### 👥 二、创建 MySQL 用户和组

为安全起见，MySQL应该以专用的非特权用户身份运行：

```bash
sudo groupadd mysql
sudo useradd -r -g mysql -s /bin/false mysql
```

> `-r`选项创建系统用户，`-s /bin/false`禁止该用户登录系统，提高安全性。

### 📂 三、创建所需目录

按规划创建安装、数据和日志目录：

```bash
sudo mkdir -p /model/mysql8/data /model/mysql8/logs
```

### 📦 四、解压 MySQL 压缩包

将下载好的安装包解压到目标目录：

```bash
# 注意：.tar.xz 文件使用 'xvf'，而不是 'z'
sudo tar -xvf /download/mysql-8.0.36-linux-glibc2.28-x86_64.tar.xz --strip-components=1 -C /model/mysql8
```

:::tip 命令参数说明
`--strip-components=1` 参数可以去掉压缩包内的顶层目录，直接将内容解压到目标目录，避免多余的嵌套目录。
:::

### 🔐 五、设置目录所有权和权限

确保MySQL用户对相关目录有适当权限：

```bash
sudo chown -R mysql:mysql /model/mysql8
# 确保mysql用户对数据和日志目录有完全权限，但其他用户（组外）没有访问权限
sudo chmod -R 750 /model/mysql8/data
sudo chmod -R 750 /model/mysql8/logs
```

### ⚙️ 六、创建MySQL配置文件(my.cnf)

创建并编辑配置文件：

```bash
sudo nano /model/mysql8/my.cnf
```

将以下内容粘贴到编辑器中：

```ini
[mysqld]
# General settings
user                    = mysql
port                    = 3306
basedir                 = /model/mysql8
datadir                 = /model/mysql8/data
socket                  = /tmp/mysql.sock
pid-file                = /model/mysql8/mysql.pid

# Logging
log-error               = /model/mysql8/logs/error.log
# slow_query_log        = 1
# slow_query_log_file   = /model/mysql8/logs/slow-query.log
# long_query_time       = 2
# log_queries_not_using_indexes = ON

# Character sets
character-set-server    = utf8mb4
collation-server        = utf8mb4_unicode_ci

# Other settings (adjust as needed)
max_connections         = 151
# innodb_buffer_pool_size = 1G  # Adjust based on your system RAM
# default_authentication_plugin=caching_sha2_password # Default in MySQL 8

[client]
socket                  = /tmp/mysql.sock
default-character-set   = utf8mb4

[mysql]
default-character-set   = utf8mb4
```

设置配置文件所有权和权限：

```bash
sudo chown mysql:mysql /model/mysql8/my.cnf
sudo chmod 644 /model/mysql8/my.cnf
```

:::tip 配置文件说明
- 默认使用utf8mb4字符集，支持完整的Unicode字符（包括表情符号）
- 日志文件位置已配置，但慢查询日志默认关闭（可取消注释开启）
- 可根据服务器内存调整InnoDB缓冲池大小（innodb_buffer_pool_size）
:::

### 🗃️ 七、初始化MySQL数据库

初始化数据目录并生成临时root密码：

```bash
sudo /model/mysql8/bin/mysqld --defaults-file=/model/mysql8/my.cnf --initialize --user=mysql
```

查看生成的临时密码（初始化过程中会自动生成）：

```bash
sudo grep 'temporary password' /model/mysql8/logs/error.log
```

> 记住这个临时密码，首次登录时需要用它来设置新密码。

### 🔄 八、配置Systemd服务

创建systemd服务文件，便于系统管理MySQL服务：

```bash
sudo nano /etc/systemd/system/mysql.service
```

粘贴以下内容：

```ini
[Unit]
Description=MySQL Community Server (Manual Install)
After=network.target

[Service]
User=mysql
Group=mysql
Type=simple
WorkingDirectory=/model/mysql8

# Specify the full path to mysqld and the config file
ExecStart=/model/mysql8/bin/mysqld --defaults-file=/model/mysql8/my.cnf

Restart=on-failure
RestartSec=5s
PIDFile=/model/mysql8/mysql.pid

# LimitNOFILE=65535 # Uncomment if you need more file descriptors

[Install]
WantedBy=multi-user.target
```

重新加载systemd配置并设置开机自启：

```bash
sudo systemctl daemon-reload
sudo systemctl enable mysql.service
```

### ▶️ 九、启动MySQL服务

启动服务并检查状态：

```bash
sudo systemctl start mysql.service
sudo systemctl status mysql.service
```

如果看到"active (running)"状态，表示服务已成功启动。

### 🌐 十、配置环境变量(PATH)

创建环境变量配置文件：

```bash
sudo nano /etc/profile.d/mysql.sh
```

添加以下内容：

```bash
export PATH=/model/mysql8/bin:$PATH
```

保存并退出，然后更新权限并应用：

```bash
sudo chmod +x /etc/profile.d/mysql.sh
source /etc/profile.d/mysql.sh
```

验证配置：

```bash
which mysql
# 应该输出 /model/mysql8/bin/mysql
```

### 🔒 十一、安全设置(非常重要!)

首次登录和修改密码：

1. 找到初始化时生成的临时密码：
   ```bash
   sudo grep 'temporary password' /model/mysql8/logs/error.log
   ```

2. 使用临时密码登录：
   ```bash
   mysql -u root -p
   ```

3. 修改root密码（首次登录会强制修改）：
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'W2sB8wXK7C17JZrn';
   FLUSH PRIVILEGES;
   ```

> 请使用强密码，包含大小写字母、数字和特殊字符，长度至少12位。

---

## 🔍 常见问题解决

### ❓ 服务无法启动

如果MySQL服务无法启动：

- 检查错误日志 `/model/mysql8/logs/error.log`
- 确认目录权限设置正确
- 验证my.cnf配置文件是否有语法错误
- 检查系统资源是否足够（内存、磁盘空间）

### ❓ 忘记root密码

如果忘记了root密码，可以按以下步骤重置：

1. 停止MySQL服务：`sudo systemctl stop mysql.service`
2. 以跳过权限表的方式启动：
   ```bash
   sudo /model/mysql8/bin/mysqld --defaults-file=/model/mysql8/my.cnf --user=mysql --skip-grant-tables --skip-networking &
   ```
3. 无密码登录：`mysql -u root`
4. 重置密码：
   ```sql
   FLUSH PRIVILEGES;
   ALTER USER 'root'@'localhost' IDENTIFIED BY '新密码';
   FLUSH PRIVILEGES;
   EXIT;
   ```
5. 关闭无权限验证的MySQL进程
6. 正常启动服务：`sudo systemctl start mysql.service`

### ❓ 远程连接问题

默认情况下，MySQL只允许本地连接。要启用远程连接：

1. 登录MySQL：`mysql -u root -p`
2. 创建允许远程连接的用户：
   ```sql
   CREATE USER 'remote_user'@'%' IDENTIFIED BY '强密码';
   GRANT ALL PRIVILEGES ON *.* TO 'remote_user'@'%';
   FLUSH PRIVILEGES;
   ```
3. 修改my.cnf，注释掉bind-address或设置为`bind-address = 0.0.0.0`
4. 重启MySQL服务：`sudo systemctl restart mysql.service`
5. 确保防火墙允许3306端口访问

## 📌 总结：Ubuntu上安装MySQL8的关键点

回顾整个安装过程，成功安装MySQL8的关键在于：

1. 正确创建用户和目录结构
2. 合理配置my.cnf文件
3. 设置适当的文件权限
4. 正确初始化数据库
5. 配置systemd服务实现自动启动
6. 设置强密码保障安全

这种手动安装方式虽然比apt安装复杂，但让你对MySQL的组件和配置有了更深入的了解，也能根据需要进行更精细的定制。

---

你有什么MySQL安装或配置方面的问题？欢迎在评论区分享！
