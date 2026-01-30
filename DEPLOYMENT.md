# SuggestionBox - Deployment Guide

## Quick Deploy Options

### 1. Docker Hub (Recommended)

```bash
# Build the image
docker build -t yourusername/suggestionbox:latest .

# Push to Docker Hub
docker login
docker push yourusername/suggestionbox:latest

# Deploy anywhere
docker run -d -p 80:80 --name suggestionbox yourusername/suggestionbox:latest
```

### 2. AWS ECS/Fargate

```bash
# Tag for AWS ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_AWS_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com

docker build -t suggestionbox .
docker tag suggestionbox:latest YOUR_AWS_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/suggestionbox:latest
docker push YOUR_AWS_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/suggestionbox:latest

# Deploy via ECS Console or CLI
```

### 3. Google Cloud Run

```bash
# Build and deploy in one command
gcloud run deploy suggestionbox \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 80
```

### 4. Azure Container Instances

```bash
# Build and push to Azure Container Registry
az acr build --registry myregistry --image suggestionbox:latest .

# Deploy
az container create \
  --resource-group myResourceGroup \
  --name suggestionbox \
  --image myregistry.azurecr.io/suggestionbox:latest \
  --dns-name-label suggestionbox-unique \
  --ports 80
```

### 5. DigitalOcean App Platform

1. Push your code to GitHub
2. Go to DigitalOcean App Platform
3. Select "Deploy from Docker Hub" or connect GitHub
4. Use Dockerfile for build
5. Set HTTP port to 80
6. Deploy!

### 6. Fly.io

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Launch app
fly launch

# Deploy
fly deploy
```

Create `fly.toml`:
```toml
app = "suggestionbox"

[build]
  dockerfile = "Dockerfile"

[[services]]
  internal_port = 80
  protocol = "tcp"

  [[services.ports]]
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
```

### 7. Railway

1. Connect your GitHub repository to Railway
2. Railway auto-detects Dockerfile
3. Deploy with one click
4. Get public URL automatically

### 8. Render

Create `render.yaml`:
```yaml
services:
  - type: web
    name: suggestionbox
    env: docker
    plan: free
    healthCheckPath: /health
```

Then:
1. Connect GitHub repo to Render
2. Render auto-deploys from Dockerfile
3. Get public URL

## Local Testing

```bash
# Build
docker build -t suggestionbox:latest .

# Run
docker run -d -p 3000:80 --name suggestionbox suggestionbox:latest

# Check health
curl http://localhost:3000/health

# View logs
docker logs suggestionbox

# Stop
docker stop suggestionbox && docker rm suggestionbox
```

## Environment Variables

If you need to add environment variables (API keys, etc.), create a `.env.production` file and modify the Dockerfile:

```dockerfile
# In build stage, add:
COPY .env.production .env
```

## Production Optimizations Included

✅ Multi-stage build (smaller image size)
✅ Production dependencies only
✅ Nginx caching for static assets
✅ Gzip compression
✅ Security headers
✅ Health check endpoint
✅ Non-root user
✅ Client-side routing support

## Image Size
- Expected size: ~50-60MB (optimized with Alpine Linux)

## Monitoring

Access health check at: `http://your-domain/health`

Should return: `healthy`
