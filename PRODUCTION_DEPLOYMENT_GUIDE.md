# WEALTHCON PRODUCTION DEPLOYMENT GUIDE

## Overview
This guide provides complete instructions for deploying the Wealthcon educational platform to a production environment.

---

## Pre-Deployment Checklist

- [ ] All environment variables configured in `.env.production`
- [ ] MongoDB production instance ready and accessible
- [ ] Redis server running and accessible
- [ ] AWS S3 bucket created and configured
- [ ] CloudFront distribution set up (if using CDN)
- [ ] SMTP email service configured
- [ ] SSL/TLS certificates installed
- [ ] Node.js 18+ installed on server
- [ ] FFmpeg installed (for HLS video conversion)
- [ ] All secrets stored securely (not in version control)

---

## 1. Environment Setup

### Create `.env.production`
Copy `.env.production.example` to `.env.production` and fill in all actual values:

```bash
cp .env.production.example .env.production
```

### Critical Environment Variables

#### Database
```
MONGODB_URI=mongodb+srv://username:password@your-cluster.mongodb.net/wealthcon
```
- Use MongoDB Atlas or self-hosted MongoDB
- Ensure network access is restricted to your server IP

#### Redis
```
REDIS_HOST=your-redis-host.com
REDIS_PORT=6379
REDIS_PASSWORD=your-secure-password
```
- Use AWS ElastiCache, Redis Cloud, or self-hosted Redis
- Enable TLS/SSL in production
- Set up authentication

#### AWS S3 & CloudFront
```
AWS_CLOUDFRONT_URL=https://d123abc.cloudfront.net
AWS_S3_BUCKET_NAME=wealthcon-prod-bucket
AWS_ACCESS_KEY_ID=your-iam-access-key
AWS_SECRET_ACCESS_KEY=your-iam-secret-key
```
- Create IAM user with S3 access only (principle of least privilege)
- Enable bucket versioning
- Enable server-side encryption
- Set up CloudFront distribution with S3 origin
- Configure CORS on S3 bucket

#### JWT Secret
```
JWT_TOKEN_SECRET=generate-strong-32-char-secret
```
Generate with:
```bash
openssl rand -base64 32
```

#### Email/SMTP
```
SMTP_HOST=smtp.gmail.com
SMTP_USER=noreply@your-domain.com
SMTP_PASS=app-specific-password
```
- Use app-specific passwords (not main account password)
- Consider using SendGrid, Mailgun, or similar services for better deliverability

---

## 2. Server Setup

### Install Dependencies
```bash
# Install Node.js (v18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install FFmpeg (for video conversion)
sudo apt-get install -y ffmpeg

# Install Redis (if self-hosted)
sudo apt-get install -y redis-server

# Install MongoDB (if self-hosted)
sudo apt-get install -y mongodb
```

### Clone Repository
```bash
git clone https://github.com/priority-technologies/Wealthcon-New.git
cd Wealthcon-New/IMP-Wealthcon-main
```

### Install Application Dependencies
```bash
npm install
```

### Build Application
```bash
npm run build
```

---

## 3. Database & Redis Setup

### MongoDB
```bash
# If using MongoDB Atlas (recommended):
# Create cluster at https://www.mongodb.com/cloud/atlas
# Get connection string and add to MONGODB_URI

# If self-hosted:
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### Redis
```bash
# If using AWS ElastiCache or Redis Cloud:
# Configure REDIS_HOST and REDIS_PORT in .env.production

# If self-hosted:
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Test Redis connection:
redis-cli ping
# Expected: PONG
```

---

## 4. Application Startup

### Using Node.js Directly
```bash
# Set production environment
export NODE_ENV=production

# Start application
npm start
```

### Using PM2 (Recommended)
```bash
# Install PM2 globally
sudo npm install -g pm2

# Start application with PM2
pm2 start npm --name "wealthcon" -- start

# Make PM2 startup on reboot
pm2 startup
pm2 save
```

### Using Systemd Service
Create `/etc/systemd/system/wealthcon.service`:
```ini
[Unit]
Description=Wealthcon Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/wealthcon
Environment="NODE_ENV=production"
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable wealthcon
sudo systemctl start wealthcon
```

---

## 5. Web Server Configuration

### Using Nginx (Recommended)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL Configuration
    ssl_certificate /etc/ssl/certs/your-cert.crt;
    ssl_certificate_key /etc/ssl/private/your-key.key;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files (cache forever)
    location /_next/static {
        proxy_pass http://localhost:3000;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }
}
```

### Using Apache
Configure virtual host with:
- mod_proxy enabled
- SSL/TLS configured
- Proxy pass to http://localhost:3000

---

## 6. Security Hardening

### Firewall Configuration
```bash
# Allow only necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### SSL/TLS Certificates
```bash
# Using Let's Encrypt (Free)
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com
```

### Environment Security
- [ ] Never commit `.env.production` to git
- [ ] Use `.env.production.example` as template
- [ ] Store actual secrets in secure vault (HashiCorp Vault, AWS Secrets Manager)
- [ ] Rotate secrets regularly
- [ ] Restrict file permissions: `chmod 600 .env.production`

### Database Security
- [ ] Enable authentication
- [ ] Restrict network access (IP whitelist)
- [ ] Enable encryption at rest and in transit
- [ ] Regular backups with encryption
- [ ] Use TLS/SSL for connections

### Redis Security
- [ ] Set strong password
- [ ] Use TLS/SSL
- [ ] Restrict network access
- [ ] No AUTH required on 0.0.0.0

---

## 7. Monitoring & Logging

### Application Logs
```bash
# View PM2 logs
pm2 logs wealthcon

# View system service logs
sudo journalctl -u wealthcon -f
```

### Database Monitoring
```bash
# MongoDB
mongosh <connection-string>
> db.stats()

# Redis
redis-cli
> INFO stats
```

### Server Monitoring
```bash
# Install monitoring tools
sudo apt-get install -y htop iotop nethogs

# Monitor resources
htop
```

### Alerting
- Set up email alerts for errors
- Monitor disk space
- Monitor memory usage
- Monitor database connections
- Set up error tracking (Sentry, LogRocket)

---

## 8. Backup Strategy

### Database Backups
```bash
# MongoDB Backup
mongodump --uri="<connection-string>" --out=/backups/mongo-$(date +%Y%m%d)

# Redis Backup
redis-cli --rdb /backups/redis-$(date +%Y%m%d).rdb
```

### S3 Uploads Backup
- Enable S3 versioning
- Enable S3 cross-region replication
- Set up S3 lifecycle policies

### Backup Schedule
- Daily automated backups
- Weekly full backups
- Monthly offline backups
- Test restore procedures monthly

---

## 9. Performance Optimization

### Next.js Build
```bash
# Analyze bundle size
npm install --save-dev @next/bundle-analyzer
npm run build
```

### Caching
- Enable CloudFront caching for static assets
- Configure browser caching headers
- Redis caching for frequently accessed data

### Database
- Create indexes on frequently queried fields
- Monitor query performance
- Archive old data if needed

### CDN Configuration
- CloudFront compression enabled
- Cache TTL set appropriately (1 day for most assets)
- Invalidate cache after deployments

---

## 10. Deployment Process

### Step-by-Step Deployment
```bash
# 1. Pull latest code
git pull origin main

# 2. Install dependencies
npm install

# 3. Run migrations (if any)
npm run migrate

# 4. Build application
npm run build

# 5. Test build
npm run build

# 6. Restart application
pm2 restart wealthcon
# OR
sudo systemctl restart wealthcon
```

### Zero-Downtime Deployment (with Load Balancer)
1. Deploy to secondary server
2. Health check new instance
3. Switch traffic gradually
4. Monitor for issues
5. Keep previous version running for quick rollback

### Rollback Plan
```bash
# Keep previous version available
git checkout <previous-commit-hash>
npm install
npm run build
pm2 restart wealthcon
```

---

## 11. Post-Deployment Verification

- [ ] Application accessible at domain
- [ ] HTTPS working (check certificate)
- [ ] Database connected
- [ ] Redis connected
- [ ] S3 uploads working
- [ ] Email sending works
- [ ] User login works
- [ ] Video upload works
- [ ] Video playback works
- [ ] Admin dashboard accessible
- [ ] Analytics working
- [ ] Comments working
- [ ] All API endpoints responding

---

## 12. Troubleshooting

### Application Won't Start
```bash
# Check logs
pm2 logs wealthcon

# Check port availability
sudo lsof -i :3000

# Check environment variables
echo $NODE_ENV
```

### Database Connection Errors
```bash
# Test MongoDB connection
mongosh <connection-string>

# Test Redis connection
redis-cli ping
```

### File Upload Issues
```bash
# Check S3 permissions
aws s3 ls s3://your-bucket

# Verify AWS credentials
aws sts get-caller-identity
```

### Video Conversion Issues
```bash
# Check FFmpeg
ffmpeg -version

# Check Redis queue jobs
redis-cli
> KEYS "bull:*"
```

---

## 13. Support & Resources

- **Documentation:** Check CLAUDE_INSTRUCTIONS or project README
- **API Documentation:** Available at /api/docs
- **Issue Tracking:** GitHub Issues
- **Error Tracking:** Sentry (if configured)

---

## Environment Variables Quick Reference

| Variable | Type | Required | Example |
|----------|------|----------|---------|
| MONGODB_URI | String | Yes | `mongodb+srv://user:pass@cluster.mongodb.net/wealthcon` |
| REDIS_HOST | String | Yes | `redis-host.com` |
| REDIS_PORT | Number | Yes | `6379` |
| AWS_CLOUDFRONT_URL | String | Yes | `https://d123abc.cloudfront.net` |
| JWT_TOKEN_SECRET | String | Yes | 32+ character random string |
| SMTP_HOST | String | Yes | `smtp.gmail.com` |
| NODE_ENV | String | Yes | `production` |
| NEXT_PUBLIC_HOST | String | Yes | `https://your-domain.com` |

---

## Contact & Questions

For deployment issues or questions, contact your DevOps team or system administrator.

**Last Updated:** 2026-02-26
**Version:** 1.0
