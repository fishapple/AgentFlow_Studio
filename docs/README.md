# AgentFlow Studio 🚀

<div align="center">

![AgentFlow Logo](../docs/assets/logo.png)

**One-Stop Platform for AI Agent Development - Make Workflow Orchestration as Simple as Building Blocks!**

[![GitHub Stars](https://img.shields.io/github/stars/fishapple/AgentFlow_Studio?style=for-the-badge&logo=github)](https://github.com/fishapple/AgentFlow_Studio)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](../LICENSE)
[![Python Version](https://img.shields.io/badge/python-3.10+-blue?style=for-the-badge&logo=python)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18+-black?style=for-the-badge&logo=react)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-green?style=for-the-badge&logo=uvicorn)](https://fastapi.tiangolo.com/)

> 🌟 **[中文 README](../README.md) | English**

</div>

---

## ✨ One-Sentence Introduction

**AgentFlow Studio** is a visual workflow platform for enterprise-grade AI Agent development, allowing you to create powerful intelligent agent applications through drag-and-drop, with support for Git version control, CI/CD integration, and automatic SDK generation.

**"The Best Combination of LangChain + Dify + Kubernetes"**

---

## 🎯 Core Features

### 🖱️ **Visual Workflow Orchestration**
- ✅ Drag-and-drop canvas: Build your first AI Agent in 10 minutes
- ✅ Supports LLM, tool calling, condition branches, parallel execution nodes
- ✅ Real-time preview and debugging capabilities

### 🔧 **Enterprise-Level Integration**
- ✅ Git version control (similar to GitHub Pull Request workflow approvals)
- ✅ CI/CD Pipeline automatic deployment
- ✅ API Gateway + OpenAPI/Swagger documentation auto-generation

### 📦 **SDK Automated Generation**
```typescript
// One-click generated TypeScript SDK
import { AgentFlowSDK } from '@agentflow/sdk';

const chatBot = new AgentFlowSDK({
  workflowId: 'customer-support-bot',
  apiKey: process.env.AGENTFLOW_API_KEY,
});

// Direct call
const response = await chatBot.handle({ userInput: "Help me check order" });
```

### 📊 **Full-Link Monitoring & Debugging**
- ✅ Real-time execution tracking and log viewing
- ✅ Performance metrics (execution time, token consumption, success rate)
- ✅ Breakpoint debugging support

---

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended - One-Click Setup)

```bash
# Clone repository
git clone https://github.com/fishapple/AgentFlow_Studio.git
cd AgentFlow_Studio

# Copy environment file and configure
cp .env.example .env
nano .env  # Edit with your settings

# Start development environment
docker-compose up -d

# Access application
open http://localhost:3000  # Web UI
```

### Option 2: Local Development (For Deep Customization)

#### Frontend Setup
```bash
# React + TypeScript + Vite
cd frontend
npm install
npm run dev
# Visit http://localhost:5173
```

#### Backend Setup
```bash
# Python FastAPI + PostgreSQL
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
python main.py
# Visit http://localhost:8000
```

---

## 📖 Usage Example

### Create Your First AI Agent Workflow

1. **Open Visual Editor**
   ```bash
   docker-compose exec web bash
   cd /app/frontend && npm run dev
   ```

2. **Drag-and-drop nodes to build workflow**
   - LLM Call Node → Connect OpenAI API
   - Tool Call Node → Integrate weather query service
   - Condition Branch → Route based on user intent

3. **Execute and test**
   ```bash
   curl http://localhost:8000/api/v1/executions \
     -d '{"workflow_id": "weather-bot-v1"}'
   ```

4. **Generate SDK and publish**
   ```bash
   npm run generate-sdk -- --workflow-id weather-bot-v1 --output ./packages/sdk-weather-bot
   ```

---

## 🏗️ Technical Architecture

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

### Technology Stack Details

| Layer | Tech Selection | Description |
|-------|---------------|-------------|
| **Frontend Framework** | React 18 + TypeScript + Vite | High performance, type-safe |
| **State Management** | Zustand | Lightweight, suitable for large apps |
| **Workflow Visualization** | React Flow | Industry-standard flowchart library |
| **UI Components** | Ant Design / shadcn/ui | Enterprise UI standard |
| **Backend Framework** | FastAPI (Python) + Fastify (Node.js) | API Gateway + AI Service dual-language architecture |
| **Database** | PostgreSQL + Redis | Structured data + caching/message queue |
| **Containerization** | Docker Compose / Kubernetes | One-click deployment |
| **Monitoring** | Prometheus + Grafana | System metrics tracking |

---

## 🌟 Feature Showcase

### 🎨 Visual Editor

![Workflow Editor Demo](./assets/editor-demo.png)

Supports:
- ✅ Infinite canvas zoom and pan
- ✅ Complex connection path calculation with auto-adaptation
- ✅ Real-time node configuration modification
- ✅ Undo/redo for history operations

### 📊 Execution Monitoring Dashboard

![Monitoring Dashboard](./assets/monitoring-dashboard.png)

Provides:
- ✅ Real-time metrics (execution count, success rate, token consumption)
- ✅ Execution tracking logs
- ✅ Performance analysis charts

---

## 🚧 Current Progress

### ✅ Phase 0 - Foundation Setup (100%)
- [x] GitHub repository initialization
- [x] README.md + LICENSE + CONTRIBUTING.md
- [x] Technical stack decision finalized
- [ ] ⏳ Project scaffolding setup (in progress)

### 🎯 Phase 1 - MVP Core Features (Estimated 4 weeks)
- [ ] React Flow canvas implementation
- [ ] LLM/Tool node support
- [ ] Basic workflow execution engine
- [ ] Version management functionality

---

## 🤝 Contributing

We welcome all forms of contributions! 🎉

See our detailed [Contributing Guide](../CONTRIBUTING.md) for information on how to get started.

### Quick Start
1. **Fork** this repository
2. **Create Feature Branch**: `git checkout -b feature/AmazingFeature`
3. **Commit**: `git commit -m 'Add some AmazingFeature'`
4. **Push**: `git push origin feature/AmazingFeature`
5. **Open Pull Request**

---

## 📝 Roadmap

### v0.1 (Current - MVP)
- [x] GitHub repository initialization
- [ ] React Flow canvas implementation
- [ ] LLM/Tool node support
- [ ] Basic workflow execution engine

### v0.2 (Expected in 4 weeks)
- [ ] Condition branch & parallel execution support
- [ ] Git version management integration
- [ ] API gateway preliminary implementation
- [ ] Monitoring dashboard v1

### v1.0 (Expected in 8 weeks)
- [ ] SDK generator complete functionality
- [ ] CI/CD Pipeline
- [ ] Plugin ecosystem
- [ ] Pre-built template market

---

## 🙏 Acknowledgments

This project was inspired by the following open-source projects:
- [LangChain](https://github.com/langchain-ai/langchain) - LLM application development framework
- [Dify](https://github.com/difyai/dify) - LLMOps platform
- [Flowise](https://github.com/FlowiseAI/Flowise) - Low-code AI workflow builder
- [React Flow](https://reactflow.dev/) - React flowchart library

---

## 📬 Contact

- **Project Homepage**: https://agentflow.io (Coming Soon)
- **GitHub Issues**: [Report a bug or request a feature](https://github.com/fishapple/AgentFlow_Studio/issues)
- **Twitter**: [@AgentFlowStudio](https://twitter.com/AgentFlowStudio)
- **Discord**: Join us for discussion! (Link TBD)

---

## 📄 License

This project is licensed under the [MIT License](../LICENSE) - feel free to use and distribute.

> ©️ 2024 AgentFlow Studio. All rights reserved.

---

<div align="center">

**Made with ❤️ by the AgentFlow Team**

⭐ If this project helps you, please give it a Star!

</div>
