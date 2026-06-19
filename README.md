# 🛒 GroceryMS - Smart Grocery Management System

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Poppins&weight=700&size=28&pause=1000&color=2874F0&center=true&vCenter=true&width=800&lines=Grocery+Management+System;Inventory+%26+Order+Management;Built+with+HTML+CSS+JavaScript+%26+MySQL;DBMS+Capstone+Project" />

<br>

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge\&logo=html5\&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge\&logo=css3\&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge\&logo=javascript\&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge\&logo=mysql\&logoColor=white)

![GitHub stars](https://img.shields.io/github/stars/yourusername/GroceryMS?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/GroceryMS?style=social)

</div>

---

# 📌 Project Overview

GroceryMS is a modern Grocery Store Management System designed to simplify inventory tracking, customer management, supplier management, order processing, payment tracking, and delivery management.

The project was developed as a DBMS Capstone Project using HTML, CSS, JavaScript, and MySQL.

---

# ✨ Features

### 📊 Dashboard

* Revenue Analytics
* Interactive Charts
* Low Stock Alerts
* Order Statistics

### 👥 Customer Management

* Add Customers
* Edit Customers
* Delete Customers
* Search Customers

### 🛍️ Product Management

* Product Catalog
* Stock Monitoring
* Product Categories
* Expiry Tracking

### 🏭 Supplier Management

* Supplier Records
* Contact Information
* Vendor Tracking

### 📦 Inventory Management

* Stock In
* Stock Out
* Inventory Logs
* Restock Alerts

### 🛒 Order Management

* Order Creation
* Order Tracking
* Status Updates

### 💳 Payment Management

* UPI Payments
* Credit/Debit Cards
* Payment History

### 🚚 Delivery Management

* Delivery Tracking
* Shipping Status
* Customer Address Records

### 📈 Reports & Analytics

* Revenue Reports
* Sales Reports
* Inventory Reports

---

# 🏗️ Tech Stack

| Technology | Purpose            |
| ---------- | ------------------ |
| HTML5      | Structure          |
| CSS3       | Styling            |
| JavaScript | Functionality      |
| Chart.js   | Data Visualization |
| MySQL      | Database           |
| Docker     | Containerization   |
| Vercel     | Frontend Hosting   |
| Render     | Backend Hosting    |

---

# 📂 Project Structure

```bash
GroceryMS/
│
├── index.html
├── login.html
├── style.css
├── app.js
├── database.sql
└── README.md
```

---

# 🔐 Demo Login

```text
Username : admin
Password : admin123
```

---

# 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/GroceryMS.git
cd GroceryMS
```

### Run Project

Open:

```bash
index.html
```

Or use VS Code Live Server.

---

# 🐳 Docker Setup

```bash
docker run --name grocery-mysql \
-e MYSQL_ROOT_PASSWORD=root \
-e MYSQL_DATABASE=groceryms \
-p 3306:3306 \
-d mysql:8
```

Check running container:

```bash
docker ps
```

---

# ☁️ Deployment Architecture

```text
┌───────────────────┐
│     Frontend      │
│      Vercel       │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Node.js + Express │
│      Render       │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│   MySQL Database  │
│ Railway / Aiven   │
└───────────────────┘
```

---

# 🔄 Customer Data Flow

```text
Add Customer
      ↓
Render API
      ↓
MySQL Database

Refresh Page
      ↓
Data comes back from MySQL
```

---

# 🌟 Future Enhancements

* JWT Authentication
* Role Based Access
* Cloud Database Integration
* Invoice Generation
* PDF Reports
* Email Notifications
* Product Image Upload
* Real-Time Inventory Updates

---

# 👨‍💻 Developer

### Aman Gupta

DBMS Capstone Project

Grocery Management System

---

<div align="center">

### ⭐ If you like this project, give it a star ⭐

<img src="https://readme-typing-svg.demolab.com?font=Poppins&weight=700&size=24&pause=1000&color=00C853&center=true&vCenter=true&width=600&lines=Thank+You+For+Visiting!;Happy+Coding!+🚀" />

</div>
