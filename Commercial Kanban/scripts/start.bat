@echo off
echo Starting Docker container...
docker compose up -d --build
echo App started on http://localhost:8000
