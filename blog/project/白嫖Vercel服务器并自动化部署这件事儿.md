---
id: 1004
slug: github-actions-auto-vercel
title: 白嫖 Vercel 服务器并自动化部署这件事儿
date: 2025-01-26
authors: bianliang
tags: [github, action, vercel]
keywords: [GitHub Actions, 自动化部署, CI/CD, Vercel]
description: 详细介绍如何利用 GitHub Actions 实现项目自动部署到 Vercel，包括完整配置步骤和最佳实践。
image: https://bianliangrensheng.cn/gImage/title/about-my-github-actions-automation-deployment.jpg
---

最近我把博客的部署方式从手动部署改成了使用 GitHub Actions 自动部署，这让我体会到了自动化带来的便利。在这篇文章中，我想分享一下这个转变的过程。

<!-- truncate -->

## 为什么需要自动化部署？

:::note 传统部署流程
在之前，每次更新博客我都需要：

1. 本地修改内容
2. 本地构建
3. 手动上传到服务器
4. 重新加载服务器配置文件

这个过程不仅繁琐，而且容易出错。特别是当你频繁更新内容的时候，这种重复性的工作会消耗大量时间。
:::

## 一、GitHub Actions 是什么？

:::info
GitHub Actions 是 GitHub 提供的自动化工具，它可以：
- 自动执行构建
- 测试代码
- 部署应用等
:::

## 二、如何配置自动部署 Vercel？

### 1. 准备工作

:::tip 前置条件
在开始之前，我们需要：
- 一个 Vercel 账号（可以直接用 GitHub 账号登录）
- 项目已经推送到 GitHub 仓库
- 在 Vercel 中导入该项目
:::

1. 由于我这里已经配置成功过。可能跟第1次导入项目页面还不太一样。但思路都是一致的。在概述页面找到导入项目的按钮。

![image-20250126094424723](https://cdn.jsdelivr.net/gh/hhhh-wang/MyPic@main/blog/img/image-20250126094424723.png)

2. 进入项目选择页面，选择项目进行导入。此时会弹出一个小框进行选择项目的操作。

:::caution 重要提醒
项目需要开源，不然会收取一定的费用！
:::

![image-20250126095838867](https://cdn.jsdelivr.net/gh/hhhh-wang/MyPic@main/blog/img/image-20250126095838867.png)	

3. 点击保存，在页面进行导入即可

![image-20250126100203688](https://cdn.jsdelivr.net/gh/hhhh-wang/MyPic@main/blog/img/image-20250126100203688.png)

4. 最后完成部署

![image-20250126100935309](https://cdn.jsdelivr.net/gh/hhhh-wang/MyPic@main/blog/img/image-20250126100935309.png)

### 2. 获取必要的密钥

:::info 必要参数
在 Vercel 项目设置中获取以下信息：
1. `VERCEL_TOKEN`：在 Vercel 的设置页面生成
2. `VERCEL_ORG_ID`和`VERCEL_PROJECT_ID`：通过 API 获取
:::

![image-20250126103953869](https://cdn.jsdelivr.net/gh/hhhh-wang/MyPic@main/blog/img/image-20250126103953869.png)

![image-20250126104319256](https://cdn.jsdelivr.net/gh/hhhh-wang/MyPic@main/blog/img/image-20250126104319256.png)

:::tip API 获取参数
由于已经获取到了 token，在页面上寻找这些参数是很困难的事情，我之前就找了蛮长时间也没找到。但我找到了接口，可以通过接口的方式来获取到我想要的参数：
```shell
## 调用接口获取到参数
curl -H "Authorization: Bearer 你刚刚创建的token" https://api.vercel.com/v9/projects | grep -A 5 "你的项目名"

## 在返回的JSON数据包当中
"projects": [
  {
    "id": "这个就是你的 VERCEL_PROJECT_ID",
    "name": "你的项目名称",
    "accountId": "这个就是你的 VERCEL_ORG_ID",
    ...
  }
]
```
:::

到此处 vercel 部分已经完结。

### 3. 配置 Secrets

这些信息需要添加到 GitHub 仓库的 Secrets 中：

:::info 配置步骤
1. 进入仓库的 Settings -> Secrets and variables -> Actions
   对应的链接为：  

   `https://github.com/你的用户名/项目名/settings/secrets/actions/new`

2. 点击 "New repository secret" 

     VERCEL_TOKEN

     VERCEL_ORG_ID

     VERCEL_PROJECT_ID

3. 分别添加上述三个在vercel获得的密钥，重复操作三次
  :::

![image-20250126110610131](https://cdn.jsdelivr.net/gh/hhhh-wang/MyPic@main/blog/img/image-20250126110610131.png)

### 4. 配置 Workflow 文件

创建 `.github/workflows/vercel.yml` 文件 或者 进入仓库的 Actions -> New workflow -> `set up a workflow yourself →`

```yaml
# 可以参考我的工作流
# 定义 GitHub Actions 的工作流程名称
name: Deploy to Vercel

# 触发条件
on:
  push:
    branches: [ main ] # 当代码推送到 main 分支时触发
  pull_request:
    branches: [ main ] # 当针对 main 分支发起 Pull Request 时触发

# 定义工作流程中的作业（jobs）
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: '9.8.0'
      - name: Install Dependencies
        run: pnpm install
      - name: Build
        run: pnpm build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./
```

:::warning 注意事项
`working-directory` 路径必须和你之前[导入项目时配置的路径](#1-准备工作)保持一致，否则会导致部署失败。
:::

![image-20250126111407118](https://cdn.jsdelivr.net/gh/hhhh-wang/MyPic@main/blog/img/image-20250126111407118.png)

### 5. 验证部署

:::info 部署流程
配置完成后：
1. 提交代码到 main 分支
2. GitHub Actions 会自动触发部署
3. 在 Actions 标签页查看部署进度
4. 部署完成后，可以在 Vercel 仓库查看部署详情
5. 如果失败也会给你发送邮件，请关注邮件查看报错信息
:::

## 最终效果

:::success 自动化流程
现在我只需要：
1. 写文章
2. 提交到 GitHub
3. 自动完成部署

整个过程变得简单且可靠，让我可以专注于内容创作。
:::

## 总结

:::tip 建议
自动化部署不仅提高了效率，也让整个发布流程更加可靠。如果你还在手动部署，不妨试试 GitHub Actions。
:::

---

欢迎在评论区分享你的自动化部署经验！ 