---
id: 1045
slug: certd-opencloudos9-source-deployment
title: OpenCloudOS 9 源码部署 Certd 与泛域名证书自动续期
date: 2026-08-05
authors: bianliang
keywords: [Certd, OpenCloudOS 9, 泛域名证书, 证书自动续期, DNS-01, 腾讯云DNSPod, Nginx, Node.js, systemd]
tags: [Certd, SSL证书, 泛域名证书, Nginx, OpenCloudOS, 自动化运维]
description: 记录在 OpenCloudOS 9 上以源码方式部署 Certd，接入 Nginx 与腾讯云 DNSPod，自动申请并部署泛域名证书的完整过程，包含 Node.js 22 安装、systemd 托管、常见故障排查与数据备份升级。
image: https://bianliangrensheng.cn/gImage/title/certd-opencloudos9-source-deployment.png
---

# OpenCloudOS 9 源码部署 Certd 与泛域名证书自动续期

本文记录在 OpenCloudOS 9 服务器上安装 Node.js 22、以源码方式部署 Certd、接入 Nginx，并通过腾讯云 DNSPod 为 `shuomishengda.cn` 自动申请和部署泛域名证书的完整过程。

<!-- truncate -->

## 1. 文档说明

- 记录日期：2026-08-05
- Certd 源码分支：`v2`
- Certd 默认端口：HTTP `7001`、HTTPS `7002`
- Certd 数据目录：`/opt/certd/packages/ui/certd-server/data`
- 图文操作教程：[Certd 演示示例](https://gitee.com/certd/certd/blob/v2/step.md#certd%E6%BC%94%E7%A4%BA%E7%A4%BA%E4%BE%8B)
- 官方源码部署文档：[Certd 源码部署](https://certd.docmirror.cn/guide/install/source/)

## 2. 证书覆盖范围

当前业务域名包括：

```text
mini.shuomishengda.cn
platform.shuomishengda.cn
store.shuomishengda.cn
test-mini.shuomishengda.cn
mbiz.shuomishengda.cn
```

申请证书时填写：

```text
*.shuomishengda.cn
shuomishengda.cn
```

`*.shuomishengda.cn` 可以覆盖上述一级子域名，但不能覆盖根域名 `shuomishengda.cn`，因此建议将两者放入同一张证书。泛域名证书必须使用 DNS-01 验证。

## 3. 安装系统依赖

使用 `root` 用户执行：

```bash
dnf install -y git curl wget unzip xz gcc gcc-c++ make python3 lsof
uname -m
```

本文服务器架构为 `x86_64`。如果输出为 `aarch64`，Node.js 安装包应改用 `linux-arm64`。

## 4. 安装 Node.js 22

使用 Node.js 官方二进制包安装到 `/usr/local`：

```bash
cd /tmp
curl -fLO https://nodejs.org/dist/latest-v22.x/node-v22.23.2-linux-x64.tar.xz

echo "d60acfe00a2932254bb0ad20e01b0d74397a0875595de719654b214f4b03f307  node-v22.23.2-linux-x64.tar.xz" \
  | sha256sum -c -

tar -xJf node-v22.23.2-linux-x64.tar.xz \
  -C /usr/local \
  --strip-components=1

node --version
npm --version
command -v node
command -v npm
```

预期 Node.js 版本为 `v22.23.2`，程序路径通常为：

```text
/usr/local/bin/node
/usr/local/bin/npm
```

### 4.1 处理 `sudo: npm: command not found`

首次执行 Certd 的 `start.sh` 时出现：

```text
安装pnpm@10.33.4, 前提是已经安装了nodejs
sudo: npm: command not found
```

原因是 Certd 脚本执行了 `sudo npm`，而 OpenCloudOS 的 `sudo secure_path` 默认没有包含 `/usr/local/bin`。即使当前用户是 `root`，再次执行 `sudo` 时仍会使用该受限路径。

创建 sudo 路径配置：

```bash
visudo -f /etc/sudoers.d/local-bin
```

写入：

```text
Defaults secure_path="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
```

验证配置：

```bash
chmod 440 /etc/sudoers.d/local-bin
visudo -cf /etc/sudoers.d/local-bin
sudo npm -v
```

`sudo npm -v` 能正常输出版本后即可继续。Certd 的 `start.sh` 会自动安装 `pnpm@10.33.4`，无须提前手动安装 pnpm。

## 5. 下载并构建 Certd

```bash
cd /opt
git clone --depth=1 --branch v2 https://github.com/certd/certd.git
cd /opt/certd
chmod +x start.sh
./start.sh
```

第一次询问是否后台运行时输入 `n`：

```text
是否后台运行(第一次运行建议选择n，调试没有问题之后，重新运行，选择y)
y/n: n
```

脚本会依次完成：

1. 安装指定版本 pnpm。
2. 安装项目依赖。
3. 构建 Certd 服务端。
4. 下载对应版本的前端 UI。
5. 前台启动 Certd。

首次访问：

```text
http://服务器IP:7001
```

默认登录信息：

```text
账号：admin
密码：123456
```

首次登录后立即修改默认密码。确认页面正常后，在终端按 `Ctrl+C` 停止前台进程。

## 6. 使用 systemd 托管 Certd

创建低权限运行用户：

```bash
useradd --system --home-dir /opt/certd --shell /sbin/nologin certd
chown -R certd:certd /opt/certd
```

创建 `/etc/systemd/system/certd.service`：

```ini
[Unit]
Description=Certd Certificate Management
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=certd
Group=certd
WorkingDirectory=/opt/certd/packages/ui/certd-server
Environment=NODE_ENV=production
Environment=PATH=/usr/local/bin:/usr/bin:/bin
ExecStart=/usr/local/bin/pnpm run start
Restart=always
RestartSec=5
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
```

启用服务：

```bash
systemctl daemon-reload
systemctl enable --now certd
systemctl status certd
journalctl -u certd -n 100 --no-pager
ss -lntp | grep -E ':7001|:7002'
```

## 7. 使用 Nginx 发布 Certd 管理页面

建议为 Certd 增加独立域名：

```text
certd.shuomishengda.cn
```

先在 DNSPod 添加指向服务器公网 IP 的 A 记录，然后在 Nginx 的 `http {}` 中增加：

```nginx
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;

    server_name certd.shuomishengda.cn;

    include /etc/nginx/ssl-conf/common.ssl.conf;

    location / {
        proxy_pass http://127.0.0.1:7001;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }
}
```

将 `certd.shuomishengda.cn` 同时加入原有的 HTTP 跳转配置：

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name mini.shuomishengda.cn
                platform.shuomishengda.cn
                store.shuomishengda.cn
                test-mini.shuomishengda.cn
                mbiz.shuomishengda.cn
                certd.shuomishengda.cn;
    return 301 https://$host$request_uri;
}
```

OpenCloudOS 9 启用 SELinux 时，需要允许 Nginx 连接反向代理端口：

```bash
setsebool -P httpd_can_network_connect 1
nginx -t
systemctl reload nginx
```

:::warning 端口安全

公网安全组和防火墙只需开放 `80/443`，不要对公网开放 Certd 的 `7001/7002` 端口。

:::

## 8. 配置腾讯云 DNSPod 授权

在腾讯云访问管理控制台创建 API 密钥，然后在 Certd 的“授权管理”中添加“腾讯云”授权：

```text
secretId：腾讯云 API SecretId，通常以 AKID 开头
secretKey：与 SecretId 同一组的 SecretKey
站点类型：国内站
```

:::warning 密钥注意事项

不要把旧版 DNSPod 的“数字 ID + Token”填写到腾讯云 `SecretId/SecretKey` 中。建议使用专用 CAM 子用户，不要使用主账号永久密钥。

:::

### 8.1 故障：`The SecretId is not found`

首次申请时出现：

```text
[TencentDnsProvider错误] The SecretId is not found,
please ensure that your SecretId is correct.
```

该错误表示腾讯云无法识别 Certd 提交的 SecretId，处理方法：

1. 确认 Certd 中选择的是“腾讯云”授权，不是旧版“DNSPod”授权。
2. 从[腾讯云 API 密钥管理](https://console.cloud.tencent.com/cam/capi)重新复制 SecretId 和 SecretKey。
3. 确认 SecretId 通常以 `AKID` 开头。
4. 确认 SecretId 与 SecretKey 来自同一组密钥。
5. 清除字段前后的空格、换行和引号。
6. 在 Certd 授权配置中点击“测试”。

### 8.2 故障：缺少 `dnspod:CreateRecord` 权限

修正密钥后，申请进入 DNS TXT 记录创建阶段，但出现：

```text
you are not authorized to perform operation (dnspod:CreateRecord)
resource (qcs:id/0:dnspod::uin/100048321959:domain/99214064) has no permission
```

这说明 SecretId 已经有效，但其所属用户没有修改目标域名 DNS 记录的权限。进入腾讯云 CAM 用户管理，为创建该 SecretId 的子用户关联策略：

```text
QcloudDNSPodFullAccess
```

等待策略生效后重新执行流水线，证书申请成功。

如果关联策略后仍然失败，需要确认：

- 策略关联给了创建该 SecretId 的正确子用户。
- `shuomishengda.cn` 属于日志中 UIN `100048321959` 对应的账号。
- 密钥所属账号与域名所有者账号一致，或已得到域名所有者授权。
- 没有其他策略对 DNSPod 操作配置显式 `Deny`。

Certd 授权的“测试”主要验证密钥身份有效性，不代表一定具有 DNSPod 写权限。

验证成功后，可将全权限策略收紧为仅允许目标域名执行 Certd 所需操作：

```text
dnspod:CreateRecord
dnspod:DeleteRecord
dnspod:DescribeRecordFilterList
dnspod:DescribeRecordList
dnspod:DescribeDomainList
```

## 9. 创建证书申请流水线

在 Certd 中执行：

1. 进入“证书流水线”，新建流水线。
2. 添加“证书申请（Lego）”或“证书申请（JS版）”任务。
3. 域名填写 `*.shuomishengda.cn` 和 `shuomishengda.cn`。
4. 验证方式选择 DNS-01。
5. DNS 提供商选择“腾讯云”。
6. 选择前面创建并授权成功的腾讯云凭据。
7. 手动运行一次流水线。
8. 确认证书签发成功，并检查证书包含的域名和有效期。

更完整的界面操作参考：[Certd 图文演示示例](https://gitee.com/certd/certd/blob/v2/step.md#certd%E6%BC%94%E7%A4%BA%E7%A4%BA%E4%BE%8B)。

## 10. 自动部署证书到 Nginx

当前 Nginx 公共 SSL 配置使用：

```nginx
ssl_certificate /etc/nginx/ssl-conf/_.shuomishengda.cn.pem;
ssl_certificate_key /etc/nginx/ssl-conf/_.shuomishengda.cn.key;
```

在证书申请任务后添加“主机-部署证书到 SSH 主机”任务：

```text
证书格式：pem
证书保存路径：/etc/nginx/ssl-conf/_.shuomishengda.cn.pem
私钥保存路径：/etc/nginx/ssl-conf/_.shuomishengda.cn.key
后置命令：nginx -t && systemctl reload nginx
```

:::tip 安全建议

建议使用仅允许密钥登录的专用部署账号，并只授予写入上述证书文件以及检查、重载 Nginx 的权限。不要将 root 登录密码保存到 Certd。

:::

完整自动化流程为：

```text
定时触发
  -> DNS-01 申请泛域名证书
  -> 上传 PEM 证书和私钥
  -> nginx -t
  -> systemctl reload nginx
  -> 证书生效
```

部署完成后检查：

```bash
nginx -t
systemctl status nginx

openssl s_client -connect mini.shuomishengda.cn:443 \
  -servername mini.shuomishengda.cn </dev/null 2>/dev/null \
  | openssl x509 -noout -subject -issuer -dates -ext subjectAltName
```

## 11. 数据备份与源码升级

Certd 的授权信息、流水线和 SQLite 数据都属于敏感数据，必须备份：

```bash
tar -C /opt/certd/packages/ui/certd-server \
  -czf /root/certd-data-$(date +%F).tar.gz data
```

源码升级步骤：

```bash
systemctl stop certd

cd /opt/certd
cp -a packages/ui/certd-server/data /root/certd-data-backup
git pull
./start.sh
```

选择前台运行 `n`，确认启动成功后按 `Ctrl+C`，再执行：

```bash
chown -R certd:certd /opt/certd
systemctl start certd
systemctl status certd
journalctl -u certd -n 100 --no-pager
```

:::warning 升级须知

升级前必须先备份数据目录，不要删除或覆盖 `packages/ui/certd-server/data`。

:::

## 12. 最终结果

本次部署最终完成：

- OpenCloudOS 9 安装 Node.js 22 和 pnpm。
- Certd `v2` 源码构建并运行成功。
- Certd 由 systemd 托管，并可通过 Nginx HTTPS 访问。
- 腾讯云 SecretId 配置错误得到修正。
- CAM 子用户获得 DNSPod 创建和删除验证记录的权限。
- `*.shuomishengda.cn` 与 `shuomishengda.cn` 证书申请成功。
- 具备后续自动续期、自动覆盖 Nginx 证书和自动重载服务的条件。
