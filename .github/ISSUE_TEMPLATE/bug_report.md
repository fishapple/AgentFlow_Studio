---
name: Bug Report
about: Create a bug report to help us improve
title: "[BUG] "
labels: ["bug", "triage"]
assignees: []

---

## 🐛 Bug Description

**Describe the bug:**  
<!-- A clear and concise description of what the bug is. -->

**Expected behavior:**  
<!-- What did you expect to happen? -->

**Actual behavior:**  
<!-- What actually happened? Include error messages if available -->

---

## 📋 To Reproduce

Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Code snippet (if applicable):**
```typescript
// Paste relevant code here
```

---

## 🔍 Environment Information

| Property | Value |
|----------|-------|
| OS: | <!-- e.g., Windows 10, macOS 13, Ubuntu 22.04 --> |
| Browser/Node Version: | <!-- e.g., Chrome 120, Node.js 20 --> |
| AgentFlow Studio Version: | <!-- Check package.json or settings page --> |
| Database: | <!-- PostgreSQL version if applicable --> |

**Additional context:**  
<!-- Add any other context about the problem here. Screenshots, logs, etc. -->

---

## 📸 Logs & Screenshots

```bash
# Backend logs (if error is in backend)
docker-compose logs backend
```

![Screenshot](./screenshot.png) <!-- Attach screenshot if needed -->

---

**Severity:** <!-- Choose one: `Critical` / `High` / `Medium` / `Low` -->
- Critical: System down, data loss
- High: Key feature broken
- Medium: Non-critical bug affecting some users
- Low: UI issue, typo, etc.
