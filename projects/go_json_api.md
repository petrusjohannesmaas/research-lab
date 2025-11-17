## Basic GO JSON API Server

### 🧩 Overview

This project demonstrates how to build a lightweight RESTful API server using Go. The server exposes endpoints to manage a collection of items (e.g., books, tasks, users) and returns responses in JSON format.

---

## 🛠 Tech Stack

- **Language:** Go (Golang)
- **Framework:** net/http (standard library)
- **Data Storage:** In-memory (map or slice)
- **Format:** JSON
- **Tools:** curl or Postman for testing

---

## 📁 Project Structure

```
json-api-server/
├── main.go
├── handlers.go
├── models.go
└── README.md

```

---

## 📄 API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | /items | List all items |
| GET | /items/{id} | Get item by ID |
| POST | /items | Create a new item |
| PUT | /items/{id} | Update an existing item |
| DELETE | /items/{id} | Delete an item |

---

## 📦 Sample Data Model (models.go)

```go
package main

type Item struct {
    ID    string `json:"id"`
    Name  string `json:"name"`
    Price float64 `json:"price"`
}

```

---

## 🔧 Server Setup (main.go)

```go
package main

import (
    "log"
    "net/http"
    "github.com/gorilla/mux"
)

func main() {
    r := mux.NewRouter()

    r.HandleFunc("/items", GetItems).Methods("GET")
    r.HandleFunc("/items/{id}", GetItem).Methods("GET")
    r.HandleFunc("/items", CreateItem).Methods("POST")
    r.HandleFunc("/items/{id}", UpdateItem).Methods("PUT")
    r.HandleFunc("/items/{id}", DeleteItem).Methods("DELETE")

    log.Println("Server running on port 8080")
    log.Fatal(http.ListenAndServe(":8080", r))
}

```

---

## 🧠 Handlers (handlers.go)

```go
package main

import (
    "encoding/json"
    "net/http"
    "github.com/gorilla/mux"
)

var items = []Item{}

func GetItems(w http.ResponseWriter, r *http.Request) {
    json.NewEncoder(w).Encode(items)
}

func GetItem(w http.ResponseWriter, r *http.Request) {
    params := mux.Vars(r)
    for _, item := range items {
        if item.ID == params["id"] {
            json.NewEncoder(w).Encode(item)
            return
        }
    }
    http.NotFound(w, r)
}

func CreateItem(w http.ResponseWriter, r *http.Request) {
    var newItem Item
    json.NewDecoder(r.Body).Decode(&newItem)
    items = append(items, newItem)
    json.NewEncoder(w).Encode(newItem)
}

func UpdateItem(w http.ResponseWriter, r *http.Request) {
    params := mux.Vars(r)
    for i, item := range items {
        if item.ID == params["id"] {
            json.NewDecoder(r.Body).Decode(&items[i])
            json.NewEncoder(w).Encode(items[i])
            return
        }
    }
    http.NotFound(w, r)
}

func DeleteItem(w http.ResponseWriter, r *http.Request) {
    params := mux.Vars(r)
    for i, item := range items {
        if item.ID == params["id"] {
            items = append(items[:i], items[i+1:]...)
            break
        }
    }
    w.WriteHeader(http.StatusNoContent)
}

```

---

## 🧪 Testing the API

Use `curl` or Postman to test endpoints:

```bash
curl -X POST http://localhost:8080/items \
-H "Content-Type: application/json" \
-d '{"id":"1","name":"Book","price":9.99}'

```

---

## 📌 Optional Enhancements

- Add persistent storage with Redis or MongoDB
- Add input validation and error handling
- Implement pagination and filtering
- Add Swagger/OpenAPI documentation

---