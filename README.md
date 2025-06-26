# TaskFlow - Full-Stack Task Manager

![TaskFlow Login Page](https://via.placeholder.com/800x400.png?text=Add+A+Screenshot+Of+Your+Login+Page+Here)

TaskFlow is a modern, full-stack task management application designed for tech students and professionals. It provides a clean, intuitive interface for managing daily tasks, complete with secure user authentication, including social login via Google.

---

## ✨ Features

*   **Secure User Authentication**: Local (email/password) and Google OAuth 2.0 login.
*   **JWT-Powered API**: Secure, stateless API using JSON Web Tokens.
*   **Full CRUD Operations**: Create, Read, Update, and Delete tasks.
*   **Task Prioritization**: Assign 'Low', 'Medium', or 'High' priority to tasks.
*   **Due Dates**: Set and track deadlines.
*   **Advanced Filtering & Sorting**: Easily find the tasks that matter most.
*   **Responsive UI**: A beautiful and functional interface on both desktop and mobile, built with React and Tailwind CSS.
*   **Password Management**: Secure password hashing with bcrypt, plus "Forgot/Reset Password" functionality.

---

## 🚀 Live Demo

*   **Frontend (Vercel):** [Your Vercel URL will go here]
*   **Backend API (Render):** [Your Render URL will go here]

---

## 🛠️ Tech Stack

**Backend:**
*   Node.js
*   Express.js
*   MongoDB (with Mongoose)
*   Passport.js (for Google OAuth)
*   JSON Web Token (JWT)
*   bcrypt.js

**Frontend:**
*   React (with Vite)
*   Tailwind CSS
*   React Router
*   Axios
*   Framer Motion (for animations)

---

## 🔧 Getting Started

### Prerequisites

*   Node.js (v18 or later)
*   npm
*   MongoDB (local instance or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)

### Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install backend dependencies:**
    ```bash
    npm install
    ```

3.  **Install frontend dependencies:**
    ```bash
    cd frontend
    npm install
    cd ..
    ```

4.  **Create the `.env` file:**
    In the root directory, create a `.env` file and add the following variables. Get your Google credentials from the [Google Cloud Console](https://console.cloud.google.com/).
    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key
    SESSION_SECRET=your_super_secret_session_key
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    ```

5.  **Run the development servers:**
    *   To run the backend (port 5000): `npm start`
    *   To run the frontend (port 5173): `cd frontend && npm run dev`

---
Made with ❤️ by Gipsy   