# 🪑 SteelCraft — Premium Steel Furniture E-Commerce

A full-stack e-commerce web application for premium stainless steel furniture, built with **React + Vite** (frontend) and **Node.js + Express + MongoDB** (backend).

---

## 🌐 Live Preview

> Coming Soon...

---

## ✨ Features

- 🎬 **Video Hero Section** — Cinematic background video with auto-rotating headlines
- 🛍️ **Product Shop** — 24+ products across 5 categories (Swings, Doors, Railings, Furniture, Decor)
- 🔍 **Live Search** — Real-time product search with image suggestions dropdown
- 🛒 **Shopping Cart** — Add, remove, quantity control with `localStorage` persistence
- 📦 **Product Detail Page** — Image gallery, features, quantity selector, and add-to-cart
- 📂 **Category Filter** — Filter products by category with animated transitions
- 📬 **Contact Form** — Sends inquiries to the backend
- 🔐 **Login / Auth Page** — Sign in with Google & Facebook (UI ready)
- 📰 **Newsletter Signup** — Email subscription section
- 📱 **Responsive Design** — Works across desktop and mobile

---

## 🛠️ Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, Vite 4, Vanilla CSS     |
| Backend   | Node.js, Express 5                |
| Database  | MongoDB (via Mongoose)            |
| Tools     | CORS, dotenv                      |

---

## 📁 Project Structure

```
Steel_funiture-main/
├── public/
│   └── images/          # Product images & background video
├── src/
│   ├── App.jsx          # Main React application
│   ├── api.js           # API helper functions
│   ├── main.jsx         # React entry point
│   └── styles.css       # Global styles
├── models/
│   ├── Product.js       # Product schema
│   ├── Order.js         # Order schema
│   └── Message.js       # Contact message schema
├── routes/
│   ├── Products.js      # /api/products
│   ├── orders.js        # /api/orders
│   └── messages.js      # /api/messages
├── server.js            # Express server entry point
├── vite.config.js       # Vite configuration
└── .env                 # Environment variables (not committed)
```

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/sahaniTripurari/Steel_Funiture_web.git
cd Steel_Funiture_web
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### 4. Run the Backend Server

```bash
node server.js
```

### 5. Run the Frontend (Dev Mode)

```bash
npm run dev
```

> Frontend runs at: `http://localhost:5173`  
> Backend runs at: `http://localhost:5000`

---

## 🏗️ Build for Production

```bash
npm run build
```

---

## 📦 API Endpoints

| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| GET    | /api/products    | Fetch all products       |
| POST   | /api/orders      | Place a new order        |
| POST   | /api/messages    | Submit a contact message |

---

## 🎨 Product Categories

- 🪑 **Furniture** — Dining tables, wardrobes, bed frames, center tables
- 🪟 **Doors** — Main doors, safety doors, designer doors
- 🪜 **Railings** — Glass railings, spiral staircases, balcony frames
- 🛋️ **Swings** — Indoor & outdoor jhoolas in various finishes
- 🖼️ **Decor** — Wall art, planter stands

---

## 👨‍💻 Developer

**Sahani Tripurari**  
GitHub: [@sahaniTripurari](https://github.com/sahaniTripurari)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
