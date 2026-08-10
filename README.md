# JobTrack

A job application tracker built with **Laravel 13**, **React 18**, **Inertia.js**, and **TailwindCSS**.

## 🐳 Getting Started with Docker

The fastest way to get JobTrack running on any machine. No need to install PHP, MySQL, or Node.js locally.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/Mac) or Docker Engine + Docker Compose (Linux)

### Quick Start (Development)

```bash
# 1. Clone the repository
git clone https://github.com/Hfzuddin/Job-Tracker.git
cd Job-Tracker

# 2. Start the development environment
docker compose up --build

# 3. (Optional) Seed the database with test data
docker compose up --build -e DB_SEED=true
```

That's it! Open **http://localhost:8000** in your browser.

| Service | URL | Purpose |
|---------|-----|---------|
| App | http://localhost:8000 | Laravel dev server |
| Vite HMR | http://localhost:5173 | Hot module replacement |
| MySQL | `localhost:3306` | Database (user: `jobtrack`, pass: `secret`) |

### Useful Commands

```bash
# Run artisan commands
docker compose exec app php artisan tinker
docker compose exec app php artisan migrate:fresh --seed

# Run tests
docker compose exec app php artisan test

# Access the container shell
docker compose exec app bash

# View logs
docker compose logs -f app

# Stop everything
docker compose down

# Stop and remove all data (fresh start)
docker compose down -v
```

### Custom Ports

If default ports conflict with other services, override them:

```bash
APP_PORT=8080 VITE_PORT=5174 MYSQL_PORT=3307 docker compose up
```

### Production Build

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

This builds an optimized image with:
- Nginx as reverse proxy (port 80)
- PHP-FPM (no debug, OPcache enabled)
- Pre-built frontend assets
- No dev dependencies

---

## 🖥️ Local Setup (Without Docker)

If you prefer to run without Docker, you'll need:
- PHP 8.3+
- Composer
- Node.js 20+
- MySQL 8.0

```bash
# Install dependencies
composer install
npm install

# Configure environment
cp .env.example .env
# Edit .env to point DB_HOST to your local MySQL (127.0.0.1)
php artisan key:generate

# Run migrations
php artisan migrate

# Start development servers
composer dev
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | PHP 8.3, Laravel 13 |
| Frontend | React 18, Inertia.js, TailwindCSS |
| Database | MySQL 8.0 |
| Build Tool | Vite 8 |
| Auth | Laravel Breeze |

## License

Open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
