#!/bin/sh
set -e
mkdir -p /app/media
chown -R nextjs:nodejs /app/media
exec su-exec nextjs node server.js
