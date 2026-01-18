#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

FRESH=false

while [[ "$#" -gt 0 ]]; do
    case $1 in
        --fresh) FRESH=true ;;
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
    shift
done

cd "$PROJECT_ROOT"

COMPOSE_CMD="docker compose"
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed. Please install Docker Desktop first."
    exit 1
fi

if ! docker compose version &> /dev/null; then
    if command -v docker-compose &> /dev/null; then
        COMPOSE_CMD="docker-compose"
    else
        echo "Error: Neither 'docker compose' nor 'docker-compose' is available."
        exit 1
    fi
fi

if [ "$FRESH" = true ]; then
    echo "Stopping and removing existing database..."
    $COMPOSE_CMD down -v
    echo "Starting fresh database..."
else
    echo "Starting database..."
fi

$COMPOSE_CMD up -d postgres

echo "Waiting for PostgreSQL to be healthy..."
until $COMPOSE_CMD ps postgres | grep -q "healthy"; do
    sleep 1
done

echo "PostgreSQL is ready!"
echo ""
echo "Connection details:"
echo "  Host: localhost"
echo "  Port: 5432"
echo "  Database: shiftgiving"
echo "  Username: shiftgiving"
echo "  Password: shiftgiving_local_dev"
echo ""
echo "Connection string:"
echo "  postgresql://shiftgiving:shiftgiving_local_dev@localhost:5432/shiftgiving"
