#!/bin/bash

# Start script for Museum of Black Civilizations Digital Experience

echo "🎨 Starting Museum of Black Civilizations Digital Experience..."
echo "=========================================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "   Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

# Generate demo data if not exists
if [ ! -d "data/images" ]; then
    echo "📸 Generating demo data..."
    python3 generate_demo_data.py
fi

# Start the application
echo "🚀 Starting services with Docker Compose..."
docker-compose up -d

echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

echo ""
echo "✅ Museum Digital Experience is now running!"
echo "=========================================================="
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000/api"
echo "📊 Admin Panel: http://localhost:8000/admin"
echo ""
echo "📱 To access from mobile devices, use your local IP address"
echo "🔍 To view logs: docker-compose logs -f"
echo "🛑 To stop: docker-compose down"
echo "=========================================================="

# Open browser if possible
if command -v open &> /dev/null; then
    open http://localhost:3000
elif command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000
elif command -v start &> /dev/null; then
    start http://localhost:3000
fi