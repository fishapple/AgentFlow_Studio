# Commit Convention Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for all commits. This helps automate our changelog generation and ensures consistency across the project.

---

## 📋 Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Type (Required)

Choose one of the following types:

| Type | Description | Example |
|------|-------------|---------|
| `feat` | A new feature | `feat(workflow): add LLM node support` |
| `fix` | Bug fix | `fix(api): correct CORS origin validation` |
| `docs` | Documentation changes | `docs(README): update installation instructions` |
| `style` | Code style changes (formatting, semicolons) | `style(frontend): add missing semicolons` |
| `refactor` | Code refactoring (no feature/fix) | `refactor(engine): simplify DAG execution logic` |
| `perf` | Performance improvement | `perf(backend): optimize database queries with indexes` |
| `test` | Adding/fixing tests | `test(workflow): add unit tests for executor` |
| `chore` | Build process or auxiliary tool changes | `chore(deps): update dependencies to latest versions` |

### Scope (Optional)

Common scopes:
- `frontend`: React components, UI updates
- `backend`: API routes, business logic
- `workflow`: Workflow engine, execution
- `docs`: Documentation files
- `ci`: CI/CD configuration
- `deps`: Dependency management
- `perf`: Performance-related changes

### Subject (Required)

Present tense, imperative mood: "Add feature" not "Added feature" or "Adds feature". Keep it under 50 characters.

---

## ✅ Examples

```bash
# New feature - adding LLM node type
feat(workflow): add OpenAI/Anthropic/Gemini node support

# Bug fix - API validation issue
fix(api): validate required fields in workflow creation request

# Documentation update
docs(README): add quick start guide for Docker deployment

# Performance improvement
perf(backend): use asyncpg instead of psycopg2 for faster queries

# Test coverage addition
test(executor): add tests for parallel execution scenarios

# Refactoring - no behavior change
refactor(components): extract common UI logic into utility function

# Build/CI changes
chore(ci): update GitHub Actions workflow to latest Node.js 20

# Dependency updates
deps(frontend): upgrade React from 18.2 to 18.3

# Breaking change notification
feat(api): rename /workflows endpoint to /agent-workflows (BREAKING CHANGE)
```

---

## 🔧 Automatic Changelog Generation

Based on your commit types, we automatically generate changelog entries:

| Type | Changelog Section |
|------|------------------|
| `feat` | ✨ Features |
| `fix` | 🐛 Bug Fixes |
| `perf` | ⚡ Performance Improvements |
| `refactor` | 🔧 Code Refactoring |
| `test` | ✅ Test Updates |
| `docs` | 📚 Documentation |

---

## 🎯 Best Practices

1. **One commit per logical change** - Don't mix multiple features in one commit
2. **Keep subject line under 50 characters** - Wrap long lines for readability
3. **Use imperative mood** - "Add" not "Added" or "Adding"
4. **Reference issues** - Use `Closes #123` or `Refs #123` in body/footer
5. **Be specific** - Avoid vague descriptions like "fix bug"

---

## 📝 Body & Footer Guidelines

### Body (Optional)

Wrap at 72 characters, describe the full context of change:

```
feat(workflow): add parallel execution support

Implement ability to execute multiple nodes in parallel based on 
dependency resolution. This improves performance for workflows with
independent branches by reducing sequential bottlenecks.

See discussion in #45 for more details.
```

### Footer (Optional)

Use footers for:
- Breaking changes notification
- Issues/PR references
- Deprecation warnings

Example:
```
BREAKING CHANGE: The /workflows endpoint is now deprecated. Use /agent-workflows instead.

Closes #123, Fixes #456
```

---

## 🤖 Automated Tools

We use [semantic-release](https://github.com/semantic-release/semantic-release) to automatically generate release tags based on commit messages:

- `feat` and `fix` commits → bump minor version (e.g., 0.1.0 → 0.2.0)
- `chore`, `docs`, `test`, `refactor` → bump patch version (e.g., 0.2.0 → 0.2.1)

---

## ❗ Common Mistakes to Avoid

❌ **Bad:** "Fixed the bug in login"  
✅ **Good:** "fix(auth): correct password validation logic"

❌ **Bad:** "Added new feature for users" (vague)  
✅ **Good:** "feat(users): add role-based access control system"

❌ **Bad:** Past tense ("added", "fixed")  
✅ **Good:** Present imperative ("add", "fix")

---

## 📚 References

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-commit-message-guide)
- [Commitizen](https://github.com/commitizen/cz-cli) - Interactive commit helper
