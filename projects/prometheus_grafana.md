# Prometheus + Grafana

## 🧩 Overview
Prometheus is an open-source monitoring system that collects metrics from configured targets at regular intervals. Grafana is a visualization tool that connects to Prometheus and displays metrics in customizable dashboards.

---

## 🛠️ Prerequisites
- Linux server (Ubuntu 20.04+ recommended)
- Root or sudo access
- Internet connection
- Basic knowledge of system administration

---

## 📦 Step 1: Install Prometheus

### 🔧 Download and Extract
```bash
wget https://github.com/prometheus/prometheus/releases/latest/download/prometheus-*.tar.gz
tar xvf prometheus-*.tar.gz
cd prometheus-*
```

### 📁 Directory Setup
- `prometheus`: binary
- `promtool`: config checker
- `prometheus.yml`: main config file

### 📝 Sample `prometheus.yml`
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']
```

---

## 📦 Step 2: Install Node Exporter (for system metrics)
```bash
wget https://github.com/prometheus/node_exporter/releases/latest/download/node_exporter-*.tar.gz
tar xvf node_exporter-*.tar.gz
cd node_exporter-*
./node_exporter &
```

---

## 🚀 Step 3: Run Prometheus
```bash
./prometheus --config.file=prometheus.yml
```
- Access Prometheus UI: `http://localhost:9090`

---

## 📦 Step 4: Install Grafana

### 🧰 Install via APT (Ubuntu)
```bash
sudo apt-get install -y apt-transport-https
sudo apt-get install -y software-properties-common
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -
echo "deb https://packages.grafana.com/oss/deb stable main" | sudo tee /etc/apt/sources.list.d/grafana.list
sudo apt update
sudo apt install grafana
```

### 🚀 Start Grafana
```bash
sudo systemctl start grafana-server
sudo systemctl enable grafana-server
```
- Access Grafana UI: `http://localhost:3000`
- Default login: `admin / admin`

---

## 🔗 Step 5: Connect Prometheus to Grafana

### 📡 Add Data Source
1. Go to Grafana → **Settings → Data Sources**
2. Choose **Prometheus**
3. Set URL: `http://localhost:9090`
4. Click **Save & Test**

---

## 📊 Step 6: Create Dashboards
- Use built-in panels or import community dashboards from [Grafana Labs](https://grafana.com/grafana/dashboards/)
- Example metrics:
  - CPU usage: `node_cpu_seconds_total`
  - Memory: `node_memory_MemAvailable_bytes`
  - Disk I/O: `node_disk_io_time_seconds_total`

---

## ✅ Best Practices
- Use systemd services for Prometheus and Node Exporter
- Secure Grafana with HTTPS and user roles
- Set up alerting rules in Prometheus
- Backup Grafana dashboards and Prometheus data

---

## 📚 References
- [Grafana Docs](https://grafana.com/docs/grafana/latest/getting-started/get-started-grafana-prometheus/)
- [Cherry Servers Setup Guide](https://www.cherryservers.com/blog/set-up-grafana-with-prometheus)
- [Linode Ubuntu Setup](https://www.linode.com/docs/guides/how-to-install-prometheus-and-grafana-on-ubuntu/)

---