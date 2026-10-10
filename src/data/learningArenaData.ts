// ============================================================
// EduGuard AI — Learning Arena Mock Data Layer
// Supports 4 Subjects: DBMS, DSA, Operating Systems, Computer Networks
// ============================================================

export type TopicStatus = "LOCKED" | "AVAILABLE" | "CURRENT" | "COMPLETED";

export interface MissionQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TopicMission {
  id: string;
  title: string;
  description: string;
  questions: MissionQuestion[];
}

export interface TopicNode {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  x: number; // Canvas X coordinate (px inside 1600px width canvas)
  y: number; // Canvas Y coordinate (px inside 1000px height canvas)
  xp: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
  prerequisites: string[]; // Topic IDs required before unlocking
  missions: TopicMission[];
  category?: string;
}

export interface SubjectWorld {
  id: string;
  name: string;
  shortName: string;
  description: string;
  iconName: string;
  colorTheme: {
    primary: string;
    light: string;
    border: string;
    gradient: string;
    accent: string;
  };
  topics: TopicNode[];
}

export const subjectWorlds: SubjectWorld[] = [
  // ─── 1. DATABASE MANAGEMENT SYSTEMS (DBMS) ───
  {
    id: "dbms",
    name: "Database Management Systems",
    shortName: "DBMS World",
    description: "Master relational models, SQL queries, normalization, transactions, and query optimization.",
    iconName: "Database",
    colorTheme: {
      primary: "#0EA5E9",
      light: "#F0F9FF",
      border: "#BAE6FD",
      gradient: "from-sky-500 to-indigo-600",
      accent: "#38BDF8",
    },
    topics: [
      {
        id: "dbms-1",
        title: "Database Fundamentals",
        shortTitle: "1. DBMS Intro",
        description: "Core concepts of DBMS vs File Systems, data independence, and 3-schema architecture.",
        x: 180,
        y: 480,
        xp: 50,
        difficulty: "Beginner",
        estimatedMinutes: 15,
        prerequisites: [],
        missions: [
          {
            id: "m-dbms-1",
            title: "Fundamentals Mission",
            description: "Test your knowledge of core database architecture concepts.",
            questions: [
              {
                id: "q1",
                question: "Which level of database abstraction defines HOW data is actually stored on disk?",
                options: ["External Level", "Conceptual Level", "Physical Level", "Logical Level"],
                correctIndex: 2,
                explanation: "The Physical Level describes the low-level data structures and actual storage files on disk.",
              },
              {
                id: "q2",
                question: "What is a major advantage of DBMS over traditional file processing systems?",
                options: ["Data Redundancy", "Data Independence & Centralized Control", "Manual Backup", "No Multi-user Access"],
                correctIndex: 1,
                explanation: "DBMS eliminates data redundancy and provides data independence and multi-user concurrency control.",
              },
            ],
          },
        ],
      },
      {
        id: "dbms-2",
        title: "Relational Data Model",
        shortTitle: "2. Relational Model",
        description: "Tables, tuples, attributes, primary keys, candidate keys, and foreign key constraints.",
        x: 360,
        y: 320,
        xp: 60,
        difficulty: "Beginner",
        estimatedMinutes: 20,
        prerequisites: ["dbms-1"],
        missions: [
          {
            id: "m-dbms-2",
            title: "Relational Schema Challenge",
            description: "Understand primary keys, foreign keys, and referential integrity.",
            questions: [
              {
                id: "q1",
                question: "Which key uniquely identifies a tuple in a relation and cannot contain NULL values?",
                options: ["Foreign Key", "Primary Key", "Secondary Key", "Super Key"],
                correctIndex: 1,
                explanation: "A Primary Key uniquely identifies each tuple and enforces Entity Integrity (cannot be NULL).",
              },
              {
                id: "q2",
                question: "Referential integrity requires that a foreign key value must match an existing primary key or be...",
                options: ["Zero", "NULL", "Negative", "String"],
                correctIndex: 1,
                explanation: "Foreign keys must either match a valid primary key value in the referenced table or be NULL.",
              },
            ],
          },
        ],
      },
      {
        id: "dbms-3",
        title: "SQL Basics & DDL",
        shortTitle: "3. SQL Basics",
        description: "CREATE, ALTER, DROP, INSERT, UPDATE, and DELETE operations in SQL.",
        x: 540,
        y: 560,
        xp: 65,
        difficulty: "Beginner",
        estimatedMinutes: 20,
        prerequisites: ["dbms-2"],
        missions: [
          {
            id: "m-dbms-3",
            title: "SQL Syntax Practice",
            description: "Master DDL and DML commands.",
            questions: [
              {
                id: "q1",
                question: "Which command is used to modify the structure of an existing database table?",
                options: ["UPDATE", "MODIFY", "ALTER TABLE", "CHANGE"],
                correctIndex: 2,
                explanation: "ALTER TABLE is the DDL command used to add, delete, or modify columns in an existing table.",
              },
              {
                id: "q2",
                question: "Which SQL clause filters rows before aggregation occurs?",
                options: ["HAVING", "WHERE", "ORDER BY", "GROUP BY"],
                correctIndex: 1,
                explanation: "WHERE filters individual rows before grouping, while HAVING filters aggregated groups.",
              },
            ],
          },
        ],
      },
      {
        id: "dbms-4",
        title: "SQL Queries & Filtering",
        shortTitle: "4. SQL Filtering",
        description: "WHERE, LIKE, IN, BETWEEN, ORDER BY, and NULL value handling.",
        x: 720,
        y: 340,
        xp: 70,
        difficulty: "Intermediate",
        estimatedMinutes: 25,
        prerequisites: ["dbms-3"],
        missions: [
          {
            id: "m-dbms-4",
            title: "Filtering Mastery",
            description: "Practice complex SQL filter conditions.",
            questions: [
              {
                id: "q1",
                question: "Which operator matches a string pattern starting with 'A' in SQL?",
                options: ["LIKE 'A%'", "LIKE '%A'", "LIKE '_A'", "MATCH 'A*'"],
                correctIndex: 0,
                explanation: "The % wildcard represents zero or more characters, so LIKE 'A%' matches anything starting with A.",
              },
            ],
          },
        ],
      },
      {
        id: "dbms-5",
        title: "SQL Joins & Multi-Table",
        shortTitle: "5. SQL Joins",
        description: "INNER JOIN, LEFT OUTER JOIN, RIGHT OUTER JOIN, FULL JOIN, and Self Joins.",
        x: 900,
        y: 600,
        xp: 80,
        difficulty: "Intermediate",
        estimatedMinutes: 30,
        prerequisites: ["dbms-4"],
        missions: [
          {
            id: "m-dbms-5",
            title: "Relational Joins Challenge",
            description: "Master multi-table relational join queries.",
            questions: [
              {
                id: "q1",
                question: "Which SQL Join returns all rows from the left table, and matching rows from the right table?",
                options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "CROSS JOIN"],
                correctIndex: 1,
                explanation: "LEFT JOIN returns all records from the left table, with NULLs for non-matching right records.",
              },
              {
                id: "q2",
                question: "What is the result of a CROSS JOIN between a table with 5 rows and a table with 4 rows?",
                options: ["9 rows", "20 rows", "5 rows", "0 rows"],
                correctIndex: 1,
                explanation: "A CROSS JOIN produces a Cartesian product: 5 × 4 = 20 rows.",
              },
            ],
          },
        ],
      },
      {
        id: "dbms-6",
        title: "Aggregation & GROUP BY",
        shortTitle: "6. Aggregations",
        description: "COUNT, SUM, AVG, MIN, MAX, GROUP BY, and HAVING clause filters.",
        x: 1080,
        y: 380,
        xp: 75,
        difficulty: "Intermediate",
        estimatedMinutes: 25,
        prerequisites: ["dbms-5"],
        missions: [
          {
            id: "m-dbms-6",
            title: "GROUP BY Challenge",
            description: "Aggregate data and filter group results.",
            questions: [
              {
                id: "q1",
                question: "Which clause is used to filter aggregated group results (e.g. COUNT > 5)?",
                options: ["WHERE", "HAVING", "GROUP BY", "LIMIT"],
                correctIndex: 1,
                explanation: "HAVING filters aggregated groups after GROUP BY execution.",
              },
            ],
          },
        ],
      },
      {
        id: "dbms-7",
        title: "Database Normalization",
        shortTitle: "7. Normalization",
        description: "Functional Dependencies, 1NF, 2NF, 3NF, and BCNF normal forms.",
        x: 1260,
        y: 620,
        xp: 90,
        difficulty: "Advanced",
        estimatedMinutes: 35,
        prerequisites: ["dbms-6"],
        missions: [
          {
            id: "m-dbms-7",
            title: "Normalization Master",
            description: "Eliminate update, insertion, and deletion anomalies.",
            questions: [
              {
                id: "q1",
                question: "Which Normal Form eliminates partial dependencies on a composite primary key?",
                options: ["1NF", "2NF", "3NF", "BCNF"],
                correctIndex: 1,
                explanation: "2NF requires 1NF and ensures all non-key attributes are fully dependent on the entire primary key.",
              },
              {
                id: "q2",
                question: "3NF eliminates which type of attribute dependency?",
                options: ["Partial Dependency", "Transitive Dependency", "Multi-valued Dependency", "Join Dependency"],
                correctIndex: 1,
                explanation: "3NF eliminates transitive dependencies (X → Y and Y → Z).",
              },
            ],
          },
        ],
      },
      {
        id: "dbms-8",
        title: "Transactions & ACID",
        shortTitle: "8. Transactions",
        description: "Atomicity, Consistency, Isolation, Durability, COMMIT, ROLLBACK, and Concurrency.",
        x: 1440,
        y: 420,
        xp: 95,
        difficulty: "Advanced",
        estimatedMinutes: 35,
        prerequisites: ["dbms-7"],
        missions: [
          {
            id: "m-dbms-8",
            title: "ACID Concurrency Mission",
            description: "Ensure transaction integrity and serializability.",
            questions: [
              {
                id: "q1",
                question: "Which ACID property guarantees that all operations in a transaction succeed or none do?",
                options: ["Atomicity", "Consistency", "Isolation", "Durability"],
                correctIndex: 0,
                explanation: "Atomicity guarantees an 'all-or-nothing' execution of a transaction.",
              },
            ],
          },
        ],
      },
      {
        id: "dbms-9",
        title: "Indexing & B-Trees",
        shortTitle: "9. Indexing",
        description: "Clustered vs Non-clustered indexes, B-Trees, and B+ Trees.",
        x: 1550,
        y: 650,
        xp: 85,
        difficulty: "Advanced",
        estimatedMinutes: 30,
        prerequisites: ["dbms-8"],
        missions: [
          {
            id: "m-dbms-9",
            title: "Index Efficiency",
            description: "Learn how indexes accelerate query lookup.",
            questions: [
              {
                id: "q1",
                question: "How many clustered indexes can a relational database table have?",
                options: ["Unlimited", "Only One", "Up to 16", "Three"],
                correctIndex: 1,
                explanation: "A table can have only one clustered index because it dictates physical row storage order on disk.",
              },
            ],
          },
        ],
      },
      {
        id: "dbms-10",
        title: "Query Optimization",
        shortTitle: "10. Optimization",
        description: "Execution plans, cost-based optimizer, join algorithms, and index scans.",
        x: 1700,
        y: 450,
        xp: 100,
        difficulty: "Advanced",
        estimatedMinutes: 40,
        prerequisites: ["dbms-9"],
        missions: [
          {
            id: "m-dbms-10",
            title: "Query Plan Optimization",
            description: "Analyze and optimize slow SQL queries.",
            questions: [
              {
                id: "q1",
                question: "Which tool command displays the execution strategy chosen by the database engine?",
                options: ["ANALYZE PLAN", "EXPLAIN QUERY", "SHOW INDEX", "SELECT PLAN"],
                correctIndex: 1,
                explanation: "EXPLAIN (or EXPLAIN ANALYZE) shows the query execution plan.",
              },
            ],
          },
        ],
      },
      {
        id: "dbms-11",
        title: "Database Security & RBAC",
        shortTitle: "11. Security",
        description: "GRANT, REVOKE, Role-Based Access Control, SQL Injection prevention, and Auditing.",
        x: 1850,
        y: 680,
        xp: 90,
        difficulty: "Advanced",
        estimatedMinutes: 30,
        prerequisites: ["dbms-10"],
        missions: [
          {
            id: "m-dbms-11",
            title: "Security Mission",
            description: "Protect databases against unauthorized access and SQL injection.",
            questions: [
              {
                id: "q1",
                question: "What is the primary defense against SQL Injection vulnerabilities?",
                options: ["Client-side validation", "Prepared Statements (Parameterized Queries)", "Weak Passwords", "Encryption"],
                correctIndex: 1,
                explanation: "Parameterized Queries (Prepared Statements) separate SQL code from user inputs, preventing SQL injection.",
              },
            ],
          },
        ],
      },
    ],
  },

  // ─── 2. DATA STRUCTURES & ALGORITHMS (DSA) ───
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    shortName: "DSA World",
    description: "Conquer arrays, linked lists, trees, graphs, sorting, searching, and dynamic programming.",
    iconName: "Binary",
    colorTheme: {
      primary: "#8B5CF6",
      light: "#F5F3FF",
      border: "#DDD6FE",
      gradient: "from-purple-500 to-indigo-600",
      accent: "#A78BFA",
    },
    topics: [
      {
        id: "dsa-1",
        title: "Algorithm Foundations & Big-O",
        shortTitle: "1. Big-O Basics",
        description: "Time and space complexity analysis, O(1), O(log N), O(N), O(N log N), O(N²).",
        x: 180,
        y: 480,
        xp: 50,
        difficulty: "Beginner",
        estimatedMinutes: 15,
        prerequisites: [],
        missions: [
          {
            id: "m-dsa-1",
            title: "Complexity Challenge",
            description: "Identify worst-case time complexity.",
            questions: [
              {
                id: "q1",
                question: "What is the time complexity of accessing an element in an array by index?",
                options: ["O(N)", "O(1)", "O(log N)", "O(N²)"],
                correctIndex: 1,
                explanation: "Array element access by index takes constant O(1) time.",
              },
            ],
          },
        ],
      },
      {
        id: "dsa-2",
        title: "Arrays & Dynamic Sizing",
        shortTitle: "2. Arrays",
        description: "Contiguous memory allocation, insertions, deletions, and dynamic array resizing.",
        x: 360,
        y: 320,
        xp: 60,
        difficulty: "Beginner",
        estimatedMinutes: 20,
        prerequisites: ["dsa-1"],
        missions: [
          {
            id: "m-dsa-2",
            title: "Array Operations",
            description: "Understand array bounds and insertion costs.",
            questions: [
              {
                id: "q1",
                question: "What is the worst-case time complexity of inserting an element at the start of an array?",
                options: ["O(1)", "O(N)", "O(log N)", "O(N²)"],
                correctIndex: 1,
                explanation: "Inserting at index 0 requires shifting all N existing elements right by one position, which takes O(N) time.",
              },
            ],
          },
        ],
      },
      {
        id: "dsa-3",
        title: "Strings & Pattern Matching",
        shortTitle: "3. Strings",
        description: "ASCII, Unicode, String immutability, Two pointers, and Sliding Window technique.",
        x: 540,
        y: 560,
        xp: 65,
        difficulty: "Beginner",
        estimatedMinutes: 20,
        prerequisites: ["dsa-2"],
        missions: [
          {
            id: "m-dsa-3",
            title: "Sliding Window",
            description: "Solve string subarray problems.",
            questions: [
              {
                id: "q1",
                question: "Which technique is optimal for finding the longest substring without repeating characters?",
                options: ["Binary Search", "Sliding Window with Hash Set", "Recursion", "Bubble Sort"],
                correctIndex: 1,
                explanation: "Sliding Window with a Hash Set tracks unique characters in O(N) linear time.",
              },
            ],
          },
        ],
      },
      {
        id: "dsa-4",
        title: "Linked Lists",
        shortTitle: "4. Linked Lists",
        description: "Singly Linked Lists, Doubly Linked Lists, Pointer manipulation, and Cycle detection.",
        x: 720,
        y: 340,
        xp: 75,
        difficulty: "Intermediate",
        estimatedMinutes: 25,
        prerequisites: ["dsa-2"],
        missions: [
          {
            id: "m-dsa-4",
            title: "Pointer Mechanics",
            description: "Floyd's Cycle Detection Algorithm.",
            questions: [
              {
                id: "q1",
                question: "Floyd's Tortoise and Hare algorithm detects linked list cycles using...",
                options: ["One fast pointer", "Two pointers moving at different speeds", "A hash table only", "Stack memory"],
                correctIndex: 1,
                explanation: "Slow pointer moves 1 step while fast pointer moves 2 steps; if a cycle exists, they collide.",
              },
            ],
          },
        ],
      },
      {
        id: "dsa-5",
        title: "Stacks & LIFO",
        shortTitle: "5. Stacks",
        description: "Last-In First-Out operations, expression evaluation, call stack, and Monotonic Stacks.",
        x: 900,
        y: 600,
        xp: 70,
        difficulty: "Intermediate",
        estimatedMinutes: 25,
        prerequisites: ["dsa-4"],
        missions: [
          {
            id: "m-dsa-5",
            title: "Stack Evaluation",
            description: "Balanced parentheses matching.",
            questions: [
              {
                id: "q1",
                question: "Which data structure is naturally used by compilers to manage function call frames?",
                options: ["Queue", "Stack", "Tree", "Graph"],
                correctIndex: 1,
                explanation: "The Call Stack manages function invocation frames in LIFO order.",
              },
            ],
          },
        ],
      },
      {
        id: "dsa-6",
        title: "Queues & BFS Support",
        shortTitle: "6. Queues",
        description: "First-In First-Out queues, Circular Queues, Priority Queues, and Deque.",
        x: 1080,
        y: 380,
        xp: 70,
        difficulty: "Intermediate",
        estimatedMinutes: 25,
        prerequisites: ["dsa-5"],
        missions: [
          {
            id: "m-dsa-6",
            title: "Queue Mechanics",
            description: "FIFO buffer scheduling.",
            questions: [
              {
                id: "q1",
                question: "In a FIFO queue, where are new elements inserted?",
                options: ["Head / Front", "Tail / Rear", "Middle", "Random index"],
                correctIndex: 1,
                explanation: "Enqueue inserts at the tail (rear) and dequeue removes from the head (front).",
              },
            ],
          },
        ],
      },
      {
        id: "dsa-7",
        title: "Recursion & Backtracking",
        shortTitle: "7. Recursion",
        description: "Base case, Recursive call stack, Subproblems, N-Queens, and Subset generation.",
        x: 1260,
        y: 620,
        xp: 85,
        difficulty: "Advanced",
        estimatedMinutes: 30,
        prerequisites: ["dsa-5"],
        missions: [
          {
            id: "m-dsa-7",
            title: "Recursive Tree Exploration",
            description: "Solve problems by breaking down into base cases.",
            questions: [
              {
                id: "q1",
                question: "What happens if a recursive function lacks a valid base case?",
                options: ["Completes in O(1)", "Causes Stack Overflow Error", "Returns null", "Runs in O(N log N)"],
                correctIndex: 1,
                explanation: "Infinite recursion exhausts stack memory resulting in a Stack Overflow Error.",
              },
            ],
          },
        ],
      },
      {
        id: "dsa-8",
        title: "Binary Trees & BST",
        shortTitle: "8. Binary Trees",
        description: "Tree traversals (Pre-order, In-order, Post-order), Binary Search Trees, and AVL Trees.",
        x: 1440,
        y: 420,
        xp: 90,
        difficulty: "Advanced",
        estimatedMinutes: 35,
        prerequisites: ["dsa-7"],
        missions: [
          {
            id: "m-dsa-8",
            title: "BST Traversal Challenge",
            description: "Master tree traversal patterns.",
            questions: [
              {
                id: "q1",
                question: "Which traversal of a Binary Search Tree (BST) produces nodes in sorted ascending order?",
                options: ["Pre-order", "In-order", "Post-order", "Level-order"],
                correctIndex: 1,
                explanation: "In-order traversal (Left, Root, Right) yields elements of a BST in strictly sorted order.",
              },
            ],
          },
        ],
      },
      {
        id: "dsa-9",
        title: "Graphs, BFS & DFS",
        shortTitle: "9. Graphs",
        description: "Adjacency matrix, Adjacency list, Breadth-First Search, Depth-First Search, Dijkstra.",
        x: 1600,
        y: 650,
        xp: 95,
        difficulty: "Advanced",
        estimatedMinutes: 40,
        prerequisites: ["dsa-8"],
        missions: [
          {
            id: "m-dsa-9",
            title: "Graph Traversal",
            description: "Shortest path and cycle detection.",
            questions: [
              {
                id: "q1",
                question: "Which algorithm guarantees finding the shortest path in an unweighted graph?",
                options: ["Depth-First Search (DFS)", "Breadth-First Search (BFS)", "Pre-order Traversal", "Binary Search"],
                correctIndex: 1,
                explanation: "BFS explores level by level, ensuring the shortest path in unweighted graphs.",
              },
            ],
          },
        ],
      },
      {
        id: "dsa-10",
        title: "Sorting Algorithms",
        shortTitle: "10. Sorting",
        description: "Bubble, Insertion, Selection, Merge Sort, Quick Sort, and Heap Sort.",
        x: 1750,
        y: 450,
        xp: 85,
        difficulty: "Intermediate",
        estimatedMinutes: 30,
        prerequisites: ["dsa-2"],
        missions: [
          {
            id: "m-dsa-10",
            title: "Divide & Conquer Sorting",
            description: "Merge Sort vs Quick Sort.",
            questions: [
              {
                id: "q1",
                question: "What is the worst-case time complexity of Merge Sort?",
                options: ["O(N²)", "O(N log N)", "O(N)", "O(log N)"],
                correctIndex: 1,
                explanation: "Merge Sort consistently guarantees O(N log N) time complexity in all cases.",
              },
            ],
          },
        ],
      },
      {
        id: "dsa-11",
        title: "Searching & Binary Search",
        shortTitle: "11. Searching",
        description: "Linear Search, Binary Search on sorted arrays, and Search space reduction.",
        x: 1900,
        y: 680,
        xp: 80,
        difficulty: "Intermediate",
        estimatedMinutes: 25,
        prerequisites: ["dsa-10"],
        missions: [
          {
            id: "m-dsa-11",
            title: "Binary Search Mastery",
            description: "Logarithmic lookup in sorted arrays.",
            questions: [
              {
                id: "q1",
                question: "What precondition must be true to perform Binary Search on an array?",
                options: ["Array elements must be unique", "Array must be sorted", "Array size must be prime", "Array must contain positive numbers"],
                correctIndex: 1,
                explanation: "Binary Search relies on sorted order to divide the search space in half.",
              },
            ],
          },
        ],
      },
      {
        id: "dsa-12",
        title: "Dynamic Programming",
        shortTitle: "12. DP & Memoization",
        description: "Overlapping subproblems, Optimal substructure, Top-down memoization, Bottom-up tabulation.",
        x: 2050,
        y: 480,
        xp: 110,
        difficulty: "Advanced",
        estimatedMinutes: 45,
        prerequisites: ["dsa-8"],
        missions: [
          {
            id: "m-dsa-12",
            title: "Optimal Substructure",
            description: "Knapsack and Fibonacci DP.",
            questions: [
              {
                id: "q1",
                question: "What are the two key attributes required for a problem to be solved using Dynamic Programming?",
                options: [
                  "Greedy choice & Sorting",
                  "Overlapping Subproblems & Optimal Substructure",
                  "Graph Cycles & Trees",
                  "Linear time & Hashing",
                ],
                correctIndex: 1,
                explanation: "DP is applicable when subproblems repeat (overlapping) and optimal solutions combine (optimal substructure).",
              },
            ],
          },
        ],
      },
    ],
  },

  // ─── 3. OPERATING SYSTEMS (OS) ───
  {
    id: "os",
    name: "Operating Systems",
    shortName: "OS World",
    description: "Explore processes, threads, CPU scheduling, synchronization, deadlocks, and virtual memory.",
    iconName: "Cpu",
    colorTheme: {
      primary: "#F59E0B",
      light: "#FEF3C7",
      border: "#FDE68A",
      gradient: "from-amber-500 to-orange-600",
      accent: "#FBBF24",
    },
    topics: [
      {
        id: "os-1",
        title: "OS Architecture & Dual-Mode",
        shortTitle: "1. OS Intro",
        description: "Kernel mode vs User mode, system calls, interrupt handling, and OS components.",
        x: 180,
        y: 480,
        xp: 50,
        difficulty: "Beginner",
        estimatedMinutes: 15,
        prerequisites: [],
        missions: [
          {
            id: "m-os-1",
            title: "Kernel Mode Exploration",
            description: "Understand privileged hardware access.",
            questions: [
              {
                id: "q1",
                question: "Which mode allows executing privileged instructions directly interacting with hardware?",
                options: ["User Mode", "Kernel / Supervisor Mode", "Virtual Mode", "Guest Mode"],
                correctIndex: 1,
                explanation: "Kernel mode has unrestricted access to hardware memory and CPU instructions.",
              },
            ],
          },
        ],
      },
      {
        id: "os-2",
        title: "Processes & PCB",
        shortTitle: "2. Processes",
        description: "Process Control Block (PCB), process states (New, Ready, Running, Waiting, Terminated).",
        x: 360,
        y: 320,
        xp: 60,
        difficulty: "Beginner",
        estimatedMinutes: 20,
        prerequisites: ["os-1"],
        missions: [
          {
            id: "m-os-2",
            title: "Process Lifecycle",
            description: "Track state transitions in OS scheduler.",
            questions: [
              {
                id: "q1",
                question: "When a running process performs an I/O operation, to which state does it transition?",
                options: ["Ready State", "Waiting / Blocked State", "Terminated State", "New State"],
                correctIndex: 1,
                explanation: "I/O requests cause the process to enter the Waiting/Blocked state until I/O completes.",
              },
            ],
          },
        ],
      },
      {
        id: "os-3",
        title: "Threads & Concurrency",
        shortTitle: "3. Threads",
        description: "User threads vs Kernel threads, multi-threading models, and race conditions.",
        x: 540,
        y: 560,
        xp: 65,
        difficulty: "Beginner",
        estimatedMinutes: 20,
        prerequisites: ["os-2"],
        missions: [
          {
            id: "m-os-3",
            title: "Multithreading Basics",
            description: "Shared address space vs separate process memory.",
            questions: [
              {
                id: "q1",
                question: "What resource is SHARED among all threads belonging to the same process?",
                options: ["Register values", "Program Counter", "Stack memory", "Heap & Global Code Memory"],
                correctIndex: 3,
                explanation: "Threads share the process code segment, data segment, and heap, but maintain separate stacks.",
              },
            ],
          },
        ],
      },
      {
        id: "os-4",
        title: "CPU Scheduling Algorithms",
        shortTitle: "4. CPU Scheduling",
        description: "FCFS, SJF, Round Robin, Priority Scheduling, Preemption, and Gantt charts.",
        x: 720,
        y: 340,
        xp: 75,
        difficulty: "Intermediate",
        estimatedMinutes: 25,
        prerequisites: ["os-3"],
        missions: [
          {
            id: "m-os-4",
            title: "Round Robin Scheduling",
            description: "Time quantum scheduling for interactive systems.",
            questions: [
              {
                id: "q1",
                question: "Which CPU scheduling algorithm prevents starvation while guaranteeing time sharing?",
                options: ["First-Come First-Served (FCFS)", "Shortest Job First (SJF)", "Round Robin (RR)", "Priority Non-preemptive"],
                correctIndex: 2,
                explanation: "Round Robin assigns a fixed time quantum to each process, preventing CPU starvation.",
              },
            ],
          },
        ],
      },
      {
        id: "os-5",
        title: "Process Synchronization",
        shortTitle: "5. Synchronization",
        description: "Critical Section Problem, Mutex Locks, Counting Semaphores, and Peterson's Solution.",
        x: 900,
        y: 600,
        xp: 85,
        difficulty: "Intermediate",
        estimatedMinutes: 30,
        prerequisites: ["os-4"],
        missions: [
          {
            id: "m-os-5",
            title: "Semaphore Mechanics",
            description: "Prevent race conditions and ensure mutual exclusion.",
            questions: [
              {
                id: "q1",
                question: "What atomic operation decrements a semaphore value and blocks if value < 0?",
                options: ["signal() / V()", "wait() / P()", "post()", "notify()"],
                correctIndex: 1,
                explanation: "wait() (also known as P()) decrements the semaphore counter and blocks when unavailable.",
              },
            ],
          },
        ],
      },
      {
        id: "os-6",
        title: "Deadlocks & Prevention",
        shortTitle: "6. Deadlocks",
        description: "Four Coffman Conditions, Resource Allocation Graph, Banker's Algorithm.",
        x: 1080,
        y: 380,
        xp: 90,
        difficulty: "Advanced",
        estimatedMinutes: 35,
        prerequisites: ["os-5"],
        missions: [
          {
            id: "m-os-6",
            title: "Banker's Algorithm",
            description: "Deadlock avoidance in multi-resource environments.",
            questions: [
              {
                id: "q1",
                question: "Which of the following is NOT one of the 4 necessary conditions for a deadlock?",
                options: ["Mutual Exclusion", "Hold and Wait", "No Preemption", "Paging Fault"],
                correctIndex: 3,
                explanation: "The 4 conditions are Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.",
              },
            ],
          },
        ],
      },
      {
        id: "os-7",
        title: "Memory Management & Paging",
        shortTitle: "7. Memory & Paging",
        description: "Logical vs Physical address, Contiguous allocation, Paging, Page Tables, TLB.",
        x: 1260,
        y: 620,
        xp: 85,
        difficulty: "Intermediate",
        estimatedMinutes: 30,
        prerequisites: ["os-6"],
        missions: [
          {
            id: "m-os-7",
            title: "Address Translation",
            description: "TLB hardware acceleration for page tables.",
            questions: [
              {
                id: "q1",
                question: "What hardware cache accelerates logical-to-physical address translation?",
                options: ["L1 Cache", "Translation Lookaside Buffer (TLB)", "RAM", "Register File"],
                correctIndex: 1,
                explanation: "TLB is a fast hardware cache that stores recent page table translations.",
              },
            ],
          },
        ],
      },
      {
        id: "os-8",
        title: "Virtual Memory & Page Replacement",
        shortTitle: "8. Virtual Memory",
        description: "Demand paging, Page faults, FIFO, LRU, Optimal page replacement, Thrashing.",
        x: 1440,
        y: 420,
        xp: 95,
        difficulty: "Advanced",
        estimatedMinutes: 35,
        prerequisites: ["os-7"],
        missions: [
          {
            id: "m-os-8",
            title: "LRU Page Replacement",
            description: "Handle page faults efficiently.",
            questions: [
              {
                id: "q1",
                question: "What state occurs when an OS spends more time swapping pages than executing user code?",
                options: ["Deadlock", "Thrashing", "Starvation", "Segmentation Fault"],
                correctIndex: 1,
                explanation: "Thrashing happens when high page fault frequency causes constant swapping.",
              },
            ],
          },
        ],
      },
      {
        id: "os-9",
        title: "File Systems & Inodes",
        shortTitle: "9. File Systems",
        description: "File allocation methods (Contiguous, Linked, Indexed), Inode structure, Directories.",
        x: 1600,
        y: 650,
        xp: 80,
        difficulty: "Intermediate",
        estimatedMinutes: 25,
        prerequisites: ["os-8"],
        missions: [
          {
            id: "m-os-9",
            title: "Inode Architecture",
            description: "Unix file metadata indexing.",
            questions: [
              {
                id: "q1",
                question: "In Unix file systems, which data structure stores file attributes, permissions, and block pointers?",
                options: ["FAT", "Inode", "Boot Block", "Super Block"],
                correctIndex: 1,
                explanation: "An inode (index node) stores file metadata, ownership, permissions, and data block pointers.",
              },
            ],
          },
        ],
      },
      {
        id: "os-10",
        title: "I/O & Disk Scheduling",
        shortTitle: "10. Disk Scheduling",
        description: "Disk seek time, FCFS, SSTF, SCAN (Elevator), C-SCAN, RAID levels.",
        x: 1750,
        y: 450,
        xp: 85,
        difficulty: "Advanced",
        estimatedMinutes: 30,
        prerequisites: ["os-9"],
        missions: [
          {
            id: "m-os-10",
            title: "Elevator SCAN Scheduling",
            description: "Optimize hard disk arm movement.",
            questions: [
              {
                id: "q1",
                question: "Which disk scheduling algorithm moves the arm in one direction servicing requests until reaching the end?",
                options: ["FCFS", "SSTF", "SCAN (Elevator)", "Random"],
                correctIndex: 2,
                explanation: "SCAN algorithm behaves like an elevator, moving back and forth across the disk platters.",
              },
            ],
          },
        ],
      },
      {
        id: "os-11",
        title: "OS Protection & Access Control",
        shortTitle: "11. OS Security",
        description: "Access Control Matrix, Protection Domains, Encryption, Malware defense.",
        x: 1900,
        y: 680,
        xp: 90,
        difficulty: "Advanced",
        estimatedMinutes: 30,
        prerequisites: ["os-10"],
        missions: [
          {
            id: "m-os-11",
            title: "Protection Domains",
            description: "Enforce principle of least privilege.",
            questions: [
              {
                id: "q1",
                question: "Which security principle states that users/processes should only have minimum permissions required?",
                options: ["Principle of Open Access", "Principle of Least Privilege", "Principle of Zero Protection", "Principle of Maximum Rights"],
                correctIndex: 1,
                explanation: "Least Privilege dictates granting only necessary rights required to perform a specific task.",
              },
            ],
          },
        ],
      },
    ],
  },

  // ─── 4. COMPUTER NETWORKS (CN) ───
  {
    id: "cn",
    name: "Computer Networks",
    shortName: "CN World",
    description: "Navigate OSI layers, TCP/IP, IP subnetting, routing, switching, DNS, HTTP/HTTPS, and security.",
    iconName: "Network",
    colorTheme: {
      primary: "#10B981",
      light: "#ECFDF5",
      border: "#A7F3D0",
      gradient: "from-emerald-500 to-teal-600",
      accent: "#34D399",
    },
    topics: [
      {
        id: "cn-1",
        title: "Networking Fundamentals",
        shortTitle: "1. Network Intro",
        description: "LAN, WAN, MAN, Mesh vs Star vs Bus topologies, Packet Switching vs Circuit Switching.",
        x: 180,
        y: 480,
        xp: 50,
        difficulty: "Beginner",
        estimatedMinutes: 15,
        prerequisites: [],
        missions: [
          {
            id: "m-cn-1",
            title: "Topologies & Switching",
            description: "Compare network structures.",
            questions: [
              {
                id: "q1",
                question: "Which network topology provides maximum redundancy by connecting every node to every other node?",
                options: ["Star Topology", "Bus Topology", "Mesh Topology", "Ring Topology"],
                correctIndex: 2,
                explanation: "Full Mesh topology connects every device directly to every other device, providing maximum fault tolerance.",
              },
            ],
          },
        ],
      },
      {
        id: "cn-2",
        title: "OSI & TCP/IP Stack Models",
        shortTitle: "2. OSI Model",
        description: "7 Layers of OSI (Physical to Application) and 4/5 Layers of TCP/IP.",
        x: 360,
        y: 320,
        xp: 60,
        difficulty: "Beginner",
        estimatedMinutes: 20,
        prerequisites: ["cn-1"],
        missions: [
          {
            id: "m-cn-2",
            title: "Layer Identification",
            description: "Map protocols to OSI layers.",
            questions: [
              {
                id: "q1",
                question: "At which layer of the OSI model does IP routing occur?",
                options: ["Data Link Layer (Layer 2)", "Network Layer (Layer 3)", "Transport Layer (Layer 4)", "Application Layer (Layer 7)"],
                correctIndex: 1,
                explanation: "Layer 3 (Network Layer) is responsible for logical IP addressing and packet routing.",
              },
            ],
          },
        ],
      },
      {
        id: "cn-3",
        title: "Physical & Data Link Layers",
        shortTitle: "3. Data Link",
        description: "MAC Addresses, Framing, CSMA/CD, Ethernet, and Error Detection (CRC).",
        x: 540,
        y: 560,
        xp: 65,
        difficulty: "Beginner",
        estimatedMinutes: 20,
        prerequisites: ["cn-2"],
        missions: [
          {
            id: "m-cn-3",
            title: "MAC Addressing & CSMA/CD",
            description: "Understand collision detection in shared media.",
            questions: [
              {
                id: "q1",
                question: "How long is a standard Ethernet MAC hardware address?",
                options: ["32 bits", "48 bits (6 bytes)", "64 bits", "128 bits"],
                correctIndex: 1,
                explanation: "A MAC address is a 48-bit (6-byte) globally unique hardware identifier.",
              },
            ],
          },
        ],
      },
      {
        id: "cn-4",
        title: "IP Addressing & Subnetting",
        shortTitle: "4. IP Subnetting",
        description: "IPv4 Classes, CIDR notation, Subnet Masks, Network ID, Broadcast ID, and IPv6.",
        x: 720,
        y: 340,
        xp: 80,
        difficulty: "Intermediate",
        estimatedMinutes: 30,
        prerequisites: ["cn-3"],
        missions: [
          {
            id: "m-cn-4",
            title: "Subnet Mask Challenge",
            description: "Calculate usable host IP addresses.",
            questions: [
              {
                id: "q1",
                question: "How many usable host IP addresses are available in a /24 subnet (255.255.255.0)?",
                options: ["256", "254", "512", "128"],
                correctIndex: 1,
                explanation: "28 = 256 total addresses minus 2 reserved (Network ID & Broadcast ID) = 254 usable hosts.",
              },
            ],
          },
        ],
      },
      {
        id: "cn-5",
        title: "Routing Protocols & Algorithms",
        shortTitle: "5. Routing",
        description: "Distance Vector (RIP), Link State (OSPF), BGP, Distance-Vector routing loops.",
        x: 900,
        y: 600,
        xp: 85,
        difficulty: "Intermediate",
        estimatedMinutes: 30,
        prerequisites: ["cn-4"],
        missions: [
          {
            id: "m-cn-5",
            title: "OSPF Link State Routing",
            description: "Dijkstra's shortest path algorithm in routers.",
            questions: [
              {
                id: "q1",
                question: "Which algorithm is utilized by OSPF (Open Shortest Path First) link-state routing?",
                options: ["Bellman-Ford", "Dijkstra's Algorithm", "Floyd-Warshall", "Kruskal's Algorithm"],
                correctIndex: 1,
                explanation: "OSPF uses Dijkstra's shortest path first algorithm to compute the routing table.",
              },
            ],
          },
        ],
      },
      {
        id: "cn-6",
        title: "Switching & VLANs",
        shortTitle: "6. Switching & VLANs",
        description: "Layer 2 switching, MAC table learning, Spanning Tree Protocol (STP), and VLANs.",
        x: 1080,
        y: 380,
        xp: 75,
        difficulty: "Intermediate",
        estimatedMinutes: 25,
        prerequisites: ["cn-5"],
        missions: [
          {
            id: "m-cn-6",
            title: "VLAN Segmentation",
            description: "Isolate broadcast domains with VLANs.",
            questions: [
              {
                id: "q1",
                question: "Which protocol prevents switching loops in redundant Layer 2 networks?",
                options: ["RIP", "Spanning Tree Protocol (STP)", "BGP", "DHCP"],
                correctIndex: 1,
                explanation: "STP blocks redundant paths to prevent broadcast storms and switching loops.",
              },
            ],
          },
        ],
      },
      {
        id: "cn-7",
        title: "Transport Layer: TCP vs UDP",
        shortTitle: "7. TCP vs UDP",
        description: "TCP 3-way handshake, Flow Control (Sliding Window), Congestion Control, and UDP.",
        x: 1260,
        y: 620,
        xp: 85,
        difficulty: "Intermediate",
        estimatedMinutes: 30,
        prerequisites: ["cn-6"],
        missions: [
          {
            id: "m-cn-7",
            title: "3-Way Handshake Mission",
            description: "SYN -> SYN-ACK -> ACK connection establishment.",
            questions: [
              {
                id: "q1",
                question: "What sequence of packets establishes a reliable TCP connection?",
                options: ["ACK -> SYN -> SYN-ACK", "SYN -> SYN-ACK -> ACK", "FIN -> ACK -> FIN-ACK", "DATA -> ACK -> CLOSE"],
                correctIndex: 1,
                explanation: "The TCP 3-way handshake uses SYN, SYN-ACK, and ACK packets.",
              },
            ],
          },
        ],
      },
      {
        id: "cn-8",
        title: "DNS & Domain Name System",
        shortTitle: "8. DNS",
        description: "Recursive vs Iterative lookup, A, AAAA, CNAME, MX records, and DNS Caching.",
        x: 1440,
        y: 420,
        xp: 75,
        difficulty: "Intermediate",
        estimatedMinutes: 20,
        prerequisites: ["cn-7"],
        missions: [
          {
            id: "m-cn-8",
            title: "DNS Resolution",
            description: "Map human-readable domains to IP addresses.",
            questions: [
              {
                id: "q1",
                question: "Which DNS record type maps a domain name directly to an IPv4 address?",
                options: ["MX Record", "CNAME Record", "A Record", "TXT Record"],
                correctIndex: 2,
                explanation: "An 'A' (Address) record maps a hostname to an IPv4 address.",
              },
            ],
          },
        ],
      },
      {
        id: "cn-9",
        title: "Application Protocols: HTTP & TLS",
        shortTitle: "9. HTTP/HTTPS",
        description: "HTTP Methods (GET, POST, PUT, DELETE), Status codes, Cookies, Sessions, and TLS/SSL.",
        x: 1600,
        y: 650,
        xp: 85,
        difficulty: "Advanced",
        estimatedMinutes: 30,
        prerequisites: ["cn-8"],
        missions: [
          {
            id: "m-cn-9",
            title: "HTTP & HTTPS Security",
            description: "Understand web request/response semantics.",
            questions: [
              {
                id: "q1",
                question: "Which HTTP status code indicates a successful resource creation on the server?",
                options: ["200 OK", "201 Created", "301 Moved Permanently", "404 Not Found"],
                correctIndex: 1,
                explanation: "Status code 201 Created indicates successful resource creation.",
              },
            ],
          },
        ],
      },
      {
        id: "cn-10",
        title: "Network Security & Firewalls",
        shortTitle: "10. Security",
        description: "Firewalls (Stateful vs Packet Filtering), IDS/IPS, VPNs, NAT, and IPsec.",
        x: 1750,
        y: 450,
        xp: 90,
        difficulty: "Advanced",
        estimatedMinutes: 35,
        prerequisites: ["cn-9"],
        missions: [
          {
            id: "m-cn-10",
            title: "Firewall Defense",
            description: "Filter unauthorized traffic.",
            questions: [
              {
                id: "q1",
                question: "Which technology translates private internal IP addresses into a public IP address for internet access?",
                options: ["DHCP", "NAT (Network Address Translation)", "DNS", "ARP"],
                correctIndex: 1,
                explanation: "NAT allows multiple devices on a private network to share a single public IP address.",
              },
            ],
          },
        ],
      },
      {
        id: "cn-11",
        title: "Wireless Networks & Wi-Fi",
        shortTitle: "11. Wireless",
        description: "802.11 standards, WPA2/WPA3 security, Access Points, Frequency bands (2.4GHz / 5GHz).",
        x: 1900,
        y: 680,
        xp: 85,
        difficulty: "Advanced",
        estimatedMinutes: 25,
        prerequisites: ["cn-10"],
        missions: [
          {
            id: "m-cn-11",
            title: "Wi-Fi Security Mission",
            description: "WPA3 encryption and wireless protocols.",
            questions: [
              {
                id: "q1",
                question: "Which IEEE standard governs wireless local area networks (Wi-Fi)?",
                options: ["802.3", "802.11", "802.15", "802.1X"],
                correctIndex: 1,
                explanation: "IEEE 802.11 is the set of standards defining Wi-Fi communications.",
              },
            ],
          },
        ],
      },
    ],
  },
];

// Default initial state helper for progress tracking
export interface UserProgressState {
  completedTopicIds: Record<string, string[]>; // subjectId -> topicIds[]
  currentMissionTopicId: Record<string, string>; // subjectId -> topicId
  subjectXP: Record<string, number>; // subjectId -> total XP
}

export const initialUserProgress: UserProgressState = {
  completedTopicIds: {
    dbms: ["dbms-1", "dbms-2"],
    dsa: ["dsa-1"],
    os: ["os-1"],
    cn: [],
  },
  currentMissionTopicId: {
    dbms: "dbms-3",
    dsa: "dsa-2",
    os: "os-2",
    cn: "cn-1",
  },
  subjectXP: {
    dbms: 110,
    dsa: 50,
    os: 50,
    cn: 0,
  },
};

// Subject-Specific Daily Challenge Data Contract
export interface SubjectDailyChallenge {
  subjectId: string;
  subjectName: string;
  title: string;
  subtitle: string;
  description: string;
  missionTitle: string;
  xpReward: number;
  targetTopicId: string;
  badgeText: string;
  estimatedMinutes: number;
}

export const subjectDailyChallenges: Record<string, SubjectDailyChallenge> = {
  dbms: {
    subjectId: "dbms",
    subjectName: "Database Management Systems",
    title: "Master SQL Joins",
    subtitle: "Daily Relational Sprint",
    description: "Practice INNER, LEFT, RIGHT, and FULL OUTER joins to combine multi-table relational data efficiently.",
    missionTitle: "Complete SQL Joins Challenge",
    xpReward: 150,
    targetTopicId: "dbms-5",
    badgeText: "🔥 DAILY DBMS SPRINT",
    estimatedMinutes: 15,
  },
  dsa: {
    subjectId: "dsa",
    subjectName: "Data Structures & Algorithms",
    title: "Array & Searching Sprint",
    subtitle: "Algorithm Performance",
    description: "Master sliding window techniques, two pointers, and logarithmic binary search patterns.",
    missionTitle: "Complete DSA Array & Search Challenge",
    xpReward: 150,
    targetTopicId: "dsa-2",
    badgeText: "⚡ DAILY DSA SPRINT",
    estimatedMinutes: 20,
  },
  os: {
    subjectId: "os",
    subjectName: "Operating Systems",
    title: "Process Scheduling Challenge",
    subtitle: "OS Concurrency & CPU",
    description: "Solve Round-Robin, SJF, and Priority CPU scheduling Gantt chart problems.",
    missionTitle: "Complete Process Management Challenge",
    xpReward: 150,
    targetTopicId: "os-4",
    badgeText: "⚙️ DAILY OS SPRINT",
    estimatedMinutes: 15,
  },
  cn: {
    subjectId: "cn",
    subjectName: "Computer Networks",
    title: "IP Subnetting & OSI Stack",
    subtitle: "Network Protocol Mastery",
    description: "Calculate CIDR subnet masks, usable host ranges, and Layer 3 IP routing rules.",
    missionTitle: "Complete Networking Fundamentals",
    xpReward: 150,
    targetTopicId: "cn-4",
    badgeText: "🌐 DAILY CN SPRINT",
    estimatedMinutes: 15,
  },
};

