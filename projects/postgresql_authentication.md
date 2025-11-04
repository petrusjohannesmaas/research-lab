# User Authentication with Node.js and PostgreSQL

## 🧩 Overview
This project demonstrates how to implement secure user authentication using Node.js for the back-end and PostgreSQL as the database. It includes user registration, login, password hashing, and session/token management.

---

## 🛠️ Tech Stack

| Layer        | Technology |
|--------------|------------|
| Server       | Node.js (Express.js) |
| Database     | PostgreSQL |
| Authentication | bcrypt, JWT (JSON Web Tokens) |
| ORM/Query    | pg or Sequelize/Knex.js |
| Environment  | dotenv |

---

## 📁 Project Structure
```
auth-app/
├── controllers/
│   └── authController.js
├── models/
│   └── userModel.js
├── routes/
│   └── authRoutes.js
├── db/
│   └── index.js
├── .env
├── app.js
└── package.json
```

---

## ⚙️ Setup Instructions

### 1. **Install Dependencies**
```bash
npm init -y
npm install express pg bcrypt jsonwebtoken dotenv
```

### 2. **Configure Environment Variables (.env)**
```env
PORT=3000
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=authdb
JWT_SECRET=your_jwt_secret
```

### 3. **Initialize PostgreSQL Database**
```sql
CREATE DATABASE authdb;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL
);
```

---

## 📄 Sample Code Snippets

### 🔌 Database Connection (db/index.js)
```js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = pool;
```

### 🔐 User Registration (controllers/authController.js)
```js
const bcrypt = require('bcrypt');
const pool = require('../db');

exports.register = async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashed]);
  res.status(201).send('User registered');
};
```

### 🔑 User Login with JWT
```js
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  const user = result.rows[0];

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send('Invalid credentials');
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};
```

---

## 🧪 API Endpoints

| Method | Endpoint      | Description         |
|--------|---------------|---------------------|
| POST   | /register     | Register new user   |
| POST   | /login        | Authenticate user   |
| GET    | /profile      | Protected route     |

---

## ✅ Best Practices
- Use HTTPS in production
- Store JWT in HTTP-only cookies or secure headers
- Validate input with middleware (e.g., `express-validator`)
- Use rate limiting and logging for security

---

## 📚 Further Reading
- [bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)
- [pg Node.js Client](https://node-postgres.com/)
- [JWT Introduction](https://jwt.io/introduction)

---