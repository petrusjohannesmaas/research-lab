## Fluentd Log Aggregation

Here’s a basic tutorial to get up and running with Fluentd on Ubuntu, including installation and log parsing setup 🛠️📄

## 🧰 Step 1: Install Fluentd

Fluentd’s documentation recommends to use the `fluent-d` package instead of the deprecated `td-agent`. Here’s how to install it:

### 1. Run the installation script

```bash
curl -fsSL https://fluentd.cdn.cncf.io/sh/install-ubuntu-jammy-fluent-package6-lts.sh | sh
```

### 2. Start and enable the service

```bash
sudo systemctl start fluentd
sudo systemctl enable fluentd
```

---

## 🔍 Step 2: Basic Log Parsing Setup

Fluentd uses a config file at `/etc/fluent/fluentd.conf`. Let’s set up a simple pipeline to parse logs from `/var/log/syslog`.

### Example Configuration:

```xml
<source>
  @type tail
  path /var/log/syslog
  pos_file /var/log/fluent/syslog.pos
  tag syslog
  format syslog
</source>

<filter syslog>
  @type record_transformer
  <record>
    hostname "#{Socket.gethostname}"
    parsed_time ${time}
  </record>
</filter>

<match syslog>
  @type stdout
</match>

```

### What This Does:

- **Source**: Tails the syslog file.
- **Filter**: Adds hostname and parsed timestamp.
- **Match**: Outputs parsed logs to stdout (you’ll see them in `/var/log/fluent/syslog.pos`).

---

## 🧪 Step 3: Test and Validate

- Check Fluentd status:
    
    ```bash
    sudo systemctl status fluentd
    
    ```
    
- View parsed logs:
    
    ```bash
    tail -f /var/log/fluentd/syslog.log
    
    ```
    
- Validate config:
    
    ```bash
    td-agent --dry-run -c /etc/td-agent/td-agent.conf
    
    ```
    

---

## 📦 Bonus: Install Plugins

Want to send logs to Elasticsearch or S3?

```bash
sudo td-agent-gem install fluent-plugin-elasticsearch
sudo td-agent-gem install fluent-plugin-s3

```

---

## 📚 Resources

- [Fluentd Official Getting Started Guide](https://docs.fluentd.org/0.12/quickstart/getting-started) [Fluentd](https://docs.fluentd.org/0.12/quickstart/getting-started)
- [Step-by-Step Installation Tutorial](https://www.everythingdevops.dev/blog/fluentd-installation) [Everything DevOps](https://www.everythingdevops.dev/blog/fluentd-installation)
- [Linux Quickstart Tutorial](https://ioflood.com/blog/install-fluentd-linux/) [IOFLOOD](https://ioflood.com/blog/install-fluentd-linux/)