# Deployment Guide

## Overview
This guide provides detailed instructions for deploying the Domos Underwriter Engine across different environments.

## Prerequisites

### System Requirements
- Operating System: Windows Server 2019+ or Linux (Ubuntu 20.04+)
- Memory: Minimum 16GB RAM (32GB recommended)
- Storage: 500GB SSD minimum
- CPU: 8 cores minimum (16 cores recommended)

### Software Dependencies
- Python 3.9+
- PostgreSQL 13+
- Redis 6+
- Node.js 16+ (for frontend components)
- Docker and Docker Compose (for containerized deployment)

## Environment Configuration

### Development Environment
```yaml
# development.yml
database:
  host: localhost
  port: 5432
  name: domos_dev
  
redis:
  host: localhost
  port: 6379
  
logging:
  level: DEBUG
  
security:
  jwt_secret: development_secret_key
```

### Staging Environment
```yaml
# staging.yml
database:
  host: staging-db.internal
  port: 5432
  name: domos_staging
  
redis:
  host: staging-redis.internal
  port: 6379
  
logging:
  level: INFO
  
security:
  jwt_secret: ${STAGING_JWT_SECRET}
```

### Production Environment
```yaml
# production.yml
database:
  host: prod-db.internal
  port: 5432
  name: domos_prod
  
redis:
  host: prod-redis.internal
  port: 6379
  
logging:
  level: WARNING
  
security:
  jwt_secret: ${PROD_JWT_SECRET}
```

## Deployment Steps

### 1. Infrastructure Setup
```bash
# Create necessary directories
mkdir -p /opt/domos-underwriter
mkdir -p /var/log/domos-underwriter
mkdir -p /var/lib/domos-underwriter

# Set permissions
chown -R app:app /opt/domos-underwriter
chown -R app:app /var/log/domos-underwriter
chown -R app:app /var/lib/domos-underwriter
```

### 2. Database Setup
```sql
-- Create database and user
CREATE DATABASE domos_prod;
CREATE USER domos_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE domos_prod TO domos_user;

-- Run schema migrations
psql -U domos_user -d domos_prod -f schema/01_initial_schema.sql
psql -U domos_user -d domos_prod -f schema/02_indexes.sql
```

### 3. Application Deployment
```bash
# Clone repository
git clone https://github.com/DeveloperZo/domos-underwriter-engine.git
cd domos-underwriter-engine

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp config/environments/production.yml config/active_config.yml

# Run database migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic

# Start services
systemctl start domos-underwriter
systemctl enable domos-underwriter
```

### 4. Docker Deployment
```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/domos
    depends_on:
      - db
      - redis
      
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: domos
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
      
  redis:
    image: redis:6
    
volumes:
  postgres_data:
```

## Monitoring and Maintenance

### Health Checks
- Application health endpoint: `/health`
- Database connectivity check
- Redis connectivity check
- File system availability

### Backup Procedures
- Daily automated database backups
- Weekly full system backups
- Monthly backup verification tests

### Log Management
- Centralized logging with log rotation
- Error alerting and monitoring
- Performance metrics collection

## Security Considerations

### Network Security
- Firewall configuration
- VPN access for administrative functions
- SSL/TLS encryption for all communications

### Data Security
- Encryption at rest and in transit
- Regular security updates
- Access control and authentication

### Compliance
- SOC 2 compliance monitoring
- Regular security audits
- Incident response procedures

## Troubleshooting

### Common Issues
- Database connection failures
- Memory and performance issues
- File permission problems
- Service startup failures

### Support Contacts
- Technical Support: tech-support@domos.com
- Emergency Contact: +1-555-DOMOS-HELP
