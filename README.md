# 📏 Quantity Measurement App - Frontend

This is the frontend of the Quantity Measurement App built using React (Vite). It provides a user-friendly interface for performing quantity operations and managing authentication.

---

## 🚀 Features

* 🔄 Perform quantity operations (Add, Subtract, Multiply, Divide, Compare, Convert)
* 🔐 User Authentication (JWT + Google OAuth2)
* 📊 View user-specific history
* ⚡ Fast and responsive UI
* 🌐 Clean modular architecture

---

## 🛠️ Tech Stack

* React (Vite)
* JavaScript (ES6+)
* CSS (Custom styling)
* Axios (API calls)
* React Router

---

## 📂 Project Structure

```bash
QuantityMeasurementApp-Frontend/
│
├── public/              # Static assets
├── src/
│   ├── api/             # API service calls
│   ├── components/      # Reusable UI components
│   ├── config/          # App configuration (API URLs, etc.)
│   ├── constants/       # Constant values
│   ├── context/         # Authentication & global state
│   ├── pages/           # Page components (Login, Signup, Dashboard, etc.)
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 📦 Installation

```bash
git clone <your-frontend-repo-url>
cd QuantityMeasurementApp-Frontend
npm install
```

---

## ▶️ Run the App

```bash
npm run dev
```

App will run on:

```
http://localhost:5173
```

---

## 🔗 Backend Integration

Make sure backend is running on:

```
http://localhost:8080
```

Update API base URL inside:

```
src/config/
```

---

## 🔐 Authentication

* JWT-based authentication
* Google OAuth2 login supported
* Public access:

  * Quantity operations
* Protected access:

  * History

---

## 📊 Pages Overview

* Login Page
* Signup Page
* Dashboard (Operations)
* History Page

---

## ⚙️ Environment Configuration

You can store API URL in config file:

Example:

```js
export const BASE_URL = "http://localhost:8080";
```

---

## 💡 Future Improvements

* Dark mode 🌙

---

## 📄 License

MIT License
