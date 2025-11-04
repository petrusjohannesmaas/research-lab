# ELK Stack Deployment

---

## **Project Overview**
We'll build a system that:
1. **Deploys an API** that returns random data.
2. **Runs a script** that continuously sends requests to the API and logs responses.
3. **Processes and stores logs** using **Logstash & Elasticsearch**.
4. **Visualizes logs** using **Kibana dashboards**.

---

## **1. Set Up the ELK Stack**
We'll use **Docker Compose** to simplify deployment.

### **Create a `docker-compose.yml` file:**
```yaml
version: "3.8"
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.2.0
    container_name: elasticsearch
    environment:
      - discovery.type=single-node
    ports:
      - "9200:9200"

  logstash:
    image: docker.elastic.co/logstash/logstash:8.2.0
    container_name: logstash
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    depends_on:
      - elasticsearch
    ports:
      - "5044:5044"
      - "9600:9600"

  kibana:
    image: docker.elastic.co/kibana/kibana:8.2.0
    container_name: kibana
    depends_on:
      - elasticsearch
    ports:
      - "5601:5601"
```
---

## **2. Build the API**
Your **FastAPI** application will serve random data.

### **Create `api.py`:**
```python
from fastapi import FastAPI
import random

app = FastAPI()

@app.get("/data")
def get_data():
    return {
        "value": random.randint(1, 100),
        "status": "success"
    }
```
### **Run the API:**
```bash
uvicorn api:app --host 0.0.0.0 --port 8000
```
---

## **3. Create the Request-Logging Script**
This script continuously **sends requests to the API** and logs responses.

### **Create `log_requests.py`:**
```python
import requests
import time
import json

while True:
    response = requests.get("http://localhost:8000/data")
    log_entry = {
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "response": response.json()
    }
    with open("logs.json", "a") as log_file:
        log_file.write(json.dumps(log_entry) + "\n")
    time.sleep(5)
```
Run it:
```bash
python log_requests.py
```

---

## **4. Configure Logstash**
Logstash will **parse and send logs to Elasticsearch**.

### **Create `logstash.conf`:**
```bash
input {
    file {
        path => "/usr/share/logstash/logs.json"
        start_position => "beginning"
        codec => "json"
    }
}

output {
    elasticsearch {
        hosts => ["http://elasticsearch:9200"]
        index => "api_logs-%{+YYYY.MM.dd}"
    }
}
```

Start the ELK stack:
```bash
docker-compose up -d
```

---

## **5. Visualize Logs in Kibana**
1. Go to **http://localhost:5601**.
2. Set up an **index pattern** for `api_logs-*`.
3. Build **dashboards** to visualize:
   - API response trends
   - Errors or anomalies
   - Request frequencies

---

## **Next Steps**
- Improve **API logging** with request metadata.
- Deploy the system to a **cloud server** for real-world use.
- Use **Grafana** alongside Kibana for deeper monitoring.
