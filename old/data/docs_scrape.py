import os
import re
import requests
from urllib.parse import urlparse

# ---- CONFIG ----
OUTPUT_DIR = "output"
BASE_RAW = "https://raw.githubusercontent.com/petrusjohannesmaas/research-lab/main/"
TOKEN = None  # optional GitHub token

os.makedirs(OUTPUT_DIR, exist_ok=True)

HEADERS = {"Accept": "application/vnd.github.v3.raw"}
if TOKEN:
    HEADERS["Authorization"] = f"token {TOKEN}"


# ---- INPUT JSON ----
data = [
    {
        "title": "Dummy Systemd Service",
        "link": "https://github.com/petrusjohannesmaas/roadmap.sh/tree/main/dummy-systemd-service",
        "tier": "Testing",
        "skill": "Shell (Bash)",
    },
    {
        "title": "Web Server Utilities",
        "link": "https://github.com/petrusjohannesmaas/server-stats/",
        "tier": "Beginner",
        "skill": "Shell (Bash)",
    },
    {
        "title": "Encrypted Database Backup Scripts",
        "link": "https://github.com/petrusjohannesmaas/encrypted-database-backup-scripts",
        "tier": "Intermediate",
        "skill": "Shell (Bash)",
    },
    {
        "title": "Linux User Management Tool",
        "link": "https://github.com/petrusjohannesmaas/user-mgmt-tool",
        "tier": "Advanced",
        "skill": "Shell (Bash)",
    },
    {
        "title": "Basic Dockerfile",
        "link": "https://github.com/petrusjohannesmaas/roadmap.sh/tree/main/basic-dockerfile",
        "tier": "Testing",
        "skill": "Docker",
    },
    {
        "title": "Development Database Deploy-er",
        "link": "https://github.com/petrusjohannesmaas/dev-database-deployer",
        "tier": "Beginner",
        "skill": "Docker",
    },
    {
        "title": "API Containerfile Templates",
        "link": "https://github.com/petrusjohannesmaas/api-containerfile-templates",
        "tier": "Intermediate",
        "skill": "Docker",
    },
    {
        "title": "Docker Swarm Deployment",
        "link": "./projects/docker_swarm_deployment.md",
        "tier": "Advanced",
        "skill": "Docker",
    },
    {
        "title": "Blue-Green Deployment",
        "link": "https://github.com/petrusjohannesmaas/roadmap.sh/tree/main/blue-green-deployment",
        "tier": "Testing",
        "skill": "Kubernetes",
    },
    {
        "title": "Rolling Deployments",
        "link": "https://github.com/petrusjohannesmaas/research-lab/blob/main/projects/rolling_deployments_with_k3s.md",
        "tier": "Beginner",
        "skill": "Kubernetes",
    },
    {
        "title": "K3S Cluster on openSUSE MicroOS",
        "link": "https://github.com/petrusjohannesmaas/research-lab/blob/main/projects/opensuse_k3s_cluster.md",
        "tier": "Intermediate",
        "skill": "Kubernetes",
    },
    {
        "title": "Vagrantfile Configurations",
        "link": "https://github.com/petrusjohannesmaas/research-lab/blob/main/projects/vagrant.md",
        "tier": "Testing",
        "skill": "Virtualization",
    },
    {
        "title": "Kubernetes Vagrant Box",
        "link": "https://github.com/petrusjohannesmaas/kubernetes-vagrant-box",
        "tier": "Beginner",
        "skill": "Virtualization",
    },
    {
        "title": "Netdata Monitoring Dashboard",
        "link": "https://github.com/petrusjohannesmaas/roadmap.sh/tree/main/simple-monitoring",
        "tier": "Testing",
        "skill": "Monitoring & Logging",
    },
    {
        "title": "Prometheus + Grafana",
        "link": "https://github.com/petrusjohannesmaas/research-lab/blob/main/projects/prometheus_grafana.md",
        "tier": "Beginner",
        "skill": "Monitoring & Logging",
    },
    {
        "title": "Fluentd Log Aggregation",
        "link": "https://github.com/petrusjohannesmaas/research-lab/blob/projects/fluentd_log_aggregation.md",
        "tier": "Intermediate",
        "skill": "Monitoring & Logging",
    },
    {
        "title": "Elastic Stack Deployment",
        "link": "https://github.com/petrusjohannesmaas/research-lab/blob/main/projects/elk_stack_deployment.md",
        "tier": "Advanced",
        "skill": "Monitoring & Logging",
    },
    {
        "title": "CLI Node.js Bootstrapper",
        "link": "https://github.com/petrusjohannesmaas/cli-nodejs-bootstrapper",
        "tier": "Testing",
        "skill": "JavaScript",
    },
    {
        "title": "WebSocket Broadcast Server",
        "link": "https://github.com/petrusjohannesmaas/websocket-broadcast-server",
        "tier": "Beginner",
        "skill": "JavaScript",
    },
    {
        "title": "PostgreSQL Authentication Template",
        "link": "https://github.com/petrusjohannesmaas/research-lab/blob/main/projects/postgresql_authentication",
        "tier": "Intermediate",
        "skill": "JavaScript",
    },
    {
        "title": "JWT Authentication Service",
        "link": "https://github.com/petrusjohannesmaas/research-lab/blob/main/projects/jwt_authentication_service.md",
        "tier": "Advanced",
        "skill": "JavaScript",
    },
    {
        "title": "Caching Proxy",
        "link": "https://github.com/petrusjohannesmaas/caching-proxy",
        "tier": "Testing",
        "skill": "Go",
    },
    {
        "title": "JSON API Server",
        "link": "https://github.com/petrusjohannesmaas/research-lab/blob/main/projects/json_api_server.md",
        "tier": "Beginner",
        "skill": "Go",
    },
    {
        "title": "Rate Limiter Service",
        "link": "https://github.com/petrusjohannesmaas/research-lab/blob/main/projects/rate_limiter_service.md",
        "tier": "Intermediate",
        "skill": "Go",
    },
    {
        "title": "URL Shortener Service",
        "link": "https://github.com/petrusjohannesmaas/roadmap.sh/tree/main/url-shortener",
        "tier": "Testing",
        "skill": "Python",
    },
    {
        "title": "Log File Monitor",
        "link": "https://github.com/petrusjohannesmaas/research-lab/blob/main/projects/log_file_monitor.md",
        "tier": "Beginner",
        "skill": "Python",
    },
    {
        "title": "Employee Management System",
        "link": "https://github.com/petrusjohannesmaas/employee_mgmt_sys",
        "tier": "Intermediate",
        "skill": "Python",
    },
    {
        "title": "Intrusion Detection System (IDS)",
        "link": "https://github.com/petrusjohannesmaas/intrusion-detection-system",
        "tier": "Advanced",
        "skill": "Python",
    },
    {
        "title": "SSH Remote Server Setup (with Fail2Ban)",
        "link": "https://github.com/petrusjohannesmaas/roadmap.sh/tree/main/ssh-remote-server-setup",
        "tier": "Testing",
        "skill": "System Administration",
    },
    {
        "title": "Log Archive Tool",
        "link": "https://github.com/petrusjohannesmaas/roadmap.sh/tree/main/log-archive-tool",
        "tier": "Beginner",
        "skill": "System Administration",
    },
    {
        "title": "Client Side (Front-end)",
        "link": "https://github.com/petrusjohannesmaas/research-lab/blob/main/projects/client_side.md",
        "tier": "Testing",
        "skill": "Web Development",
    },
    {
        "title": "Server Side (Back-end)",
        "link": "https://github.com/petrusjohannesmaas/research-lab/blob/main/projects/server_side.md",
        "tier": "Beginner",
        "skill": "Web Development",
    },
    {
        "title": "Full Stack Deployment",
        "link": "https://github.com/petrusjohannesmaas/research-lab/blob/main/projects/full_stack.md",
        "tier": "Intermediate",
        "skill": "Web Development",
    },
    {
        "title": "Joe's Coffee",
        "link": "https://github.com/petrusjohannesmaas/joes-coffee",
        "tier": "Advanced",
        "skill": "Web Development",
    },
    {
        "title": "PPPoE Client Configuration",
        "link": "https://github.com/petrusjohannesmaas/research-lab/blob/main/projects/pppoe_client_config.md",
        "tier": "Testing",
        "skill": "Networking",
    },
    {
        "title": "Mikrotik Router Configuration Utility",
        "link": "https://github.com/petrusjohannesmaas/python/tree/main/mikrotik/hapac2",
        "tier": "Beginner",
        "skill": "Networking",
    },
    {
        "title": "YAML DNS Server",
        "link": "https://github.com/petrusjohannesmaas/dns-server",
        "tier": "Intermediate",
        "skill": "Networking",
    },
    {
        "title": "Kubernetes Overlay Network Benchmarking",
        "link": "https://github.com/petrusjohannesmaas/research-lab/blob/main/projects/kubernetes_overlay_network_benchmarking.md",
        "tier": "Advanced",
        "skill": "Networking",
    },
    {
        "title": "Jenkins Pipeline",
        "link": "https://github.com/petrusjohannesmaas/research-lab/blob/main/projects/jenkins_pipeline.md",
        "tier": "Testing",
        "skill": "CI/CD",
    },
    {
        "title": "Multi Stage Container Build Pipeline",
        "link": "https://github.com/petrusjohannesmaas/research-lab/blob/main/projects/multi_stage_container_build_pipeline.md",
        "tier": "Beginner",
        "skill": "CI/CD",
    },
    {
        "title": "Automated API Testing Framework",
        "link": "https://github.com/petrusjohannesmaas/research-lab/blob/main/projects/automated_api_testing_framework.md",
        "tier": "Intermediate",
        "skill": "CI/CD",
    },
    {
        "title": "Azure CI/CD Pipeline with Jenkins",
        "link": "https://github.com/petrusjohannesmaas/research-lab/blob/main/projects/microsoft_azure_pipeline_with_jenkins.md",
        "tier": "Advanced",
        "skill": "CI/CD",
    },
    {
        "title": "Server Hardening Configuration",
        "link": "https://github.com/petrusjohannesmaas/research-lab/blob/main/projects/automated_debian_server_provisioning.md",
        "tier": "Intermediate",
        "skill": "Ansible",
    },
    {
        "title": "Proxmox Automation",
        "link": "https://github.com/petrusjohannesmaas/research-lab/blob/main/projects/proxmox_automation.md",
        "tier": "Testing",
        "skill": "Terraform",
    },
    {
        "title": "Azure Resource Provisioning",
        "link": "https://github.com/petrusjohannesmaas/research-lab/blob/main/projects/azure_resource_provisioning.md",
        "tier": "Beginner",
        "skill": "Terraform",
    },
]


# ---- HELPERS ----
def sanitize_filename(name):
    return re.sub(r"[^\w\-. ]", "", name).replace(" ", "_")


def resolve_relative(url):
    if url.startswith("./"):
        return BASE_RAW + url.replace("./", "")
    return url


def github_blob_to_raw(url):
    return url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/")


def extract_repo(url):
    parts = urlparse(url).path.strip("/").split("/")
    if len(parts) >= 2:
        return parts[0], parts[1]
    return None, None


def fetch_readme(owner, repo):
    url = f"https://api.github.com/repos/{owner}/{repo}/readme"
    r = requests.get(url, headers=HEADERS)

    if r.status_code == 200:
        return r.text
    elif r.status_code == 404:
        return None  # no README
    else:
        print(f"  [WARN] API error {r.status_code} for {owner}/{repo}")
        return None


def fetch_direct(url):
    r = requests.get(url)
    return r.text if r.status_code == 200 else None


def resolve_and_fetch(link):
    link = resolve_relative(link)

    # Direct markdown
    if link.endswith(".md"):
        if "github.com" in link:
            link = github_blob_to_raw(link)
        return fetch_direct(link)

    # GitHub repo
    if "github.com" in link:
        owner, repo = extract_repo(link)
        if owner and repo:
            return fetch_readme(owner, repo)

    return None


# ---- MAIN ----
failed = []

for item in data:
    title = item["title"]
    link = item["link"]

    filename = sanitize_filename(title) + ".md"
    path = os.path.join(OUTPUT_DIR, filename)

    print(f"\n[PROCESS] {title}")

    content = resolve_and_fetch(link)

    if content:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  [OK] saved → {filename}")
    else:
        print(f"  [MISSING] No README or markdown found")
        failed.append({"title": title, "link": link})


# ---- SUMMARY ----
print("\n\n===== SUMMARY =====")

if failed:
    print(f"\n⚠️  {len(failed)} items need manual sourcing:\n")
    for item in failed:
        print(f"- {item['title']} → {item['link']}")
else:
    print("✅ All items successfully fetched")
