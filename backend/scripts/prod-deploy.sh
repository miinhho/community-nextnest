#!/bin/bash

echo "Starting deployment..."

COMPOSE_FILE="docker-compose.yml"

if [ ! -f "$COMPOSE_FILE" ]; then
    echo "Error: $COMPOSE_FILE not found! Please run from project root."
    exit 1
fi

if [ ! -f ".env.production.local" ]; then
    echo "Error: .env.production.local file not found!"
    exit 1
fi

if [ ! -f "nginx/ssl/cert.pem" ]; then
    echo "Warning: SSL certificates not found!"
    echo "Please generate SSL certificates or disable SSL in nginx config."
fi

docker-compose -f $COMPOSE_FILE build

docker-compose -f $COMPOSE_FILE down

docker-compose -f $COMPOSE_FILE up -d

docker-compose -f $COMPOSE_FILE logs --tail=50

echo "Deployment completed!"