# Production Deployment Guide

This guide covers deploying the SaaS platform to production environments.

## Pre-Deployment Checklist

Before deploying to production, ensure:

- [ ] All environment variables are configured
- [ ] Database backup strategy is in place
- [ ] SSL certificates are ready
- [ ] Domain names are configured
- [ ] CDN is set up for static assets (optional)
- [ ] Monitoring tools are configured
- [ ] Error tracking is set up
- [ ] Backup strategy is implemented

## Environment Variables

### Backend (.env)

```bash
# Application
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://yourdomain.com

# Database (use production database)
DATABASE_URL=postgresql://user:password@your-db-host:5432/saas_db?schema=public

# JWT (IMPORTANT: Change these in production!)
JWT_SECRET=your-very-long-random-secret-key-here
JWT_REFRESH_SECRET=your-very-long-random-refresh-secret-key-here

# Redis
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@yourdomain.com

# Stripe (Production keys)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# PayPal (Production)
PAYPAL_CLIENT_ID=your_production_paypal_client_id
PAYPAL_SECRET=your_production_paypal_secret
PAYPAL_MODE=live

# AWS S3 (Production)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-production-bucket
```

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Deployment Options

### Option 1: Docker Compose (Simple VPS)

Best for: Small to medium deployments on a single server.

#### 1. Prepare Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx for reverse proxy
sudo apt install nginx -y
```

#### 2. Clone and Configure

```bash
# Clone repository
cd /opt
sudo git clone <repository-url> saas-platform
cd saas-platform

# Create production .env files
sudo nano apps/backend/.env
sudo nano apps/frontend/.env.local

# Update docker-compose.yml with production settings
sudo nano docker-compose.yml
```

#### 3. Setup SSL with Let's Encrypt

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

#### 4. Configure Nginx

Create `/etc/nginx/sites-available/saas-platform`:

```nginx
# Frontend
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend API
server {
    listen 80;
    listen [::]:80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/saas-platform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. Deploy

```bash
# Build and start services
cd /opt/saas-platform
sudo docker-compose up -d --build

# Run migrations
sudo docker-compose exec backend npx prisma migrate deploy

# Check logs
sudo docker-compose logs -f
```

#### 6. Setup Auto-restart

Create systemd service `/etc/systemd/system/saas-platform.service`:

```ini
[Unit]
Description=SaaS Platform
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/saas-platform
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable saas-platform
sudo systemctl start saas-platform
```

---

### Option 2: Cloud Platforms (AWS, GCP, Azure)

#### AWS Deployment

**Components:**
- **Frontend**: AWS Amplify or EC2 + CloudFront
- **Backend**: ECS/Fargate or EC2
- **Database**: RDS PostgreSQL
- **Cache**: ElastiCache Redis
- **Storage**: S3
- **Load Balancer**: Application Load Balancer

**Steps:**

1. **Create RDS PostgreSQL Instance**
   ```bash
   # Use AWS Console or CLI
   aws rds create-db-instance \
     --db-instance-identifier saas-db \
     --db-instance-class db.t3.micro \
     --engine postgres \
     --master-username admin \
     --master-user-password yourpassword \
     --allocated-storage 20
   ```

2. **Create ElastiCache Redis**
   ```bash
   aws elasticache create-cache-cluster \
     --cache-cluster-id saas-redis \
     --cache-node-type cache.t3.micro \
     --engine redis \
     --num-cache-nodes 1
   ```

3. **Deploy Backend to ECS**
   - Build Docker image
   - Push to ECR
   - Create ECS task definition
   - Create ECS service

4. **Deploy Frontend**
   - Build Next.js app: `npm run build`
   - Deploy to Amplify or S3 + CloudFront

---

### Option 3: Kubernetes

Best for: Large-scale deployments requiring auto-scaling.

#### 1. Create Kubernetes Manifests

**Backend Deployment** (`k8s/backend-deployment.yaml`):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: your-registry/saas-backend:latest
        ports:
        - containerPort: 4000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secret
              key: url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: jwt-secret
              key: secret
```

**Frontend Deployment** (`k8s/frontend-deployment.yaml`):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: your-registry/saas-frontend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NEXT_PUBLIC_API_URL
          value: "https://api.yourdomain.com/api"
```

#### 2. Deploy to Kubernetes

```bash
# Create secrets
kubectl create secret generic database-secret --from-literal=url='postgresql://...'
kubectl create secret generic jwt-secret --from-literal=secret='your-secret'

# Deploy services
kubectl apply -f k8s/

# Check status
kubectl get pods
kubectl get services
```

---

## Database Migration Strategy

### Running Migrations in Production

```bash
# Docker
docker-compose exec backend npx prisma migrate deploy

# Kubernetes
kubectl exec -it backend-pod -- npx prisma migrate deploy

# Direct
cd apps/backend
npx prisma migrate deploy
```

### Backup Before Migration

```bash
# PostgreSQL backup
pg_dump -h your-host -U your-user -d saas_db > backup-$(date +%Y%m%d).sql

# Restore if needed
psql -h your-host -U your-user -d saas_db < backup-20240101.sql
```

---

## Monitoring & Logging

### Setup PM2 (for Node.js processes)

```bash
# Install PM2
npm install -g pm2

# Start services
cd apps/backend
pm2 start npm --name backend -- start

cd apps/frontend
pm2 start npm --name frontend -- start

# Setup startup script
pm2 startup
pm2 save
```

### Logging with PM2

```bash
# View logs
pm2 logs

# Monitor
pm2 monit
```

### Application Monitoring

Consider using:
- **Sentry** for error tracking
- **New Relic** or **DataDog** for APM
- **CloudWatch** (AWS) or **Stackdriver** (GCP)

---

## Security Best Practices

1. **SSL/TLS**: Always use HTTPS in production
2. **Environment Variables**: Never commit secrets to git
3. **Database**: Use strong passwords, enable SSL
4. **API Rate Limiting**: Already configured with NestJS Throttler
5. **CORS**: Configure allowed origins in production
6. **Regular Updates**: Keep dependencies updated
7. **Backups**: Automated daily database backups
8. **Firewall**: Configure firewall rules (UFW, Security Groups)

---

## Performance Optimization

### Backend

1. **Enable Caching**
   - Redis for session storage
   - Cache frequent database queries

2. **Database Optimization**
   - Add indexes
   - Use connection pooling
   - Query optimization

3. **Compression**
   ```typescript
   // Enable in main.ts
   app.use(compression());
   ```

### Frontend

1. **Next.js Optimizations**
   - Image optimization (already enabled)
   - Code splitting (automatic)
   - Static generation where possible

2. **CDN for Static Assets**
   - Use CloudFront, Cloudflare, or similar

---

## Backup Strategy

### Automated Database Backups

```bash
#!/bin/bash
# /opt/scripts/backup-db.sh

BACKUP_DIR="/opt/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILENAME="saas_db_${TIMESTAMP}.sql"

# Create backup
docker-compose exec -T postgres pg_dump -U postgres saas_db > "${BACKUP_DIR}/${FILENAME}"

# Compress
gzip "${BACKUP_DIR}/${FILENAME}"

# Remove old backups (keep 30 days)
find ${BACKUP_DIR} -name "*.sql.gz" -mtime +30 -delete

# Upload to S3 (optional)
# aws s3 cp "${BACKUP_DIR}/${FILENAME}.gz" s3://your-backup-bucket/
```

Add to crontab:

```bash
# Run daily at 2 AM
0 2 * * * /opt/scripts/backup-db.sh
```

---

## Scaling Strategies

### Horizontal Scaling

1. **Load Balancer**: Use Nginx, HAProxy, or cloud load balancer
2. **Multiple Backend Instances**: Scale with Docker Compose or Kubernetes
3. **Database Read Replicas**: For read-heavy workloads
4. **Redis Cluster**: For high availability

### Vertical Scaling

- Increase server resources (CPU, RAM)
- Optimize database queries
- Enable caching

---

## Troubleshooting Production Issues

### Check Service Status

```bash
docker-compose ps
systemctl status saas-platform
kubectl get pods
```

### View Logs

```bash
docker-compose logs -f backend
tail -f /var/log/nginx/error.log
pm2 logs
```

### Database Connection Issues

```bash
# Test connection
psql -h your-host -U your-user -d saas_db

# Check connections
SELECT * FROM pg_stat_activity;
```

---

## Rolling Updates

### Zero-Downtime Deployment

```bash
# Pull latest code
git pull origin main

# Build new images
docker-compose build

# Rolling update
docker-compose up -d --no-deps --build backend
docker-compose up -d --no-deps --build frontend
```

---

## Support & Maintenance

- Monitor error rates and performance
- Review logs regularly
- Keep dependencies updated
- Regular security audits
- Database maintenance (vacuum, analyze)

For issues, check:
- Application logs
- Nginx logs
- Database logs
- System resources (CPU, memory, disk)

---

## Additional Resources

- [Nginx Documentation](https://nginx.org/en/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [PostgreSQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
