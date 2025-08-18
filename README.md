# 🛒 HamroShoppingApp

**HamroShoppingApp** is a modern **E-commerce Web Application** built with **ASP.NET Core Web API** for the backend and **React.js** for the frontend. It provides a smooth shopping experience with features like cart management, product browsing, category filtering, order placement, ratings, and secure payments.

The platform includes **role-based access** for Admins and Users, with **real-time notifications using SignalR** and **eSewa integration** for payments.

---

## 🔑 Key Features

* **Authentication & Roles**

  * User registration & login
  * Role-based access for **Admin** and **User**

* **User Features**

  * Browse products by category, search, or filters
  * Add, edit, and delete items from the **shopping cart**
  * Place orders with **eSewa payment verification**
  * Rate and review purchased products
  * Receive **real-time notifications** via SignalR

* **Admin Features**

  * Manage **Products** (add, edit, delete, search, filter, popular products)
  * Manage **Categories**
  * View and manage **Orders**
  * Monitor **Ratings & Reviews**

---

## 🏗️ Architecture

* **Backend:** ASP.NET Core Web API
* **Frontend:** React.js
* **Authentication:** JWT (JSON Web Token)
* **Database:** SQL Server (Entity Framework Core, Code First)
* **Design Pattern:** Repository Pattern
* **Realtime Updates:** SignalR for notifications
* **Payment:** eSewa integration
* **DTOs:** Used for structured data transfer between layers

---

## 🧰 Technologies Used

* **Language:** C# / JavaScript
* **Backend Framework:** ASP.NET Core 8 (Web API)
* **Frontend Framework:** React.js
* **Database:** SQL Server
* **ORM:** Entity Framework Core (Code First)
* **Realtime:** SignalR
* **Authentication:** JWT
* **Payment:** eSewa
* **Other Tools:** LINQ, AutoMapper

---

## ⚙️ Setup Instructions

### 1. Update the Connection String

In `appsettings.json`, configure your SQL Server:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER_NAME; Database=HamroShoppingAppDb; Trusted_Connection=True; TrustServerCertificate=True; Connection Timeout=30; MultipleActiveResultSets=True"
}
```

### 2. Apply Migrations

Run the following to create the database:

```bash
dotnet ef database update
```

### 3. Build and Run the Backend

```bash
dotnet build
dotnet run
```

### 4. Run the Frontend (React)

Navigate to the React frontend project and start the development server:

```bash
npm install
npm start
```

---

