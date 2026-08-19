#!/usr/bin/env bash
set -e

echo "Stopping Docker container..."
docker compose down
echo "App stopped."
