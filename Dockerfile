# -----------------------------
# 🛠️ Stage 1: Build Ionic Angular App
# -----------------------------
FROM node:20-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package files separately to leverage Docker cache
COPY package*.json ./

# Install dependencies (use --frozen-lockfile if you use yarn)
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular + Ionic app for production
RUN npm run build

# -----------------------------
# 🚀 Stage 2: Serve app with Nginx
# -----------------------------
FROM nginx:stable-alpine

# Copy built app from the builder stage
COPY --from=builder /app/www /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
