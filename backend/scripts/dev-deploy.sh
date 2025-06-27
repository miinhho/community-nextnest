#!/bin/bash

echo "Starting development deployment..."

COMPOSE_FILE="docker-compose.dev.yml"

if [ ! -f "$COMPOSE_FILE" ]; then
    echo "Error: $COMPOSE_FILE not found!"
    exit 1
fi

if [ ! -f ".env" ]; then
    echo "Warning: .env file not found!"
    if [ -f ".env.example" ]; then
        echo "Creating .env from .env.example..."
        cp .env.example .env
    else
        echo "Error: .env.example also not found!"
        exit 1
    fi
fi

echo "Stopping existing containers..."
docker-compose -f $COMPOSE_FILE down

echo "Building and starting containers..."
docker-compose -f $COMPOSE_FILE up --build

echo "Checking container status..."
docker-compose -f $COMPOSE_FILE ps

echo "Recent logs:"
docker-compose -f $COMPOSE_FILE logs --tail=20

echo ""
echo "✅ Development deployment completed!"
echo "🌐 Nginx is running on: https://localhost"
echo "🚀 Backend API is proxied through nginx"
echo ""
echo "📋 Commands:"
echo "  View logs: docker-compose logs -f"
echo "  Stop: docker-compose down"
echo "  Rebuild: pnpm run build && docker-compose up -d --build"