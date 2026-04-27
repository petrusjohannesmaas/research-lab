export interface StudyPlanTopic {
  level: string;
  topics: string[];
}

export interface StudyGuide {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  overview: string[];
  specs: {
    label: string;
    value: string;
  }[];
  studyPlan: StudyPlanTopic[];
}

export const studyGuides: StudyGuide[] = [
  {
    id: 'javascript',
    title: 'Javascript',
    category: 'Web Development',
    description: 'The programming language of the Web. Master everything from DOM manipulation to modern ES6+ features and async programming.',
    icon: 'javascript',
    overview: [
      'JavaScript (JS) is a lightweight, interpreted, or just-in-time compiled programming language with first-class functions.',
      'While it is most well-known as the scripting language for Web pages, many non-browser environments also use it, such as Node.js, Apache CouchDB and Adobe Acrobat.',
      'JavaScript is a prototype-based, multi-paradigm, single-threaded, dynamic language, supporting object-oriented, imperative, and declarative (e.g. functional programming) styles.'
    ],
    specs: [
      { label: 'Type', value: 'Multi-paradigm, Dynamic' },
      { label: 'Origin', value: '1995' },
      { label: 'Creator', value: 'Brendan Eich' },
      { label: 'Current', value: 'ECMAScript 2023' }
    ],
    studyPlan: [
      {
        level: 'Beginner',
        topics: [
          'Variables and Data Types',
          'Basic Operators and Math',
          'String Manipulation',
          'Control Flow (if/else, switch)',
          'Loops (for, while)',
          'Functions (Declarations and Expressions)',
          'Basic Arrays and Methods',
          'Basic Objects',
          'The DOM (Document Object Model)',
          'Basic Event Handling'
        ]
      },
      {
        level: 'Intermediate',
        topics: [
          'Scope and Closures',
          'Hoisting',
          'Arrow Functions',
          'Advanced Array Methods (map, filter, reduce)',
          'Object Destructuring and Spread Operator',
          'Template Literals',
          'Error Handling (try/catch)',
          'Asynchronous JavaScript (Callbacks)',
          'Promises',
          'Fetch API'
        ]
      },
      {
        level: 'Advanced',
        topics: [
          'Async / Await',
          'The Event Loop and Concurrency Model',
          'Prototypes and Prototypal Inheritance',
          'Classes (ES6)',
          'Modules (import/export)',
          'Web Storage API (localStorage, sessionStorage)',
          'Regular Expressions',
          'Functional Programming Concepts',
          'Currying and Partial Application',
          'Generators and Iterators'
        ]
      },
      {
        level: 'Expert',
        topics: [
          'Design Patterns in JavaScript',
          'Memory Management and Garbage Collection',
          'Web Workers',
          'Service Workers and PWA',
          'WebSockets',
          'Performance Optimization',
          'Writing Custom Babel Plugins',
          'Understanding the V8 Engine',
          'WebAssembly (Wasm) Integration',
          'Advanced Metaprogramming (Proxies and Reflect)'
        ]
      }
    ]
  },
  {
    id: 'python',
    title: 'Python',
    category: 'Software Engineering',
    description: 'A versatile, high-level programming language. From scripting and automation to data science and backend web development.',
    icon: 'terminal',
    overview: [
      'Python is a high-level, general-purpose programming language. Its design philosophy emphasizes code readability with the use of significant indentation.',
      'Python is dynamically typed and garbage-collected. It supports multiple programming paradigms, including structured (particularly procedural), object-oriented and functional programming.',
      'It is often described as a "batteries included" language due to its comprehensive standard library.'
    ],
    specs: [
      { label: 'Type', value: 'Multi-paradigm, Dynamic' },
      { label: 'Origin', value: '1991' },
      { label: 'Creator', value: 'Guido van Rossum' },
      { label: 'Current', value: 'Python 3.x' }
    ],
    studyPlan: [
      {
        level: 'Beginner',
        topics: [
          'Syntax and Variables',
          'Basic Data Types (Integers, Strings, Floats, Booleans)',
          'Basic Operators',
          'Control Flow (if, elif, else)',
          'Loops (for, while)',
          'Functions (def)',
          'Lists and Tuples',
          'Dictionaries and Sets',
          'Basic File I/O',
          'Error Handling (try, except)'
        ]
      },
      {
        level: 'Intermediate',
        topics: [
          'List Comprehensions',
          'Lambda Functions',
          'Modules and Packages',
          'Virtual Environments (venv, pip)',
          'Object-Oriented Programming (Classes, Objects, Inheritance)',
          'File Handling (JSON, CSV)',
          'Regular Expressions (re module)',
          'Iterators and Generators',
          'Decorators',
          'Working with APIs (requests)'
        ]
      },
      {
        level: 'Advanced',
        topics: [
          'Advanced OOP (Multiple Inheritance, Metaclasses)',
          'Context Managers (with statement)',
          'Concurrency and Parallelism (threading, multiprocessing)',
          'Asynchronous Programming (asyncio)',
          'Testing (unittest, pytest)',
          'Database Interaction (SQLAlchemy, psycopg2)',
          'Web Scraping (BeautifulSoup, Selenium)',
          'Functional Programming in Python (map, filter, reduce)',
          'Type Hinting',
          'Memory Management and Profiling'
        ]
      },
      {
        level: 'Expert',
        topics: [
          'CPython Internals',
          'Writing C Extensions for Python',
          'Advanced Design Patterns',
          'Optimizing Python Code (Cython, PyPy)',
          'Advanced Concurrency Models',
          'Building Large-Scale Applications',
          'Security Best Practices',
          'Data Science Stack Deep Dive (NumPy, Pandas, Scikit-learn)',
          'Machine Learning/Deep Learning (TensorFlow, PyTorch)',
          'Contributing to Open Source Python Projects'
        ]
      }
    ]
  },
  {
    id: 'solidity',
    title: 'Solidity',
    category: 'Blockchain',
    description: 'The primary language for smart contract development on Ethereum. Build decentralized applications and trustless systems.',
    icon: 'token',
    overview: [
      'Solidity is a programming language for implementing smart contracts on various blockchain platforms, most notably, Ethereum.',
      'It was designed by Gavin Wood and developed by Christian Reitwiessner, Alex Beregszaszi, and several former Ethereum core contributors. Programs in Solidity run on Ethereum Virtual Machine or on compatible virtual machines.',
      'Solidity was proposed in August 2014 by Gavin Wood. It is the primary language used to develop smart contracts for Ethereum as well as other private blockchains, such as the enterprise-oriented Hyperledger Fabric blockchain.'
    ],
    specs: [
      { label: 'Type', value: 'Statically typed, Smart Contract' },
      { label: 'Origin', value: '2014' },
      { label: 'Creator', value: 'Gavin Wood' },
      { label: 'Current', value: 'Solidity 0.8.x' }
    ],
    studyPlan: [
      {
        level: 'Beginner',
        topics: [
          'Introduction to Blockchain and Ethereum',
          'Setting up the Development Environment',
          'Basic Syntax and Hello World in Solidity',
          'Data Types and Variables',
          'Basic Operators',
          'Control Structures (if, else, for, while)',
          'Functions',
          'Arrays and Structs',
          'Mappings',
          'Events',
          'Modifiers',
          'Error Handling'
        ]
      },
      {
        level: 'Intermediate',
        topics: [
          'Smart Contract Architecture',
          'Inheritance',
          'Interfaces and Abstract Contracts',
          'Libraries',
          'Visibility and Access Control',
          'Function Overloading',
          'Constructor Functions',
          'Fallback Functions',
          'Storage vs Memory',
          'Gas Optimization',
          'Unit Testing with Truffle',
          'Deploying Smart Contracts'
        ]
      },
      {
        level: 'Advanced',
        topics: [
          'Advanced Data Structures',
          'Advanced Functionality with Assembly',
          'Security Best Practices',
          'Reentrancy Attacks',
          'Oracle and Chainlink Integration',
          'ERC-20 and ERC-721 Token Standards',
          'Building Decentralized Applications (DApps)',
          'Interacting with Smart Contracts',
          'Upgradable Smart Contracts',
          'Gas Optimization Techniques',
          'Advanced Testing and Debugging'
        ]
      },
      {
        level: 'Expert',
        topics: [
          'Advanced Design Patterns',
          'Smart Contract Auditing',
          'Formal Verification',
          'Optimizing for Gas Costs',
          'Advanced Security Considerations',
          'Zero-Knowledge Proofs',
          'Layer 2 Scaling Solutions',
          'Cross-Chain Interactions',
          'Governance Models',
          'Building Complex DApps',
          'DeFi Protocols',
          'DAOs (Decentralized Autonomous Organizations)'
        ]
      }
    ]
  },
  {
    id: 'linux',
    title: 'Linux',
    category: 'Operating Systems',
    description: 'The open-source kernel that powers the world. From embedded systems to global cloud infrastructure, master the terminal and system administration.',
    icon: 'computer',
    overview: [
      'Linux is a family of open-source Unix-like operating systems based on the Linux kernel, an operating system kernel first released on September 17, 1991, by Linus Torvalds.',
      'Linux is typically packaged as a Linux distribution (distro), which includes the kernel and supporting system software and libraries—most of which are provided by third parties—to create a complete operating system.',
      'Popular Linux distributions include Debian, Fedora Linux, Linux Mint, Arch Linux, and Ubuntu. Linux is one of the most prominent examples of free and open-source software collaboration.'
    ],
    specs: [
      { label: 'Type', value: 'Unix-like, Open-source' },
      { label: 'Origin', value: '1991' },
      { label: 'Creator', value: 'Linus Torvalds' },
      { label: 'Current', value: 'Varies by distribution' }
    ],
    studyPlan: [
      {
        level: 'Beginner',
        topics: [
          'Introduction to Linux',
          'Installing Linux (Various Distributions)',
          'Basic Command Line Usage',
          'File System Navigation',
          'File and Directory Management',
          'Understanding File Permissions',
          'Editing Files with Nano and Vim',
          'Basic Networking Commands',
          'Managing Processes',
          'Package Management (APT, YUM)'
        ]
      },
      {
        level: 'Intermediate',
        topics: [
          'User and Group Management',
          'Advanced File Permissions (ACLs)',
          'Shell Scripting Basics',
          'Cron Jobs and Scheduling Tasks',
          'Disk Management and Partitioning',
          'File Systems and Storage (ext4, xfs, etc.)',
          'System Monitoring and Performance Tuning',
          'Network Configuration and Troubleshooting',
          'Firewall Configuration (iptables, firewalld)',
          'Basic System Security'
        ]
      },
      {
        level: 'Advanced',
        topics: [
          'Advanced Shell Scripting',
          'Systemd and Service Management',
          'Log Management and Analysis',
          'Kernel Modules and Tuning',
          'RAID Configuration',
          'LVM (Logical Volume Management)',
          'SELinux and AppArmor',
          'Advanced Networking Concepts (VLANs, Bonding)',
          'NFS and Samba File Sharing',
          'Backup and Recovery Strategies'
        ]
      },
      {
        level: 'Expert',
        topics: [
          'High Availability and Clustering',
          'Virtualization (KVM, QEMU)',
          'Containerization (Docker, LXC)',
          'Orchestration (Kubernetes, OpenShift)',
          'Advanced Security Practices',
          'Automating Infrastructure with Ansible/Puppet/Chef',
          'Linux Kernel Development',
          'Advanced Networking (SDN, NFV)',
          'Performance Optimization at Scale',
          'Linux in the Cloud (AWS, Azure, GCP)'
        ]
      }
    ]
  },
  {
    id: 'databases',
    title: 'Databases',
    category: 'Data Management',
    description: 'The foundation of any application. Master the art of data storage, from relational SQL systems to scalable NoSQL architectures.',
    icon: 'database',
    overview: [
      'In computing, a database is an organized collection of data or a type of data store based on the use of a database management system (DBMS). The DBMS software interacts with end users, applications, and the database itself to capture and analyze the data.',
      'Small databases can be stored on a file system, while large databases are hosted on computer clusters or cloud storage.',
      'Relational databases became dominant in the 1980s, while non-relational (NoSQL) databases became popular in the 2000s for handling unstructured data and scale.'
    ],
    specs: [
      { label: 'Preferred Model', value: 'MariaDB (Relational)' },
      { label: 'Models', value: 'Relational, NoSQL, Graph' },
      { label: 'Query Languages', value: 'SQL, NoSQL, GraphQL' },
      { label: 'Scale', value: 'Local to Distributed' }
    ],
    studyPlan: [
      {
        level: 'Beginner',
        topics: [
          'Introduction to Databases',
          'Types of Databases (Relational, NoSQL)',
          'Database Terminology (Tables, Rows, Columns)',
          'Basic SQL Syntax',
          'Creating and Modifying Tables',
          'Inserting, Updating, and Deleting Data',
          'Basic SELECT Queries',
          'Simple WHERE Clauses',
          'Basic Data Types',
          'Database Design Principles'
        ]
      },
      {
        level: 'Intermediate',
        topics: [
          'Advanced SELECT Queries (JOINs, Subqueries)',
          'Indexes and Performance Tuning',
          'Transactions and ACID Properties',
          'Stored Procedures and Functions',
          'Views and Materialized Views',
          'Normalization and Denormalization',
          'Backup and Restore Strategies',
          'User Roles and Permissions',
          'Database Security',
          'NoSQL Databases (MongoDB, Cassandra)'
        ]
      },
      {
        level: 'Advanced',
        topics: [
          'Advanced Query Optimization',
          'Partitioning and Sharding',
          'Replication and High Availability',
          'Database Scaling Strategies',
          'Data Warehousing',
          'ETL (Extract, Transform, Load) Processes',
          'Data Modeling and Schema Design',
          'Full-Text Search',
          'JSON and XML Data Handling',
          'Database Monitoring and Maintenance'
        ]
      },
      {
        level: 'Expert',
        topics: [
          'Distributed Databases',
          'Graph Databases (Neo4j)',
          'Time-Series Databases (InfluxDB)',
          'Columnar Databases',
          'Real-Time Analytics',
          'Big Data Technologies (Hadoop, Spark)',
          'Database-as-a-Service (DBaaS)',
          'Advanced Security Practices',
          'Machine Learning with Databases',
          'Emerging Trends in Database Technology'
        ]
      }
    ]
  },
  {
    id: 'containerization',
    title: 'Containerization',
    category: 'DevOps',
    description: 'The standard for modern application deployment. Package your code and dependencies into portable, isolated containers for consistent performance across any environment.',
    icon: 'boxes',
    overview: [
      'In software engineering, containerization is operating-system–level virtualization or application-level virtualization over multiple network resources so that software applications can run in isolated user spaces called containers.',
      'Each container is basically a fully functional and portable computing environment surrounding the application and keeping it independent of other environments running in parallel. Multiple containers share a common operating system kernel, making them lightweight compared to virtual machines.',
      'Containerization technology has been widely adopted by cloud computing platforms and for rapid software development and fielding.'
    ],
    specs: [
      { label: 'Type', value: 'OS-level Virtualization' },
      { label: 'Common Platforms', value: 'Docker, Podman, LXC' },
      { label: 'Orchestration', value: 'Kubernetes, Swarm' },
      { label: 'Environment', value: 'Cloud & On-premise' }
    ],
    studyPlan: [
      {
        level: 'Beginner',
        topics: [
          'Introduction to Containerization',
          'Installing Docker',
          'Basic Docker Commands',
          'Creating and Managing Docker Containers',
          'Docker Images and Dockerfile',
          'Volumes and Persistent Storage',
          'Docker Networking Basics',
          'Docker Compose for Multi-Container Applications',
          'Introduction to Container Orchestration'
        ]
      },
      {
        level: 'Intermediate',
        topics: [
          'Advanced Docker Commands',
          'Dockerfile Best Practices',
          'Managing Docker Logs',
          'Docker Swarm Basics',
          'Introduction to Kubernetes',
          'Kubernetes Architecture',
          'Kubernetes Components (Pods, Deployments, Services)',
          'Kubernetes ConfigMaps and Secrets',
          'Kubernetes Networking'
        ]
      },
      {
        level: 'Advanced',
        topics: [
          'Advanced Docker Networking',
          'Docker Security Best Practices',
          'Kubernetes Resource Management',
          'Kubernetes Scheduling and Taints/Tolerations',
          'Kubernetes Persistent Volumes',
          'Service Mesh with Istio',
          'Monitoring and Logging with Prometheus and Grafana',
          'Helm for Kubernetes Package Management',
          'CI/CD with Jenkins and Kubernetes',
          'Kubernetes Operators'
        ]
      },
      {
        level: 'Expert',
        topics: [
          'Cluster Management and Scaling',
          'High Availability in Kubernetes',
          'Cluster Federation',
          'Disaster Recovery and Backup Strategies',
          'Advanced Security in Kubernetes',
          'Custom Resource Definitions (CRDs) and API Extensions',
          'Performance Tuning and Optimization',
          'Building and Managing Multi-Cloud Kubernetes Clusters',
          'Hybrid Cloud Deployments',
          'Emerging Trends in Containerization and Clustering'
        ]
      }
    ]
  }
];
