---
id: 1029
slug: redis-free-cloud-database
title: Redis官方免费30M云数据库使用教程
authors: bianliang
keywords: [Redis,云数据库,RedisLabs,缓存,数据库]
tags: [Redis,云数据库,缓存,数据库]
description: 详细介绍如何注册并使用Redis官方提供的免费30MB云数据库服务，包括注册流程、配置步骤和连接方法
image: https://bianliangrensheng.cn/gImage/title/redis-cloud.png
date: 2025-04-05
---

# Redis官方免费30M云数据库使用教程

在开发过程中，我们经常需要一个Redis服务来做缓存、消息队列或者简单的数据存储。但是自己搭建Redis服务器不仅麻烦，还需要花钱购买服务器。其实，Redis官方提供了30MB的免费云数据库服务，足够满足小型项目或个人开发测试需求。本文将详细介绍如何注册并使用这个免费的Redis云数据库。

<!-- truncate -->

## RedisLabs简介

RedisLabs是Redis的官方云服务提供商，由Redis的创始人Salvatore Sanfilippo(antirez)创建的公司。他们提供了从免费到企业级的各种Redis云服务方案。免费方案虽然只有30MB的存储空间，但对于学习和小型项目来说已经足够用了。

## 免费方案特点

- 存储空间：30MB
- 连接数：30个并发连接
- 专用RESP端口访问
- 自动备份和故障恢复
- 不需要手机验证码，仅需邮箱注册
- 多地区可选：日本、新加坡、英国、美国等
- 国内可正常访问和使用

## 注册流程

### 1. 访问官网

首先访问Redis官方云服务网站：https://cloud.redis.io/#/login

### 2. 注册账号

点击右上角的"Try Free"或"Get Started"按钮，进入注册页面。

填写注册信息，包括：
- 邮箱地址
- 密码
- 姓名
- 公司名称(可选)

### 3. 验证邮箱

注册后，Redis官方会发送一封验证邮件到你的邮箱。请查收并点击邮件中的验证链接。

### 4. 登录账号

验证邮箱后，返回RedisLabs官网并使用刚才注册的邮箱和密码登录。

## 创建免费Redis数据库

### 1. 查看默认数据库

登录后，你会进入控制台页面。对于新注册的用户，RedisLabs通常会自动创建一个免费的30MB数据库实例，你可以在数据库列表中看到它。

![image-20250405093752797](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20250405093752797.png)

如果系统已经为你创建了默认数据库，你可以直接使用它，无需额外创建。如果没有看到默认数据库，或者你想创建一个新的数据库，可以点击"New database"按钮进行创建。

### 2. 创建新数据库（可选）

如果你需要创建新的数据库，点击页面右上角的"New database"按钮。

在数据库创建页面：
- 选择"Fixed Size"固定大小类型
- 选择"Free 30MB"免费套餐
- 输入数据库名称（如"myredis"）
- 选择地区（建议选择离你最近的地区，如日本或新加坡）

### 3. 配置数据库（可选）

配置Redis数据库的一些参数：
- 可以选择Redis版本（默认即可）
- 可以设置数据持久化选项（默认即可）
- 可以启用数据备份（免费版有限制）

完成配置后，点击"comfirm & pay"按钮创建数据库。

### 4. 使用数据库

无论是使用自动创建的默认数据库还是自己新建的数据库，你都可以点击"Connect"按钮获取连接信息。

![image-20250405092255259](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20250405092255259.png)

## 连接Redis云数据库

创建成功后，你将获得数据库的连接信息，包括：
- 端点地址（Endpoint）
- 端口号（Port）
- 密码（Password）
- ![获取连接信息](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20250405092023076.png)
- ![image-20250405092439231](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20250405092439231.png)



### 使用Redis-cli连接

如果你本地安装了Redis客户端，可以使用以下命令连接：

```bash
redis-cli -h <你的端点地址> -p <端口号> -a <密码>
```

例如：

```bash
redis-cli -h redis-10042.c10.us-east-1-2.ec2.cloud.redislabs.com -p 10042 -a ABCdef123456
```

下面是我的Redis-cli连接和使用案例:

首先，使用命令行连接到远程Redis服务器，输入正确的主机地址、端口和密码：

![image-20250405092811167](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20250405092811167.png)

连接成功后，可以执行基本的Redis命令测试功能，如设置键值对、获取值、查看所有键等：

![image-20250405092839829](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20250405092839829.png)

使用Redis-cli时，可以执行以下常用命令：

- `SET key value` - 设置键值对
- `GET key` - 获取指定键的值
- `KEYS *` - 查看所有键
- `DEL key` - 删除指定键
- `FLUSHDB` - 清空当前数据库
- `INFO` - 查看服务器信息

注意：在生产环境中请谨慎使用`FLUSHDB`和`KEYS *`命令，它们可能会影响性能或导致数据丢失。


### 在代码中连接

#### Java示例

```java
import redis.clients.jedis.Jedis;

public class RedisTest {
    public static void main(String[] args) {
        // 创建Jedis实例
        Jedis jedis = new Jedis("redis-10042.c10.us-east-1-2.ec2.cloud.redislabs.com", 10042);
        
        // 设置密码
        jedis.auth("ABCdef123456");
        
        // 测试连接
        String pingResponse = jedis.ping();
        System.out.println("连接成功: " + pingResponse);
        
        // 设置key
        jedis.set("testkey", "Hello RedisLabs!");
        
        // 获取key
        String value = jedis.get("testkey");
        System.out.println("获取值: " + value);
        
        // 关闭连接
        jedis.close();
    }
}
```

#### Python示例

```python
import redis

# 创建Redis连接
r = redis.Redis(
    host='redis-10042.c10.us-east-1-2.ec2.cloud.redislabs.com',
    port=10042,
    password='ABCdef123456'
)

# 测试连接
print("连接成功:", r.ping())

# 设置key
r.set('testkey', 'Hello RedisLabs!')

# 获取key
value = r.get('testkey')
print("获取值:", value.decode('utf-8'))
```

#### Node.js示例

```javascript
const redis = require('redis');
const client = redis.createClient({
    url: 'redis://default:ABCdef123456@redis-10042.c10.us-east-1-2.ec2.cloud.redislabs.com:10042'
});

(async () => {
    await client.connect();
    
    // 测试连接
    console.log("连接成功:", await client.ping());
    
    // 设置key
    await client.set('testkey', 'Hello RedisLabs!');
    
    // 获取key
    const value = await client.get('testkey');
    console.log("获取值:", value);
    
    // 关闭连接
    await client.quit();
})();
```


## 注意事项

1. **30MB容量限制**：免费版只有30MB存储空间，超出将无法写入新数据
2. **连接数限制**：最多支持30个并发连接
3. **账户活跃度**：长期不活跃的免费账户可能会被回收
4. **功能限制**：部分高级功能（如Redis模块）在免费版中不可用
5. **网络延迟**：由于服务器在国外，可能会有一定的网络延迟

## 总结

RedisLabs提供的免费30MB Redis云数据库是学习和小型项目的理想选择。它不需要复杂的服务器搭建过程，只需简单注册即可获得专业的Redis服务。虽然容量有限，但对于测试、学习或小型应用已经足够使用。

如果你的项目需要更大的存储空间或更多功能，RedisLabs也提供了各种付费方案，可以根据需求进行升级。

希望这篇教程能帮助你快速上手Redis云数据库，提升开发效率！