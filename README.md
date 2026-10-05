# HamroShoppingApp

**HamroShoppingApp** is a modern **E-commerce Web Application** built with **ASP.NET Core Web API** for the backend and **React.js** for the frontend. It provides a smooth shopping experience with features like cart management, product browsing, category filtering, order placement, ratings, and secure payments. 

The platform includes **role-based access** for Admins and Users, with **real-time notifications using SignalR**, **eSewa integration** for payments, and a custom **Machine Learning recommendation engine**.

---

## Key Features

* **Authentication & Roles**
  * User registration & login
  * Role-based access for **Admin** and **User**

* **User Features**
  * Browse products by category, search, or filters
  * Discover related products powered by a machine learning content-based filtering system.
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

## AI & Machine Learning Integration

To provide a personalized shopping experience, the platform features a custom-built **Content-Based Recommendation Engine**:
* **Data Pipeline:** Real product datasets are exported directly from the SQL database, focusing on key contextual columns: `Id`, `CategoryName`, `ProductName`, and `Description`.
* **Natural Language Processing (NLP):** The text data is cleaned, tokenized, and stemmed using **NLTK** (Porter Stemmer) and vectorized using **Scikit-learn** to extract the top 5,000 most important features.
* **Cosine Similarity Engine:** The model calculates mathematical match scores between every product in the catalog based on shared keywords and context, generating the top 5 closest matches.
* **Microservice Architecture:** The mathematical computations are offloaded to a lightweight **Python (Flask) API**. The ASP.NET Core backend queries this microservice via HTTP to instantly fetch recommendation IDs and serve the full SQL data to the React frontend.

---

## Architecture

* **Backend:** ASP.NET Core Web API
* **Machine Learning API:** Python Flask (Microservice)
* **Frontend:** React.js
* **Authentication:** JWT (JSON Web Token)
* **Database:** SQL Server (Entity Framework Core, Code First)
* **Design Pattern:** Repository Pattern
* **Realtime Updates:** SignalR for notifications
* **Payment:** eSewa integration
* **DTOs:** Used for structured data transfer between layers

---

## Technologies Used

* **Language:** C# / JavaScript / Python
* **Backend Framework:** ASP.NET Core 8 (Web API)
* **Microservice:** Flask
* **AI / Data Science:** Scikit-learn, NLTK, Pandas, NumPy
* **Frontend Framework:** React.js
* **Database:** SQL Server
* **ORM:** Entity Framework Core (Code First)
* **Realtime:** SignalR
* **Authentication:** JWT
* **Payment:** eSewa

---

## Setup Instructions

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

### 5. Run the Machine Learning API (Python)

Navigate to the Python Folder and start the development server:

```bash
python app.py

```

---
👨‍💻 Author

Developed by Abiskar Gyawali

Contributions & suggestions are welcome!
---

