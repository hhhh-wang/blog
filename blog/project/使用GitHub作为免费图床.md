---
id: 1000
slug: use-github-trusteeship-images
title: 使用GitHub搭建免费的图床教程
date: 2025-01-17
authors: bianliang
keywords: [GitHub, 图床, 免费图床, 图片上传, PicGo, Typora, GitHub 仓库, 静态资源]
tags: [GitHub,PicGo,JsDelivr]
description: 使用GitHub 图床,无论是博客写作还是前端项目开发，这都将是一个非常棒的方式
image: https://bianliangrensheng.cn/gImage/title/apifox-auto-generates.jpg
---

# 使用GitHub搭建免费的图床教程

最近就想找一款免费的图床来放置自己的图片，逛了一圈下来发现GitHub可以白嫖，于是乎，就有了这篇文章。

<!-- truncate -->

GitHub 是一个非常流行的代码托管平台，除了代码存储外，你还可以使用 GitHub 来托管静态资源，比如图片。通过将图片上传到 GitHub 的仓库，你可以轻松获取图片的 URL，从而在网页或文档中嵌入这些图片。以下是如何使用 GitHub 作为免费图床的详细步骤。

## 步骤 1: 创建 GitHub 仓库

1. 登录到 [GitHub](https://github.com)。

2. 点击右上角的 "+" 按钮，然后选择 "New repository"。

3. 填写仓库的名称（例如：`my-image-hosting`），并设置为公开（Public）。

4. 点击 "Create repository" 创建仓库。

   ![image-20250117160420100](https://cdn.jsdelivr.net/gh/hhhh-wang/MyPic@main/blog/img/image-20250117160420100.png)

## 步骤 2: GitHub获取个人的Token

1. 访问：[settings-tokens](https://github.com/settings/tokens) ，点击**Generate new token**

![image-20250117161131051](https://cdn.jsdelivr.net/gh/hhhh-wang/MyPic@main/blog/img/image-20250117161131051.png)

2.设置 token 属性 ，Expiration：永不过期，Select scopes：`repo` 一定要全选，其他的无所谓 ，点击最下方**创建**

![image-20250117161405422](https://cdn.jsdelivr.net/gh/hhhh-wang/MyPic@main/blog/img/image-20250117161405422.png)

3. 就会获得一个token字符串， **⚠️ 注意：一定要收藏好 token，因为只会显示一次！**，关掉这个页面就再也看不见了。

   > [!IMPORTANT]
   >  **后续会继续使用这个token!!!!**

   

   ![image-20250117162025796](https://cdn.jsdelivr.net/gh/hhhh-wang/MyPic@main/blog/img/image-20250117162025796.png)
   
   

## 步骤 3: 下载PicGo

1. 在PicGo最新页面上下载它的安装包。[PicGo下载页面](https://github.com/Molunerfinn/PicGo/releases)

   ![image-20250117163246665](https://cdn.jsdelivr.net/gh/hhhh-wang/MyPic@main/blog/img/image-20250117163246665.png)

   

2. 安装PicGo。无需赘述

3. 配置GitHub

   ![image-20250117164001627](https://cdn.jsdelivr.net/gh/hhhh-wang/MyPic@main/blog/img/image-20250117164001627.png)

   ​	

4. **PicGo 上传区配置选中你的配置**

   ![image-20250117164326720](https://cdn.jsdelivr.net/gh/hhhh-wang/MyPic@main/blog/img/image-20250117164326720.png)

   ​	选择完成配置之后就可以拖拉拽上传文件了。

## 步骤 4: Typora中使用

1. 打开Typora，在文件选项中选中偏好设置。

   ![image-20250117164623827](https://cdn.jsdelivr.net/gh/hhhh-wang/MyPic@main/blog/img/image-20250117164623827.png)

2. 在图像选项中勾选你的安装路径

   ![image-20250117164729954](https://cdn.jsdelivr.net/gh/hhhh-wang/MyPic@main/blog/img/image-20250117164729954.png)

3. 使用方式：

   在Typora粘贴一张图片，右击图片上传，图片会上传并自动转换成链接

![image-20250117165032807](https://cdn.jsdelivr.net/gh/hhhh-wang/MyPic@main/blog/img/image-20250117165032807.png)

![image-20250117165047991](https://cdn.jsdelivr.net/gh/hhhh-wang/MyPic@main/blog/img/image-20250117165047991.png)

++++

# 🎉 使用 GitHub 图床大功告成！

恭喜你完成了 GitHub 图床的配置！🎊 通过本文的引导，你已经学会了如何：

1. 创建 GitHub 仓库并上传图片；
2. 获取并配置个人 Token；
3. 使用 PicGo 工具进行图片上传；
4. 在 Typora 中无缝集成并自动生成图片链接。

通过这个流程，你可以快速搭建自己的高效图床，结合 GitHub 和 JsDelivr CDN，免费、稳定且速度快！无论是博客写作还是前端项目开发，这都将是一个非常棒的工具！💪

希望这篇教程对你有所帮助！祝你工作愉快，写作顺利！🚀



