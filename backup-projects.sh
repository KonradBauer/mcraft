#!/bin/bash
set -e

DATE=$(date +%Y-%m-%d_%H%M)
BACKUP_ROOT=/var/backups/mcraft-kcraft

for PROJECT in mcraft kcraft; do
  DIR="$BACKUP_ROOT/$PROJECT/$DATE"
  mkdir -p "$DIR"

  cd "/var/www/$PROJECT"
  CONTAINER=$(docker compose ps -q mongo)

  docker compose exec -T mongo rm -f "/tmp/${PROJECT}.dump"
  docker compose exec -T mongo mongodump --db="$PROJECT" --archive="/tmp/${PROJECT}.dump"
  docker cp "$CONTAINER:/tmp/${PROJECT}.dump" "$DIR/${PROJECT}.dump"
  docker compose exec -T mongo rm -f "/tmp/${PROJECT}.dump"

  docker run --rm -v "${PROJECT}_media:/from" -v "$DIR:/to" alpine tar czf "/to/media.tar.gz" -C /from .
done

find "$BACKUP_ROOT" -maxdepth 2 -type d -mtime +7 -exec rm -rf {} +
