# Jenkins Pipeline: Basic Setup Guide

## 🧩 Overview
A Jenkins pipeline automates the process of building, testing, and deploying software. It defines a series of steps in code, allowing for consistent and repeatable CI/CD workflows. This guide walks through creating a simple declarative pipeline using a `Jenkinsfile`.

---

## 🎯 Objectives
- Understand the structure of a Jenkins pipeline
- Create a `Jenkinsfile` for a basic build-test-deploy flow
- Configure a Jenkins job to use the pipeline
- Trigger builds automatically on code changes

---

## 🛠️ Prerequisites
- Jenkins installed and running (local or server)
- Git repository with source code
- Jenkins user with access to create jobs
- Basic knowledge of shell commands and Git

---

## 📁 Project Structure Example
```
my-app/
├── Jenkinsfile
├── src/
├── tests/
└── README.md
```

---

## 📄 Sample Jenkinsfile (Declarative Pipeline)
```groovy
pipeline {
    agent any

    environment {
        APP_ENV = 'development'
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/your-username/your-repo.git'
            }
        }

        stage('Build') {
            steps {
                echo 'Building the application...'
                sh 'make build' // or your build command
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                sh 'make test' // or pytest, npm test, etc.
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying application...'
                sh './deploy.sh' // or your deployment script
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
```

---

## ⚙️ Setting Up the Pipeline in Jenkins

### 1. **Create a New Pipeline Job**
- Go to Jenkins dashboard → **New Item**
- Enter a name → Select **Pipeline** → Click **OK**

### 2. **Configure the Job**
- Under **Pipeline** section:
  - Set **Definition** to “Pipeline script from SCM”
  - Choose **Git** and enter your repository URL
  - Set the script path to `Jenkinsfile`

### 3. **Save and Run**
- Click **Build Now** to trigger the pipeline
- View progress in the **Console Output**

---

## 🔍 Pipeline Stages Explained

| Stage     | Purpose                          |
|-----------|----------------------------------|
| Checkout  | Pulls the latest code from Git   |
| Build     | Compiles or prepares the app     |
| Test      | Runs automated tests             |
| Deploy    | Pushes code to staging/production|

---

## ✅ Best Practices
- Use environment variables for secrets and config
- Keep pipelines modular and readable
- Add notifications (Slack, email) in `post` block
- Use shared libraries for reusable logic

---

## 📚 Further Reading
- [Jenkins Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [Jenkins Declarative vs Scripted Pipelines](https://www.jenkins.io/doc/book/pipeline/pipeline-model/)
- [Jenkinsfile Best Practices](https://www.jenkins.io/blog/2020/05/06/pipeline-best-practices/)

---