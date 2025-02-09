# 租赁管理系统

这是一个基于React的房屋租赁管理系统前端项目，用于管理房源、租户、合同等信息。

## 功能特性

- 📊 仪表盘概览
- 🏠 房源管理
- 📝 合同管理
- 💰 费用管理
- 👥 客户管理
- 💳 收银管理
- 📈 数据分析
- 🔐 用户认证

## 技术栈

- React 
- React Router
- Fetch API
- CSS3

## 快速开始

### 前提条件

- Node.js (版本 14.0.0 或更高)
- npm (版本 6.0.0 或更高)

### 安装步骤

1. 克隆项目
```bash
git clone https://github.com/Shinokawa/rental.git
cd rental
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm start
```

4. 打开浏览器访问 http://localhost:5173

## 项目结构

```
rental/
├── src/
│   ├── components/     # 可复用组件
│   ├── pages/         # 页面组件
│   ├── App.js         # 应用入口
│   └── index.js       # 项目入口
├── public/            # 静态资源
└── package.json       # 项目配置
```

## API 接口

项目默认后端API地址为 `http://localhost:8000/api/`，主要接口包括：

- `/api/token/` - 用户认证
- `/api/properties/` - 房源管理
- `/api/tenants/` - 租户管理
- `/api/contracts/` - 合同管理
- `/api/fees/` - 费用管理
- `/api/payments/` - 支付管理
- `/api/data-analysis/` - 数据分析
