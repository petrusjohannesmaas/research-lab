# Full Stack Development

We'll bring everything together:  
1. **React Frontend:** Registration, login, protected route, logout.  
2. **Express Backend:** Handles authentication with **JWT** and **password salting**.  
3. **Caddy Proxy:** Manages requests efficiently with automatic HTTPS.

Let's go step by step.  

---

### **Step 1: Setting Up the React Frontend**  
Run:
```sh
npx create-react-app fullstack-auth
cd fullstack-auth
npm install axios react-router-dom
```
Dependencies:  
- `axios` → Handles API requests.  
- `react-router-dom` → For page navigation.

---

### **Step 2: Creating Authentication Pages**
#### **`src/Register.js` (User Registration)**
```jsx
import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:3000/register", { username, password });
      alert("User registered!");
    } catch (error) {
      alert("Registration failed!");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;
```

---

#### **`src/Login.js` (User Login)**
```jsx
import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/login", { username, password });
      localStorage.setItem("token", response.data.token);
      alert("Login successful!");
    } catch (error) {
      alert("Login failed!");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
```
- Stores JWT in **localStorage**.
- Authenticates **via backend**.

---

#### **`src/Protected.js` (Secured Page)**
```jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

function Protected() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProtected = async () => {
      try {
        const response = await axios.get("http://localhost:3000/protected", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setMessage(response.data.message);
      } catch (error) {
        setMessage("Access Denied!");
      }
    };

    fetchProtected();
  }, []);

  return (
    <div>
      <h2>Protected Route</h2>
      <p>{message}</p>
      <button onClick={() => localStorage.removeItem("token")}>Log Out</button>
    </div>
  );
}

export default Protected;
```
- Fetches protected **data from Express**.
- Logs user out by clearing the token.

---

### **Step 3: React Routing (`App.js`)**
```jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Protected from "./Protected";

function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/protected" element={isAuthenticated ? <Protected /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
```
- Redirects **unauthenticated users** to login.

---

### **Step 4: Backend (Express)**
Modify Express to interact properly:

#### **Install Dependencies**
```sh
npm install cors express
```
- `cors` → Enables frontend communication.

#### **Update Express Server**
```js
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("./db");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const secretKey = process.env.JWT_SECRET || "supersecretkey";

// Register Route
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await pool.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);

  res.status(201).json({ message: "User created successfully" });
});

// Login Route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
  if (rows.length === 0) return res.status(400).json({ message: "User not found" });

  const user = rows[0];
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign({ userId: user.id, username: user.username }, secretKey, { expiresIn: "1h" });

  res.json({ message: "Login successful", token });
});

// Protected Route
app.get("/protected", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ message: "Token required" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    res.json({ message: `Hello ${user.username}, you have access!` });
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

---

### **Step 5: Caddy Proxy**
Create a `Caddyfile` to reverse-proxy requests:

```
example.com {
    reverse_proxy localhost:3000
    encode gzip
    tls internal
}
```
Run:
```sh
caddy run
```
- Ensures **secure communication**.
- Handles **automatic HTTPS**.

---

### **Final Steps**
- Start Express: `node server.js`
- Start React: `npm start`
- Run Caddy: `caddy run`

Your full-stack app is now **secured** and fully functional!  

### **Next Enhancements**
- Containerize the app with **Docker**.
- Add **database migrations**.
- Add **error handling**.
- Add **logging**.
- Deploy to cloud with **Kubernetes**.
