# 📦 Enterprise Inventory Management System

A powerful, scalable, and analytics-driven **Inventory Management System** tailored for large organizations. Built using the modern MERN stack with TypeScript, this system supports multi-warehouse tracking, advanced analytics dashboards, purchase/sales workflows, barcode management, and real-time updates.

> 🚀 Live Demo: [Click Here to Explore the Live App](https://stockwise-enterprise-hub.onrender.com/)  
---

## 📸 Screenshots

| Dashboard Overview | Inventory Listing | Product Details |
|--------------------|-------------------|-----------------|
| ![](./screenshots/dashboard.png) | ![](./screenshots/inventory-list.png) | ![](./screenshots/product-view.png) |

---

## 🌟 Features

- 🔐 **User Authentication & RBAC**
  - JWT Auth with Admin, Manager, Staff roles
- 📦 **Product & Category Management**
  - SKU, barcode, variant, vendor linking
- 🏢 **Multi-Warehouse Support**
  - Bin, rack, shelf-level tracking
- 📥 **Procurement / Purchase Orders**
- 📤 **Sales & Dispatch Workflows**
- 📊 **Analytics Dashboard**
  - Fast-moving/slow-moving items
  - Inventory valuation, stock levels
- 📈 **Recharts & D3 Visualizations**
- 🧾 **Barcode/QR Code Integration**
- 🔄 **Real-Time Updates** via WebSocket
- 🧩 **API-First Architecture** with Swagger Docs
- 🧠 **AI-Ready** schema and modular backend

---

## 🧰 Tech Stack

| Layer       | Technology |
|-------------|------------|
| **Frontend** | [React.js](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Tailwind CSS](https://tailwindcss.com/) |
| **Backend**  | [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/) + [TypeScript](https://www.typescriptlang.org/) |
| **Database** | [MongoDB](https://www.mongodb.com/) (with Mongoose) |
| **Charts**   | [Recharts](https://recharts.org/) / [D3.js](https://d3js.org/) |
| **Auth**     | [JWT](https://jwt.io/) |
| **Docs**     | [Swagger UI](https://swagger.io/tools/swagger-ui/) |
| **CI/CD**    | [GitHub Actions](https://github.com/features/actions) |
| **Containerization** | [Docker](https://www.docker.com/) |
| **Real-time** | [Socket.IO](https://socket.io/) |

---

## 📁 Project Structure

```bash
inventory-system/
│
├── client/               # React + TS frontend
│   └── src/
│       └── components/
│       └── pages/
│       └── charts/
│
├── server/               # Node.js + Express + TS backend
│   └── controllers/
│   └── routes/
│   └── models/
│   └── middleware/
│   └── sockets/
│
├── shared/               # Shared constants/types
├── docker-compose.yml
└── README.md
