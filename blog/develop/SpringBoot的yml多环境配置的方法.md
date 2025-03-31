---
id: 1027
slug: springboot-yml-multiple-environments
title: SpringBoot的yml多环境配置的方法
date: 2025-03-25
authors: bianliang
keywords: [SpringBoot, yml配置, 多环境配置, 环境切换, 开发环境, 生产环境, 测试环境, profiles配置]
tags: [SpringBoot, 配置管理, Java开发]
description: 详细介绍SpringBoot项目中yml配置文件的多环境配置方法，包括多文件方式、单文件方式和pom.xml配置方式，帮助开发者优雅地管理不同环境的配置。
image: https://bianliangrensheng.cn/gImage/title/springboot-yml-config.png
---

# SpringBoot的yml多环境配置方法

🚀 在SpringBoot项目开发中，我们经常需要面对不同环境（开发、测试、生产）的配置管理问题。合理使用yml配置文件可以让多环境管理变得简单高效。本文将详细介绍三种实用的yml多环境配置方法，帮你轻松应对不同环境切换的挑战。

<!-- truncate -->

## 🔍 为什么需要多环境配置？
### 💡 一、多环境配置的意义
:::tip 配置管理的难题
没有多环境配置时，开发人员在不同环境间切换，需要手动修改配置文件，不仅繁琐且容易出错。
:::

多环境配置解决的问题：
- 🚫 避免了 手动修改配置文件带来的风险
- ✅ 实现了 一次配置，多环境运行
- 🔄 简化了 从开发到生产的部署流程
- 🔒 保障了 生产环境配置的安全性

### 🧩 二、常见的环境区分
在企业应用中，通常将运行环境分为以下几种：
| 环境类型 | 环境代码 | 主要用途 | 配置特点 |
|---------|---------|---------|---------|
| 开发环境 | dev | 日常开发和单元测试 | 本地数据库、详细日志、热部署 |
| 测试环境 | test | QA测试和功能验证 | 独立测试数据库、完整日志 |
| 预发环境 | stage | 模拟生产环境 | 与生产环境配置相近 |
| 生产环境 | prod | 正式对外服务 | 高性能配置、精简日志、安全设置 |

## 📋 三种多环境配置方法
### 📁 一、多yml文件方式
:::info 配置文件命名规则
这种方式利用SpringBoot的自动配置特性，通过文件命名规则区分不同环境。
:::

步骤一：创建多个配置文件

```
application.yml      # 主配置文件
application-dev.yml  # 开发环境配置
application-test.yml # 测试环境配置
application-prod.yml # 生产环境配置
```

步骤二：在主配置文件中指定激活的环境

```yml
spring:
  profiles:
    active: dev  # 指定激活"开发环境"配置
```

配置文件内容示例：
```yml
# application.yml - 所有环境通用配置
server:
  servlet:
    context-path: /api

spring:
  jackson:
    date-format: yyyy-MM-dd HH:mm:ss
    time-zone: GMT+8
```

```yml
# application-dev.yml - 开发环境特有配置
server:
  port: 8080
  
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/dev_db?useSSL=false
    username: dev_user
    password: dev_password
    
logging:
  level:
    root: debug
```

```yml
# application-prod.yml - 生产环境特有配置
server:
  port: 80
  
spring:
  datasource:
    url: jdbc:mysql://prod-server:3306/prod_db?useSSL=false
    username: ${PROD_DB_USER}  # 使用环境变量
    password: ${PROD_DB_PASS}
    
logging:
  level:
    root: warn
```

> 💡 小贴士： 当主配置文件和环境特定配置文件中存在相同配置项时，环境特定配置会覆盖主配置，实现差异化配置。

### 📄 二、单yml文件方式
:::tip 单文件多环境优势
适合配置项不太多的项目，所有环境配置集中在一个文件，易于对比和管理。
:::

单文件多环境配置示例：

```yml
# 指定默认激活的环境
spring:
  profiles:
    active: dev

---
# 开发环境配置
spring:
  config:
    activate:
      on-profile: dev
  datasource:
    url: jdbc:mysql://localhost:3306/dev_db?useSSL=false
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
server:
  port: 8080

---
# 测试环境配置
spring:
  config:
    activate:
      on-profile: test
  datasource:
    url: jdbc:mysql://test-server:3306/test_db?useSSL=false
    username: test
    password: test123
    driver-class-name: com.mysql.cj.jdbc.Driver
server:
  port: 8088

---
# 生产环境配置
spring:
  config:
    activate:
      on-profile: prod
  datasource:
    url: jdbc:mysql://prod-server:3306/prod_db?useSSL=false
    username: prod
    password: prod123!
    driver-class-name: com.mysql.cj.jdbc.Driver
server:
  port: 80
```

注意事项：
- `---` 用于分隔不同环境的配置块
- 在SpringBoot 2.4之前使用 `spring.profiles`，2.4及以后版本使用 `spring.config.activate.on-profile`
- 可以在任意位置添加通用配置

### 📦 三、通过pom.xml配置环境
:::warning 注意事项
这种方法结合了Maven的profile功能，在构建时就确定了环境配置，适合CI/CD流程。
:::

步骤一：创建配置文件
```
application.yml      # 主配置文件
application-dev.yml  # 开发环境配置
application-test.yml # 测试环境配置
application-prod.yml # 生产环境配置
```

步骤二：在application.yml中引用Maven属性

```yml
spring:
  profiles:
    active: @profiles.active@
```

步骤三：在pom.xml中配置profiles

```xml
<profiles>
    <!-- 开发环境 -->
    <profile>
        <id>dev</id>
        <activation>
            <!-- 默认激活开发环境 -->
            <activeByDefault>true</activeByDefault>
        </activation>
        <properties>
            <profiles.active>dev</profiles.active>
        </properties>
    </profile>
    
    <!-- 测试环境 -->
    <profile>
        <id>test</id>
        <properties>
            <profiles.active>test</profiles.active>
        </properties>
    </profile>
    
    <!-- 生产环境 -->
    <profile>
        <id>prod</id>
        <properties>
            <profiles.active>prod</profiles.active>
        </properties>
    </profile>
</profiles>
```

步骤四：添加资源过滤配置

```xml
<build>
    <resources>
        <resource>
            <directory>src/main/resources</directory>
            <filtering>true</filtering>
            <includes>
                <include>**/*.*</include>
            </includes>
        </resource>
    </resources>
</build>
```

步骤五：打包指定环境

```bash
# 打包测试环境
mvn clean package -P test

# 打包生产环境
mvn clean package -P prod
```

## 🔄 多环境配置

### 👍 一、环境变量与配置中心

对于生产环境的敏感信息（如数据库密码、API密钥等），建议使用以下方式保护：

1. **环境变量**：将敏感信息设置为环境变量
   
   ```yml
   spring:
     datasource:
       password: ${DB_PASSWORD}
   ```
   
2. **配置中心**：使用Spring Cloud Config、Nacos等配置中心
   - 集中管理配置
   - 动态更新
   - 权限控制

### 👍 二、Docker环境配置

使用Docker部署时，可以结合环境变量和Docker启动参数：

```bash
docker run -e "SPRING_PROFILES_ACTIVE=prod" \
           -e "DB_PASSWORD=secure_password" \
           -p 8080:8080 your-spring-application
```

### 👍 三、多环境配置比较

| 配置方法 | 优点 | 缺点 | 适用场景 |
|---------|-----|------|---------|
| 多文件方式 | 结构清晰、易于管理 | 文件较多 | 中大型项目 |
| 单文件方式 | 配置集中、对比方便 | 文件可能过长 | 小型项目 |
| Maven方式 | 与构建流程结合 | 配置较复杂 | CI/CD场景 |

## 🔑 示例案例：饮食健康管理

下面是一个饮食健康管理的多环境配置示例，展示如何处理不同环境的特殊需求：

![image-20250331200955807](https://bianliangrensheng.cn/gImage/content/image-20250331200955807.png)

###  主配置文件（application.yml）

```yml
# Spring配置
spring:
  profiles:
    # 激活环境配置
    active: dev
    # active: prod 生产环境 未激活
    # 包含的其他配置文件
    include: druid-dev
    # include: druid-prod  生产环境 未激活
```

###  开发环境（application--dev.yml）

```yml


# 开发环境配置
server:
  # 服务器的HTTP端口，默认为8080
  port: 8080
  servlet:
    # 应用的访问路径
    context-path: /
  tomcat:
    # tomcat的URI编码
    uri-encoding: UTF-8
    # 连接数满后的排队数，默认为100
    accept-count: 1000
    threads:
      # tomcat最大线程数，默认为200
      max: 800
      # Tomcat启动初始化的线程数，默认值10
      min-spare: 100

# 日志配置
logging:
  level:
    com.health: debug
    org.springframework: warn

# 用户配置
user:
  password:
    # 密码最大错误次数
    maxRetryCount: 5
    # 密码锁定时间（默认10分钟）
    lockTime: 10

# Spring配置
spring:
  # 资源信息
  messages:
    # 国际化资源文件路径
    basename: i18n/messages
  # 文件上传
  servlet:
    multipart:
      # 单个文件大小
      max-file-size: 10MB
      # 设置总上传的文件大小
      max-request-size: 20MB
  # 服务模块
  devtools:
    restart:
      # 热部署开关
      enabled: true
  # redis 配置
  redis:
    # 地址
    host: localhost
    # 端口，默认为6379
    port: 6379
    # 数据库索引
    database: 0
    # 密码
    password:
    # 连接超时时间
    timeout: 10s
    lettuce:
      pool:
        # 连接池中的最小空闲连接
        min-idle: 0
        # 连接池中的最大空闲连接
        max-idle: 8
        # 连接池的最大数据库连接数
        max-active: 8
        # #连接池最大阻塞等待时间（使用负值表示没有限制）
        max-wait: -1ms

# token配置
token:
  # 令牌自定义标识
  header: Authorization
  # 令牌密钥
  secret: abcdefghijklmnopqrstuvwxyz
  # 令牌有效期（默认60分钟）
  expireTime: 60

# MyBatis配置
mybatis:
  # 搜索指定包别名
  typeAliasesPackage: com.health.**.domain
  # 配置mapper的扫描，找到所有的mapper.xml映射文件
  mapperLocations: classpath*:mapper/**/*Mapper.xml
  # 加载全局的配置文件
  configLocation: classpath:mybatis/mybatis-config.xml

# PageHelper分页插件
pagehelper:
  helperDialect: mysql
  supportMethodsArguments: true
  params: count=countSql

# Swagger配置
swagger:
  # 是否开启swagger
  enabled: true
  # 请求前缀
  pathMapping: /dev-api

# 防止XSS攻击
xss:
  # 过滤开关
  enabled: true
  # 排除链接（多个用逗号分隔）
  excludes: /system/notice
  # 匹配链接
  urlPatterns: /system/*,/monitor/*,/tool/*



```



###  生产环境（application-prod.yml）

```yml
# 生产环境配置
server:
  # 服务器的HTTP端口，默认为8080
  port: 8080
  servlet:
    # 应用的访问路径
    context-path: /
  tomcat:
    # tomcat的URI编码
    uri-encoding: UTF-8
    # 连接数满后的排队数
    accept-count: 1000
    threads:
      # tomcat最大线程数
      max: 1000
      # Tomcat启动初始化的线程数
      min-spare: 100

# 日志配置
logging:
  level:
    com.health: info
    org.springframework: warn

# 用户配置
user:
  password:
    # 密码最大错误次数
    maxRetryCount: 5
    # 密码锁定时间（默认10分钟）
    lockTime: 10

# Spring配置
spring:
  # 资源信息
  messages:
    # 国际化资源文件路径
    basename: i18n/messages
  # 文件上传
  servlet:
    multipart:
      # 单个文件大小
      max-file-size: 10MB
      # 设置总上传的文件大小
      max-request-size: 20MB
  # redis 配置
  redis:
    # 地址
    host: 生产Redis地址
    # 端口，默认为6379
    port: 6379
    # 数据库索引
    database: 0
    # 密码
    password: ${REDIS_PASSWORD:}
    # 连接超时时间
    timeout: 10s
    lettuce:
      pool:
        # 连接池配置
        min-idle: 0
        max-idle: 8
        max-active: 8
        max-wait: -1ms

# token配置
token:
  # 令牌自定义标识
  header: Authorization
  # 令牌密钥
  secret: abcdefghijklmnopqrstuvwxyz
  # 令牌有效期（默认30分钟）
  expireTime: 30

# MyBatis配置
mybatis:
  # 搜索指定包别名
  typeAliasesPackage: com.health.**.domain
  # 配置mapper的扫描，找到所有的mapper.xml映射文件
  mapperLocations: classpath*:mapper/**/*Mapper.xml
  # 加载全局的配置文件
  configLocation: classpath:mybatis/mybatis-config.xml

# PageHelper分页插件
pagehelper:
  helperDialect: mysql
  supportMethodsArguments: true
  params: count=countSql

# Swagger配置
swagger:
  # 生产环境关闭swagger
  enabled: false
  # 请求前缀
  pathMapping: /prod-api

# 防止XSS攻击
xss:
  # 过滤开关
  enabled: true
  # 排除链接（多个用逗号分隔）
  excludes: /system/notice
  # 匹配链接
  urlPatterns: /system/*,/monitor/*,/tool/*


```



###  数据库开发环境（application-druid-dev.yml）

```yml
# 数据源配置
spring:
    datasource:
        type: com.alibaba.druid.pool.DruidDataSource
        driverClassName: com.mysql.cj.jdbc.Driver
        druid:
            # 主库数据源
            master:
                url: jdbc:mysql://localhost:3306/health-bite?useUnicode=true&characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&useSSL=true&serverTimezone=GMT%2B8
                username: root
                password: 123456
            # 从库数据源
            slave:
                # 从数据源开关/默认关闭
                enabled: false
                url: 
                username: 
                password: 
            # 初始连接数
            initialSize: 5
            # 最小连接池数量
            minIdle: 10
            # 最大连接池数量
            maxActive: 20
            # 配置获取连接等待超时的时间
            maxWait: 60000
            # 配置连接超时时间
            connectTimeout: 30000
            # 配置网络超时时间
            socketTimeout: 60000
            # 配置间隔多久才进行一次检测，检测需要关闭的空闲连接，单位是毫秒
            timeBetweenEvictionRunsMillis: 60000
            # 配置一个连接在池中最小生存的时间，单位是毫秒
            minEvictableIdleTimeMillis: 300000
            # 配置一个连接在池中最大生存的时间，单位是毫秒
            maxEvictableIdleTimeMillis: 900000
            # 配置检测连接是否有效
            validationQuery: SELECT 1 FROM DUAL
            testWhileIdle: true
            testOnBorrow: false
            testOnReturn: false
            webStatFilter: 
                enabled: true
            statViewServlet:
                enabled: true
                # 设置白名单，不填则允许所有访问
                allow:
                url-pattern: /druid/*
                # 控制台管理用户名和密码
            filter:
                stat:
                    enabled: true
                    # 慢SQL记录
                    log-slow-sql: true
                    slow-sql-millis: 1000
                    merge-sql: true
                wall:
                    config:
                        multi-statement-allow: true
```



###  数据库生产环境（application-druid-prod.yml）

```yml
# 数据源配置
spring:
    datasource:
        type: com.alibaba.druid.pool.DruidDataSource
        driverClassName: com.mysql.cj.jdbc.Driver
        druid:
            # 主库数据源
            master:
                url: jdbc:mysql://ip:prot/health-bite?useUnicode=true&characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&useSSL=true&serverTimezone=GMT%2B8
                username: 
                password: 
            # 从库数据源
            slave:
                # 从数据源开关/默认关闭
                enabled: false
                url: 
                username: 
                password: 
            # 初始连接数
            initialSize: 5
            # 最小连接池数量
            minIdle: 10
            # 最大连接池数量
            maxActive: 20
            # 配置获取连接等待超时的时间
            maxWait: 60000
            # 配置连接超时时间
            connectTimeout: 30000
            # 配置网络超时时间
            socketTimeout: 60000
            # 配置间隔多久才进行一次检测，检测需要关闭的空闲连接，单位是毫秒
            timeBetweenEvictionRunsMillis: 60000
            # 配置一个连接在池中最小生存的时间，单位是毫秒
            minEvictableIdleTimeMillis: 300000
            # 配置一个连接在池中最大生存的时间，单位是毫秒
            maxEvictableIdleTimeMillis: 900000
            # 配置检测连接是否有效
            validationQuery: SELECT 1 FROM DUAL
            testWhileIdle: true
            testOnBorrow: false
            testOnReturn: false
            webStatFilter: 
                enabled: true
            statViewServlet:
                enabled: true
                # 设置白名单，不填则允许所有访问
                allow:
                url-pattern: /druid/*

            filter:
                stat:
                    enabled: true
                    # 慢SQL记录
                    log-slow-sql: true
                    slow-sql-millis: 1000
                    merge-sql: true
                wall:
                    config:
                        multi-statement-allow: true



```
###  命令行启动指定环境
``` shell
   # 开发环境
   java -jar health-admin.jar --spring.profiles.active=dev --spring.profiles.include=druid-dev
   
   # 生产环境
   java -jar health-admin.jar --spring.profiles.active=prod --spring.profiles.include=druid-prod
```

## 📝 总结

合理的多环境配置是SpringBoot项目开发的基础设施，能有效提高开发效率，降低环境切换风险。

> "配置也是代码，应该像对待代码一样认真对待配置管理"

如果你有任何关于SpringBoot配置的经验或问题，欢迎在评论区分享交流！

