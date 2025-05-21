# Security Audit

A **security audit** systematically evaluates the security posture of a system or network to identify vulnerabilities, ensure compliance, and improve defenses. Here’s a structured approach:

### **1. Define the Scope**
- Determine what systems, networks, and policies need auditing.
- Identify compliance requirements (e.g., GDPR, PCI DSS, HIPAA).

### **2. Collect System Information**
- Gather logs (`syslog`, `auditd`, `journalctl`) and configurations (`/etc/security/`).
- Document installed software, firewall rules, and active services.

### **3. Perform Vulnerability Assessment**
- Use tools like:
  - **Lynis** (Linux security auditing)
  - **OpenVAS** (Network vulnerability scanner)
  - **Nmap** (Port scanning & service enumeration)
  - **Chkrootkit & ClamAV** (Malware detection)

### **4. Analyze Authentication & Access Control**
- Review **PAM** and authentication logs (`/var/log/auth.log`).
- Verify **LDAP or local user permissions** for unnecessary privileges.
- Test **password policies** and multi-factor authentication configurations.

### **5. Test Network Security**
- Scan for open ports and exposed services (`netstat`, `ss`).
- Review firewall rules (`iptables`, `nftables`).
- Analyze potential DNS leaks or misconfigurations.

### **6. Assess System Hardening**
- Check file permissions and SUID binaries (`find / -perm -4000`).
- Verify kernel hardening (`sysctl` settings for ASLR, TCP/IP stack security).
- Implement automated security patching (`unattended-upgrades`, `dnf-automatic`).

### **7. Review Logs & Intrusion Detection**
- Analyze failed login attempts (`lastb`, `grep "Failed password"` in logs).
- Configure log monitoring (`fail2ban`, `OSSEC`).
- Set up SIEM (Security Information and Event Management) for alerting.

### **8. Document Findings & Remediation Plan**
- Summarize security gaps, risk levels, and mitigation strategies.
- Implement continuous monitoring & automated compliance checks.

Since you're **security-conscious** and experienced in **automating system tasks**, scripting a **custom security audit tool** with automated logging and reporting might align well with your workflow. Would you like help structuring a Bash-based audit framework?