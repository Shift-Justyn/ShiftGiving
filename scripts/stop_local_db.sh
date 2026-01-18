#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

CLEAN=false

while [[ "$#" -gt 0 ]]; do
    case $1 in
        --clean) CLEAN=true ;;
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

if [ "$CLEAN" = true ]; then
    echo "Stopping database and removing volumes..."
    $COMPOSE_CMD down -v
    echo "Database stopped and data cleaned!"
else
    echo "Stopping database..."
    $COMPOSE_CMD stop postgres
    echo "Database stopped (data preserved)"
fi
