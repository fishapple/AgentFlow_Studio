# AgentFlow Studio - Production Deployment Guide

This guide covers deploying AgentFlow Studio to production environments using Docker Compose.

---

## 📋 Prerequisites

Before deployment, ensure you have:

- **Docker** 20+ installed on your server
- **Docker Compose** v2.0+ 
- Port availability: `80`, `5432`, `6379`, `8000` (configurable)
- Environment variables configured (see below)

---

## 🚀 Quick Start Deployment

### 1. Clone & Configure

```bash
# Clone the repository
git clone https://github.com/fishapple/AgentFlow_Studio.git
cd AgentFlow_Studio

# Copy environment template and customize
cp .env.example .env

# Edit .env with your production settings (see below)
nano .env
```

### 2. Build & Deploy

```bash
# Build all services and start containers
docker-compose up -d --build

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 3. Access the Application

- **Frontend**: `http://your-domain.com` (or localhost:3000)
- **Backend API**: `http://localhost:8000/api/v1/workflows`
- **PostgreSQL**: Port 5432
- **Redis**: Port 6379

---

## 🔐 Environment Variables Configuration

Edit `.env` file with your production settings:

```bash
# ==================== DATABASE CONFIGURATION ==================== #
DB_NAME=agentflow_prod_db
DB_USER=agentflow_user
DB_PASSWORD=strong_password_change_me_2024!  # IMPORTANT: Change this!
DB_PORT=5432

# ==================== CACHE CONFIGURATION ==================== #
REDIS_PORT=6379

# ==================== APPLICATION PORTS ==================== #
BACKEND_PORT=8000
FRONTEND_PORT=3000
NGINX_PORT=80

# ==================== API KEYS (Optional - Configure as needed) ==================== #
OPENAI_API_KEY=sk-your-openai-api-key-here
ANTHROPIC_API_KEY=your-anthropic-api-key
GOOGLE_API_KEY=your-google-api-key

# ==================== SECURITY & MONITORING ==================== #
DEBUG=false                  # Set to true for development, false for production
LOG_LEVEL=INFO              # DEBUG | INFO | WARNING | ERROR
SECRET_KEY=your-secret-key-here  # Generate with: python -c "import secrets; print(secrets.token_urlsafe(32))"

# ==================== FRONTEND CONFIGURATION ==================== #
VITE_API_URL=http://backend:8000/api/v1
```

---

## 📦 Deployment Options

### Option A: All-in-One (Development/Testing)

```bash
docker-compose up -d --build
```

All services run on default ports. Good for development and testing.

### Option B: Production with Nginx Reverse Proxy

```bash
# Start without exposing internal ports
docker-compose -f docker-compose.prod.yml up -d --build
```

Nginx handles SSL termination and routing to backend/frontend services.

### Option C: Kubernetes (Advanced)

See `kubernetes/` directory for Helm charts and deployment manifests.

---

## 🔧 Post-Deployment Configuration

### 1. Initialize Database

The database will auto-initialize on first startup with the schema defined in `backend/init.sql`.

```bash
# Check if database is ready
docker-compose exec db pg_isready -U agentflow_user
```

### 2. Run Migrations (if needed)

If you have Alembic migrations:

```bash
docker-compose exec backend alembic upgrade head
```

### 3. Seed Initial Data (Optional)

```python
from src.db.database import init_db
init_db()
```

---

## 🛡️ Security Checklist for Production

Before going live, verify:

- [ ] **Change all default passwords** in `.env` and database config
- [ ] Set `DEBUG=false` to disable debug mode
- [ ] Configure strong `SECRET_KEY` (32+ random characters)
- [ ] Enable HTTPS with SSL certificates (nginx or cloud provider)
- [ ] Restrict API keys by IP whitelist if possible
- [ ] Set up monitoring and alerting (Prometheus/Grafana recommended)
- [ ] Review `.env.example` to ensure no secrets are committed

---

## 🔄 Updating/Upgrading the Application

```bash
# Pull latest code
git pull origin main

# Recreate containers with new changes
docker-compose down
docker-compose up -d --build

# Or update specific services:
docker-compose restart backend
docker-compose restart frontend
```

### Zero-Downtime Deployment (Recommended)

```bash
# Stop only the current version
docker-compose stop

# Remove old containers and volumes
docker rm agentflow-backend agentflow-frontend
docker volume prune -f  # Be careful with production data!

# Start fresh deployment
docker-compose up -d --build
```

---

## 📊 Monitoring & Health Checks

### Service Health Status

```bash
# Check all services status
docker-compose ps

# View logs in real-time
docker-compose logs -f backend frontend db redis

# Individual service logs
docker-compose logs --tail=100 backend
```

### Application-Level Health Endpoints

- `/api/v1/health` - Backend health check
- `http://localhost:8000/openapi.json` - API documentation (Swagger)

### Enable Prometheus Metrics

Add to `backend/Dockerfile.prod`:
```python
# In uvicorn command
--metrics --metrics-exporter 0.0.0.0:9000
```

---

## 🐛 Troubleshooting Common Issues

### Issue: Database Connection Failed

```bash
# Check if PostgreSQL is running
docker-compose ps db

# Rebuild database container
docker-compose up -d --no-deps db

# Test connection
docker-compose exec backend python -c "import psycopg2; print(psycopg2.connect('postgresql://agentflow_user:@db:5432/agentflow_db'))"
```

### Issue: Redis Not Responding

```bash
# Check Redis status
docker-compose ps redis

# Clear Redis if needed
docker-compose exec redis redis-cli FLUSHALL

# Test connectivity
docker-compose exec backend python -c "import redis; print(redis.Redis(host='redis', port=6379).ping())"
```

### Issue: Frontend Not Loading API Data

1. Check `VITE_API_URL` in `.env` points to correct backend URL
2. Verify CORS is configured in backend settings
3. Check browser console for 404/500 errors
4. Ensure frontend build was successful: `docker-compose logs frontend | grep -i error`

---

## 📝 Backup & Disaster Recovery

### Database Backup

```bash
# Full database backup
docker-compose exec db pg_dumpagentflow_db > /backups/db_$(date +%Y%m%d).sql.gz

# Restore from backup
gunzip < /backups/db_20241201.sql.gz | docker-compose exec -T db psql -U agentflow_user
```

### Redis Backup (RDB snapshot)

```bash
docker-compose exec redis redis-cli SAVE  # Trigger manual save
```

---

## 🎯 Scaling Strategy

For high-traffic production:

1. **Horizontal Backend Scaling**: Deploy multiple backend replicas behind a load balancer
2. **Vertical Database Scaling**: Increase PostgreSQL instance resources
3. **Redis Cluster**: Upgrade to Redis Sentinel or Cluster mode
4. **CDN Integration**: Add CloudFlare/CloudFront for static assets
5. **Database Read Replicas**: For read-heavy workloads

---

## 📞 Support & Getting Help

- **GitHub Issues**: [Report bugs](https://github.com/fishapple/AgentFlow_Studio/issues)
- **Documentation**: See `/docs` directory
- **Community**: Join Discord/Slack channel (link in README)

---

**Last Updated:** December 2024  
**Version:** v0.2 Production Ready
