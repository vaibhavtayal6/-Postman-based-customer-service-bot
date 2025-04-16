# ABC Lighting Chatbot API Simulation

## 🚀 Project Overview
This project simulates a customer service chatbot for **ABC Lighting Company** using:
- A **Node.js backend** to serve API responses.
- **Postman Collection Runner** to simulate conversations.
- **Static product images** for chatbot responses.

---

## 📦 Project Structure
📂 ABC_Lighting_Assignment/ │/ # Node.js API server │── postman_collection.json # Exported Postman collection │── README.md # Documentation


---

## 🛠️ Setup Instructions

### 1️⃣ Install & Run the Backend
```bash
npm install
node setup.js
node server.js

## Your API should now be running at http://localhost:3000/.


### 🌐 API Endpoints

Method	Route	Description
GET	/api/company-info	Get company details
GET	/api/products	Get all products
GET	/api/products/street-light	Get street light details
GET	/api/products/driveway-light	Get driveway light details
GET	/api/products/wall-light	Get wall light details


### 📸 Demo Screenshot
Below is the screenshot from Postman Runner showing all endpoints returning successful responses (200 OK):

![Postman Run Results](./demo_screenshots/postman-run-results.png)



