# JobTrack

A job application tracker that helps you stay on top of your job search — log every application, track its status through the pipeline, set a weekly application goal, and get notified when an application has gone quiet and needs a follow-up.

## 🌟 Features
- **Application Pipeline:** Track each job application through statuses — applied, reviewed, interview, offer, rejected, or ghosted.
- **Dashboard with Filters:** Filter and sort your applications by status, platform, or date applied.
- **Weekly Goal Tracking:** Set a weekly application target and watch an animated progress card fill up as you apply, with a streak counter for consecutive weeks you hit your goal.
- **Follow-Up Notifications:** An in-app notification bell flags applications stuck in "applied"/"reviewed" for 7+ days with no update.
- **Platform Analytics:** See which job platforms (LinkedIn, Indeed, Jobstreet, etc.) get you the highest interview rate.
- **Dark Mode:** Full light/dark theme toggle across the app.
- **Self-Service Password Reset:** Reset your password directly with your email and a new password — no email delivery required.

## 🛠️ Technology Stack
- **Backend:** PHP 8.3, Laravel 13
- **Frontend:** React 18, Inertia.js, TailwindCSS
- **Database:** MySQL 8.0
- **Build Tool:** Vite 8

## 📋 Prerequisites
- **Git** (for cloning)
- **Docker Desktop** (Recommended)
- *OR* **PHP 8.3+, Composer, and Node.js 20+** (if running manually)

---

## 🚀 Getting Started

You can run this application either using **Docker (Recommended)** or by running it manually.

### Option 1: Using Docker (Recommended)
Using Docker guarantees that PHP, MySQL, and Node.js are all correctly set up without touching your local environment.

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hfzuddin/Job-Tracker.git
   cd Job-Tracker
   ```

2. **Start Docker Desktop** on your computer.

3. **Run the application**
   ```bash
   docker compose up --build
   ```
   *Note: The first run may take a few minutes to install PHP/Node dependencies and build the frontend.*

4. **Access the web app**
   Open your browser and navigate to: [http://localhost:8000](http://localhost:8000)

5. **Stop the application**
   ```bash
   docker compose down
   ```

### Option 2: Traditional Manual Installation (Without Docker)

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hfzuddin/Job-Tracker.git
   cd Job-Tracker
   ```

2. **Install dependencies and configure the environment**
   ```bash
   composer install
   npm install

   cp .env.example .env
   # Edit .env to point DB_HOST to your local MySQL (127.0.0.1)
   php artisan key:generate
   php artisan migrate
   ```

3. **Start the development servers**
   ```bash
   composer dev
   ```
   *This runs the Laravel server and Vite together. Open the URL shown in your terminal (typically `http://localhost:8000`).*

---

## 📖 How to Use

Once you're logged in, here's how to get the most out of JobTrack:

### Tracking a Job Application
1. Click **Add Job** in the sidebar.
2. Fill in the company name, job title, platform, location, date applied, and status.
3. It'll appear on your **Dashboard**, where you can filter by status/platform or reorder by date.
4. As a job progresses, open it from **Edit / Delete** to update its status.

### Weekly Goals
1. On the Dashboard, click **Edit goal** on the Weekly Goal card and set how many applications you want to submit that week.
2. The progress card updates automatically as you log new applications, and tracks a streak for consecutive weeks you hit your goal.

### Follow-Up Notifications
Click the 🔔 bell icon next to your name at any time — it lists every application still sitting in "applied" or "reviewed" after 7+ days, so nothing falls through the cracks.

### Platform Analytics
Visit the **Analytics** page to see which platforms are converting into interviews most often, based on your own application history.

## License

Open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
