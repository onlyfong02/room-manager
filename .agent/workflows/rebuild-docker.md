---
description: Rebuild and restart Docker containers to apply code changes
---

# Rebuild Docker Containers

This workflow rebuilds the Docker images and restarts the containers. Use this after making changes to the code (Backend or Frontend) to ensure the changes are reflected in the running application.

// turbo
```bash
cd e:\Project\room-manager
docker compose up -d --build
```
