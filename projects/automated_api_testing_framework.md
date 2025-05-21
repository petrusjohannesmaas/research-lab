# Automated API Testing Framework

An **Automated API Testing Framework** using Bash, `curl`, and `jq` can help you streamline API testing and ensure consistent results.

---

### **1. Set Up the Bash Script**
You'll write a script to send API requests, validate responses, and log results.

#### **Example: Basic API Request & Validation**
```bash
#!/bin/bash

API_URL="https://api.example.com/resource"
EXPECTED_STATUS=200

# Make the API request
RESPONSE=$(curl -s -o response.json -w "%{http_code}" "$API_URL")
STATUS_CODE=$RESPONSE

# Validate response code
if [[ "$STATUS_CODE" -eq "$EXPECTED_STATUS" ]]; then
    echo "✅ API response is valid ($STATUS_CODE)"
else
    echo "❌ API response failed ($STATUS_CODE)"
    exit 1
fi

# Validate JSON structure using jq
if jq -e '.data.id and .data.name' response.json >/dev/null; then
    echo "✅ JSON structure is valid"
else
    echo "❌ JSON validation failed"
    exit 1
fi
```

---

### **2. Extend with Authentication & Headers**
If your API requires authentication, you can modify the request:
```bash
curl -s -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" "$API_URL"
```

For **OAuth-based APIs**, automate token retrieval:
```bash
TOKEN=$(curl -s -X POST "https://api.example.com/auth" -d "client_id=yourclient&client_secret=yoursecret" | jq -r '.access_token')
```

---

### **3. Automate API Calls in a CI Pipeline**
- Place your script inside `tests/api_tests.sh`
- Define CI/CD jobs to run API tests automatically:

#### **Example: GitHub Actions Pipeline**
```yaml
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Run API tests
        run: bash tests/api_tests.sh
```

---

### **4. Enhance Logging & Alerts**
- Log test results into a file:
  ```bash
  echo "$(date): API Test Passed" >> api_test.log
  ```
- Send failure alerts via a webhook:
  ```bash
  curl -X POST -H "Content-Type: application/json" -d '{"message": "API Test Failed!"}' "https://hooks.example.com/alert"
  ```

---

### **5. Expand with Additional Tests**
- Test **performance**: Measure response time with `time curl`
- Validate **response format**: Check if JSON matches a predefined schema
- Handle **edge cases**: Simulate failures like **timeouts** or invalid data

---

Since you're already experienced in **Bash scripting, security, and API development**, you might enjoy enhancing this framework with **encrypted logs** or integrating it with **Podman for isolated API testing environments**. Want to explore custom extensions for it?