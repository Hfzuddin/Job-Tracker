# ============================================================
# Stage 1: BASE — PHP 8.3 + system deps + Composer + Node 20
# ============================================================
FROM php:8.3-fpm AS base

# System dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    git \
    unzip \
    zip \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libwebp-dev \
    libzip-dev \
    libonig-dev \
    libicu-dev \
    libxml2-dev \
    default-mysql-client \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
        intl \
        xml \
        opcache \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install Node.js 20 LTS
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# PHP configuration
RUN cp "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"

WORKDIR /var/www/html

# ============================================================
# Stage 2: DEV — Development environment
# ============================================================
FROM base AS dev

# Use development php.ini
RUN cp "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"

# Entrypoint handles: deps install, key gen, migrations, seeding
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose ports: Laravel dev server + Vite HMR
EXPOSE 8000 5173

ENTRYPOINT ["entrypoint.sh"]

# Default command: run the full dev stack via composer dev script
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]

# ============================================================
# Stage 3: PROD-ASSETS — Build frontend assets
# ============================================================
FROM base AS prod-assets

COPY . /var/www/html

RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader \
    && npm ci \
    && npm run build \
    && rm -rf node_modules

# ============================================================
# Stage 4: PROD — Production image (PHP-FPM)
# ============================================================
FROM base AS prod

# Use production php.ini
RUN cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

# OPcache settings for production
RUN echo "opcache.enable=1\n\
opcache.memory_consumption=256\n\
opcache.interned_strings_buffer=64\n\
opcache.max_accelerated_files=30000\n\
opcache.validate_timestamps=0\n\
opcache.save_comments=1\n\
opcache.fast_shutdown=1" > "$PHP_INI_DIR/conf.d/opcache-prod.ini"

# Copy application code
COPY . /var/www/html

# Copy built assets from the build stage
COPY --from=prod-assets /var/www/html/public/build /var/www/html/public/build
COPY --from=prod-assets /var/www/html/vendor /var/www/html/vendor

# Remove dev files
RUN rm -rf node_modules tests .env .env.example docker

# Laravel optimizations
RUN php artisan config:clear \
    && php artisan route:clear \
    && php artisan view:clear

# Permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Entrypoint for production (simpler — just migrations)
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 9000

CMD ["php-fpm"]
