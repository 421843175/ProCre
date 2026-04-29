# ProCreate 编创基地

## 项目概述

ProCreate（编创基地）是一个基于FISCO-BCOS区块链的积分管理系统。用户在平台注册后会自动在区块链上创建账户，签到可获得积分（创造粒），积分存储在区块链上无法伪造或篡改。

## 技术架构

### 后端技术栈

| 技术 | 说明 |
|------|------|
| Spring Boot 2.5.6 | Web框架 |
| MyBatis-Plus 3.3.1 | ORM框架 |
| MySQL 8.0 | 关系数据库 |
| Redis | 缓存（存储验证码） |
| FISCO-BCOS Java SDK 2.7.2 | 区块链SDK |
| JWT 3.5.0 | Token认证 |
| WeBASE-Front | 区块链节点网关 |
| Java Mail | 邮件发送 |

### 前端技术栈

| 技术 | 说明 |
|------|------|
| uni-app | 跨平台框架 |
| Element UI | UI组件库 |
| Vue 2 | 前端框架 |

### 区块链配置

| 配置项 | 值 |
|--------|-----|
| 节点地址 | 192.168.10.100:20200, 192.168.10.100:20201 |
| 合约名称 | RecordPoints |
| 合约地址 | 0x649f107f31052fb308521c5eba5ad64e5bbf8729 |
| 合约ABI | 见application.yaml |
| 管理员地址 | 0xf319534dcb17ceb33f4f86c0795d160ed1831e8f |
| 调用网关 | http://192.168.10.100:5002/WeBASE-Front/trans/handle |

## 目录结构

```
ProCreate/
├── backend/
│   └── src/main/
│       ├── java/jupiter/jupiter/
│       │   ├── controller/          # REST控制器
│       │   │   ├── UserController.java      # 用户登录/注册/区块链接口
│       │   │   ├── UserSignController.java  # 签到接口
│       │   │   ├── FileController.java      # 文件上传下载
│       │   │   └── CURDUserInfoController.java
│       │   ├── service/            # 业务逻辑
│       │   │   └── impl/
│       │   │       ├── UserServiceImpl.java    # 用户注册登录、区块链交互
│       │   │       └── UserSignServiceImpl.java # 签到业务
│       │   ├── mapper/             # MyBatis Mapper
│       │   ├── entity/             # 实体类
│       │   │   ├── User.java               # 用户实体
│       │   │   ├── UserInfo.java           # 用户详情实体
│       │   │   ├── UserSign.java           # 签到实体
│       │   │   ├── requestcode.java       # 邀请码实体
│       │   │   └── Sign/TodaySign.java     # 今日签到实体
│       │   ├── utils/              # 工具类
│       │   │   ├── TokenUtils.java         # JWT Token生成/验证
│       │   │   ├── Md5Tool.java            # 双重MD5加密
│       │   │   ├── RSAUtils.java           # AES加密（区块链地址）
│       │   │   ├── HttpUtils.java         # 区块链HTTP调用
│       │   │   ├── SendEmil.java          # 邮件发送
│       │   │   └── RedisUtil.java
│       │   ├── interceptor/        # 拦截器
│       │   │   └── TokenInterceptor.java  # Token验证拦截器
│       │   └── config/            # 配置类
│       └── resources/
│           ├── conf/              # 区块链SDK配置
│           │   ├── config.toml    # 节点连接配置
│           │   ├── sdk.key        # SDK私钥
│           │   ├── sdk.crt        # SDK证书
│           │   └── ca.crt         # CA证书
│           └── application.yaml   # 应用配置
└── frontend/
    ├── App.vue
    └── manifest.json
```

## 数据库表结构

### user 用户表
存储用户基本信息及区块链地址。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| email | VARCHAR(255) | 邮箱（唯一） |
| password | VARCHAR(255) | 双重MD5加密密码 |
| power | INT | 权限等级 |
| date | DATETIME | 注册时间 |
| address | VARCHAR(500) | 区块链地址（AES加密） |

### user_info 用户详细信息表
存储用户个人资料。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| username | VARCHAR(100) | 用户名 |
| nick | VARCHAR(100) | 昵称 |
| sex | VARCHAR(10) | 性别 |
| brithday | VARCHAR(50) | 生日 |
| fieldarea | VARCHAR(200) | 领域 |
| interestarea | VARCHAR(500) | 兴趣领域 |
| career | VARCHAR(100) | 职业 |
| company | VARCHAR(200) | 公司 |
| location | VARCHAR(200) | 所在地 |
| home | VARCHAR(200) | 家乡 |
| info | TEXT | 个人简介 |

### user_sign 用户签到表
记录用户签到状态和连续签到天数。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| username | VARCHAR(100) | 用户名 |
| signday | INT | 连续签到天数 |
| signdate | DATETIME | 最后签到时间 |
| isPerInfo | BOOLEAN | 是否已完善个人信息 |

### requestcode 邀请码表
存储有效的邀请码。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| requestcode | VARCHAR(100) | 邀请码 |

### today_sign 今日签到表
当日签到详情。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键，自增 |
| addcreatepoint | INT | 增加的创造粒数量 |
| signday | INT | 签到天数 |
| endsign | DATETIME | 签到有效期 |

## API接口

### 用户接口 (/user)

| 接口 | 方法 | 参数 | 说明 |
|------|------|------|------|
| /user/login | POST | mail, password | 用户登录，返回JWT Token |
| /user/register | POST | mail, password, code, invitation | 用户注册 |
| /user/getCode | POST | email | 发送邮箱验证码（存入Redis，1小时有效） |
| /user/getAccountMe | GET | Header: Authorization | 获取当前用户区块链积分 |
| /user/getAccountRank | GET | - | 获取积分排行榜TOP10 |

### 签到接口 (/sign)

| 接口 | 方法 | 参数 | 说明 |
|------|------|------|------|
| /sign/getUserSign | GET | Header: Authorization | 获取用户签到状态 |
| /sign/settoday | GET | Header: Authorization | 执行签到，调用区块链添加积分 |

### 文件接口 (/file)

| 接口 | 方法 | 参数 | 说明 |
|------|------|------|------|
| /file/head/upload | POST | file, isHead | 上传头像/背景图 |
| /file/price/{token} | GET | - | 下载自己的头像 |
| /file/price/bgimg/{token} | GET | - | 下载自己的背景图 |
| /file/getprice/{username} | GET | - | 查看他人头像 |
| /file/public/{resourcename} | GET | - | 访问公开资源 |
| /file/price/isextis/{token} | GET | isHead | 检查头像是否存在 |

## 核心业务逻辑

### 用户注册流程

```
1. 前端提交: email, password, code(邮箱验证码), invitation(邀请码)
2. 验证邮箱验证码:
   - 从Redis获取存储的RegisterCode
   - 校验code是否匹配
   - 校验是否过期（1小时）
3. 验证邀请码:
   - 查询requestcode表确认邀请码有效
4. 验证邮箱格式: 必须以@qq.com结尾
5. 验证密码: 必须包含大小写字母且长度>=6位
6. 检查重复: 确认邮箱未被注册
7. 创建区块链账户:
   - 使用FISCO-BCOS SDK创建ECDSA密钥对
   - 获取账户地址
8. 加密存储: 用AES加密区块链地址
9. 存入数据库: user表、user_info表（默认空）、user_sign表（默认0签到）
10. 创建默认头像: 复制default.jpeg为用户头像
```

### 登录流程

```
1. 前端提交: mail, password
2. 查询数据库验证邮箱存在
3. 验证密码: 输入密码双重MD5后与数据库比对
4. 生成JWT Token:
   - payload: username(email), loginTime, power
   - 过期时间: 7天
5. 返回Token给前端
```

### 签到流程

```
1. 从Token解析用户名
2. 检查今日是否已签到（比较签到日期与当前日期）
3. 读取签到规则配置文件 (signday.yaml):
   - 根据连续签到天数确定奖励积分
   - 例: 1-3天=10分, 4-7天=20分, 8-15天=30分...
4. 更新user_sign表:
   - signday+1
   - signdate=当前时间
5. 调用区块链合约添加积分:
   - 解密用户区块链地址
   - 调用addPoints(userAddress, points)
6. 返回签到结果（获得积分数）
```

### 区块链积分系统

**智能合约RecordPoints接口:**

| 方法 | 说明 |
|------|------|
| getPoints(address account) | 查询用户积分 |
| addPoints(address userAddress, uint256 p) | 添加积分（需管理员权限） |
| transferUser(address from, address to, uint256 amount) | 转账 |
| setPoweruser(address account, bool ispower) | 设置管理员 |

**积分规则配置 (signday.yaml):**
```yaml
sign:
  day:
    3: 10      # 1-3天每天10积分
    7: 20      # 4-7天每天20积分
    15: 30     # 8-15天每天30积分
    30: 50     # 16-30天每天50积分
    100: 100   # 31天以上每天100积分
```

## 安全机制

| 机制 | 说明 |
|------|------|
| 密码加密 | 双重MD5Digest |
| 区块链地址加密 | AES-128加密 |
| 接口认证 | JWT Token（7天有效期） |
| 注册防护 | ESAPI XSS过滤（已注释） |
| 文件上传 | 仅允许image/jpeg/png/gif |
| 验证码 | Redis存储，1小时有效期 |

## 配置文件

### application.yaml 主要配置

```yaml
server:
  port: 8678

spring:
  mail:
    username: frommuxingkeji@126.com  # 发件邮箱
    host: smtp.126.com                  # 邮件服务器
  datasource:
    url: jdbc:mysql://localhost:3306/procre
    username: root
    password: "0000"
  redis:
    host: 192.168.10.100
    port: 6379
    password: 123456

files:
  upload:
    path: D:\procredata\price         # 文件存储路径
    allowTypes: [image/jpeg,image/png,image/jpg,image/gif]

system:
  contract:
    url: "http://192.168.10.100:5002/WeBASE-Front/trans/handle"
    address: "0x649f107f31052fb308521c5eba5ad64e5bbf8729"
    name: "RecordPoints"
    abi: '[...]'                      # 合约ABI定义
    owneraddress: "0xf319534dcb17ceb33f4f86c0795d160ed1831e8f"

projectconfig:
  path:
    signconfig: D:\procredata\config\signday.yaml
```

### 区块链SDK配置 (config.toml)

```toml
[network]
peers=["127.0.0.1:20200", "127.0.0.1:20201"]

[cryptoMaterial]
certPath = "conf"

[account]
keyStoreDir = "account"
accountFileFormat = "pem"
```

## 环境要求

- JDK 1.8+
- Maven 3.x
- MySQL 8.0+
- Redis 6.x
- FISCO-BCOS 节点 (或WeBASE-Front)

## 快速启动

### 1. 初始化数据库

```sql
CREATE DATABASE procre DEFAULT CHARACTER SET utf8mb4;
USE procre;
-- 执行 backend/sql.sql 建表语句
```

### 2. 配置区块链

确保FISCO-BCOS节点正常运行，配置正确的节点地址和合约信息。

### 3. 启动后端

```bash
cd backend
mvn clean package
java -jar target/jupiter-0.0.1-SNAPSHOT.jar
# 或
mvn spring-boot:run
```

### 4. 访问API文档

启动后访问: http://localhost:8678/swagger-ui.html

## 数据流转图

```
用户注册
┌─────────┐     ┌──────────┐     ┌─────────┐     ┌────────────┐
│ 前端    │────>│ 验证码   │────>│ 邀请码  │────>│ FISCO-BCOS │
│ 注册页  │     │ Redis    │     │ 数据库  │     │ 创建账户   │
└─────────┘     └──────────┘     └─────────┘     └────────────┘
                                                        │
                                                        v
                                                   AES加密存储
                                                        │
                                                        v
                                                   MySQL数据库

用户签到
┌─────────┐     ┌────────────┐     ┌────────────┐     ┌────────────┐
│ 前端    │────>│ 签到规则   │────>│ 更新签到表 │────>│ 区块链     │
│ 点击签到│     │ signday.yaml│     │ user_sign  │     │ addPoints  │
└─────────┘     └────────────┘     └────────────┘     └────────────┘
```

## 相关地址

| 类型 | 地址 |
|------|------|
| 合约地址 | 0x649f107f31052fb308521c5eba5ad64e5bbf8729 |
| 管理员地址 | 0xf319534dcb17ceb33f4f86c0795d160ed1831e8f |
| WeBASE网关 | http://192.168.10.100:5002 |
