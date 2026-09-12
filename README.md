# AgentFlow Studio 🚀

<div align="center">

![AgentFlow Logo](./docs/assets/logo.png)

**AI Agent 开发一站式平台 - 让工作流编排像搭积木一样简单！**

[![GitHub Stars](https://img.shields.io/github/stars/fishapple/AgentFlow_Studio?style=for-the-badge&logo=github)](https://github.com/fishapple/AgentFlow_Studio)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Python Version](https://img.shields.io/badge/python-3.10+-blue?style=for-the-badge&logo=python)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18+-black?style=for-the-badge&logo=react)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-green?style=for-the-badge&logo=uvicorn)](https://fastapi.tiangolo.com/)

> 🌟 **中文 | [English](./docs/README.md)**

</div>

---

## ✨ 一句话介绍

**AgentFlow Studio** 是一个面向企业级 AI Agent 开发的可视化工作流平台，让你通过拖拽就能创建强大的智能体应用，并支持 Git 版本管理、CI/CD 集成和 SDK 自动生成。

**"LangChain + Dify + Kubernetes 的最佳结合点"**

---

## 🎯 核心特性

### 🖱️ **可视化工作流编排**
- ✅ 拖拽式画布，10 分钟构建第一个 AI Agent
- ✅ 支持 LLM、工具调用、条件分支、并行执行等多种节点类型
- ✅ 实时预览和调试功能

### 🔧 **企业级集成能力**
- ✅ Git 版本控制（类似 GitHub Pull Request 的工作流审批）
- ✅ CI/CD Pipeline 自动部署
- ✅ API 网关 + OpenAPI/Swagger 文档自动生成

### 📦 **SDK 自动化生成**
```typescript
// 一键生成的 TypeScript SDK
import { AgentFlowSDK } from '@agentflow/sdk';

const chatBot = new AgentFlowSDK({
  workflowId: 'customer-support-bot',
  apiKey: process.env.AGENTFLOW_API_KEY,
});

// 直接调用
const response = await chatBot.handle({ userInput: "帮我查订单" });
```

### 📊 **全链路监控与调试**
- ✅ 实时执行追踪和日志查看
- ✅ 性能指标（耗时、Token 消耗、成功率）
- ✅ 断点调试支持

---

## 🚀 快速开始

### 方式一：Docker Compose（推荐，一键部署）

```bash
# 克隆项目
git clone https://github.com/fishapple/AgentFlow_Studio.git
cd AgentFlow_Studio

# 启动开发环境
docker-compose up -d

# 访问应用
open http://localhost:3000  # Web UI
```

### 方式二：本地开发（适合深度定制）

#### 前端设置
```bash
# React + TypeScript + Vite
cd frontend
npm install
npm run dev
# 访问 http://localhost:5173
```

#### 后端设置
```bash
# Python FastAPI + PostgreSQL
cd backend
pip install -r requirements.txt
python main.py
# 访问 http://localhost:8000
```

---

## 📖 使用示例

### 创建第一个 AI Agent 工作流

1. **打开可视化编辑器**
   ```bash
   docker-compose exec web bash
   cd /app/frontend && npm run dev
   ```

2. **拖拽节点构建工作流**
   - LLM 调用节点 → 连接 OpenAI API
   - Tool 调用节点 → 集成天气查询服务
   - Condition 分支 → 根据用户意图路由

3. **执行并测试**
   ```bash
   curl http://localhost:8000/api/v1/executions \
     -d '{"workflow_id": "weather-bot-v1"}'
   ```

4. **生成 SDK 并发布**
   ```bash
   npm run generate-sdk -- --workflow-id weather-bot-v1 --output ./packages/sdk-weather-bot
   ```

---

## 🏗️ 技术架构

```
┌─────────────────────────────────────────┐
│         AgentFlow Studio                │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐    ┌──────────────┐  │
│  │   Frontend   │    │    Backend   │  │
│  │ React Flow   │◄──►│ FastAPI +    │  │
│  │ TypeScript   │    │ PostgreSQL   │  │
│  └──────────────┘    └──────────────┘  │
│           │                    │        │
│           ▼                    ▼        │
│  ┌─────────────────────────────────┐   │
│  │       Workflow Engine           │   │
│  │  • DAG Execution                │   │
│  │  • Parallel Processing          │   │
│  │  • Condition Resolution         │   │
│  └─────────────────────────────────┘   │
│                    │                     │
│        ┌──────────┴──────────┐         │
│        ▼                     ▼         │
│  ┌──────────────┐    ┌──────────────┐ │
│  │     LLM      │    │    Plugins   │ │
│  │ Providers    │    │ & Tools      │ │
│  │ (OpenAI, etc)│    │              │ │
│  └──────────────┘    └──────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### 技术栈详情

| 层级 | 技术选型 | 说明 |
|------|---------|------|
| **前端框架** | React 18 + TypeScript + Vite | 高性能、类型安全 |
| **状态管理** | Zustand | 轻量级，适合中大型应用 |
| **工作流可视化** | React Flow | 业界标准的流程图库 |
| **UI 组件** | Ant Design / shadcn/ui | 企业级 UI 标准 |
| **后端框架** | FastAPI (Python) + Fastify (Node.js) | API 网关 + AI 服务双语言架构 |
| **数据库** | PostgreSQL + Redis | 结构化数据 + 缓存/消息队列 |
| **容器化** | Docker Compose / Kubernetes | 一键部署 |
| **监控** | Prometheus + Grafana | 系统指标追踪 |

---

## 🌟 特色功能展示

### 🎨 可视化编辑器

![Workflow Editor Demo](./docs/assets/editor-demo.png)

支持：
- ✅ 无限画布缩放和平移
- ✅ 复杂连线自适应路径计算
- ✅ 实时节点配置修改
- ✅ 撤销/重做历史操作

### 📊 执行监控面板

![Monitoring Dashboard](./docs/assets/monitoring-dashboard.png)

提供：
- ✅ 实时指标（执行次数、成功率、Token 消耗）
- ✅ 执行追踪日志
- ✅ 性能分析图表

---

## 🚧 当前进度

### ✅ Phase 0 - 基础准备 (100%)
- [x] GitHub 仓库初始化
- [x] README.md + LICENSE + CONTRIBUTING.md
- [x] 技术选型决策确定
- [ ] ⏳ 项目脚手架搭建（进行中）

### 🎯 Phase 1 - MVP 核心功能 (预计 4 周)
- [ ] React Flow 画布实现
- [ ] LLM/Tool节点支持
- [ ] 工作流执行引擎
- [ ] 版本管理功能

---

## 🤝 参与贡献

我们欢迎所有形式的贡献！🎉

### 如何开始

1. **Fork** 本仓库
2. **创建 Feature Branch**: `git checkout -b feature/AmazingFeature`
3. **Commit**: `git commit -m 'Add some AmazingFeature'`
4. **Push**: `git push origin feature/AmazingFeature`
5. **Open a Pull Request**

### 开发流程

```bash
# 克隆项目
git clone https://github.com/fishapple/AgentFlow_Studio.git
cd AgentFlow_Studio

# 创建新特性分支
git checkout -b my-new-feature

# 提交更改并提交信息
git commit -m 'Add some feature'

# 推送到远程仓库
git push origin my-new-feature

# 创建 Pull Request
```

### Code of Conduct

在参与本项目之前，请阅读并遵守我们的 [行为准则](./CODE_OF_CONDUCT.md)

---

## 📝 Roadmap

### v0.1 (当前 - MVP)
- [x] GitHub 仓库初始化
- [ ] React Flow 画布实现
- [ ] LLM/Tool节点支持
- [ ] 基础工作流执行引擎

### v0.2 (预计 4 周后)
- [ ] 条件分支 & 并行执行支持
- [ ] Git 版本管理集成
- [ ] API 网关初步实现
- [ ] 监控仪表盘 v1

### v1.0 (预计 8 周后)
- [ ] SDK 生成器完整功能
- [ ] CI/CD Pipeline
- [ ] 插件生态系统
- [ ] 预置模板市场

### Future Ideas 💡
- 🤖 AI 辅助工作流设计（自然语言描述自动生成）
- 🔌 更多第三方工具集成（Slack, Discord, Telegram等）
- 📈 机器学习优化执行路径
- 🎓 团队协作功能增强

---

## 🙏 致谢

本项目灵感来源于以下开源项目，感谢它们的贡献：
- [LangChain](https://github.com/langchain-ai/langchain) - LLM 应用开发框架
- [Dify](https://github.com/difyai/dify) - LLMOps 平台
- [Flowise](https://github.com/FlowiseAI/Flowise) - Low-code AI workflow builder
- [React Flow](https://reactflow.dev/) - React 流程图库

---

## 📬 联系方式

- **项目主页**: https://agentflow.io (Coming Soon)
- **GitHub Issues**: [提交问题和建议](https://github.com/fishapple/AgentFlow_Studio/issues)
- **Twitter**: [@AgentFlowStudio](https://twitter.com/AgentFlowStudio)
- **Discord**: 加入我们讨论！(链接待定)

---

## 📄 License

本项目采用 [MIT License](LICENSE)，欢迎自由使用和分发。

> ©️ 2024 AgentFlow Studio. All rights reserved.

---

<div align="center">

**Made with ❤️ by the AgentFlow Team**

⭐ 如果这个项目对你有帮助，请给它一个 Star！

</div>
