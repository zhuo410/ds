# ===== Stage 1: Build frontend =====
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# ===== Stage 2: Backend production image =====
FROM node:20-alpine

WORKDIR /app

# Copy backend sources
COPY backend/package.json ./
RUN npm install --production

COPY backend/ ./

# Copy built frontend from stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get({hostname:'localhost',port:process.env.PORT||80,path:'/api/health'},r=>{process.exit(r.statusCode===200?0:1)}).on('error',()=>process.exit(1))"

EXPOSE 80

CMD ["node", "app.js"]
