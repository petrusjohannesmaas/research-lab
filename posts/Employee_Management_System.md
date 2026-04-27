---
title: "Employee Management System"
description: "Overview of a standard CRUD application designed for managing organizational employee records."
slug: "employee-management-system"
date: "2024-12-05"
tags: ['Fullstack', 'CRUD', 'Project']
author: "Petrus Johannes Maas"
---

# Employee Management System (Web 2 & Web 3)

This repository contains a **bare-bones employee management system** designed for both traditional Web 2 applications and future Web 3 implementations.  

The current version is built using the **MERN stack** with **MongoDB** for storage, **Express** for backend APIs, and **React (Vite + Router v7)** for the frontend. 

The next version will extend this functionality by implementing smart contracts in **Solidity**, allowing decentralized management on the Ethereum blockchain.

---

## Features

- **MongoDB Storage:** Employee and user data stored in collections with indexes for fast lookups.
- **Express APIs:** RESTful endpoints for CRUD operations on employees and users.
- **React Frontend:** Built with Vite and Router v7 for a modern UI.
- **Role-Based Access:** Basic role assignment (admin, management) for restricted operations.

---

## Code Overview

The application provides essential employee management functionality, including user authentication and CRUD operations. Below is an explanation of key parts of the code:

### Authentication System
The system implements a basic authentication mechanism where an admin logs in using predefined credentials. Sessions can be managed via tokens or cookies.

```js
// Example Express route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password') {
    res.json({ success: true, role: 'admin' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});
```

### Employee Data Management
The system enables adding, reading, and deleting employees from the database while enforcing role-based authorization.

#### Insert Employee:
```js
app.post('/employees', async (req, res) => {
  const { eID, name, department } = req.body;
  await Employee.create({ eID, name, department });
  res.json({ message: 'Employee inserted successfully' });
});
```

#### Read Employee Data:
```js
app.get('/employees', async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});
```

#### Delete Employee:
```js
app.delete('/employees/:id', async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ message: 'Employee removed successfully' });
});
```

---

## Future Development (Web 3 Integration)

The next version of this system will transition from a centralized approach to a decentralized framework using **Solidity smart contracts** on the Ethereum blockchain. The aim is to provide:

- **Tamper-proof employee records** stored on-chain.
- **Decentralized authentication mechanisms** using wallets instead of cookies.
- **Permission-based role assignment** enforced through smart contracts.

The Web 3 upgrade will enhance security, transparency, and decentralization in employee management, ensuring that all transactions are **verifiable and immutable** within the Ethereum ecosystem.
```

---

## Disclaimer & Intent 

This project was developed for **research and portfolio purposes**. The
primary goal is to explore architectural patterns and software systems.
It is provided for educational and demonstration purposes.

## License
Copyright © 2026 [Petrus Johannes Maas](https://github.com/petrusjohannesmaas)

Licensed under the **Apache License, Version 2.0**. You may obtain a copy of the License at:
http://www.apache.org/licenses/LICENSE-2.0

### Third-Party Attribution
All included dependencies and libraries are the property of their respective owners and are used according to their original licensing terms.