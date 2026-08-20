#!/bin/bash
set -e

echo "[START] JobTrack Entrypoint Starting..."

# -------------------------------------------------------------------
# 1. Environment file
# -------------------------------------------------------------------
if [ ! -f .env ]; then
    echo "[ENV] No .env found - copying from .env.example"
    cp .env.example .env
fi

# -------------------------------------------------------------------
# 2. Install PHP dependencies
# -------------------------------------------------------------------
if [ ! -d vendor ] || [ ! -f vendor/autoload.php ]; then
    echo "[COMPOSER] Installing Composer dependencies..."
    composer install --no-interaction --prefer-dist
fi

# -------------------------------------------------------------------
# 3. Install Node dependencies
# -------------------------------------------------------------------
if [ ! -d node_modules ] || [ ! -f node_modules/.package-lock.json ]; then
    echo "[NPM] Installing NPM dependencies..."
    npm install
fi

# -------------------------------------------------------------------
# 4. Generate app key if not set
# -------------------------------------------------------------------
if grep -q "^APP_KEY=$" .env 2>/dev/null || grep -q "^APP_KEY=base64:$" .env 2>/dev/null; then
    echo "[KEY] Generating application key..."
    php artisan key:generate --force
fi

# -------------------------------------------------------------------
# 5. Wait for MySQL to be ready
# -------------------------------------------------------------------
echo "[DB] Waiting for MySQL..."
MAX_RETRIES=30
RETRY_COUNT=0

until php artisan db:monitor --databases=mysql > /dev/null 2>&1 || \
      php -r "try { new PDO('mysql:host=${DB_HOST:-mysql};port=${DB_PORT:-3306}', '${DB_USERNAME:-jobtrack}', '${DB_PASSWORD:-secret}'); echo 'ok'; } catch(Exception \$e) { exit(1); }" 2>/dev/null; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo "[ERROR] MySQL did not become ready in time. Continuing anyway..."
        break
    fi
    echo "   Attempt $RETRY_COUNT/$MAX_RETRIES - retrying in 2s..."
    sleep 2
done

echo "[OK] MySQL is ready!"

# -------------------------------------------------------------------
# 6. Run migrations
# -------------------------------------------------------------------
echo "[MIGRATE] Running migrations..."
php artisan migrate --force

# -------------------------------------------------------------------
# 7. Laravel optimizations (cache config, routes, views)
# -------------------------------------------------------------------
echo "[CACHE] Caching config & routes..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# -------------------------------------------------------------------
# 8. Fix storage permissions
# -------------------------------------------------------------------
echo "[PERMS] Setting storage permissions..."
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

echo "[DONE] Entrypoint complete - starting application..."

# Execute the CMD passed to the container
exec "$@"
