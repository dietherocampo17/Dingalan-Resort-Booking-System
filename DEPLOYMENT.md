# Deployment Guide: Dingalan Resort Booking System

This guide covers the reliable and accurate steps to deploy the full-stack application (Frontend + Backend + Database) on a Linux server.

## Prerequisites
Ensure the server has the following installed:
-   **Node.js** (v18 or higher)
-   **MySQL Server** (v8.0 recommended)
-   **Nginx** (Web Server)
-   **PM2** (Process Manager for Node.js)
-   **Git**

## 1. Database Setup (MySQL)
1.  Log in to MySQL:
    ```bash
    mysql -u root -p
    ```
2.  Create the database:
    ```sql
    CREATE DATABASE dingalan_booking_db;
    CREATE USER 'dingalan_user'@'localhost' IDENTIFIED BY 'your_secure_password';
    GRANT ALL PRIVILEGES ON dingalan_booking_db.* TO 'dingalan_user'@'localhost';
    FLUSH PRIVILEGES;
    EXIT;
    ```

## 2. Backend Deployment
1.  **Navigate to Backend Directory**:
    ```bash
    cd backend
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Configure Environment**:
    Create a `.env` file:
    ```bash
    nano .env
    ```
    Content:
    ```env
    PORT=3000
    DATABASE_URL="mysql://dingalan_user:your_secure_password@localhost:3306/dingalan_booking_db"
    JWT_SECRET="your_very_long_random_secret_string"
    ```
4.  **Run Database Migrations**:
    ```bash
    npx prisma migrate deploy
    ```
5.  **Seed Database (Optional)**:
    ```bash
    npm run seed
    ```
6.  **Build and Start**:
    ```bash
    npm run build
    pm2 start dist/index.js --name "dingalan-api"
    pm2 save
    ```

## 3. Frontend Deployment
1.  **Navigate to Project Root**:
    ```bash
    cd ..
    ```
2.  **Configure API URL**:
    Create `.env.production` file:
    ```bash
    nano .env.production
    ```
    Content:
    ```env
    VITE_API_URL=http://your-server-ip:3000
    ```
3.  **Install & Build**:
    ```bash
    npm install
    npm run build
    ```
    This creates a `dist` directory with static files.

## 4. Nginx Configuration (Reverse Proxy)
1.  **Create Config File**:
    ```bash
    sudo nano /etc/nginx/sites-available/dingalan-resort
    ```
2.  **Paste Configuration**:
    ```nginx
    server {
        listen 80;
        server_name your-domain.com; # Or IP address

        root /var/www/dingalan-resort/dist; # Adjust path to your project dist folder
        index index.html;

        # Frontend: Serve Static Files (SPA)
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Backend: Reverse Proxy to API
        location /api {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```
3.  **Enable Site**:
    ```bash
    sudo ln -s /etc/nginx/sites-available/dingalan-resort /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

## 5. Verification
-   Visit `http://your-domain.com` to see the App.
-   Visit `http://your-domain.com/api/health` to check the API status.
