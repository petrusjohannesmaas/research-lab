## Rate Limiter Service

### **1. Design the Rate Limiter Service**
Your rate limiter should act as a **reverse proxy** sitting between the web server and incoming requests. The architecture looks like this:

```
Client → Rate Limiter Container → Web Server Container → Response
```

### **2. Implement the Rate Limiter in Go**
You'll create a standalone Go service that:
- **Tracks client requests** (based on IP or API keys).
- **Imposes limits** (e.g., 10 requests per minute).
- **Uses Redis** (or an in-memory cache) to efficiently manage request counts.
- **Forwards requests** to the web server container only if within allowed limits.

Here's a minimal implementation:

```go
package main

import (
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"
)

var (
	requests = make(map[string]int)
	mu       sync.Mutex
)

const (
	limit  = 10  // Max requests per minute
	window = time.Minute
)

func rateLimiter(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := r.RemoteAddr

		mu.Lock()
		count, exists := requests[ip]
		if !exists {
			requests[ip] = 1
		} else if count >= limit {
			mu.Unlock()
			http.Error(w, "Too many requests", http.StatusTooManyRequests)
			return
		} else {
			requests[ip]++
		}
		mu.Unlock()

		next.ServeHTTP(w, r)
	})
}

func backendProxy(w http.ResponseWriter, r *http.Request) {
	resp, err := http.Get("http://webserver-container:8080" + r.URL.Path) // Modify the URL if needed
	if err != nil {
		http.Error(w, "Error contacting backend", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	w.WriteHeader(resp.StatusCode)
	fmt.Fprint(w, "Request forwarded successfully")
}

func main() {
	http.Handle("/", rateLimiter(http.HandlerFunc(backendProxy)))

	log.Println("Rate limiter proxy running on port 8000...")
	http.ListenAndServe(":8000", nil)
}
```

### **3. Containerizing the Rate Limiter**
Create a `Dockerfile`:

```dockerfile
FROM golang:1.20
WORKDIR /app
COPY . .
RUN go build -o rate-limiter
CMD ["./rate-limiter"]
EXPOSE 8000
```

### **4. Setting Up Docker Compose**
You can define your rate limiter alongside the web server:

```yaml
version: '3.9'

services:
  webserver:
    image: my-webserver
    container_name: webserver-container
    ports:
      - "8080:8080"

  rate-limiter:
    build: .
    container_name: rate-limiter-container
    ports:
      - "8000:8000"
    depends_on:
      - webserver
```

### **5. Running the Containers**
Build and start them:

```sh
docker-compose up --build -d
```

Now, clients send requests to the **rate limiter container (port 8000)**, which forwards valid requests to the **web server container (port 8080)**.

---

This setup makes the rate limiter modular, so you can deploy it independently, scale it, and integrate caching like **Redis** for better performance. 
