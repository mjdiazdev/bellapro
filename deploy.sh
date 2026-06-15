#!/bin/bash
# BellaPro — script de deploy en producción
# Uso: bash deploy.sh
# Directorio raíz del proyecto en el servidor: /home/bellaonl/public_html

set -e

PHP="/opt/cpanel/ea-php83/root/usr/bin/php"
BACKEND="/home/bellaonl/public_html/backend"
FRONTEND="/home/bellaonl/public_html/frontend"
ROOT="/home/bellaonl/public_html"

echo "==> [1/6] Git pull..."
cd "$ROOT"
git pull origin main

echo "==> [2/6] Limpiando caché de config (evita REDSYS/ENV null)..."
rm -f "$BACKEND/bootstrap/cache/config.php"
rm -f "$BACKEND/bootstrap/cache/routes-v7.php"
rm -f "$BACKEND/bootstrap/cache/services.php"
rm -f "$BACKEND/bootstrap/cache/packages.php"

echo "==> [3/6] Regenerando cachés con PHP 8.3..."
$PHP "$BACKEND/artisan" config:clear
$PHP "$BACKEND/artisan" config:cache
$PHP "$BACKEND/artisan" route:cache
$PHP "$BACKEND/artisan" view:clear

echo "==> [4/6] Migraciones..."
$PHP "$BACKEND/artisan" migrate --force

echo "==> [5/6] Build del frontend..."
cd "$FRONTEND"
npm run build

echo "==> [6/6] Deploy completado."
