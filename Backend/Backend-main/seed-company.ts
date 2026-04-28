import mongoose from "mongoose";
import dotenv from "dotenv";
import Company from "./models/company.model.ts";
import PrepContent from "./models/prep-content.model.ts";
import InterviewExperience from "./models/interview-experience.model.ts";
import User from "./models/user.model.ts";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/beyondbasic";

async function seedCTS() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  // Ensure admin user exists
  let admin = await User.findOne({ role: "admin" });
  if (!admin) {
    const bcrypt = await import("bcryptjs");
    admin = await User.create({
      username: "admin",
      email: "admin@beyondbasic.com",
      password: await bcrypt.hash("Admin@123", 10),
      role: "admin",
    });
    console.log("Admin user created: admin@beyondbasic.com / Admin@123");
  }

  // Remove existing CTS data
  const existingCTS = await Company.findOne({ slug: "cts" });
  if (existingCTS) {
    await PrepContent.deleteMany({ company: existingCTS._id });
    await InterviewExperience.deleteMany({ company: existingCTS._id });
    await Company.deleteOne({ _id: existingCTS._id });
    console.log("Existing CTS data removed");
  }

  // ─── Create CTS Company ───────────────────────────────────────────────────
  const cts = await Company.create({
    name: "CTS",
    slug: "cts",
    type: "Service",
    color: "bg-sky-600",
    badge: "GenC Program",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-100",
    website: "https://www.cognizant.com",
    description:
      "Cognizant Technology Solutions (CTS) is one of the world's leading professional services companies, transforming clients' business, operating, and technology models for the digital era.",
    overview: `Cognizant (CTS) is a Fortune 200 company and one of the most sought-after employers for fresh graduates in India. Known for its GenC (Generate the Next) hiring program, CTS offers a structured on-campus recruitment process targeting engineering students.

With over 3.5 lakh employees globally and a strong presence in IT services, consulting, and business process services, CTS provides excellent opportunities for freshers across a wide range of technologies including Java, Python, .NET, cloud, and digital transformation.

**Why CTS?**
- One of the highest volume campus recruiters in India
- Structured onboarding via the GenC program
- Exposure to Fortune 500 clients worldwide
- Strong learning culture with Cognizant Academy resources`,
    hiringProcess: `CTS follows a well-defined campus hiring process for freshers. The GenC program specifically targets students from Tier 2 and Tier 3 colleges. Here's the complete hiring breakdown:

**Stage 1 – Online Assessment**
The aptitude round consists of three sections:
- Logical Reasoning (25 questions, 25 mins)
- Quantitative Aptitude (25 questions, 25 mins)
- English Communication (25 questions, 25 mins)

**Stage 2 – Coding Assessment (GenC)**
- 2 coding problems (45 minutes)
- Difficulty: Easy to Medium
- Languages allowed: C, C++, Java, Python
- Focus: Arrays, Strings, Basic Math

**Stage 3 – Technical Interview**
- 30–45 minutes with a technical panel
- OOPs concepts, DBMS, OS, DSA basics
- 1–2 coding problems on whiteboard/paper
- Projects discussion

**Stage 4 – HR Interview**
- 15–20 minutes
- Behavioural questions
- Location preference, bond acceptance
- Communication assessment`,
    hiringDetails: {
      ctc: "₹4.5 LPA (GenC) | ₹7 LPA (GenC Next) | ₹9 LPA (GenC Elevate)",
      roles: [
        "Programmer Analyst Trainee (GenC)",
        "Software Engineer (GenC Next)",
        "Senior Software Engineer (GenC Elevate)",
      ],
      eligibility: "60%+ in 10th, 12th, and Graduation. No active backlogs. B.E/B.Tech/MCA/M.Sc",
      locations: ["Chennai", "Pune", "Bangalore", "Hyderabad", "Mumbai", "Kolkata"],
      bond: "No bond for regular GenC role",
      selectionRate: "~10-15% of applicants",
    },
    rounds: [
      {
        name: "Aptitude Test",
        description:
          "Three-section online assessment: Logical Reasoning, Quantitative Aptitude, and English Communication. Conducted on AMCAT/CoCubes platform.",
        duration: "75 minutes",
        tips:
          "Focus on speed and accuracy. Practice number series, percentages, syllogisms, and reading comprehension. AMCAT mock tests are highly recommended.",
        order: 1,
      },
      {
        name: "Coding Test (GenC)",
        description:
          "Two coding problems on HackerRank. Problems range from easy to medium difficulty covering arrays, strings, math, and basic algorithms.",
        duration: "45 minutes",
        tips:
          "Practice Hackerrank Easy-Medium problems. Focus on correct output even with brute force. String manipulation and array problems are most common.",
        order: 2,
      },
      {
        name: "Technical Interview",
        description:
          "Face-to-face or virtual interview covering OOPs, DBMS, Operating System basics, and 1–2 coding problems. Projects from resume are also discussed.",
        duration: "30–45 minutes",
        tips:
          "Be thorough with OOPs concepts (inheritance, polymorphism, abstraction). Know SQL queries (joins, group by). Explain your projects confidently.",
        order: 3,
      },
      {
        name: "HR Interview",
        description:
          "Behavioural round assessing communication skills, team fit, and willingness to relocate. Includes questions on strengths, weaknesses, and career goals.",
        duration: "15–20 minutes",
        tips:
          "Dress formally, be confident and articulate. Prepare answers for 'Tell me about yourself', 'Why CTS?', and 'Where do you see yourself in 5 years?'",
        order: 4,
      },
    ],
    isPublished: true,
    order: 1,
  });

  console.log("CTS company created");

  // ─── Prep Content: Aptitude ───────────────────────────────────────────────
  await PrepContent.create({
    company: cts._id,
    category: "aptitude",
    title: "CTS Aptitude Test – Complete Guide",
    isPublished: true,
    order: 1,
    content: `## Overview
The CTS Aptitude Test has 3 sections conducted on AMCAT/CoCubes. You need to clear section-wise cutoffs.

---

## Section 1: Quantitative Aptitude (25 Qs / 25 min)

**High-weightage Topics:**
- **Percentages** – Profit/Loss, Discount, Tax calculations
- **Ratios & Proportions** – Mixtures, Alligation
- **Time & Work** – Pipes & Cisterns, Efficiency
- **Time, Speed & Distance** – Trains, Boats
- **Number System** – HCF, LCM, Divisibility
- **Simple & Compound Interest**
- **Permutations & Combinations**
- **Probability**

**Tips:**
- Aim for 20+ correct out of 25
- Use approximation for speed
- Don't spend more than 60 seconds on any single question
- Practice IndiaBix Quant section daily

---

## Section 2: Logical Reasoning (25 Qs / 25 min)

**High-weightage Topics:**
- **Number Series** – Find the next/missing number
- **Letter & Symbol Series**
- **Coding–Decoding**
- **Blood Relations**
- **Direction Sense**
- **Syllogisms** – Statements and conclusions
- **Seating Arrangement**
- **Data Sufficiency**

**Tips:**
- Number series is the easiest – never skip these
- For syllogisms, use Venn diagrams
- Practice 20 reasoning questions daily

---

## Section 3: English Communication (25 Qs / 25 min)

**High-weightage Topics:**
- **Reading Comprehension** (2–3 passages, ~10 questions)
- **Sentence Completion / Fill in the Blanks**
- **Para Jumbles**
- **Error Detection**
- **Synonyms & Antonyms**
- **Prepositions & Articles**

**Tips:**
- Read the questions first, then the passage
- Vocabulary – learn 10 new words daily
- Practice parajumbles on Gradeup/PrepInsta

---

## Recommended Practice Plan (2 Weeks)

| Day | Focus |
|-----|-------|
| 1–3 | Percentages, Profit/Loss, SI/CI |
| 4–5 | Number Series, Coding–Decoding |
| 6–7 | Reading Comprehension basics |
| 8–9 | Time-Work-Speed |
| 10–11 | Syllogisms, Blood Relations |
| 12–13 | Mock tests (AMCAT style) |
| 14 | Revision + 2 full mocks |`,
    resources: [
      { title: "AMCAT Sample Papers", url: "", type: "practice" },
      { title: "IndiaBix Quant Practice", url: "", type: "practice" },
      { title: "PrepInsta CTS Aptitude Questions", url: "", type: "article" },
      { title: "RS Aggarwal – Quantitative Aptitude", url: "", type: "book" },
    ],
  });

  // ─── Prep Content: Communication ─────────────────────────────────────────
  await PrepContent.create({
    company: cts._id,
    category: "communication",
    title: "CTS Communication & HR Round Guide",
    isPublished: true,
    order: 1,
    content: `## Why Communication Matters at CTS

CTS works with global Fortune 500 clients. Strong English communication is non-negotiable for client-facing roles. The HR round primarily evaluates:
- Clarity & fluency in spoken English
- Professional email & written communication
- Confidence and body language (for in-person/video)

---

## HR Round – Common Questions & Model Answers

### 1. Tell me about yourself.
**Structure:** Name → Education → Technical Skills → Projects → Why CTS

*Sample:* "My name is [Name]. I am a final year B.Tech student in Computer Science from [College]. I have strong skills in Java and Python, and have built two projects — a library management system and a weather app using React. I am keen to join CTS because of its structured GenC program and global exposure."

---

### 2. Why do you want to join CTS?
- Mention the GenC program specifically
- Talk about global client exposure
- Mention CTS Academy learning culture

---

### 3. Strengths & Weaknesses
**Strength:** Pick a relevant technical or soft skill and give an example
**Weakness:** Pick something real but mention steps you're taking to improve it

---

### 4. Where do you see yourself in 5 years?
Focus on growing within CTS — from GenC to GenC Next — and taking on leadership responsibilities.

---

### 5. Are you comfortable relocating?
Always say YES for freshers. Mention 2–3 preferred cities from CTS locations.

---

## Group Discussion Tips
CTS sometimes holds GD rounds. Tips:
- Initiate or summarise — both fetch points
- Use structured arguments: Point → Reason → Example
- Never shout or cut others off
- Use formal vocabulary

---

## Written Communication (Email Drafting)
Some CTS assessments include email drafting tasks:
- Use formal salutation (Dear Sir/Ma'am)
- Keep it concise — 3 paragraphs max
- Proofread for grammar errors
- End with "Regards, [Your Name]"`,
    resources: [
      { title: "Top 50 HR Interview Questions", url: "", type: "article" },
      { title: "CTS Group Discussion Topics 2024", url: "", type: "article" },
    ],
  });

  // ─── Prep Content: DSA ────────────────────────────────────────────────────
  await PrepContent.create({
    company: cts._id,
    category: "dsa",
    title: "CTS DSA & Coding Round – Topic-wise Guide",
    isPublished: true,
    order: 1,
    content: `## Coding Round Overview

CTS GenC coding round: **2 problems in 45 minutes** on HackerRank.
Difficulty: Easy–Medium. Partial marks are given, so always submit.

---

## Most Frequently Asked Topics

### 1. Arrays & Strings (40% of questions)
\`\`\`
- Reverse an array
- Find duplicate elements
- Rotate array by K positions
- Count vowels in a string
- Check if string is palindrome
- Anagram check
- First non-repeating character
\`\`\`

**Sample Problem:**
*Given an array of integers, find the second largest element.*
\`\`\`python
def second_largest(arr):
    arr = list(set(arr))
    arr.sort()
    return arr[-2] if len(arr) >= 2 else -1
\`\`\`

---

### 2. Number Theory (20% of questions)
\`\`\`
- Check prime
- Prime factorization
- GCD / LCM
- Armstrong number
- Fibonacci series
- Sum of digits
- Reverse a number
\`\`\`

**Sample Problem:**
*Print all prime numbers up to N*
\`\`\`python
def sieve(n):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False
    for i in range(2, int(n**0.5) + 1):
        if is_prime[i]:
            for j in range(i*i, n+1, i):
                is_prime[j] = False
    return [i for i in range(2, n+1) if is_prime[i]]
\`\`\`

---

### 3. Pattern Programs (15% of questions)
\`\`\`
- Floyd's Triangle
- Pascal's Triangle
- Star Pyramid
- Number patterns
\`\`\`

---

### 4. Searching & Sorting (15% of questions)
\`\`\`
- Binary Search
- Bubble Sort (know complexity)
- Count occurrences of an element
- Find missing number in 1..N
\`\`\`

---

### 5. Linked List & Stack Basics (10% of questions)
\`\`\`
- Reverse a linked list
- Detect loop in LL
- Valid parentheses using Stack
\`\`\`

---

## 30-Day CTS DSA Practice Plan

| Week | Topics |
|------|--------|
| 1 | Arrays, Strings, Basic Math |
| 2 | Searching, Sorting, Recursion |
| 3 | Linked Lists, Stacks, Queues |
| 4 | Mock tests on HackerRank |

---

## Key Points
- Always handle edge cases (empty array, single element)
- Write clean, readable code — comments help
- Partial scoring: even a brute force that passes 50% is better than nothing
- Python and Java are most popular choices at CTS`,
    resources: [
      { title: "HackerRank Easy Practice Problems", url: "", type: "practice" },
      { title: "GeeksforGeeks CTS Coding Questions", url: "", type: "article" },
      { title: "Striver's DSA Sheet", url: "", type: "practice" },
    ],
  });

  // ─── Prep Content: LLD ────────────────────────────────────────────────────
  await PrepContent.create({
    company: cts._id,
    category: "lld",
    title: "CTS Low Level Design – OOPs & Design Patterns",
    isPublished: true,
    order: 1,
    content: `## What LLD Means for CTS

For CTS freshers, LLD is tested primarily through OOP concepts in the Technical Interview round. You won't be asked to design complex systems, but you must be strong on:

---

## Core OOP Concepts (Must-Know)

### 1. Classes & Objects
\`\`\`java
class Car {
    String brand;
    int speed;

    Car(String brand, int speed) {
        this.brand = brand;
        this.speed = speed;
    }

    void accelerate() {
        speed += 10;
    }
}
\`\`\`

---

### 2. Inheritance
\`\`\`java
class Vehicle {
    void start() { System.out.println("Vehicle started"); }
}

class Car extends Vehicle {
    @Override
    void start() { System.out.println("Car started"); }
}
\`\`\`
**Types:** Single, Multi-level, Hierarchical, Hybrid

---

### 3. Polymorphism
- **Compile-time (Method Overloading):** Same name, different params
- **Runtime (Method Overriding):** Subclass provides specific implementation

---

### 4. Encapsulation
Private data + Public getters/setters — protects internal state.

---

### 5. Abstraction
- **Abstract class:** Can have concrete methods, cannot be instantiated
- **Interface:** All abstract by default (pre-Java 8), defines a contract

---

## Common Interview Questions

1. What is the difference between Abstract Class and Interface?
2. Explain method overloading vs overriding
3. What is the diamond problem in multiple inheritance?
4. What are access modifiers in Java?
5. Explain static and final keywords
6. What is a constructor? Types of constructors?

---

## Basic Design Patterns (Bonus)

### Singleton
Ensures only one instance of a class:
\`\`\`java
class Singleton {
    private static Singleton instance;
    private Singleton() {}

    public static Singleton getInstance() {
        if (instance == null) instance = new Singleton();
        return instance;
    }
}
\`\`\`

### Factory Pattern
Creates objects without specifying the exact class.

### Observer Pattern
One-to-many dependency; when one object changes, others are notified.

---

## DBMS Basics (Also asked in Technical Round)

\`\`\`sql
-- Basic Join
SELECT e.name, d.dept_name
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id;

-- Group By with Having
SELECT dept_id, COUNT(*) as emp_count
FROM employees
GROUP BY dept_id
HAVING COUNT(*) > 5;

-- Subquery
SELECT name FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
\`\`\`

**Key Concepts:** Normalization (1NF/2NF/3NF), ACID properties, Indexing, Transactions`,
    resources: [
      { title: "OOPs Concepts in Java – GeeksforGeeks", url: "", type: "article" },
      { title: "SQL Practice – HackerRank", url: "", type: "practice" },
      { title: "Design Patterns – Refactoring Guru", url: "", type: "article" },
    ],
  });

  // ─── Prep Content: HLD ────────────────────────────────────────────────────
  await PrepContent.create({
    company: cts._id,
    category: "hld",
    title: "CTS High Level Design – System Basics for Freshers",
    isPublished: true,
    order: 1,
    content: `## HLD Context for CTS Freshers

CTS freshers are not expected to design complex distributed systems. However, basic OS and networking concepts are frequently asked in the Technical Interview.

---

## Operating System Essentials

### Process vs Thread
| Feature | Process | Thread |
|---------|---------|--------|
| Memory | Separate address space | Shared |
| Overhead | High | Low |
| Communication | IPC required | Direct |
| Crash Impact | Isolated | Affects all threads |

### CPU Scheduling Algorithms
- **FCFS** – First Come First Served (simple, can have convoy effect)
- **SJF** – Shortest Job First (optimal average wait time)
- **Round Robin** – Time quantum based (used in modern OS)
- **Priority Scheduling** – Higher priority executes first

### Memory Management
- **Paging:** Fixed-size blocks (pages) mapped to frames
- **Segmentation:** Variable-size logical segments
- **Virtual Memory:** Illusion of large memory using disk
- **Page Replacement:** FIFO, LRU, Optimal

### Deadlock
Four conditions (Coffman): Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait
Prevention strategies: Banker's Algorithm, Resource Ordering

---

## Basic Networking Concepts

### OSI Model (7 Layers)
1. Physical → 2. Data Link → 3. Network → 4. Transport
5. Session → 6. Presentation → 7. Application

### TCP vs UDP
| TCP | UDP |
|-----|-----|
| Connection-oriented | Connectionless |
| Reliable, ordered | Fast, no guarantee |
| HTTP, FTP, SSH | DNS, Video streaming |

### HTTP Basics
- **GET** – Retrieve data
- **POST** – Send/create data
- **PUT/PATCH** – Update data
- **DELETE** – Remove data
- Status codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Server Error

---

## Basic Architecture Concepts

### Client-Server Architecture
Client sends request → Server processes → Returns response

### 3-Tier Architecture
Presentation (UI) → Business Logic (API) → Data (Database)

### REST API Design Principles
- Stateless
- Uniform interface
- Client-server separation
- Resource-based URLs (/users, /products)

---

## Frequently Asked HLD Questions at CTS

1. What is an Operating System?
2. Explain process scheduling with an example
3. What is a deadlock? How can you prevent it?
4. What is the difference between TCP and UDP?
5. Explain the client-server model
6. What is normalization in DBMS?
7. What is the difference between SQL and NoSQL?`,
    resources: [
      { title: "OS Concepts – Galvin Book Summary", url: "", type: "book" },
      { title: "Computer Networks – GeeksforGeeks", url: "", type: "article" },
      { title: "System Design Primer (Basics)", url: "", type: "article" },
    ],
  });

  console.log("CTS prep content created (5 categories)");

  // ─── Seed Interview Experiences ───────────────────────────────────────────
  // Use admin as placeholder author (real experiences come from students)
  const experiences = [
    {
      company: cts._id,
      author: admin!._id,
      authorName: "Priya S.",
      role: "Programmer Analyst Trainee",
      year: 2024,
      experience: `I got placed in CTS through on-campus recruitment in October 2023.

**Aptitude Round:** Pretty standard — focus on percentages, time-speed-distance, and number series. I practiced AMCAT mocks for 2 weeks and cleared it comfortably. The English section was the trickiest — reading comprehension passages were long.

**Coding Round:** Got two problems — reverse a string and find the second largest in an array. Solved both in Python in about 20 minutes. Make sure your basic I/O is perfect.

**Technical Interview:** The interviewer asked about OOPs (inheritance, polymorphism), a SQL join query, and asked me to explain my final year project. Then gave me a simple array problem. Be confident about your project — they probe deep.

**HR Round:** Standard questions — "Why CTS?", "Are you okay with relocation?", strength/weakness. I was honest and confident. Got the offer letter in 3 weeks.

Overall a smooth process. The key is consistency in aptitude practice and strong OOPs fundamentals.`,
      result: "selected",
      rounds: ["Aptitude Test", "Coding Test", "Technical Interview", "HR Interview"],
      tips: "Practice AMCAT mocks. Know your OOPs thoroughly. Be genuine in HR round.",
      isApproved: true,
    },
    {
      company: cts._id,
      author: admin!._id,
      authorName: "Rahul M.",
      role: "Programmer Analyst Trainee (GenC)",
      year: 2024,
      experience: `Attended CTS off-campus through their careers portal. The process took about 6 weeks from application to offer.

**Aptitude:** I used PrepInsta's CTS section specifically. The quant section had heavy focus on ratios and percentages. Logical reasoning had 3 seating arrangement questions — tricky ones!

**Coding:** One medium problem (two sum variant) and one easy string problem. I used Java. TIP: Use BufferedReader for faster input in Java — Scanner can cause TLE.

**Technical Interview (Video call):** The panel was friendly. Asked about SDLC, Agile vs Waterfall, then OOPs. Then gave me a coding problem — find common elements in two arrays. Solved it with HashSet.

**HR:** 15 minutes. They asked about my family background, why IT, and bond period. No bond for GenC regular!

Got my offer for ₹4.5 LPA. CTS is a great first company — the learning culture is excellent.`,
      result: "selected",
      rounds: ["Aptitude", "Coding", "Technical Interview", "HR"],
      tips: "Don't skip aptitude — that's the elimination round for most. Practice until you're fast.",
      isApproved: true,
    },
    {
      company: cts._id,
      author: admin!._id,
      authorName: "Sneha K.",
      role: "GenC Next – Software Engineer",
      year: 2023,
      experience: `I applied for GenC Next which is the higher track with ₹7 LPA CTC.

**GenC Next Assessment:** More complex coding — 3 problems in 60 minutes. I got a graph problem (BFS), a DP problem (coin change), and a string problem. The difficulty was definitely higher than regular GenC.

**Technical Round:** Two rounds back-to-back. First round was DSA focused — they asked me to implement LRU Cache and discuss time complexity. Second round was system design basics — how would you design a URL shortener at a high level.

**HR:** Same as regular but they also check if you know the difference between GenC and GenC Next roles.

I cleared all rounds and got the offer. GenC Next requires solid DSA — Striver's DSA sheet is what helped me the most.`,
      result: "selected",
      rounds: ["Online Assessment", "Technical Round 1 (DSA)", "Technical Round 2 (Design)", "HR"],
      tips: "For GenC Next, DSA depth matters. Practice medium-hard LeetCode problems.",
      isApproved: true,
    },
  ];

  await InterviewExperience.insertMany(experiences);
  console.log("CTS interview experiences seeded (3 approved)");

  console.log("\n✅ CTS seed completed successfully!");
  console.log("   Company slug: cts");
  console.log("   Prep categories: aptitude, communication, dsa, lld, hld");
  console.log("   Interview experiences: 3 (all approved)\n");

  await mongoose.disconnect();
}

seedCTS().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
