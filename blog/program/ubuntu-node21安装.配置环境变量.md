---
id: 1024
slug: ubuntu-node21-installation-environment-setup
title: Ubuntu Node.js 21安装并配置环境变量：完整指南
authors: bianliang
keywords: [Ubuntu, Node.js, npm, 环境变量, Linux, 开发环境, Node21, Ubuntu Server, 前端开发]
tags: [Ubuntu, Node.js, 环境配置, 前端开发]
description: 详细介绍在Ubuntu Server上手动安装Node.js 21并正确配置环境变量的完整步骤，帮助开发者快速搭建Node.js开发环境
image: https://bianliangrensheng.cn/gImage/title/ubuntu-node-cover.png
date: 2025-04-02
---

# Ubuntu Node.js 21安装并配置环境变量：完整指南

在现代前端和后端开发中，Node.js已经成为不可或缺的运行环境。本文将分享如何在Ubuntu系统上手动安装Node.js 21并配置环境变量，这种方式比使用apt安装更灵活，让你能够轻松管理多个Node.js版本。
<!-- truncate -->

---

## 🖥️ 安装环境概述

在开始安装前，先了解下我们的操作环境：

| 项目 | 详情 |
|------|------|
| 操作系统 | Ubuntu Server 22.04 LTS 64bit |
| 安装包路径 | /download/node-v21.7.3-linux-x64.tar.xz |
| 目标安装路径 | /model/node |

接下来，我会分步骤详细讲解如何完成安装和配置。

## 🚀 安装步骤详解

### 📂 一、创建安装目录

首先，创建一个专门的目录来存放Node.js：

```bash
sudo mkdir -p /model/node
```

> 使用 `-p` 参数可以确保即使父目录不存在也能一并创建，非常实用。

### 📦 二、解压Node.js安装包

将下载好的Node.js压缩包解压到目标目录：

```bash
sudo tar -xJf /download/node-v21.7.3-linux-x64.tar.xz --strip-components=1 -C /model/node
```

:::tip 命令参数说明
- `-x`: 解压
- `-J`: 专门用于.xz格式文件
- `-f`: 指定文件
- `--strip-components=1`: 去掉压缩包内的顶层目录，直接将内容解压到目标目录
:::

### ⚙️ 三、配置环境变量(PATH)

为了在任何位置都能使用node和npm命令，需要配置环境变量：

#### 创建环境变量配置文件：

```bash
sudo nano /etc/profile.d/nodejs.sh
```

#### 在编辑器中添加以下内容：

```bash
# Node.js environment variables
export NODE_HOME=/model/node
export PATH=$NODE_HOME/bin:$PATH
```

保存并退出编辑器（在nano中，按Ctrl+X，然后按Y确认保存，最后按Enter）。

#### 设置文件权限并应用：

```bash
sudo chmod +x /etc/profile.d/nodejs.sh
source /etc/profile.d/nodejs.sh
```

### ✅ 四、验证安装成功

验证Node.js是否成功安装和配置：

```bash
node -v
```

如果显示了版本信息（如`v21.7.3`），说明Node.js安装和环境变量配置成功了！

### 🔄 五、配置npm镜像源

npm是Node.js的包管理器，可以配置镜像源以加快下载速度：

```bash
sudo npm config set registry https://registry.npmjs.org --global
```

> 这里使用了官方源，如果你在中国大陆，可以考虑使用淘宝镜像源以加快下载速度：`https://registry.npmmirror.com`

## 🌟 进阶配置

### 📊 一、npm全局包配置

你可能需要配置npm全局包的安装路径，避免使用sudo：

```bash
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
```

然后将这个路径添加到环境变量中：

```bash
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
source ~/.profile
```

### 🛠️ 二、安装常用开发工具

Node.js安装完成后，你可能需要安装一些常用的开发工具：

```bash
# 安装yarn包管理器
npm install -g yarn

# 安装前端构建工具
npm install -g webpack webpack-cli

# 安装流行的框架CLI
npm install -g @vue/cli
npm install -g create-react-app
```

---

## 🔍 常见问题解决

### ❓ 权限不足问题

如果遇到"permission denied"错误：

```bash
# 方法1：使用sudo（临时解决方案）
sudo npm install -g package-name

# 方法2：修改npm全局包路径（推荐）
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
source ~/.profile
```

### ❓ 环境变量未生效

如果node命令无法找到：

- 确认`/etc/profile.d/nodejs.sh`文件内容正确
- 尝试重新登录终端或重启系统
- 临时解决方案：直接使用完整路径`/model/node/bin/node`

### ❓ npm包安装失败

如果npm安装包时失败：

- 检查网络连接
- 尝试清除npm缓存：`npm cache clean --force`
- 检查包名称是否正确

## 📌 总结：Ubuntu上安装Node.js 21的关键点

回顾整个安装过程，成功安装Node.js的关键在于：

1. 选择正确的Node.js版本和安装包
2. 正确解压并放置文件
3. 科学配置环境变量
4. 配置适合自己的npm镜像源

这种手动安装方式虽然比apt安装稍微复杂，但它给你提供了更大的灵活性，特别是当你需要在同一系统上管理多个Node.js版本时。

---

你有什么Node.js环境配置的问题或心得？欢迎在评论区分享！
