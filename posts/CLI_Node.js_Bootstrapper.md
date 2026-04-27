---
title: "CLI Node.js Bootstrapper"
description: "A utility for quickly scaffolding new Node.js command-line interface projects."
slug: "cli-node-js-bootstrapper"
date: "2024-07-29"
tags: ['NodeJS', 'CLI', 'Automation']
author: "Petrus Johannes Maas"
---

# CLI Node.js Bootstrapper

## Overview
This CLI tool automates the creation of starter templates for JavaScript projects in any directory you navigate to. It streamlines your setup process, including git initialization, README creation, and unzipping of prebuilt starter templates and empowers you to code anywhere you are, regardless of internet connection!

### Why?
I was going to spend an extended period of time in an area that had **no internet** connection, but I wanted to be sure that my local development processes won't be interrupted. This helps me package the dependencies and then speeds up the actual development with a **simple CLI interface**.

## Features
1. **Dynamic Project Initialization**:
   - Prompts the user for project name and starter template selection.
   - Automatically creates a project folder and initializes a Git repository.
   - Creates a `README.md` and `gitignore` file

2. **Starter Template Integration**:
   - Unzips a selected starter template from the predefined Templates directory into the current working directory. *(See bottom of the document to learn how to make your own)*

3. **Bash Alias**:
   - Add a bash alias (`new-project`) for easy access to the script from any directory.

## Prerequisites
1. **Linux Environment**:
   - Ensure you're running a Linux distribution (e.g., Debian, Ubuntu) or even better, to install this in something like [Distrobox](https://distrobox.it/), so that you can sandbox the `npm` packages associated with these dependencies

2. **Node.js**:
   - Install Node.js (version 16 or later recommended).
   - Install npm dependencies:
     ```bash
     npm install inquirer
     ```

3. **Unzip Utility**:
   - Install the `unzip` package:
     ```bash
     sudo apt install unzip
     ```

3. **Templates Directory**:
   - Place your starter project `.zip` files in the Templates folder. For example:
     ```
     /home/your-username/Templates/
     ├── FullStackStarter.zip
     ├── APIStarter.zip
     ├── CLIStarter.zip
     ├── RelationalStarter.zip
     ```

## Future Enhancements
- Add support for additional languages (Python + Go).
- Improve error handling and logging.
- Include validation checks for project name and directory existence.


## ️ Setup Instructions

#### 1. **Script Configuration**
Update the script with the hardcoded path to your Templates folder:
```javascript
const templatesFolder = '/home/pjmaas/Templates/';
```

#### 2. **Create a Bash Alias**
Add a bash alias to simplify running the script:
1. Open your `.bashrc` file:
   ```bash
   nano ~/.bashrc
   ```
2. Add the alias:
   ```bash
   alias new-project="node /path/to/starter.js"
   ```
3. Save and reload:
   ```bash
   source ~/.bashrc
   ```

#### 3. **Run the Script**
Navigate to the desired folder and execute:
```bash
new-project
```

### How It Works:
1. **User Input**:
   The script uses `inquirer` to prompt:
   - **Project Name**: The name of your project.
   - **Starter Template**: Choose a starter template (e.g., FullStackStarter, APIStarter).

2. **Project Setup**:
   - Creates a new folder named after the project.
   - Initializes a Git repository and creates a `README.md` file with basic content.
   - Adds `gitignore` file
   - Commits the initial setup to the repository.

3. **Starter Integration**:
   - Unzips the selected starter template from the Templates folder into the newly created project folder.

## Troubleshooting
1. **Inquirer Issues**:
   - If `inquirer.prompt` isn't recognized, ensure the correct version is installed:
     ```bash
     npm install inquirer@latest
     ```

2. **Unzip Errors**:
   - Ensure the `unzip` package is installed and working:
     ```bash
     sudo apt install unzip
     ```

3. **Permissions**:
   - Ensure the script has permissions to create folders and execute commands in the target directory.


## Breakdown of my starter packages
##### **FullStackStarter**
- **Purpose**: Full-stack project with MongoDB, Express, and EJS.
- **Includes**:
  - `express`, `mongoose`, `ejs`, `dotenv`.

##### **APIStarter**
- **Purpose**: Development API starter using JSON-Server.
- **Includes**:
  - `json-server`, `faker`.

##### **CLIStarter**
- **Purpose**: Command Line Interface (CLI) tool using `inquirer`.
- **Includes**:
  - `inquirer`.

##### **RelationalStarter**
- **Purpose**: Relational database project using Express, PostgreSQL, and EJS.
- **Includes**:
  - `express`, `postgres`, `ejs`, `dotenv`.


## ️ Creating your own starter packages (Templates) with preinstalled NPM packages

#### Set Up a Clean Project Directory
1. Create a new folder for your starter template:
   ```bash
   mkdir my-starter-template && cd my-starter-template
   ```

2. Initialize a new Node.js project:
   ```bash
   npm init -y
   ```

#### Install Required Dependencies
Install any NPM packages your starter project needs. For example:
   ```bash
   npm install express mongoose dotenv
   ```
To include development dependencies:
   ```bash
   npm install nodemon eslint --save-dev
   ```

#### Clean Up Unnecessary Files
1. Ensure that `node_modules` is ignored to keep future projects clean:
   ```bash
   echo "node_modules\n.env\n" > .gitignore
   ```

2. Verify all necessary files are present:
   ```bash
   ls -la
   ```

#### Zip the Project
1. Navigate **outside** the template folder:
   ```bash
   cd ..
   ```

2. Create a zipped archive of the directory:
   ```bash
   zip -r my-starter-template.zip my-starter-template
   ```

#### Store the Zipped Template
Move the zip file to your predefined `Templates` directory:
   ```bash
   mv my-starter-template.zip /home/your-username/Templates/
   ```

Now, your starter template is ready to be used. Just update the `starter.js` file with your template names and get coding.

## Disclaimer & Intent 

This project was developed for **research and portfolio purposes**. The
primary goal is to explore architectural patterns and software systems.
It is provided for educational and demonstration purposes.

## License
Copyright © 2026 [Petrus Johannes Maas](https://github.com/petrusjohannesmaas)

Licensed under the **Apache License, Version 2.0**. You may obtain a copy of the License at:
http://www.apache.org/licenses/LICENSE-2.0

### Third-Party Attribution
All included dependencies and libraries are the property of their respective owners and are used according to their original licensing terms.