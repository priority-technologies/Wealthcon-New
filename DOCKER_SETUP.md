# Docker Setup for Wealthcon - Local Development

This guide explains how to run Wealthcon locally using Docker for testing before deployment to the server.

## Prerequisites

- **Docker Desktop** installed and running
- **Docker Compose** (included with Docker Desktop)
- **Node.js 18+** (for building, can also use in container)

## What's Included

- **MongoDB**: Database (port 27017)
- **LocalStack**: AWS S3 emulator (port 4566) - for file uploads without AWS credentials
- **Wealthcon App**: Next.js application (port 3001)

## Quick Start

### 1. Start Docker Services

```bash
cd "c:\Project\IMP-Wealthcon-main (2)\IMP-Wealthcon-main"
docker-compose up -d
```

This starts MongoDB and LocalStack containers.

### 2. Initialize LocalStack S3 Bucket

```bash
# Create the S3 bucket
docker exec wealthcon-localstack awslocal s3 mb s3://wealthcon-bucket

# Verify bucket creation
docker exec wealthcon-localstack awslocal s3 ls
```

### 3. Install Dependencies & Run App

```bash
# Install Node dependencies
npm install

# Run development server with Docker environment variables
npm run dev
```

The app will be available at: `http://localhost:3001`

## Environment Variables

### For Local Development (with LocalStack)
Use `.env.docker` which is pre-configured for LocalStack.

### For Production (with Real AWS)
Use `.env.local` with real AWS credentials.

## File Upload Testing

### Upload Video with Docker LocalStack

1. Go to `/admin/live_session` or `/admin/shorts`
2. Click "Upload Video"
3. Select video file
4. Fill in details
5. Select a channel (optional)
6. Click Upload

Files will be stored locally in the Docker container at `/tmp/localstack/data`

## Useful Docker Commands

### View logs
```bash
docker-compose logs -f
```

### Stop services
```bash
docker-compose down
```

### Stop and remove all data
```bash
docker-compose down -v
```

### Access MongoDB shell
```bash
docker exec -it wealthcon-mongodb mongosh
```

### Access LocalStack S3
```bash
docker exec -it wealthcon-localstack bash
awslocal s3 ls
```

## LocalStack Features

- **No AWS Credentials Needed**: Uses dummy credentials (test/test)
- **Local File Storage**: All uploads stored in container volume
- **Full S3 API**: Compatible with AWS SDK
- **Easy Reset**: Delete volume to clear all data

## Deployment Workflow

1. ✅ **Development**: Test everything locally with Docker
2. ✅ **Testing**: Verify video uploads, channels, shorts
3. ✅ **Production**: Update `.env.local` with real AWS credentials and deploy to server

## Troubleshooting

### S3 Bucket Not Found
```bash
# Recreate bucket
docker exec wealthcon-localstack awslocal s3 rm s3://wealthcon-bucket --recursive
docker exec wealthcon-localstack awslocal s3 mb s3://wealthcon-bucket
```

### MongoDB Connection Error
```bash
# Check if MongoDB is running
docker ps | grep mongodb

# Restart MongoDB
docker restart wealthcon-mongodb
```

### Port Already in Use
- Change port in `docker-compose.yml`
- Or stop the container using that port

## Next Steps

1. Run Docker services
2. Test video uploads locally
3. Verify channels and shorts functionality
4. Once satisfied, deploy to server with real AWS credentials

---

**Questions?** Check Docker logs: `docker-compose logs -f`
