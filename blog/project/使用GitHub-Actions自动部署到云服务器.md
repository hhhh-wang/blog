---
id: 1005
slug: github-actions-auto-cloud
title: 使用 GitHub Actions 自动部署到云服务器
date: 2025-01-27
authors: bianliang
tags: [github, action, cloud]
keywords: [GitHub Actions, 自动部署, 云服务器, Nginx 配置, SSH 密钥配置, Node.js 环境, 部署流程, 流水线配置]
description: 详细介绍如何利用 GitHub Actions 实现项目自动部署到云服务器，包括完整配置步骤和最佳实践。
image: https://bianliangrensheng.cn/gImage/title/deploy-to-cloud-server-with-github-actions.jpg
---

在上一篇文章中，讲解了如何使用 GitHub Actions 自动部署到 Vercel。这次，来看看如何将项目自动部署到自己的云服务器上。

<!-- truncate -->


## 一、前期准备工作

### 1. 服务器准备
:::info 必要条件
- 一台云服务器（Ubuntu/CentOS）
- 已安装 Node.js 环境
- 已配置 Nginx 服务器
- 开放相应的端口（如 80、443）

我的环境如下：

```shell
# 服务器：腾讯云轻量应用服务器
# 系统：Ubuntu 22.04
# 端口：80
root@VM-20-4-ubuntu:~# node -v
v21.7.3
root@VM-20-4-ubuntu:~# npm -v
10.5.0
root@VM-20-4-ubuntu:~# pnpm -v
9.15.1
root@VM-20-4-ubuntu:~# nginx -v
nginx version: nginx/1.18.0 (Ubuntu)
```
### 2. 密钥配置

:::tip 生成密钥
1. 在本地生成 SSH 密钥对：
```bash
ssh-keygen -t rsa -b 4096 -C "密钥的名字"
```
这会在 `~/.ssh/` 目录下生成两个文件：
- `id_rsa`：私钥文件，要保密，用于 GitHub Actions 的 `SERVER_PRIVATE_KEY`
- `id_rsa.pub`：公钥文件，可以共享，用于上传到服务器

2. 将公钥添加到服务器：
```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub root@your_server_ip
```
这个命令会将公钥（`id_rsa.pub`）的内容追加到服务器的 authorized_keys 文件中

:::warning 重要提示
- 私钥（id_rsa）必须保密，下载到你的本地
- 公钥（id_rsa.pub）用于服务器认证
- GitHub Actions 中的 `SERVER_PRIVATE_KEY` 需要使用私钥的内容
:::

注意：服务器上的公钥存放位置：
- 普通用户：`~/.ssh/authorized_keys` 或 `/home/用户名/.ssh/authorized_keys`
- root用户：`/root/.ssh/authorized_keys`

如果对应目录不存在，需要手动创建并设置正确的权限：
```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

注意：Ubuntu 系统默认禁止 root 用户通过 SSH 登录，需要修改 SSH 配置文件：
```bash
# 编辑 SSH 配置文件
sudo vim /etc/ssh/sshd_config

# 修改或添加以下配置
PermitRootLogin yes               # 允许 root 登录
PubkeyAuthentication yes         # 启用公钥认证
PasswordAuthentication no        # 禁用密码认证
PubkeyAcceptedKeyTypes +ssh-rsa  # 支持 ssh-rsa 类型的密钥

# 重启 SSH 服务
sudo systemctl restart sshd
```

## 二、配置 GitHub Actions

### 1. 添加 Secrets

:::info 

1. 配置步骤进入仓库的 Settings -> Secrets and variables -> Actions
   对应的链接为：  

   `https://github.com/你的用户名/项目名/settings/secrets/actions/new`

添加以下信息：

1. `SERVER_IP`: 服务器 IP 地址

2. `SERVER_PORT`: SSH 端口（默认 22）

3. `SERVER_USERNAME`: 服务器用户名

4. `SERVER_PRIVATE_KEY`: SSH 私钥内容 id_rsa文件全选复制，连---end都要复制

   ![image-20250126110610131](https://cdn.jsdelivr.net/gh/hhhh-wang/MyPic@main/blog/img/image-20250126110610131.png)

   ​	这是我的博客仓库的配置

   ​	![image-20250126170459279](https://cdn.jsdelivr.net/gh/hhhh-wang/MyPic@main/blog/img/image-20250126170459279.png)
   
   :::

### 2. 创建 Workflow 文件

在项目根目录创建 `.github/workflows/deploy-cloud.yml` 文件：

```yaml
# 你可以参考我的工作流配置
name: Deploy to Server

on:
  push:
    branches:
      - main  # 当 main 分支有提交时触发

jobs:
  deploy-server:
    runs-on: ubuntu-latest
    # 作业中的执行步骤
    steps:
      # 步骤 1: 检出代码
      - uses: actions/checkout@v4 # 使用官方的 checkout Action，从仓库检出代码

      # 步骤 2: 设置 Node.js 环境
      - name: Setup Node.js
        uses: actions/setup-node@v4 # 使用官方的 Node.js Action
        with:
          node-version: '20' # 指定使用的 Node.js 版本为 20

      # 步骤 3: 安装 pnpm（Node.js 的包管理工具）
      - name: Setup pnpm
        uses: pnpm/action-setup@v2 # 使用 pnpm 的官方 GitHub Action
        with:
          version: '9.8.0' # 指定安装的 pnpm 版本为 9.8.0

      # 步骤 4: 安装依赖
      - name: Install Dependencies
        run: pnpm install # 使用 pnpm 安装项目依赖

      # 步骤 5: 构建项目
      - name: Build
        run: pnpm build # 执行项目的构建脚本

      # 步骤 6: 部署到 服务器
      - name: Deploy to Server
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: ${{ secrets.SERVER_PORT }}
          source: "build/*"
          target: "/model/blog/build/"  #推送到这个路径下， 这是我的打包好的项目路径，要更换成你的
          strip_components: 1
          
      - name: Cleanup
        if: always()
        run: |
          rm -rf build
          rm -rf .docusaurus
```

## 三、服务器配置

### 1. Nginx 配置

:::info Nginx 设置
创建或修改 Nginx 配置文件：

```nginx
## 参考我的配置。
# 博客站点 (通过IP 80端口访问)
server {
    listen 80;
    server_name bianliangrensheng.cn www.bianliangrensheng.cn;  # 域名访问
    root /model/blog/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存配置
    location /assets/ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    location /img/ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}

```
:::

### 2. 权限设置

:::warning 注意事项
果不是root登录的话，可能会有权限问题，请你调整权限， 确保部署目录具有正确的权限。

:::

## 四、自动化部署流程

:::info 部署过程
1. 推送代码到 GitHub main 分支
2. GitHub Actions 自动触发构建流程
3. 构建完成后，通过 SSH 将文件传输到云服务器
4. Nginx 自动加载新的静态文件
:::



## 常见问题及解决方案

:::tip 故障排除
1. 部署失败
   - 检查 Secrets 配置是否正确
   
   - 确认服务器防火墙设置

   - 查看 GitHub Actions 日志
   
     
   
2. 网站无法访问
   - 检查 Nginx 配置
   - 确认端口是否开放
   - 验证文件权限设置

3. 文件传输问题
   - 确认 SSH 密钥配置正常
   - 检查目录权限
   - 验证磁盘空间
   :::



## 总结

通过 GitHub Actions 实现自动化部署到云服务器，不仅提高了开发效率，也保证了部署的一致性和可靠性。这个过程虽然初期配置较为复杂，但一旦设置完成，后续的维护和使用都会变得非常简单，并且我也不是一次成功，失败了n多次

![image-20250126171757482](https://cdn.jsdelivr.net/gh/hhhh-wang/MyPic@main/blog/img/image-20250126171757482.png)

​		现在当我推送代码到github上以后，会触发部署工作流，重新部署云上项目和Vercel

![image-20250126172116374](https://cdn.jsdelivr.net/gh/hhhh-wang/MyPic@main/blog/img/image-20250126172116374.png)

![image-20250126172222215](https://cdn.jsdelivr.net/gh/hhhh-wang/MyPic@main/blog/img/image-20250126172222215.png)

---

如果你在配置过程中遇到任何问题，欢迎在评论区讨论！ 