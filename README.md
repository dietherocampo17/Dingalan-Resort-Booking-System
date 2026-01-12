# Dingalan Resort Booking System

A modern, full-stack resort booking application designed for Dingalan, Aurora. This system provides a seamless experience for potential guests to discover resorts, check availability, and make bookings, while offering resort administrators and staff powerful tools to manage operations.

## Features

### For Guests (Client Portal)
-   **Resort Discovery**: Browse a curated list of resorts with high-quality images and detailed descriptions.
-   **Advanced Search**: Filter resorts by price, amenities, and location.
-   **Seamless Booking**: Easy-to-use booking flow with date selection and room customization.
-   **User Accounts**: Manage profile, view booking history, and save favorite resorts.

### For Staff (Employee Portal)
-   **Dashboard**: Real-time overview of check-ins, check-outs, and pending bookings.
-   **Booking Management**: Confirm bookings, check guests in/out, and handle payments.
-   **Availability Calendar**: View and manage room availability efficiently.

### For Admins (Admin Panel)
-   **Analytics**: View revenue reports, occupancy rates, and booking trends.
-   **System Management**: Configure payment methods, manage users, and update resort details.
-   **Audit Logs**: (Planned) Track key actions and system changes.

## Tech Stack

-   **Frontend**: React, Ionic Framework, TypeScript, Vite
-   **Backend**: Node.js, Express.js
-   **Database**: MySQL
-   **ORM**: Prisma
-   **Styling**: Vanilla CSS (Custom Design System)

## Getting Started

### Prerequisites
-   Node.js (v18+)
-   MySQL Server

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/dietherocampo17/Dingalan-Resort-Booking-System.git
    cd Dingalan-Resort-Booking-System
    ```

2.  **Install Dependencies**
    ```bash
    # Install frontend dependencies
    npm install

    # Install backend dependencies
    cd backend
    npm install
    cd ..
    ```

3.  **Setup Environment**
    -   Configure `backend/.env` with your database credentials.
    -   See `DEPLOYMENT.md` for detailed configuration.

4.  **Run Development Server**
    ```bash
    # Run Frontend
    npm run dev

    # Run Backend (in a separate terminal)
    cd backend
    npm run dev
    ```

## Deployment

For detailed deployment instructions, please refer to [DEPLOYMENT.md](./DEPLOYMENT.md).

## License

This project is licensed under the ISC License.
