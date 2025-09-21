# ⚡ Full-Stack Next.js + Cloudflare 模板

一个用于构建全栈应用的生产就绪模板，采用 Next.js 15 和 Cloudflare 强大的边缘基础设施。非常适合 MVP 项目，拥有慷慨的免费层级，并可无缝扩展到企业级应用。

**灵感来自 [Cloudflare SaaS Stack](https://github.com/supermemoryai/cloudflare-saas-stack)** - 这是为 [Supermemory.ai](https://git.new/memory) 提供支持的相同技术栈，该应用仅需每月 5 美元即可为 20,000+ 用户提供服务。此模板使用 Cloudflare Workers（而非 Pages）对该方法进行了现代化改造，包含了全面的 D1 和 R2 示例，并提供完整的工作流。

您可以在 [Deepwiki](https://deepwiki.com/ifindev/fullstack-next-cloudflare) 上阅读 Devin AI 对此模板的详细解释和代码架构。

## 🌟 为什么选择 Cloudflare + Next.js？

**Cloudflare 的边缘网络**提供无与伦比的性能和可靠性：
- ⚡ **超低延迟** - 部署到全球 300+ 个地点
- 💰 **慷慨的免费层级** - 完美适合 MVP 和副项目
- 📈 **轻松扩展** - 从零到百万用户自动扩展
- 🔒 **内置安全** - DDoS 防护、WAF 等
- 🌍 **全球默认** - 您的应用在每个用户附近运行

结合 **Next.js 15**，您将获得现代 React 功能、服务器组件和服务器操作，以获得最佳性能和开发体验。

## 🛠️ 技术栈

### 🎯 **前端**
- ⚛️ **Next.js 15** - 带 React 服务器组件 (RSC) 的 App Router
- 🎨 **TailwindCSS 4** - 实用优先的 CSS 框架
- 📘 **TypeScript** - 完整的端到端类型安全
- 🧩 **Shadcn UI** - 无样式、可访问的组件
- 📋 **React Hook Form + Zod** - 类型安全的表单处理

### ☁️ **后端和基础设施**
- 🌐 **Cloudflare Workers** - 无服务器边缘计算平台
- 🗃️ **Cloudflare D1** - 边缘分布式 SQLite 数据库
- 📦 **Cloudflare R2** - S3 兼容的对象存储
- 🔑 **Better Auth** - 现代身份验证，支持 Google OAuth
- 🛠️ **Drizzle ORM** - TypeScript 优先的数据库工具包

### 🚀 **DevOps 和部署**
- ⚙️ **GitHub Actions** - 自动化 CI/CD 管道
- 🔧 **Wrangler** - Cloudflare 的 CLI 工具
- 👁️ **预览部署** - 生产前测试变更
- 🔄 **数据库迁移** - 版本控制的模式变更
- 💾 **自动备份** - 生产数据库安全

### 📊 **数据流架构**
- **获取**：服务器操作 + React 服务器组件，实现最佳性能
- **变更**：服务器操作，自动重新验证
- **类型安全**：从数据库到 UI 的端到端 TypeScript
- **缓存**：内置 Next.js 缓存 + Cloudflare 边缘缓存

## 🚀 快速开始

### 1. 先决条件

- **Cloudflare 账户** - [免费注册](https://dash.cloudflare.com/sign-up)
- **Node.js 20+** 和 **pnpm** 已安装
- **Google OAuth 应用** - 用于身份验证设置

### 2. 创建 Cloudflare API 令牌

创建用于 Wrangler 身份验证的 API 令牌：

1. 在 Cloudflare 仪表板中，转到 **Account API tokens** 页面
2. 选择 **Create Token** > 找到 **Edit Cloudflare Workers** > 选择 **Use Template**
3. 自定义您的令牌名称（例如，"Next.js Cloudflare Template"）
4. 将令牌范围限定到您的账户和区域（如果使用自定义域名）
5. **添加其他权限** 用于 D1 数据库访问：
   - Account - D1:Edit
   - Account - D1:Read

**最终令牌权限：**
- "Edit Cloudflare Workers" 模板的所有权限
- Account - D1:Edit（用于数据库操作）
- Account - D1:Read（用于数据库查询）

### 3. 克隆和设置

```bash
# 克隆仓库
git clone https://github.com/ifindev/fullstack-next-cloudflare.git
cd fullstack-next-cloudflare

# 安装依赖
pnpm install
```

### 4. 环境配置

创建您的环境文件：

```bash
# 复制示例环境文件
cp .dev.vars.example .dev.vars
```

使用您的凭据编辑 `.dev.vars`：

```bash
# Cloudflare 配置
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_D1_TOKEN=your-api-token

# 身份验证密钥
BETTER_AUTH_SECRET=your-random-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# 存储
CLOUDFLARE_R2_URL=your-r2-bucket-url
```

### 5. 身份验证设置

**Better Auth 密钥：**
```bash
# 生成随机密钥
openssl rand -base64 32
# 添加到 .dev.vars 中的 BETTER_AUTH_SECRET
```

**Google OAuth 设置：**
按照 [Better Auth Google 文档](https://www.better-auth.com/docs/authentication/google) 进行：
1. 创建 Google OAuth 2.0 应用
2. 获取您的客户端 ID 和客户端密钥
3. 添加授权的重定向 URI

### 6. 存储设置

**本地开发：**
```bash
# 创建 R2 存储桶用于本地开发
wrangler r2 bucket create next-cf-app-bucket-dev

# 获取存储桶 URL 并添加到 .dev.vars 作为 CLOUDFLARE_R2_URL
```

**生产环境：**
GitHub Actions 工作流将自动创建生产存储桶。部署后，使用 R2 URL 更新您的生产密钥。

## 🛠️ 手动设置（详细）

如果您更喜欢手动设置所有内容或想详细了解每个步骤，请按照此详细指南进行。

### 第 1 步：创建 Cloudflare 资源

**创建 D1 数据库：**
```bash
# 在边缘创建新的 SQLite 数据库
wrangler d1 create your-app-name

# 输出将显示：
# database_name = "your-app-name"
# database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**创建 R2 存储桶：**
```bash
# 创建对象存储桶
wrangler r2 bucket create your-app-bucket

# 列出存储桶以确认
wrangler r2 bucket list
```

### 第 2 步：配置 Wrangler

使用您的资源 ID 更新 `wrangler.jsonc`：

```jsonc
{
    "name": "your-app-name",
    "d1_databases": [
        {
            "binding": "DB",
            "database_name": "your-app-name",
            "database_id": "your-database-id-from-step-1",
            "migrations_dir": "./src/drizzle"
        }
    ],
    "r2_buckets": [
        {
            "bucket_name": "your-app-bucket",
            "binding": "FILES"
        }
    ]
}
```

### 第 3 步：设置身份验证

**生成 Better Auth 密钥：**
```bash
# 在 macOS/Linux 上
openssl rand -base64 32

# 在 Windows (PowerShell) 上
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# 或使用在线生成器：https://generate-secret.vercel.app/32
```

**配置 Google OAuth：**
1. 转到 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google+ API
4. 创建 OAuth 2.0 凭据
5. 添加授权的重定向 URI：
   - `http://localhost:3000/api/auth/callback/google`（开发）
   - `https://your-app.your-subdomain.workers.dev/api/auth/callback/google`（生产）

### 第 4 步：环境配置

**创建本地环境文件：**
```bash
# .dev.vars 用于本地开发
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_D1_TOKEN=your-api-token
BETTER_AUTH_SECRET=your-generated-secret
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
CLOUDFLARE_R2_URL=https://your-bucket.your-account-id.r2.cloudflarestorage.com
```

**设置生产密钥：**
```bash
# 将每个密钥添加到 Cloudflare Workers
echo "your-secret-here" | wrangler secret put BETTER_AUTH_SECRET
echo "your-client-id" | wrangler secret put GOOGLE_CLIENT_ID
echo "your-client-secret" | wrangler secret put GOOGLE_CLIENT_SECRET
echo "your-r2-url" | wrangler secret put CLOUDFLARE_R2_URL
```

### 第 5 步：数据库设置

**生成 TypeScript 类型：**
```bash
# 为 TypeScript 生成 Cloudflare 绑定
pnpm run cf-typegen
```

**初始化数据库：**
```bash
# 从模式生成初始迁移
pnpm run db:generate

# 将迁移应用到本地数据库
pnpm run db:migrate:local

# 验证数据库结构
pnpm run db:inspect:local
```

**可选：种子示例数据**
```bash
# 创建并运行种子脚本
wrangler d1 execute your-app-name --local --command="
INSERT INTO todos (id, title, description, completed, created_at, updated_at) VALUES
('1', '欢迎使用您的应用', '这是一个示例待办事项', false, datetime('now'), datetime('now')),
('2', '设置身份验证', '配置 Google OAuth', true, datetime('now'), datetime('now'));
"
```

### 第 6 步：测试您的设置

**启动开发服务器：**
```bash
# 终端 1：启动 Wrangler（提供 D1 访问）
pnpm run wrangler:dev

# 终端 2：启动 Next.js（提供 HMR）
pnpm run dev

# 替代方案：单个命令（无 HMR）
pnpm run dev:cf
```

**验证一切正常：**
1. 打开 `http://localhost:3000`
2. 测试身份验证流程
3. 创建待办事项
4. 检查数据库：`pnpm run db:studio:local`

### 第 7 步：设置 GitHub Actions（可选）

**添加仓库密钥：**
转到您的 GitHub 仓库 → 设置 → 密钥并添加：

- `CLOUDFLARE_API_TOKEN` - 来自第 2 步的 API 令牌
- `CLOUDFLARE_ACCOUNT_ID` - 您的账户 ID
- `BETTER_AUTH_SECRET` - 您的身份验证密钥
- `GOOGLE_CLIENT_ID` - 您的 Google 客户端 ID
- `GOOGLE_CLIENT_SECRET` - 您的 Google 客户端密钥
- `CLOUDFLARE_R2_URL` - 您的 R2 存储桶 URL

**部署生产数据库：**
```bash
# 将迁移应用到生产环境
pnpm run db:migrate:prod

# 验证生产数据库
pnpm run db:inspect:prod
```

## 🔧 高级手动配置

### 自定义域名设置

**添加自定义域名：**
1. 转到 Cloudflare 仪表板 → Workers & Pages
2. 选择您的 worker → 设置 → 触发器
3. 点击"Add Custom Domain"
4. 输入您的域名（必须在您的 Cloudflare 账户中）

**更新 OAuth 重定向 URL：**
将您的自定义域名添加到 Google OAuth 设置：
- `https://yourdomain.com/api/auth/callback/google`

### 数据库优化

**添加索引以提高性能：**
```sql
-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at);
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
```

**监控数据库性能：**
```bash
# 查看数据库洞察
wrangler d1 insights your-app-name --since 1h

# 导出数据进行分析
wrangler d1 export your-app-name --output backup.sql
```

### R2 存储配置

**配置 CORS 用于直接上传：**
```bash
# 创建 CORS 策略文件
echo '[
  {
    "AllowedOrigins": ["https://yourdomain.com", "http://localhost:3000"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": [],
    "MaxAgeSeconds": 3000
  }
]' > cors.json

# 应用 CORS 策略
wrangler r2 bucket cors put your-app-bucket --file cors.json
```

### 性能监控

**启用高级分析：**
```jsonc
// 添加到 wrangler.jsonc
{
  "observability": {
    "enabled": true,
    "head_sampling_rate": 1
  },
  "analytics_engine_datasets": [
    {
      "binding": "ANALYTICS",
      "dataset": "your-analytics-dataset"
    }
  ]
}
```

## 🏃‍♂️ 开发工作流

### 初始设置
```bash
# 1. 生成 Cloudflare 类型（在 wrangler.jsonc 更改后运行）
pnpm run cf-typegen

# 2. 应用数据库迁移
pnpm run db:migrate:local

# 3. 构建适用于 Cloudflare 的应用程序
pnpm run build:cf
```

### 日常开发
```bash
# 终端 1：启动 Wrangler 以访问 D1 数据库
pnpm run wrangler:dev

# 终端 2：启动 Next.js 开发服务器，支持 HMR
pnpm run dev
```

**开发 URL：**
- 🌐 **Next.js with HMR**: `http://localhost:3000`（推荐）
- ⚙️ **Wrangler 开发服务器**: `http://localhost:8787`

### 替代开发选项
```bash
# 单个命令 - Cloudflare 运行时（无 HMR）
pnpm run dev:cf

# 使用远程 Cloudflare 资源进行测试
pnpm run dev:remote
```

## 📜 可用脚本

### **核心开发**
| 脚本 | 描述 |
|--------|-------------|
| `pnpm dev` | 启动带 HMR 的 Next.js |
| `pnpm run build:cf` | 为 Cloudflare Workers 构建 |
| `pnpm run wrangler:dev` | 启动 Wrangler 以访问本地 D1 |
| `pnpm run dev:cf` | 组合构建 + Cloudflare 开发服务器 |

### **数据库操作**
| 脚本 | 描述 |
|--------|-------------|
| `pnpm run db:generate` | 生成新迁移 |
| `pnpm run db:generate:named "migration_name"` | 生成命名迁移 |
| `pnpm run db:migrate:local` | 将迁移应用到本地 D1 |
| `pnpm run db:migrate:preview` | 将迁移应用到预览环境 |
| `pnpm run db:migrate:prod` | 将迁移应用到生产环境 |
| `pnpm run db:studio:local` | 为本地数据库打开 Drizzle Studio |
| `pnpm run db:inspect:local` | 列出本地数据库表 |
| `pnpm run db:reset:local` | 重置本地数据库 |

### **部署和生产**
| 脚本 | 描述 |
|--------|-------------|
| `pnpm run deploy` | 部署到生产环境 |
| `pnpm run deploy:preview` | 部署到预览环境 |
| `pnpm run cf-typegen` | 生成 Cloudflare TypeScript 类型 |
| `pnpm run cf:secret` | 向 Cloudflare Workers 添加密钥 |

### **开发顺序**

**首次设置：**
1. `pnpm run cf-typegen` - 生成类型
2. `pnpm run db:migrate:local` - 设置数据库
3. `pnpm run build:cf` - 构建应用程序

**日常开发：**
1. `pnpm run wrangler:dev` - 启动 D1 访问（终端 1）
2. `pnpm run dev` - 启动带 HMR 的 Next.js（终端 2）

**模式更改后：**
1. `pnpm run db:generate` - 生成迁移
2. `pnpm run db:migrate:local` - 应用到本地数据库

**wrangler.jsonc 更改后：**
1. `pnpm run cf-typegen` - 重新生成类型

## 🏗️ 项目结构

此模板使用**基于功能/模块切片的架构**，以获得更好的可维护性和可扩展性：

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 身份验证相关页面
│   ├── api/               # API 路由（用于外部访问）
│   ├── dashboard/         # 仪表板页面
│   └── globals.css        # 全局样式
├── components/            # 共享 UI 组件
├── constants/             # 应用常量
├── db/                    # 数据库配置
│   ├── index.ts          # DB 连接
│   └── schema.ts         # 数据库模式
├── lib/                   # 共享工具
├── modules/               # 功能模块
│   ├── auth/             # 身份验证模块
│   │   ├── actions/      # 身份验证服务器操作
│   │   ├── components/   # 身份验证组件
│   │   ├── hooks/        # 身份验证钩子
│   │   ├── models/       # 身份验证模型
│   │   ├── schemas/      # 身份验证模式
│   │   └── utils/        # 身份验证工具
│   ├── dashboard/        # 仪表板模块
│   └── todos/            # 待办事项模块
│       ├── actions/      # 待办事项服务器操作
│       ├── components/   # 待办事项组件
│       ├── models/       # 待办事项模型
│       └── schemas/      # 待办事项模式
└── drizzle/              # 数据库迁移
```

**关键架构优势：**
- 🎯 **功能隔离** - 每个模块包含自己的操作、组件和逻辑
- 🔄 **服务器操作** - 现代数据变更，自动重新验证
- 📊 **React 服务器组件** - 服务器端渲染，性能最佳
- 🛡️ **类型安全** - 从数据库到 UI 的端到端 TypeScript
- 🧪 **可测试性** - 清晰的关注点分离使测试更容易

## 🔧 高级配置

### 数据库模式更改
```bash
# 1. 修改 src/db/schemas/ 中的模式文件
# 2. 生成迁移
pnpm run db:generate:named "add_user_table"
# 3. 应用到本地数据库
pnpm run db:migrate:local
# 4. 测试您的更改
# 5. 提交并部署（迁移自动运行）
```

### 添加新的 Cloudflare 资源
```bash
# 1. 用新资源更新 wrangler.jsonc
# 2. 重新生成类型
pnpm run cf-typegen
# 3. 更新代码以使用新绑定
```

### 生产密钥管理
```bash
# 向生产环境添加密钥
pnpm run cf:secret BETTER_AUTH_SECRET
pnpm run cf:secret GOOGLE_CLIENT_ID
pnpm run cf:secret GOOGLE_CLIENT_SECRET
```

## 📊 性能和监控

**内置可观测性：**
- ✅ Cloudflare Analytics（默认启用）
- ✅ 实际用户监控 (RUM)
- ✅ 错误跟踪和日志记录
- ✅ 性能指标

**数据库监控：**
```bash
# 监控数据库性能
wrangler d1 insights next-cf-app

# 在 Cloudflare 仪表板中查看数据库指标
# 导航到 Workers & Pages → D1 → next-cf-app → 指标
```

## 🚀 部署

### 自动部署（推荐）

推送到 `main` 分支会通过 GitHub Actions 触发自动部署：

```bash
git add .
git commit -m "feat: 添加新功能"
git push origin main
```

**部署管道：**
1. ✅ 安装依赖
2. ✅ 构建应用程序
3. ✅ 运行数据库迁移
4. ✅ 部署到 Cloudflare Workers

### 手动部署

```bash
# 部署到生产环境
pnpm run deploy

# 部署到预览环境
pnpm run deploy:preview
```

## ✍️ 待办事项

- [ ] 使用 [Resend](https://resend.com/) 和 [Cloudflare Email Routing](https://www.cloudflare.com/developer-platform/products/email-routing/) 实现邮件发送
- [ ] 使用 [Polar.sh](https://polar.sh/) 实现国际支付网关
- [ ] 使用 [Xendit](https://www.xendit.co/en-id/)、[Midtrans](https://midtrans.com/en) 或 [Duitku](https://www.duitku.com/) 实现印度尼西亚支付网关

## 🤝 贡献

欢迎贡献！请随时提交问题和拉取请求。

## 📝 许可证

此项目根据 MIT 许可证许可 - 详情请参见 [LICENSE](LICENSE) 文件。

---

© 2025 Muhammad Arifin. 保留所有权利。
