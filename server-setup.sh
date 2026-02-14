#!/bin/bash
# =============================================
# VPS Server Setup Script
# Run this ONCE on your VPS server
# Usage: ssh root@your-server-ip 'bash -s' < server-setup.sh
# =============================================

set -e

echo "=== 1. Updating system ==="
apt update && apt upgrade -y

echo "=== 2. Installing Docker ==="
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

echo "=== 3. Installing Docker Compose ==="
apt install -y docker-compose-plugin

echo "=== 4. Installing Git ==="
apt install -y git

echo "=== 5. Cloning repository ==="
cd ~
git clone https://github.com/Shahzod1602/Shahzod1602.github.io.git shahzodnematov-portfolio
cd shahzodnematov-portfolio

echo "=== 6. Starting with HTTP first (for SSL certificate) ==="
docker compose up -d web

echo "=== 7. Getting SSL Certificate ==="
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  -d shahzodnematov.uz \
  -d www.shahzodnematov.uz \
  --email shaxzodnematov1602@gmail.com \
  --agree-tos \
  --no-eff-email

echo "=== 8. Switching to SSL config ==="
cp nginx-ssl.conf nginx.conf
docker compose down
docker compose build --no-cache
docker compose up -d

echo ""
echo "============================================"
echo "  DONE! Your site is live at:"
echo "  https://shahzodnematov.uz"
echo "============================================"
echo ""
echo "Don't forget to set DNS records:"
echo "  A record: shahzodnematov.uz -> YOUR_SERVER_IP"
echo "  A record: www.shahzodnematov.uz -> YOUR_SERVER_IP"
echo "============================================"
