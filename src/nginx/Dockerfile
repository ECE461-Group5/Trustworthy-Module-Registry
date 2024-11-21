# Use an official Nginx image as the base image
FROM nginx:latest

# Remove default configuration files
RUN rm /etc/nginx/conf.d/*

# Copy your custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/

# Expose port 80
EXPOSE 80
