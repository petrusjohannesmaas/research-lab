## Fluentd Log Aggregation

Here’s a basic tutorial to get you started with Fluentd on Ubuntu, including installation and log parsing setup 🛠️📄

## 🧰 Step 1: Install Fluentd (td-agent)

Fluentd’s stable distribution is called `td-agent`. Here’s how to install it:

### 1. Add the APT repository

```bash
curl -fsSL https://packages.treasuredata.com/GPG-KEY-td-agent | sudo apt-key add -
echo "deb https://packages.treasuredata.com/4/ubuntu/$(lsb_release -cs)/ $(lsb_release -cs) contrib" | sudo tee /etc/apt/sources.list.d/td-agent.list

```

### 2. Install td-agent

```bash
sudo apt-get update
sudo apt-get install td-agent

```

### 3. Start and enable the service

```bash
sudo systemctl start td-agent
sudo systemctl enable td-agent

```

---

## 🔍 Step 2: Basic Log Parsing Setup

Fluentd uses a config file at `/etc/td-agent/td-agent.conf`. Let’s set up a simple pipeline to parse logs from `/var/log/syslog`.

### Example Configuration:

```xml
<source>
  @type tail
  path /var/log/syslog
  pos_file /var/log/td-agent/syslog.pos
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
- **Match**: Outputs parsed logs to stdout (you’ll see them in `/var/log/td-agent/td-agent.log`).

---

## 🧪 Step 3: Test and Validate

- Check Fluentd status:
    
    ```bash
    sudo systemctl status td-agent
    
    ```
    
- View parsed logs:
    
    ```bash
    tail -f /var/log/td-agent/td-agent.log
    
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