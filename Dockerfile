# Build API
FROM node:20-alpine AS api-builder

WORKDIR /app/server

COPY server/package*.json ./
RUN npm install

COPY server/ .
RUN npm run build

# Build Frontend
FROM node:20-alpine AS web-builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_API_URL=http://localhost:3001
ENV VITE_API_URL=$VITE_API_URL
ENV NODE_ENV=production

RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install nginx and supervisor for running both services
RUN apk add --no-cache nginx supervisor curl

# Copy API built files
COPY --from=api-builder /app/server/dist ./server/dist
COPY --from=api-builder /app/server/package*.json ./server/
RUN cd server && npm ci --only=production

# Copy frontend built files
COPY --from=web-builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/http.d/default.conf

# Create supervisor config
RUN mkdir -p /etc/supervisor.d && \
    echo "[supervisord]" > /etc/supervisord.conf && \
    echo "nodaemon=true" >> /etc/supervisord.conf && \
    echo "[program:api]" >> /etc/supervisord.conf && \
    echo "command=node /app/server/dist/index.js" >> /etc/supervisord.conf && \
    echo "autorestart=true" >> /etc/supervisord.conf && \
    echo "stdout_logfile=/dev/stdout" >> /etc/supervisord.conf && \
    echo "stdout_logfile_maxbytes=0" >> /etc/supervisord.conf && \
    echo "stderr_logfile=/dev/stderr" >> /etc/supervisord.conf && \
    echo "stderr_logfile_maxbytes=0" >> /etc/supervisord.conf && \
    echo "[program:nginx]" >> /etc/supervisord.conf && \
    echo "command=nginx -g 'daemon off;'" >> /etc/supervisord.conf && \
    echo "autorestart=true" >> /etc/supervisord.conf && \
    echo "stdout_logfile=/dev/stdout" >> /etc/supervisord.conf && \
    echo "stdout_logfile_maxbytes=0" >> /etc/supervisord.conf && \
    echo "stderr_logfile=/dev/stderr" >> /etc/supervisord.conf && \
    echo "stderr_logfile_maxbytes=0" >> /etc/supervisord.conf

# Create data directory
RUN mkdir -p /app/data

# Expose only port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Start supervisor to run both services
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
