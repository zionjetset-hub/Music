#!/bin/bash

# Deploy backend to production
set -e

echo "🚀 Deploying backend to production..."

# Navigate to backend directory
cd backend

# Install production dependencies
echo "📦 Installing production dependencies..."
npm install --production

# Create production environment file
echo "⚙️ Creating production environment..."
cat > .env.production << EOF
PORT=3000
NODE_ENV=production
DB_PATH=/var/lib/musicapp/music.db
JWT_SECRET=${JWT_SECRET:-$(openssl rand -base64 32)}
API_BASE_URL=https://api.musicapp.com
EOF

# Create systemd service file
echo "🔧 Creating systemd service..."
sudo tee /etc/systemd/system/musicapp.service > /dev/null << EOF
[Unit]
Description=Music App Backend
After=network.target

[Service]
Type=simple
User=musicapp
WorkingDirectory=/opt/musicapp/backend
ExecStart=/usr/bin/node index.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /opt/musicapp/backend
sudo mkdir -p /var/lib/musicapp

# Copy application files
echo "📋 Copying application files..."
sudo cp -r . /opt/musicapp/backend/
sudo chown -R musicapp:musicapp /opt/musicapp
sudo chown -R musicapp:musicapp /var/lib/musicapp

# Enable and start service
echo "🔄 Starting service..."
sudo systemctl daemon-reload
sudo systemctl enable musicapp
sudo systemctl start musicapp

echo "✅ Backend deployment completed successfully!"
echo "🌐 Backend running at: https://api.musicapp.com"