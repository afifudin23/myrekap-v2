<div align="center">
    <!-- https://icons8.com/icons -->
    <img width="96" height="96" src="https://raw.githubusercontent.com/afifudin23/myrekap-v2/main/public/assets/images/rose.png" alt="myrekap-logo"/>
</div>

<h1 align="center">MyRekap – Quick and Easy Flower Sales Management</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v22.18.0-tosca?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-4.21.2-000000?logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-v5.6.3-0D99FF?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-v3.3-38BDF8?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/React%20Router%20DOM-v7.1-CA4245?logo=reactrouter&logoColor=white" />
  <img src="https://img.shields.io/badge/Zustand-v5.0-764ABC?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Zod-v3.24-2D3748?logo=zod&logoColor=white" />
  <img src="https://img.shields.io/badge/Cloudinary-Image%20Storage-030434" />
  <img src="https://img.shields.io/badge/Brevo-Email%20Service-0D99FF" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" />
</p>


**MyRekap** is an application designed to help record data, monitor progress, and display reports in real time.
Built with Node.js and a modern frontend, it allows users to manage information efficiently.

---

## Table of Contents

-   [Features](#features)
-   [Tech Stack Required](#tech-stack-required)
-   [Getting Started](#getting-started)
    -   [Initial Step](#1-initial-step)
    -   [Setup App](#2-setup-app)
-   [Documentation](#documentation)
    -   [Demo Features](#demo-features)

---

## Features

The MyRekap service serves as the reporting and administrative dashboard, enabling managers and admins to:

-   Product Management – Create, update, and delete products
-   Order Management – View and update order statuses (especially orders placed from MyFlower)
-   Report Generation – Automatically generate monthly stock and sales reports
-   User Management – Manage admin, staff, and user accounts
-   Notifications – Automatically send notifications to the manager and customer when a new order is created or an order is updated.

---

## Tech Stack Required

-   **Tools:**
    -   React.js (v18.3)
    -   Vite (v6.0)
    -   TypeScript (v5.6)
    -   Tailwind CSS (v3.3)
    -   React Router DOM (v7.1)
    -   Zustand (v5.0)
    -   Zod (v3.24)
-   **Package Manager:**
    -   npm (v10.9)
-   **Third-Party Service:**
    -   Brevo (for notification emails)
    -   Cloudinary (for image storage and management)

---

## Getting Started

Before starting, make sure you have Node.js installed.  
It’s **recommended to use NVM (Node Version Manager)** so you can easily switch between different Node.js versions.

## 🧩 Install Node.js (Recommended via NVM)

To manage Node.js versions easily, it’s **recommended** to install it using **NVM (Node Version Manager)**.

Please follow the installation guide for your platform:

-   **Windows:** [NVM for Windows Documentation](https://github.com/coreybutler/nvm-windows)
-   **Linux / macOS:** [Official NVM Repository](https://github.com/nvm-sh/nvm)

Once NVM is installed, verify and set up Node.js:

```bash
nvm -v            # Check if NVM is installed
nvm install 22.18.0
nvm use 22.18.0
node -v           # Verify Node.js version
npm -v            # Verify npm version

```

### 1. Initial Step:

```bash
git clone git@github.com:afifudin23/myrekap-v2.git
cd myrekap-v2
```

### 2. Setup (App)

Go to the frontend folder and install dependencies:

```bash
npm install
```

Copy .env.example to .env and set your configuration:

```bash
# System
VITE_BASE_API_URL=               # The base URL of your backend API, default http://localhost:5000

```

Build the application for production:

```bash
npm run build
```

Run the app in preview mode:

```bash
npm run preview         # Default PORT: 5001
```

The app will be available at:

```bash
http://localhost:<PORT>                   # Default PORT: 5001
```

## Documentation

### Demo Features

Explore the main frontend features and usage of MyRekap through the following live demos:

-   Setup Guide: [View Demo](https://jam.dev/c/fab4b543-1a83-4838-8d6a-0551aee3ec31)  
    Step-by-step setup instructions showing how to install and configure MyRekap properly.

-   Usage Overview: [View Demo](https://jam.dev/c/f1f7298e-91eb-4e8e-ab17-478f01a4a10e)  
    Demonstration of how to use MyRekap features including product, order, admin, and report management.
