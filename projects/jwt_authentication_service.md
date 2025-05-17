Sounds like a fantastic project, Petrus! Let’s structure it step by step so you have a **single repository** that includes both services:

### **Project Overview**
Your project will have:
- **JWT Authentication Service** (Node.js, Express, MongoDB)
- **Web Application** (Node.js, Express, communicates with Auth Service)
- **Kubernetes Deployment** to run both services inside the same cluster

---

### **Step 1: Set Up Project Structure**
Organize your project like this:

```
jwt-auth-webapp/
│── auth-service/      # JWT authentication service
│── webapp-service/    # Web application using authentication service
│── k8s/              # Kubernetes manifests
│── docker-compose.yml  # Local dev setup
│── README.md
```

---

### **Step 2: Implement JWT Authentication Service**
Inside `auth-service/`, create:
- `server.js` (authentication logic)
- `Dockerfile`
- `package.json` (dependencies)

#### `auth-service/server.js` (JWT Auth API)
```javascript
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({ username: String, password: String });
const User = mongoose.model("User", userSchema);

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: "User registered" });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

app.get('/verify-token', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        res.json({ valid: true, user });
    });
});

app.listen(3000, () => console.log('Auth service running on port 3000'));
```

#### `auth-service/Dockerfile`
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

---

### **Step 3: Implement Web Application**
Inside `webapp-service/`, create:
- `server.js` (handles authentication via auth service)
- `Dockerfile`
- `package.json` (dependencies)

#### `webapp-service/server.js`
```javascript
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

async function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

    try {
        const response = await axios.get('http://auth-service:3000/verify-token', {
            headers: { Authorization: authHeader }
        });
        req.user = response.data.user;
        next();
    } catch {
        return res.status(403).json({ message: "Invalid token" });
    }
}

app.get('/dashboard', verifyToken, (req, res) => {
    res.json({ message: `Welcome, ${req.user.username}!`, data: "Secure data accessed!" });
});

app.listen(8080, () => console.log('Web application running on port 8080'));
```

#### `webapp-service/Dockerfile`
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["node", "server.js"]
```

---

### **Step 4: Local Testing With Docker Compose**
Create a **Docker Compose** file for both services and MongoDB:

#### `docker-compose.yml`
```yaml
version: '3.9'

services:
  auth-service:
    build: ./auth-service
    container_name: auth-service
    ports:
      - "3000:3000"
    environment:
      - JWT_SECRET=your_secure_key
      - MONGO_URI=mongodb://mongo:27017/authdb
    depends_on:
      - mongo

  webapp-service:
    build: ./webapp-service
    container_name: webapp-service
    ports:
      - "8080:8080"
    depends_on:
      - auth-service

  mongo:
    image: mongo:5
    container_name: mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

Run everything locally:

```sh
docker-compose up --build -d
```

---

### **Step 5: Kubernetes Deployment**
Inside `k8s/`, create Kubernetes manifests for both services.

#### `auth-service-deployment.yaml`
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
    spec:
      containers:
        - name: auth-service
          image: your-repo/auth-service:latest
          ports:
            - containerPort: 3000
          env:
            - name: MONGO_URI
              value: "mongodb://mongo-service:27017/authdb"
            - name: JWT_SECRET
              value: "your_secure_key"

---
apiVersion: v1
kind: Service
metadata:
  name: auth-service
spec:
  selector:
    app: auth-service
  ports:
    - protocol: TCP
      port: 3000
      targetPort: 3000
```

#### `webapp-service-deployment.yaml`
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: webapp-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: webapp-service
  template:
    metadata:
      labels:
        app: webapp-service
    spec:
      containers:
        - name: webapp-service
          image: your-repo/webapp-service:latest
          ports:
            - containerPort: 8080

---
apiVersion: v1
kind: Service
metadata:
  name: webapp-service
spec:
  selector:
    app: webapp-service
  ports:
    - protocol: TCP
      port: 8080
      targetPort: 8080
```

#### `mongo-deployment.yaml`
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mongo
  template:
    metadata:
      labels:
        app: mongo
    spec:
      containers:
        - name: mongo
          image: mongo:5
          ports:
            - containerPort: 27017

---
apiVersion: v1
kind: Service
metadata:
  name: mongo-service
spec:
  selector:
    app: mongo
  ports:
    - protocol: TCP
      port: 27017
      targetPort: 27017
```

---

### **Step 6: Deploy to Kubernetes**
Apply all deployments:

```sh
kubectl apply -f k8s/
```

Now, both services run in Kubernetes, and your **web application communicates securely** with the **auth service** for JWT verification!

---

### **Next Steps**
- Use **environment variables** inside Kubernetes **Secrets** instead of hardcoding values.
- Deploy with **Ingress** to expose services securely.
- Implement **role-based authentication** for finer access control.

How does this setup look? Need adjustments based on your cluster structure? 🚀