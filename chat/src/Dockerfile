# Stage 1: Build the app
FROM node:20 AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Build the Ionic Angular app (can also be "ionic build" if using Ionic CLI directly)
RUN npm run build

# Stage 2: Serve the app using Nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built Angular app from Stage 1
COPY --from=build /app/www /usr/share/nginx/html

# Copy custom Nginx config if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
