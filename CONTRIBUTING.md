# 🤝 Contributing to AgentFlow Studio

首先，感谢你愿意为本项目做出贡献！🎉

本指南将帮助你了解如何为 AgentFlow Studio 做贡献。无论你是第一次提交代码还是资深开发者，我们都非常欢迎你的参与！

---

## 📋 贡献流程

### Step 1: Fork & Clone

```bash
# Fork 这个仓库到你的手机号码
https://github.com/fishapple/AgentFlow_Studio

# 克隆到你的本地
git clone https://github.com/YOUR_USERNAME/AgentFlow_Studio.git
cd AgentFlow_Studio
```

### Step 2: Create Branch

```bash
# 创建特性分支（使用语义化前缀）
git checkout -b feature/amazing-feature

# 或者修复 bug
git checkout -b fix/something-broken

# 或者文档改进
git checkout -b docs/updated-guide
```

### Step 3: Make Changes

开始你的工作！请遵循我们的代码规范（见下文）。

### Step 4: Test Locally

确保你的更改正常工作：

```bash
docker-compose up --build
```

### Step 5: Commit & Push

```bash
# 提交更改
git add .
git commit -m "feat: add amazing feature"

# 推送到远程仓库
git push origin feature/amazing-feature
```

### Step 6: Create Pull Request

在 GitHub 上创建 Pull Request，描述你的改动：
- ✅ 为什么要做这个改动？
- ✅ 解决了什么问题？
- ✅ 是否已通过测试？
- ✅ 是否有 Breaking Changes？

---

## 🎯 贡献类型

我们欢迎各种形式的贡献：

### 💻 Code Contributions (代码贡献)
- ✨ **新功能**: 添加新的节点类型、工具集成等
- 🔧 **Bug Fixes**: 修复发现的 bug
- ⚡ **性能优化**: 提升应用响应速度或资源使用效率
- 📝 **重构**: 改进代码结构，提高可维护性

### 🎨 UI/UX Improvements (界面体验)
- 🖌️ **组件美化**: 优化视觉设计
- 🔍 **无障碍访问**: 提升 Accessibility 支持
- 📱 **响应式布局**: 优化移动端体验

### 📚 Documentation (文档)
- 📘 **新增教程**: 编写新的使用指南
- ✏️ **修复错别字**: 改进现有文档
- 💬 **添加示例**: 提供代码示例和最佳实践

### 🔌 Plugins & Integrations (插件与集成)
- 🔗 **第三方工具**: 集成 Slack、Discord、Telegram 等
- 🤖 **AI Model Support**: 支持更多 LLM 模型（Claude, Gemini, etc.）
- 📊 **数据分析工具**: Excel, Pandas 等数据科学库

### 🐛 Bug Reports (Bug 报告)
提交高质量的 Bug Report：
1. **描述问题** - 清晰的问题说明和预期行为
2. **复现步骤** - 如何重现该问题（逐步列出）
3. **环境信息** - OS、浏览器版本、依赖版本等
4. **日志/截图** - 错误日志或屏幕截图

### 💡 Feature Requests (功能建议)
提出新功能建议时，请包含：
1. **问题描述** - 当前痛点是什么？
2. **解决方案** - 你希望如何实现？
3. **使用场景** - 谁需要这个功能？如何使用？
4. **替代方案** - 是否有其他方式解决？

---

## 📐 Code Style (代码规范)

### JavaScript/TypeScript 规范

我们使用 ESLint + Prettier：

```bash
# 安装格式化工具
npm install --save-dev eslint prettier

# 自动格式化
npm run format

# 运行检查
npm run lint
```

#### TypeScript Best Practices

```typescript
// ✅ DO - 推荐做法
interface WorkflowNode {
  id: string;          // 类型安全 + 显式声明
  type: NodeTypes;     // 枚举值更清晰
  config?: NodeConfig; // 可选参数明确标记
}

// ❌ DON'T - 避免的做法
let node = {id: '1', t:'llm'};  // 缺少类型定义
```

### Python 规范 (Backend)

我们使用 Black + Flake8 + mypy：

```bash
# 安装工具
pip install black flake8 mypy

# 格式化代码
black backend/

# 运行检查
flake8 backend/
mypy backend/
```

#### Python Best Practices

```python
# ✅ DO - 推荐做法
def create_workflow(workflow_id: str) -> Workflow:
    """创建工作流（类型注解 + 文档字符串）"""
    if not workflow_id:
        raise ValueError("workflow_id is required")
    
    return Workflow.create(
        id=uuid.uuid4(),
        owner_id=current_user,
        name=workflow_id,
        definition=json.loads(json.dumps(workflow_def))
    )

# ❌ DON'T - 避免的做法
def create(wf):   # 缺少类型和文档
    return Workflow(...)  # 参数命名不清
```

---

## 🧪 Testing (测试规范)

### 单元测试覆盖率要求

- ✅ 核心功能模块 ≥80% 覆盖率
- ✅ 新增代码必须包含对应测试
- ❌ 不接受无测试的功能提交

#### JavaScript/TypeScript Tests

```typescript
// __tests__/workflow-node.test.tsx

import { WorkflowNode } from '../components/nodes/WorkflowNode';

describe('WorkflowNode', () => {
    test('should render correctly with valid config', () => {
        const wrapper = mount(<WorkflowNode config={{}} />);
        expect(wrapper.exists()).toBe(true);
    });

    test('should show error on invalid input', () => {
        // ... 测试逻辑
    });
});
```

#### Python Tests (Backend)

```python
# tests/test_workflow_engine.py
import pytest
from backend.services.workflowEngine.executor import WorkflowEngine

@pytest.fixture
def engine():
    return WorkflowEngine()

class TestWorkflowExecution:
    def test_execute_simple_workflow(self, engine):
        """测试简单工作流执行"""
        result = engine.execute("simple-workflow-v1")
        
        assert result.status == "success"
        assert result.execution_time < 5000  # ms
```

---

## 🌐 Pull Request Checklist (PR 检查清单)

在提交 PR 前，请确保：

- [ ] Code follows the style guide
- [ ] Self-review completed
- [ ] Tests added/updated and passing
- [ ] Documentation updated (if needed)
- [ ] No lint errors (`npm run lint` / `flake8`)
- [ ] Commit messages follow Conventional Commits
- [ ] All CI checks pass

---

## 📚 Code of Conduct (行为准则)

### 我们的承诺

为了营造一个开放和友好的环境，我们承诺：

- 使用包容性语言
- 尊重所有参与者
- 接受建设性批评
- 关注社区贡献而非个人功劳

### 不可接受的行为

- 使用侮辱性或攻击性言论
- 公开或私下骚扰
- 未经他人同意分享隐私信息
- 其他违反 GitHub Community Guidelines 的行为

如果你遇到上述问题，请报告给我们 [Discord](#) 或直接 [联系我们](mailto:support@agentflow.io)

---

## 🏷️ Issue & PR Labels (标签分类)

### 常用 Issue 类型

| 标签 | 说明 |
|------|------|
| `bug` | Bug 报告，需修复 |
| `enhancement` | 新功能建议 |
| `question` | 使用问题咨询 |
| `documentation` | 文档改进建议 |
| `performance` | 性能优化相关 |

### PR 状态标签

| 标签 | 说明 |
|------|------|
| `draft` | 草稿，尚不成熟 |
| `WIP` | Work In Progress，继续完善中 |
| `ready for review` | 准备审查，可以 merge |
| `needs discussion` | 需要进一步讨论 |

---

## 🙏 Thank You! (致谢)

感谢你愿意为 AgentFlow Studio 贡献！无论你的贡献大小，我们都深表感激。

**Join us!** 🚀  
一起打造最强大的 AI Agent 开发平台！
