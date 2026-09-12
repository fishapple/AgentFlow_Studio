# 🚀 AgentFlow Studio - 快速开始指南

## ⏱️ 5 分钟快速部署

### 方式一：使用 Docker Compose（最简单）

```bash
# 1. 克隆项目
git clone https://github.com/fishapple/AgentFlow_Studio.git
cd AgentFlow_Studio

# 2. 复制环境配置文件
cp .env.example .env

# 3. 编辑.env，修改数据库密码（可选）
nano .env  # 或 vim .env / .env

# 4. 启动服务
docker-compose up -d

# 5. 访问应用
open http://localhost:3000  # Web UI
open http://localhost:8000/docs  # API 文档
```

### 方式二：本地开发环境（适合深度定制）

#### 前端设置

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问地址
http://localhost:5173
```

#### 后端设置

```bash
cd backend

# 创建虚拟环境（Windows）
python -m venv .venv
.venv\Scripts\activate

# Linux/macOS
source .venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 复制环境变量文件
cp ../.env.example .env

# 启动服务
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 访问地址
http://localhost:8000/docs  # API 文档
```

---

## 📋 开发环境检查清单

在开始开发之前，请确保：

- [ ] Python 3.10+ 已安装
- [ ] Node.js 20.x 已安装
- [ ] Docker & Docker Compose（如果使用容器化）已安装
- [ ] PostgreSQL 数据库运行中（或使用 docker-compose 中的内置数据库）
- [ ] Redis 服务运行中（或使用 docker-compose 中的内置 Redis）

---

## 🎯 第一个功能：创建工作流

1. **启动前端**
   ```bash
   cd frontend && npm run dev
   ```

2. **打开浏览器访问** `http://localhost:5173`

3. **拖拽节点到画布**
   - LLM 调用节点 → 连接 OpenAI API
   - Tool 工具节点 → 集成天气查询服务
   - Condition 条件分支 → 根据用户意图路由

4. **保存工作流**
   ```bash
   # 在浏览器中点击 "Save Workflow"
   ```

---

## 🔧 开发建议与最佳实践

### 前端开发

1. **TypeScript 类型检查**
   ```bash
   npx tsc --noEmit
   ```

2. **代码格式化**
   ```bash
   npm run format
   ```

3. **ESLint 检查**
   ```bash
   npm run lint
   ```

4. **运行测试**
   ```bash
   npm test
   ```

### 后端开发

1. **类型检查（mypy）**
   ```bash
   mypy . --ignore-missing-imports
   ```

2. **代码格式化（Black）**
   ```bash
   black backend/
   ```

3. **Flake8 检查**
   ```bash
   flake8 backend/
   ```

4. **运行测试**
   ```bash
   pytest tests/ --cov=. --cov-report=term-missing
   ```

---

## 📚 核心项目结构

```
AgentFlow_Studio/
├── frontend/                 # React + TypeScript 前端应用
│   ├── src/
│   │   ├── components/      # UI 组件库
│   │   │   ├── layout/      # Header, Sidebar
│   │   │   └── canvas/      # WorkflowCanvas, Node, ConnectionLine
│   │   ├── types/           # TypeScript 类型定义
│   │   ├── utils/           # 工具函数（如 API client）
│   │   └── App.tsx          # 主应用组件
│   ├── package.json         # NPM 依赖配置
│   └── vite.config.ts       # Vite 构建配置
│
├── backend/                 # FastAPI Python 后端服务
│   ├── main.py              # FastAPI 应用入口
│   ├── models/              # SQLAlchemy ORM 模型定义
│   │   ├── base.py          # 基础模型类
│   │   ├── workflow.py      # Workflow 模型
│   │   └── execution.py     # Execution 记录模型
│   ├── services/            # 业务逻辑层
│   │   ├── workflow_service.py
│   │   ├── workflow_engine.py
│   │   └── plugin_service.py
│   ├── routes/              # RESTful API 路由定义
│   │   ├── workflows.py
│   │   └── executions.py
│   ├── db/                  # 数据库配置与初始化
│   │   ├── database.py      # SQLAlchemy engine & session
│   │   └── init.sql         # PostgreSQL DDL 脚本
│   └── requirements.txt     # Python 依赖列表
│
├── .github/workflows/       # GitHub Actions CI/CD 配置
│   ├── ci.yml               # 持续集成流水线
│   └── notification.yml     # 问题通知配置
│
├── docker-compose.yml       # Docker Compose 服务编排
├── README.md                # 项目说明文档（英文）
└── docs/                    # 技术文档目录
    ├── README.md            # 中文技术文档
    └── assets/              # 静态资源（图片、图标等）
```

---

## 🎓 学习路径推荐

### Week 1: 基础理解
- ✅ 阅读 `README.md` 和 `QUICKSTART.md`
- ✅ 运行 Docker Compose 查看应用运行状态
- ✅ 浏览 API 文档（http://localhost:8000/docs）

### Week 2: 前端开发入门
- ✅ React + TypeScript 基础语法
- ✅ Vite 项目配置理解
- ✅ 修改 Header/Sidebar 组件样式

### Week 3: 后端逻辑实现
- ✅ FastAPI 路由编写
- ✅ SQLAlchemy ORM 模型使用
- ✅ 数据库 CRUD 操作实践

### Week 4: 工作流引擎核心
- ✅ DAG（有向无环图）算法理解
- ✅ React Flow 画布交互实现
- ✅ 节点拖拽与连线逻辑

---

## 🐛 常见问题排查

### Q1: Docker Compose 启动失败？

```bash
# 检查 Docker 是否运行
docker ps

# 查看日志
docker-compose logs

# 重启服务
docker-compose down && docker-compose up -d
```

### Q2: 数据库连接错误？

确保 PostgreSQL 正在运行：
```bash
docker ps | grep postgres
```

如果容器未启动，重新构建并启动：
```bash
docker-compose up -d postgres redis backend frontend nginx
```

### Q3: npm install 失败？

网络问题可能导致下载缓慢。可以更换镜像源（国内）：

```bash
npm config set registry https://registry.npmmirror.com
npm install
```

---

## 🤝 贡献指南

我们欢迎所有形式的贡献！详细指南请查看 [CONTRIBUTING.md](./CONTRIBUTING.md)

### 快速开始贡献

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 进行你的修改
4. 提交更改：`git commit -m 'feat: add amazing feature'`
5. 推送到远程：`git push origin feature/amazing-feature`
6. 创建 Pull Request

---

## 📝 下一步

现在你已经成功启动了项目，接下来可以：

1. **阅读完整文档** - `docs/README.md`（中文技术文档）
2. **查看 API 接口定义** - http://localhost:8000/docs
3. **参与社区讨论** - GitHub Issues / Discussions
4. **开始你的第一个功能实现！** 🚀

---

<div align="center">

**Made with ❤️ by the AgentFlow Team**  
©️ 2024 AgentFlow Studio | MIT License

</div>
