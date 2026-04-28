import mongoose from "mongoose";
import dotenv from "dotenv";
import slugify from "slugify";
import MockExam from "./models/mock-exam.model.ts";
import MockQuestion from "./models/mock-question.model.ts";

dotenv.config();

// ── 10 Aptitude Questions ─────────────────────────────────────────────────────
const aptitude = [
  {
    question: "A train 150 m long passes a pole in 15 seconds. What is the speed of the train?",
    options: ["8 m/s", "10 m/s", "12 m/s", "15 m/s"],
    correctAnswer: 1,
    explanation: "Speed = Distance / Time = 150 / 15 = 10 m/s.",
    difficulty: "Easy",
  },
  {
    question: "If 20% of a number is 80, what is 35% of that number?",
    options: ["120", "140", "160", "180"],
    correctAnswer: 1,
    explanation: "20% → 80, so 100% → 400. 35% of 400 = 140.",
    difficulty: "Easy",
  },
  {
    question: "A can do a job in 12 days and B in 18 days. How many days will they take together?",
    options: ["6 days", "7.2 days", "8 days", "9 days"],
    correctAnswer: 1,
    explanation: "Combined rate = 1/12 + 1/18 = 5/36 per day. Time = 36/5 = 7.2 days.",
    difficulty: "Medium",
  },
  {
    question: "What is the next number in the series: 2, 6, 12, 20, 30, ?",
    options: ["40", "42", "44", "48"],
    correctAnswer: 1,
    explanation: "Differences: 4, 6, 8, 10, 12. Next = 30 + 12 = 42.",
    difficulty: "Easy",
  },
  {
    question: "A shopkeeper sells a shirt at a 20% profit. If the cost price is ₹500, what is the selling price?",
    options: ["₹580", "₹590", "₹600", "₹620"],
    correctAnswer: 2,
    explanation: "SP = CP × (1 + profit%) = 500 × 1.20 = ₹600.",
    difficulty: "Easy",
  },
  {
    question: "Two pipes A and B can fill a tank in 20 and 30 minutes. If both are opened, how long to fill the tank?",
    options: ["10 min", "12 min", "15 min", "18 min"],
    correctAnswer: 1,
    explanation: "Rate = 1/20 + 1/30 = 5/60 = 1/12 per min. Time = 12 min.",
    difficulty: "Medium",
  },
  {
    question: "If the ratio of boys to girls in a class is 3:2 and there are 40 students total, how many girls are there?",
    options: ["12", "14", "16", "18"],
    correctAnswer: 2,
    explanation: "Girls = (2/5) × 40 = 16.",
    difficulty: "Easy",
  },
  {
    question: "What is the compound interest on ₹10,000 at 10% per annum for 2 years?",
    options: ["₹1,900", "₹2,000", "₹2,100", "₹2,200"],
    correctAnswer: 2,
    explanation: "CI = 10000 × (1.1² - 1) = 10000 × 0.21 = ₹2,100.",
    difficulty: "Medium",
  },
  {
    question: "A car travels 60 km in 1.5 hours. At the same speed, how far will it travel in 4 hours?",
    options: ["140 km", "150 km", "160 km", "180 km"],
    correctAnswer: 2,
    explanation: "Speed = 60/1.5 = 40 km/h. Distance = 40 × 4 = 160 km.",
    difficulty: "Easy",
  },
  {
    question: "If 5 workers complete a task in 8 days, how many days will 10 workers take (same efficiency)?",
    options: ["2 days", "3 days", "4 days", "5 days"],
    correctAnswer: 2,
    explanation: "Inversely proportional: 5×8 = 10×d → d = 4 days.",
    difficulty: "Easy",
  },
];

// ── 10 Communication Questions ────────────────────────────────────────────────
const communication = [
  {
    question: "Choose the word closest in meaning to 'ELOQUENT':",
    options: ["Silent", "Fluent and persuasive", "Confused", "Rude"],
    correctAnswer: 1,
    explanation: "'Eloquent' means well-spoken and persuasive in expression.",
    difficulty: "Easy",
  },
  {
    question: "Choose the antonym of 'BENEVOLENT':",
    options: ["Kind", "Generous", "Malevolent", "Helpful"],
    correctAnswer: 2,
    explanation: "'Benevolent' means kind/generous; its antonym is 'malevolent' (ill-wishing).",
    difficulty: "Easy",
  },
  {
    question: "Select the grammatically correct sentence:",
    options: [
      "Each of the students have submitted their assignment.",
      "Each of the students has submitted their assignment.",
      "Each of the students have submitted his assignment.",
      "Each of the students has submitted his assignment.",
    ],
    correctAnswer: 1,
    explanation: "'Each' is singular and takes a singular verb ('has'). 'Their' is acceptable as a gender-neutral pronoun.",
    difficulty: "Medium",
  },
  {
    question: "Fill in the blank: 'The committee _____ unable to reach a consensus.'",
    options: ["were", "was", "are", "have been"],
    correctAnswer: 1,
    explanation: "In British English both 'was/were' are acceptable, but in formal written English 'was' is preferred when treating the committee as a single unit.",
    difficulty: "Medium",
  },
  {
    question: "Identify the error: 'She insisted that he pays the bill immediately.'",
    options: [
      "She insisted",
      "that he pays",
      "the bill",
      "immediately",
    ],
    correctAnswer: 1,
    explanation: "After 'insisted that' use the subjunctive base form: 'he pay' (not 'pays').",
    difficulty: "Hard",
  },
  {
    question: "Choose the word that best completes: 'His _____ remarks offended everyone at the meeting.'",
    options: ["tactful", "diplomatic", "acerbic", "cordial"],
    correctAnswer: 2,
    explanation: "'Acerbic' means sharp/biting in tone, which fits 'offended everyone'.",
    difficulty: "Medium",
  },
  {
    question: "What does the idiom 'burn the midnight oil' mean?",
    options: [
      "To waste energy",
      "To work late into the night",
      "To cook something for too long",
      "To be very angry",
    ],
    correctAnswer: 1,
    explanation: "The idiom refers to working or studying very late at night, originally by lamplight.",
    difficulty: "Easy",
  },
  {
    question: "Choose the correctly punctuated sentence:",
    options: [
      "However the meeting was productive.",
      "However, the meeting was productive.",
      "However; the meeting was productive.",
      "However: the meeting was productive.",
    ],
    correctAnswer: 1,
    explanation: "A conjunctive adverb like 'however' starting a clause must be followed by a comma.",
    difficulty: "Easy",
  },
  {
    question: "Which sentence uses the passive voice correctly?",
    options: [
      "The manager was submitted the report by the team.",
      "The report was submitted by the team to the manager.",
      "The team submitted the report to the manager.",
      "The report submitted by the team.",
    ],
    correctAnswer: 1,
    explanation: "Passive: subject (report) + was/were + past participle (submitted) + by + agent.",
    difficulty: "Medium",
  },
  {
    question: "Select the word with the correct spelling:",
    options: ["Accomodate", "Accommodate", "Acommodate", "Accomadate"],
    correctAnswer: 1,
    explanation: "'Accommodate' has double 'c' and double 'm'. A commonly misspelled word.",
    difficulty: "Easy",
  },
];

// ── 10 Coding Questions (MCQ) ─────────────────────────────────────────────────
const coding = [
  {
    question: "What is the output of the following Python code?\n\nfor i in range(3):\n    print(i, end=' ')",
    options: ["0 1 2 3", "0 1 2", "1 2 3", "0 1"],
    correctAnswer: 1,
    explanation: "range(3) generates 0, 1, 2. end=' ' prints them on one line separated by spaces.",
    difficulty: "Easy",
  },
  {
    question: "What is the time complexity of binary search on a sorted array of n elements?",
    options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"],
    correctAnswer: 2,
    explanation: "Binary search halves the search space each iteration: T(n) = T(n/2) + O(1) → O(log n).",
    difficulty: "Easy",
  },
  {
    question: "Which data structure is used for BFS traversal of a graph?",
    options: ["Stack", "Queue", "Heap", "Linked List"],
    correctAnswer: 1,
    explanation: "BFS uses a Queue (FIFO) to process nodes level by level.",
    difficulty: "Easy",
  },
  {
    question: "What does the following function return?\n\ndef f(n):\n    if n <= 1: return n\n    return f(n-1) + f(n-2)\n\nprint(f(5))",
    options: ["3", "5", "8", "13"],
    correctAnswer: 1,
    explanation: "This is the Fibonacci function. f(5) = f(4)+f(3) = 3+2 = 5.",
    difficulty: "Medium",
  },
  {
    question: "What is the space complexity of Merge Sort?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 2,
    explanation: "Merge Sort requires O(n) auxiliary space for the temporary arrays during merging.",
    difficulty: "Medium",
  },
  {
    question: "Which of the following is NOT a property of a Binary Search Tree (BST)?",
    options: [
      "Left child < Parent",
      "Right child > Parent",
      "In-order traversal gives sorted output",
      "All levels must be completely filled",
    ],
    correctAnswer: 3,
    explanation: "BSTs do not need to be complete or balanced. A BST only requires the ordering property.",
    difficulty: "Easy",
  },
  {
    question: "What is the output?\n\narr = [1, 2, 3]\narr.append(arr)\nprint(len(arr))",
    options: ["3", "4", "6", "Error"],
    correctAnswer: 1,
    explanation: "arr.append(arr) appends the list itself as a single element. len(arr) becomes 4.",
    difficulty: "Hard",
  },
  {
    question: "Which sorting algorithm has the best average-case time complexity?",
    options: ["Bubble Sort", "Selection Sort", "Quick Sort", "Insertion Sort"],
    correctAnswer: 2,
    explanation: "Quick Sort has O(n log n) average-case complexity, same as Merge Sort but with better cache performance.",
    difficulty: "Medium",
  },
  {
    question: "In OOP, what is 'method overriding'?",
    options: [
      "Defining two methods with the same name but different parameters in the same class",
      "A subclass providing its own implementation of a method defined in the parent class",
      "Calling a parent class method from a child class",
      "Hiding a method by making it private",
    ],
    correctAnswer: 1,
    explanation: "Method overriding is when a subclass redefines a parent method with the same signature.",
    difficulty: "Easy",
  },
  {
    question: "What does 'git rebase' do compared to 'git merge'?",
    options: [
      "Creates a merge commit preserving branch history",
      "Rewrites commit history to create a linear history",
      "Deletes the feature branch after merging",
      "Reverts the last commit",
    ],
    correctAnswer: 1,
    explanation: "rebase replays commits on top of another branch, creating a cleaner linear history without a merge commit.",
    difficulty: "Medium",
  },
];

// ── 10 SQL Questions ──────────────────────────────────────────────────────────
const sql = [
  {
    question: "Which SQL clause is used to filter rows AFTER aggregation?",
    options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
    correctAnswer: 1,
    explanation: "HAVING filters after GROUP BY aggregation; WHERE filters before aggregation.",
    difficulty: "Easy",
  },
  {
    question: "What is the output of: SELECT COUNT(*) FROM employees WHERE salary > 50000; — if no rows match?",
    options: ["NULL", "0", "Error", "Empty set"],
    correctAnswer: 1,
    explanation: "COUNT(*) always returns an integer (0) even when no rows match — it never returns NULL.",
    difficulty: "Easy",
  },
  {
    question: "Which JOIN returns all rows from the LEFT table and matching rows from the RIGHT table?",
    options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
    correctAnswer: 1,
    explanation: "LEFT JOIN returns all rows from the left table; non-matching rows on the right have NULLs.",
    difficulty: "Easy",
  },
  {
    question: "Which of the following creates a unique constraint on a column?",
    options: [
      "CREATE INDEX idx ON t(col);",
      "ALTER TABLE t ADD UNIQUE(col);",
      "ALTER TABLE t ADD PRIMARY(col);",
      "CREATE CONSTRAINT ON t(col);",
    ],
    correctAnswer: 1,
    explanation: "ALTER TABLE ... ADD UNIQUE(col) creates a unique constraint that prevents duplicate values.",
    difficulty: "Medium",
  },
  {
    question: "What does the following query return?\nSELECT dept, AVG(salary) FROM emp GROUP BY dept HAVING AVG(salary) > 60000;",
    options: [
      "All departments",
      "Departments where average salary exceeds 60000",
      "Employees earning above 60000",
      "Total average salary per company",
    ],
    correctAnswer: 1,
    explanation: "HAVING AVG(salary) > 60000 filters groups (departments) where the average salary exceeds 60000.",
    difficulty: "Medium",
  },
  {
    question: "Which SQL function returns the number of characters in a string?",
    options: ["SIZE()", "COUNT()", "LEN() / LENGTH()", "CHAR()"],
    correctAnswer: 2,
    explanation: "LEN() in SQL Server and LENGTH() in MySQL/PostgreSQL return the character count of a string.",
    difficulty: "Easy",
  },
  {
    question: "What is a PRIMARY KEY?",
    options: [
      "A column that can have duplicate values",
      "A column or set of columns that uniquely identifies each row and cannot be NULL",
      "A foreign key reference to another table",
      "An index that speeds up queries",
    ],
    correctAnswer: 1,
    explanation: "A PRIMARY KEY must be UNIQUE and NOT NULL; it uniquely identifies every row in the table.",
    difficulty: "Easy",
  },
  {
    question: "Which statement is used to remove a table and all its data permanently?",
    options: ["DELETE TABLE", "REMOVE TABLE", "TRUNCATE TABLE", "DROP TABLE"],
    correctAnswer: 3,
    explanation: "DROP TABLE removes the table structure AND all data permanently. TRUNCATE only removes data.",
    difficulty: "Easy",
  },
  {
    question: "What does 'SELECT DISTINCT' do?",
    options: [
      "Returns only the first row",
      "Removes duplicate rows from the result set",
      "Selects rows with unique primary keys",
      "Orders results alphabetically",
    ],
    correctAnswer: 1,
    explanation: "DISTINCT eliminates duplicate rows — each combination of selected columns appears only once.",
    difficulty: "Easy",
  },
  {
    question: "Which type of index is automatically created when you define a PRIMARY KEY?",
    options: ["Non-clustered index", "Clustered index", "Bitmap index", "Hash index"],
    correctAnswer: 1,
    explanation: "Defining a PRIMARY KEY automatically creates a CLUSTERED index on that column(s).",
    difficulty: "Hard",
  },
];

// ── Seed ──────────────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(process.env.MONGO_URI!);
  console.log("Connected to MongoDB");

  const examSlug = "full-stack-placement-mock-1";
  await MockExam.deleteOne({ slug: examSlug });
  await MockQuestion.deleteMany({});  // clear all questions for a clean seed
  console.log("Cleared old mock data");

  const exam = await MockExam.create({
    title:        "Full Stack Placement Mock #1",
    slug:         examSlug,
    description:  "A comprehensive placement preparation test covering Aptitude, Communication, Coding concepts, and SQL — modelled on real placement drives by top companies.",
    instructions: "• 40 questions across 4 sections (10 each)\n• Duration: 60 minutes\n• No negative marking\n• Each correct answer carries 1 mark\n• You can switch between sections freely\n• Once submitted, you cannot retake this test",
    duration:     60,
    banner:       "from-violet-600 to-purple-700",
    isPublished:  true,
    totalQuestions: 40,
    passingScore: 60,
    tags:         ["Placement", "Aptitude", "SQL", "Coding", "Communication"],
  });

  const allSections = [
    { section: "aptitude",      qs: aptitude },
    { section: "communication", qs: communication },
    { section: "coding",        qs: coding },
    { section: "sql",           qs: sql },
  ];

  let totalInserted = 0;
  for (const { section, qs } of allSections) {
    const docs = qs.map((q, i) => ({ ...q, exam: exam._id, section, order: i + 1 }));
    await MockQuestion.insertMany(docs);
    console.log(`  ✓ ${section}: ${docs.length} questions`);
    totalInserted += docs.length;
  }

  console.log(`\nExam: "${exam.title}"`);
  console.log(`  Slug:       ${exam.slug}`);
  console.log(`  Duration:   60 minutes`);
  console.log(`  Questions:  ${totalInserted}`);
  console.log(`  Passing:    60%`);
  console.log(`  Published:  yes`);
  console.log("\nDone! Run the backend and visit /mock-assessments to see it.");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
