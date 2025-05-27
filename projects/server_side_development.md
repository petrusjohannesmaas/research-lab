# Server-Side Development

The server side is responsible for processing requests, managing databases, and ensuring business logic is executed correctly. It entails:

- Backend Frameworks & Languages: Popular choices include Node.js, Go, Python (Django/Flask), Java (Spring Boot), etc.
- Authentication & Authorization: Handling JWT, OAuth, and user credentials securely.
- Database Management: Working with SQL (PostgreSQL, MySQL) or NoSQL (MongoDB, Firebase) to store and retrieve data.
- API Development: Creating REST or GraphQL APIs for communication with the frontend.
- Error Handling: Handling exceptions and errors gracefully to provide a seamless user experience.
- Performance Optimization: Optimizing server-side performance to ensure fast response times and efficient resource utilization.

## Example: Node.js API with secure user registration

Excellent approach! If you plan to implement JWT authentication later, your backend should have a solid **user creation process** with **secure password handling**. You'll need to:  
1. **Hash and salt passwords** securely.  
2. **Store user data in MariaDB**.  
3. **Ensure authentication is manageable for JWT integration later**.  

---

### **Step 1: Setting Up the Environment**
You'll need:
- **Node.js** (Express backend)
- **MariaDB** (For storing users)
- **bcrypt.js** (For hashing passwords)
- **Express** (For handling API routes)
- **mysql2** (For database interaction)

Run this command to install dependencies:
```sh
npm install express mysql2 bcryptjs dotenv
```

---

### **Step 2: Configuring the Database**
First, set up your MariaDB database with a `users` table:
```sql
CREATE DATABASE user_db;
USE user_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### **Step 3: Connecting Express to MariaDB**
In your `db.js` file, set up database connection:
```js
const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

module.exports = pool.promise();
```
Make sure to use `.env` for credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=user_db
```

---

### **Step 4: Creating the User Route (Password Hashing & Storage)**
Now, let's create an Express route to handle **user registration** using `bcryptjs` for **password hashing**.

```js
const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("./db");

const app = express();
app.use(express.json()); // Middleware for JSON parsing

// Register Route
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  try {
    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

    const [result] = await pool.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);

    res.status(201).json({ message: "User created successfully", userId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

---

### **Step 5: Testing the API**
Once the server is running (`node server.js`), test user creation with a `POST` request:

```json
POST /register
{
  "username": "testUser",
  "password": "securepassword123"
}
```
- **bcrypt.js** hashes and salts the password.
- The password is **stored securely** in MariaDB.

---

### **Next Steps**
- **JWT Authentication:** Later, you can add a login route that verifies hashed passwords and generates a JWT token.
- **User Login:** Implement a `POST /login` endpoint where bcrypt verifies passwords.
- **Middleware for JWT:** Secure your API using JWT for protected routes.

Great question! Your backend would interact with a JWT service by issuing and validating tokens during authentication. Here’s the general flow:

### **How JWT Would Integrate with Your Backend**
1. **User Registers** → Password is hashed and stored in MariaDB _(which you've already set up)_.
2. **User Logs In** → Backend verifies credentials, then generates a **JWT token**.
3. **JWT Service Issues Token** → The token contains user details and expires after a set time.
4. **Client Stores Token** → React app saves the JWT in **localStorage** or **HTTP-only cookies**.
5. **Protected Routes Require Token** → API requests include the JWT token in headers.
6. **JWT Service Validates Requests** → Server checks if token is **valid and not expired**.
7. **User Accesses Secure Content** → If valid, the backend returns requested data.

---

### **Step 1: Implementing Login with JWT**
Now, let's modify your backend to include JWT authentication using `jsonwebtoken`.

#### **Install JWT Library**
Run:
```sh
npm install jsonwebtoken
```

#### **Modify Your Login Route**
We'll add a `POST /login` endpoint that:
1. **Verifies the password** with bcrypt.
2. **Generates a JWT token**.
3. **Returns the token to the client**.

```js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("./db");
require("dotenv").config();

const app = express();
app.use(express.json());

const secretKey = process.env.JWT_SECRET || "supersecretkey"; // JWT signing key

// Login Route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
    if (rows.length === 0) return res.status(400).json({ message: "User not found" });

    const user = rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ message: "Invalid password" });

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, username: user.username }, secretKey, { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
```
- If the **password matches**, it **creates a JWT token**.
- The client now **stores this token** and sends it in future API requests.

---

### **Step 2: Securing Protected Routes**
A JWT service should **verify incoming requests**. Let’s create middleware to **validate tokens**.

#### **JWT Middleware**
```js
const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET || "supersecretkey";

// Middleware to validate JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) return res.status(403).json({ message: "Token required" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = user; // Attach user info to request
    next();
  });
};

module.exports = authenticateToken;
```

#### **Apply JWT Middleware to a Protected Route**
```js
const authenticateToken = require("./jwtMiddleware");

app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, you have access!` });
});
```
- If JWT is **valid**, the request **continues**.
- If **invalid** or **missing**, the request **is blocked**.

---

### **Step 3: Client-Side Integration**
Your **React app** will:
1. **Store JWT** → in `localStorage` or **cookies**.
2. **Send JWT** → as a header in API requests.
3. **Protect Routes** → by checking if **token exists**.

Example request in React:
```js
fetch("http://localhost:3000/protected", {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error("Access denied:", err));
```

---

### **Next Enhancements**
- **Refresh Tokens:** Issue a secondary token to prevent logging out on expiration.
- **Secure Storage:** Instead of `localStorage`, consider **HTTP-only cookies** for security.
- **Logout Mechanism:** Implement token invalidation (blacklisting or frontend removal).