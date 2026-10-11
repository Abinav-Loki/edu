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
        xp: 100,
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
                    question: "Which level of database abstraction defines HOW data is actually stored on physical disks?",
                    options: [
                              "External Level",
                              "Conceptual Level",
                              "Physical Level",
                              "Logical Level"
                    ],
                    correctIndex: 2,
                    explanation: "The Physical Level describes low-level data structures, page blocks, and actual storage files on disk."
          },
          {
                    id: "q2",
                    question: "What is a primary advantage of a DBMS over traditional file processing systems?",
                    options: [
                              "Data Redundancy",
                              "Data Independence & Centralized Concurrency",
                              "Manual File Locking",
                              "No Multi-user Access"
                    ],
                    correctIndex: 1,
                    explanation: "DBMS eliminates data redundancy and provides logical/physical data independence with ACID concurrency."
          },
          {
                    id: "q3",
                    question: "What is the role of Data Definition Language (DDL)?",
                    options: [
                              "Insert and modify rows",
                              "Define database schema and table structures",
                              "Query relational tuples",
                              "Manage user session credentials"
                    ],
                    correctIndex: 1,
                    explanation: "DDL statements such as CREATE, ALTER, and DROP define the structure and schema of database objects."
          },
          {
                    id: "q4",
                    question: "Which component of DBMS architecture is responsible for converting user queries into efficient execution plans?",
                    options: [
                              "Query Processor & Optimizer",
                              "Buffer Manager",
                              "Storage Engine",
                              "Transaction Manager"
                    ],
                    correctIndex: 0,
                    explanation: "The Query Optimizer analyzes relational algebra expressions, statistics, and costs to produce optimal execution plans."
          },
          {
                    id: "q5",
                    question: "What does physical data independence guarantee?",
                    options: [
                              "Changes in internal storage do not affect conceptual schema",
                              "Changes in conceptual schema do not affect external views",
                              "Users cannot modify records",
                              "Data is stored without indexes"
                    ],
                    correctIndex: 0,
                    explanation: "Physical data independence ensures that changing storage structures or indexing does not require changes to conceptual schemas."
          }
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
        xp: 100,
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
                    question: "In the relational model, what is a single row in a table formally called?",
                    options: [
                              "Domain",
                              "Tuple",
                              "Relation",
                              "Cardinality"
                    ],
                    correctIndex: 1,
                    explanation: "A tuple represents a single row/record in a relational table."
          },
          {
                    id: "q2",
                    question: "Which key uniquely identifies a tuple and is strictly prohibited from containing NULL values?",
                    options: [
                              "Foreign Key",
                              "Candidate Key",
                              "Primary Key",
                              "Super Key"
                    ],
                    correctIndex: 2,
                    explanation: "By the Entity Integrity constraint, a Primary Key must be unique and cannot contain NULL."
          },
          {
                    id: "q3",
                    question: "What does Referential Integrity enforce in relational databases?",
                    options: [
                              "Primary keys must be integers",
                              "Foreign key values must match a valid primary key or be NULL",
                              "No two tables can have identical columns",
                              "Indexes must be clustered"
                    ],
                    correctIndex: 1,
                    explanation: "Referential integrity ensures foreign keys reference valid existing rows in the parent table or remain NULL."
          },
          {
                    id: "q4",
                    question: "The total number of attributes (columns) in a relation is known as its:",
                    options: [
                              "Cardinality",
                              "Degree",
                              "Domain",
                              "Schema length"
                    ],
                    correctIndex: 1,
                    explanation: "The degree of a relation is the number of attributes, while cardinality is the number of tuples."
          },
          {
                    id: "q5",
                    question: "Which constraint ensures that attribute values belong to an allowed set of valid values?",
                    options: [
                              "Entity constraint",
                              "Domain constraint",
                              "Referential constraint",
                              "Key constraint"
                    ],
                    correctIndex: 1,
                    explanation: "Domain constraints enforce that every value in a column belongs to the declared domain/data type."
          }
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
        xp: 100,
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
                    question: "Which SQL command is used to add a new column to an existing database table?",
                    options: [
                              "UPDATE TABLE",
                              "ALTER TABLE",
                              "MODIFY TABLE",
                              "EXTEND TABLE"
                    ],
                    correctIndex: 1,
                    explanation: "ALTER TABLE table_name ADD column_name datatype is the standard DDL command to add a column."
          },
          {
                    id: "q2",
                    question: "Which command completely deletes a table along with its schema and indexes from the database?",
                    options: [
                              "TRUNCATE",
                              "DELETE",
                              "DROP TABLE",
                              "REMOVE TABLE"
                    ],
                    correctIndex: 2,
                    explanation: "DROP TABLE destroys the table schema, all data, and associated indexes permanently."
          },
          {
                    id: "q3",
                    question: "How does TRUNCATE differ from DELETE in SQL?",
                    options: [
                              "TRUNCATE removes specific rows based on WHERE",
                              "TRUNCATE is a DDL operation that resets storage without row-by-row logging",
                              "DELETE deletes the entire table schema",
                              "TRUNCATE cannot be committed"
                    ],
                    correctIndex: 1,
                    explanation: "TRUNCATE deallocates data pages quickly as DDL, whereas DELETE logs row deletions individually."
          },
          {
                    id: "q4",
                    question: "Which constraint prevents duplicate values in a column without making it the primary key?",
                    options: [
                              "CHECK",
                              "NOT NULL",
                              "UNIQUE",
                              "DEFAULT"
                    ],
                    correctIndex: 2,
                    explanation: "The UNIQUE constraint ensures all values in a column are distinct, while permitting a NULL value."
          },
          {
                    id: "q5",
                    question: "Which DDL statement is used to remove all rows from a table while keeping its structure intact?",
                    options: [
                              "TRUNCATE TABLE",
                              "DROP TABLE",
                              "ALTER TABLE",
                              "CLEAR TABLE"
                    ],
                    correctIndex: 0,
                    explanation: "TRUNCATE TABLE removes all rows rapidly while preserving table structure for future inserts."
          }
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
        xp: 100,
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
                    question: "Which SQL clause is used to filter records based on pattern matching?",
                    options: [
                              "IN",
                              "BETWEEN",
                              "LIKE",
                              "EXISTS"
                    ],
                    correctIndex: 2,
                    explanation: "The LIKE operator is used with wildcards (% and _) to filter text pattern matches in SQL."
          },
          {
                    id: "q2",
                    question: "Which wildcard in SQL matches exactly one single character?",
                    options: [
                              "%",
                              "_",
                              "*",
                              "?"
                    ],
                    correctIndex: 1,
                    explanation: "The underscore (_) wildcard matches exactly one character, while percent (%) matches zero or more."
          },
          {
                    id: "q3",
                    question: "What is the correct clause to sort returned results in descending order in SQL?",
                    options: [
                              "SORT BY column DESC",
                              "ORDER BY column DESC",
                              "GROUP BY column DESC",
                              "FILTER BY column DESC"
                    ],
                    correctIndex: 1,
                    explanation: "ORDER BY column_name DESC sorts query result rows in descending order."
          },
          {
                    id: "q4",
                    question: "How do you test for missing or unassigned values in SQL?",
                    options: [
                              "column = NULL",
                              "column IS NULL",
                              "column == NULL",
                              "column EQUALS NULL"
                    ],
                    correctIndex: 1,
                    explanation: "In SQL three-valued logic, NULL comparisons must use 'IS NULL' or 'IS NOT NULL', not '='."
          },
          {
                    id: "q5",
                    question: "Which operator checks if an attribute value matches any value in a subquery or list?",
                    options: [
                              "BETWEEN",
                              "LIKE",
                              "IN",
                              "CONTAINS"
                    ],
                    correctIndex: 2,
                    explanation: "The IN operator allows specifying multiple values in a WHERE clause or testing membership against a subquery."
          }
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
        xp: 100,
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
                    question: "Which JOIN returns all rows from the left table and matching rows from the right table?",
                    options: [
                              "INNER JOIN",
                              "LEFT OUTER JOIN",
                              "RIGHT OUTER JOIN",
                              "CROSS JOIN"
                    ],
                    correctIndex: 1,
                    explanation: "LEFT OUTER JOIN returns all rows from the left table with NULL values when right table matches are absent."
          },
          {
                    id: "q2",
                    question: "What is the result of a CROSS JOIN between a table with 5 rows and a table with 4 rows?",
                    options: [
                              "9 rows",
                              "20 rows",
                              "1 row",
                              "0 rows"
                    ],
                    correctIndex: 1,
                    explanation: "A CROSS JOIN produces the Cartesian product: 5 rows × 4 rows = 20 total rows."
          },
          {
                    id: "q3",
                    question: "Which JOIN returns only the rows where there is a match in both participating tables?",
                    options: [
                              "FULL JOIN",
                              "INNER JOIN",
                              "CROSS JOIN",
                              "LEFT JOIN"
                    ],
                    correctIndex: 1,
                    explanation: "INNER JOIN selects records that have matching values in both tables based on the join predicate."
          },
          {
                    id: "q4",
                    question: "What join condition joins a table to itself?",
                    options: [
                              "NATURAL JOIN",
                              "SELF JOIN",
                              "OUTER JOIN",
                              "EQUI JOIN"
                    ],
                    correctIndex: 1,
                    explanation: "A SELF JOIN joins a table with itself, typically using table aliases for hierarchical or sequential data."
          },
          {
                    id: "q5",
                    question: "Which JOIN returns all rows from both tables, filling with NULL wherever no join match occurs?",
                    options: [
                              "CROSS JOIN",
                              "INNER JOIN",
                              "FULL OUTER JOIN",
                              "SEMI JOIN"
                    ],
                    correctIndex: 2,
                    explanation: "FULL OUTER JOIN retains all records from both sides, matching rows when possible and emitting NULL otherwise."
          }
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
        xp: 100,
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
                    question: "Which SQL clause is used to filter groups AFTER aggregation has taken place?",
                    options: [
                              "WHERE",
                              "HAVING",
                              "GROUP BY",
                              "ORDER BY"
                    ],
                    correctIndex: 1,
                    explanation: "HAVING filters aggregated groups, whereas WHERE filters individual rows before grouping."
          },
          {
                    id: "q2",
                    question: "Which aggregate function ignores NULL values when calculating the mathematical average?",
                    options: [
                              "SUM()",
                              "AVG()",
                              "COUNT(*)",
                              "MEDIAN()"
                    ],
                    correctIndex: 1,
                    explanation: "AVG() calculates the sum divided by non-null occurrences, ignoring NULL rows."
          },
          {
                    id: "q3",
                    question: "What does COUNT(*) count in a table?",
                    options: [
                              "Only non-null primary keys",
                              "Total number of rows including those with NULL attributes",
                              "Distinct values only",
                              "Non-null numerical columns"
                    ],
                    correctIndex: 1,
                    explanation: "COUNT(*) counts all rows in the relation regardless of whether attributes contain NULLs."
          },
          {
                    id: "q4",
                    question: "When using GROUP BY, every column in the SELECT clause that is not an aggregate function must be:",
                    options: [
                              "Indexed",
                              "A Primary Key",
                              "Listed in the GROUP BY clause",
                              "A Foreign Key"
                    ],
                    correctIndex: 2,
                    explanation: "Standard SQL requires any non-aggregated column in the SELECT list to appear in the GROUP BY clause."
          },
          {
                    id: "q5",
                    question: "Which function returns the number of distinct, non-duplicate values in a column?",
                    options: [
                              "COUNT(DISTINCT column)",
                              "UNIQUE_COUNT(column)",
                              "DISTINCT(column)",
                              "COUNT_ALL(column)"
                    ],
                    correctIndex: 0,
                    explanation: "COUNT(DISTINCT column) computes the count of unique, non-null values in that column."
          }
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
        xp: 100,
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
                    question: "Which Normal Form strictly prohibits multivalued attributes and composite attributes?",
                    options: [
                              "1NF",
                              "2NF",
                              "3NF",
                              "BCNF"
                    ],
                    correctIndex: 0,
                    explanation: "First Normal Form (1NF) mandates that all attribute values must be atomic (no arrays or repeating groups)."
          },
          {
                    id: "q2",
                    question: "A relation is in 2NF if it is in 1NF and contains no:",
                    options: [
                              "Transitive Dependencies",
                              "Partial Functional Dependencies",
                              "Multivalued Dependencies",
                              "Join Dependencies"
                    ],
                    correctIndex: 1,
                    explanation: "2NF requires no non-prime attribute to be functionally dependent on a proper subset of any candidate key."
          },
          {
                    id: "q3",
                    question: "Third Normal Form (3NF) eliminates which type of dependency?",
                    options: [
                              "Partial Dependency",
                              "Transitive Dependency",
                              "Trivial Dependency",
                              "Atomic Dependency"
                    ],
                    correctIndex: 1,
                    explanation: "3NF eliminates transitive functional dependencies (e.g., X -> Y and Y -> Z where Z is non-prime)."
          },
          {
                    id: "q4",
                    question: "In Boyce-Codd Normal Form (BCNF), for every functional dependency X -> Y, what must X be?",
                    options: [
                              "A non-prime attribute",
                              "A Super Key",
                              "A Foreign Key",
                              "A composite attribute"
                    ],
                    correctIndex: 1,
                    explanation: "BCNF is a stricter form of 3NF where every determinant X in X -> Y must be a super key."
          },
          {
                    id: "q5",
                    question: "What is the primary motivation for normalizing a database schema?",
                    options: [
                              "Improve query execution speed",
                              "Eliminate update, insert, and delete anomalies and reduce redundancy",
                              "Encrypt data records",
                              "Create backup snapshots"
                    ],
                    correctIndex: 1,
                    explanation: "Normalization decomposes relations to remove redundant data and prevent data modification anomalies."
          }
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
        xp: 100,
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
                    question: "Which ACID property guarantees that all operations in a transaction succeed or all fail together?",
                    options: [
                              "Atomicity",
                              "Consistency",
                              "Isolation",
                              "Durability"
                    ],
                    correctIndex: 0,
                    explanation: "Atomicity ensures 'all-or-nothing' execution of database transaction operations."
          },
          {
                    id: "q2",
                    question: "Which transaction isolation anomaly occurs when a transaction reads uncommitted changes from another transaction?",
                    options: [
                              "Non-repeatable Read",
                              "Dirty Read",
                              "Phantom Read",
                              "Lost Update"
                    ],
                    correctIndex: 1,
                    explanation: "A Dirty Read happens when Transaction A reads data modified by Transaction B before B has committed."
          },
          {
                    id: "q3",
                    question: "Which ACID property guarantees that committed changes persist even after a system crash or power outage?",
                    options: [
                              "Atomicity",
                              "Consistency",
                              "Isolation",
                              "Durability"
                    ],
                    correctIndex: 3,
                    explanation: "Durability guarantees committed transactions survive system failures via write-ahead logging (WAL)."
          },
          {
                    id: "q4",
                    question: "What is the highest and strictest SQL transaction isolation level?",
                    options: [
                              "Read Uncommitted",
                              "Read Committed",
                              "Repeatable Read",
                              "Serializable"
                    ],
                    correctIndex: 3,
                    explanation: "Serializable isolation guarantees that concurrent execution produces results identical to serial execution."
          },
          {
                    id: "q5",
                    question: "What mechanism is commonly used by DBMS engines to ensure atomicity and durability during crash recovery?",
                    options: [
                              "Write-Ahead Logging (WAL)",
                              "B-Tree balance reordering",
                              "Hash Partitioning",
                              "Deadlock detection graphs"
                    ],
                    correctIndex: 0,
                    explanation: "WAL writes transaction log records to persistent storage before modifying actual data pages on disk."
          }
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
        xp: 100,
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
                    question: "Why are B+ Trees favored over binary search trees for disk-based database indexing?",
                    options: [
                              "Higher fan-out and shallow tree depth minimize disk I/O operations",
                              "They store all data in root nodes",
                              "They do not support range scans",
                              "They use recursion instead of loops"
                    ],
                    correctIndex: 0,
                    explanation: "B+ Trees have large node branching factors (fan-out), keeping tree depth small and reducing disk block seeks."
          },
          {
                    id: "q2",
                    question: "What distinguishes a Clustered Index from a Non-Clustered Index?",
                    options: [
                              "Clustered index physically sorts and stores data rows in the table",
                              "Clustered index stores data in RAM only",
                              "Non-clustered indexes cannot have duplicate keys",
                              "A table can have 10 clustered indexes"
                    ],
                    correctIndex: 0,
                    explanation: "A clustered index determines the physical order of table rows on disk; thus only one can exist per table."
          },
          {
                    id: "q3",
                    question: "In a B+ Tree, where are actual record pointers and data values stored?",
                    options: [
                              "Only in root nodes",
                              "Exclusively in leaf nodes linked as a doubly-linked list",
                              "Evenly distributed in internal nodes",
                              "In bitmap index tables"
                    ],
                    correctIndex: 1,
                    explanation: "In B+ Trees, internal nodes only store routing keys, while leaf nodes hold all data records and sequential pointers."
          },
          {
                    id: "q4",
                    question: "What is the time complexity of searching for a key in a balanced B+ Tree of height h?",
                    options: [
                              "O(1)",
                              "O(log N)",
                              "O(N)",
                              "O(N log N)"
                    ],
                    correctIndex: 1,
                    explanation: "Search, insertion, and deletion in a balanced B+ tree execute in O(log N) operations proportional to height."
          },
          {
                    id: "q5",
                    question: "What is a Covering Index in relational query execution?",
                    options: [
                              "An index that covers foreign keys only",
                              "An index containing all columns requested by a query, avoiding table lookups",
                              "An encrypted index",
                              "An automatic temporary index created during JOIN"
                    ],
                    correctIndex: 1,
                    explanation: "A covering index contains all columns in the SELECT and WHERE clauses, satisfying the query directly from index pages."
          }
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
                    question: "Which command reveals the internal plan chosen by the database engine to execute a SQL query?",
                    options: [
                              "ANALYZE QUERY",
                              "EXPLAIN / EXPLAIN ANALYZE",
                              "DESCRIBE PLAN",
                              "SHOW INDEXES"
                    ],
                    correctIndex: 1,
                    explanation: "EXPLAIN outputs the query optimizer's chosen execution plan, showing scan types, joins, and estimated costs."
          },
          {
                    id: "q2",
                    question: "Why should SELECT * be avoided in high-performance production databases?",
                    options: [
                              "It prevents the optimizer from using index-only scans and increases I/O network bandwidth",
                              "It triggers automatic table locks",
                              "It forces transactions to abort",
                              "It invalidates foreign keys"
                    ],
                    correctIndex: 0,
                    explanation: "SELECT * retrieves unnecessary columns, preventing covering index optimization and wasting memory and bandwidth."
          },
          {
                    id: "q3",
                    question: "What type of join algorithm is preferred by optimizers when both inputs are sorted on the join key?",
                    options: [
                              "Nested Loop Join",
                              "Sort-Merge Join",
                              "Hash Join",
                              "Cartesian Product"
                    ],
                    correctIndex: 1,
                    explanation: "Sort-Merge Join is highly efficient when inputs are pre-sorted or indexed, scanning both datasets linearly."
          },
          {
                    id: "q4",
                    question: "What metric does a Cost-Based Optimizer (CBO) estimate to choose the best query execution plan?",
                    options: [
                              "CPU cost, disk I/O page reads, and memory footprint",
                              "Number of characters in the SQL query",
                              "User access privilege tier",
                              "Date the table was created"
                    ],
                    correctIndex: 0,
                    explanation: "CBO calculates estimated costs using table statistics, cardinality, I/O operations, and CPU cycles."
          },
          {
                    id: "q5",
                    question: "What is a 'Full Table Scan' and when does the optimizer typically choose it?",
                    options: [
                              "Reading all index nodes",
                              "Reading every block in the table sequentially; chosen when filtering non-indexed columns or high selectivity",
                              "Scanning foreign keys only",
                              "Scanning data in cache memory only"
                    ],
                    correctIndex: 1,
                    explanation: "A Full Table Scan reads every page in a table sequentially, chosen when no index applies or a large percentage of rows match."
          }
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
        xp: 100,
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
                    question: "What is Role-Based Access Control (RBAC) in database administration?",
                    options: [
                              "Assigning permissions to roles rather than directly to individual users",
                              "Encrypting passwords with SHA-256",
                              "Creating backup replicas",
                              "Limiting connection pool sizes"
                    ],
                    correctIndex: 0,
                    explanation: "RBAC simplifies access governance by granting permissions to roles and assigning users to appropriate roles."
          },
          {
                    id: "q2",
                    question: "Which SQL command is used to grant privileges to a database user or role?",
                    options: [
                              "ALLOW",
                              "PERMIT",
                              "GRANT",
                              "AUTHORIZE"
                    ],
                    correctIndex: 2,
                    explanation: "The GRANT statement assigns SELECT, INSERT, UPDATE, or administrative privileges to roles or users."
          },
          {
                    id: "q3",
                    question: "What is the most effective defense against SQL Injection vulnerabilities?",
                    options: [
                              "Using parameterized queries / prepared statements",
                              "Storing passwords in plaintext",
                              "Disabling indexes",
                              "Using SELECT * queries"
                    ],
                    correctIndex: 0,
                    explanation: "Parameterized queries separate SQL code from untrusted user input, neutralizing injection attacks."
          },
          {
                    id: "q4",
                    question: "Which SQL command revokes previously granted database permissions?",
                    options: [
                              "DENY ALL",
                              "REVOKE",
                              "REMOVE PRIVILEGE",
                              "DROP ACCESS"
                    ],
                    correctIndex: 1,
                    explanation: "REVOKE removes specified access rights from database accounts or roles."
          },
          {
                    id: "q5",
                    question: "What database security feature allows masking sensitive columns (e.g. credit cards) for unauthorized roles?",
                    options: [
                              "Dynamic Data Masking (DDM)",
                              "B-Tree Rebalancing",
                              "Foreign Key Cascading",
                              "Two-Phase Commit"
                    ],
                    correctIndex: 0,
                    explanation: "Dynamic Data Masking obfuscates sensitive data in query results in real time based on user role authorization."
          }
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
        xp: 100,
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
                    question: "What is the worst-case time complexity of accessing an element in an array by its index?",
                    options: [
                              "O(1)",
                              "O(log N)",
                              "O(N)",
                              "O(N^2)"
                    ],
                    correctIndex: 0,
                    explanation: "Array elements are stored contiguously in memory, allowing constant time O(1) random access via base + index * size."
          },
          {
                    id: "q2",
                    question: "Which Big-O notation describes an algorithm whose execution time doubles with each additional input element?",
                    options: [
                              "O(N log N)",
                              "O(N^2)",
                              "O(2^N)",
                              "O(N!)"
                    ],
                    correctIndex: 2,
                    explanation: "Exponential time complexity O(2^N) doubles operations with every increment in input size N."
          },
          {
                    id: "q3",
                    question: "What does Space Complexity analyze in an algorithm?",
                    options: [
                              "Disk storage required for source code",
                              "Total working memory (RAM) used by algorithm relative to input size",
                              "Number of lines of code",
                              "Network bandwidth consumed"
                    ],
                    correctIndex: 1,
                    explanation: "Space complexity measures auxiliary memory and input storage required as a function of input size N."
          },
          {
                    id: "q4",
                    question: "If an algorithm repeatedly halves the problem size at each step (e.g. Binary Search), its time complexity is:",
                    options: [
                              "O(1)",
                              "O(log N)",
                              "O(N)",
                              "O(N log N)"
                    ],
                    correctIndex: 1,
                    explanation: "Halving the search space repeatedly leads to a logarithmic time complexity of O(log N)."
          },
          {
                    id: "q5",
                    question: "Which of the following functions grows the slowest as N approaches infinity?",
                    options: [
                              "O(log N)",
                              "O(sqrt(N))",
                              "O(N)",
                              "O(N log N)"
                    ],
                    correctIndex: 0,
                    explanation: "Logarithmic growth O(log N) is significantly slower than polynomial or linear growth functions."
          }
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
        xp: 100,
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
                    question: "What is the amortized time complexity of appending an element to a dynamic array (e.g., C++ vector or Java ArrayList)?",
                    options: [
                              "O(1)",
                              "O(N)",
                              "O(log N)",
                              "O(N^2)"
                    ],
                    correctIndex: 0,
                    explanation: "Dynamic array capacity doubling ensures that geometric reallocations average out to O(1) amortized time per insertion."
          },
          {
                    id: "q2",
                    question: "What is the time complexity of inserting an element at the beginning (index 0) of an array of size N?",
                    options: [
                              "O(1)",
                              "O(N)",
                              "O(log N)",
                              "O(N log N)"
                    ],
                    correctIndex: 1,
                    explanation: "Inserting at the front requires shifting all existing N elements one position to the right, taking O(N) operations."
          },
          {
                    id: "q3",
                    question: "Which algorithmic technique uses two indices traversing an array towards each other to find pair sums in O(N)?",
                    options: [
                              "Two Pointers Technique",
                              "Breadth-First Search",
                              "Binary Lifting",
                              "KMP Algorithm"
                    ],
                    correctIndex: 0,
                    explanation: "The Two Pointers pattern moves left and right pointers towards each other on a sorted array in linear O(N) time."
          },
          {
                    id: "q4",
                    question: "What is the primary drawback of static arrays compared to dynamic arrays?",
                    options: [
                              "Cannot store primitive numbers",
                              "Fixed size determined at compile/allocation time that cannot grow dynamically",
                              "Slow index lookup",
                              "Higher cache miss rate"
                    ],
                    correctIndex: 1,
                    explanation: "Static arrays have a immutable capacity fixed at declaration, risking buffer overflow or memory waste."
          },
          {
                    id: "q5",
                    question: "The Sliding Window technique is optimal for solving which type of array problem?",
                    options: [
                              "Subarray sum, longest contiguous substring, and windowed maximums",
                              "Topological sorting of nodes",
                              "Shortest path in weighted graph",
                              "Balanced tree rotations"
                    ],
                    correctIndex: 0,
                    explanation: "Sliding Window efficiently computes contiguous subarray/substring metrics in O(N) by maintaining running window bounds."
          }
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
        xp: 100,
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
                    question: "What is the time complexity of checking if a string of length N is a palindrome using two pointers?",
                    options: [
                              "O(N^2)",
                              "O(N)",
                              "O(log N)",
                              "O(1)"
                    ],
                    correctIndex: 1,
                    explanation: "Comparing characters from both ends inwards takes N/2 comparisons, which is O(N) linear time."
          },
          {
                    id: "q2",
                    question: "Which algorithm performs exact substring pattern matching in linear O(N + M) time using a prefix failure function?",
                    options: [
                              "Knuth-Morris-Pratt (KMP)",
                              "Dijkstra's Algorithm",
                              "Kruskal's Algorithm",
                              "Bellman-Ford"
                    ],
                    correctIndex: 0,
                    explanation: "The KMP algorithm preprocesses pattern prefixes (LPS array) to skip redundant comparisons in O(N + M) time."
          },
          {
                    id: "q3",
                    question: "Which data structure is most effective for prefix-based string auto-completion and dictionary lookups?",
                    options: [
                              "Trie (Prefix Tree)",
                              "Max Heap",
                              "Stack",
                              "Adjacency List"
                    ],
                    correctIndex: 0,
                    explanation: "A Trie stores characters hierarchically at edges/nodes, allowing prefix searches in O(L) time where L is word length."
          },
          {
                    id: "q4",
                    question: "What does the Rabin-Karp algorithm use to search for substring patterns efficiently?",
                    options: [
                              "Rolling Hash Function",
                              "Dynamic Programming Table",
                              "Segment Tree",
                              "Disjoint Set Union"
                    ],
                    correctIndex: 0,
                    explanation: "Rabin-Karp calculates a rolling hash of the sliding pattern window, allowing O(1) hash updates per character shift."
          },
          {
                    id: "q5",
                    question: "What is an Anagram of a string?",
                    options: [
                              "A string with identical characters in different permutation order",
                              "A reversed string",
                              "A substring of odd length",
                              "An encrypted hash string"
                    ],
                    correctIndex: 0,
                    explanation: "Two strings are anagrams if they contain identical character frequencies rearranged in different order."
          }
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
        xp: 100,
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
                    question: "What is the time complexity to insert a new node at the head of a Singly Linked List?",
                    options: [
                              "O(1)",
                              "O(N)",
                              "O(log N)",
                              "O(N^2)"
                    ],
                    correctIndex: 0,
                    explanation: "Prepending to a linked list simply updates the new node's next pointer and head reference in O(1) constant time."
          },
          {
                    id: "q2",
                    question: "Which algorithm detects a cycle in a linked list using slow and fast pointers in O(1) auxiliary space?",
                    options: [
                              "Floyd's Tortoise and Hare Cycle Detection",
                              "Kadane's Algorithm",
                              "Dijkstra's Algorithm",
                              "Boyer-Moore Voting"
                    ],
                    correctIndex: 0,
                    explanation: "Floyd's cycle-finding algorithm moves a slow pointer by 1 and fast by 2 steps; if a cycle exists, they must meet."
          },
          {
                    id: "q3",
                    question: "What advantage does a Doubly Linked List have over a Singly Linked List?",
                    options: [
                              "Takes less memory per node",
                              "Allows bidirectional traversal and O(1) node deletion given the node pointer",
                              "Supports random index access in O(1)",
                              "Guarantees balanced height"
                    ],
                    correctIndex: 1,
                    explanation: "Having both next and previous pointers allows backward traversal and immediate O(1) deletion of an arbitrary node."
          },
          {
                    id: "q4",
                    question: "What is the time complexity to access the k-th element in a linked list of length N?",
                    options: [
                              "O(1)",
                              "O(k)",
                              "O(log N)",
                              "O(N log N)"
                    ],
                    correctIndex: 1,
                    explanation: "Because linked list nodes are dispersed in heap memory without contiguous indexing, traversing to node k takes O(k) steps."
          },
          {
                    id: "q5",
                    question: "How do you reverse a Singly Linked List iteratively in O(N) time and O(1) space?",
                    options: [
                              "Using three pointers: prev, current, and next",
                              "Recursively creating duplicate nodes",
                              "Converting the list into an array",
                              "Using binary search pointers"
                    ],
                    correctIndex: 0,
                    explanation: "Reversing iteratively in-place requires three tracking pointers (prev, curr, next) to reorient each node's pointer."
          }
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
        xp: 100,
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
                    question: "Which ordering principle governs a Stack data structure?",
                    options: [
                              "FIFO (First In First Out)",
                              "LIFO (Last In First Out)",
                              "Priority Order",
                              "Random Order"
                    ],
                    correctIndex: 1,
                    explanation: "A Stack follows Last In, First Out (LIFO), where the most recently added item is the first to be popped."
          },
          {
                    id: "q2",
                    question: "What is the time complexity of Stack push() and pop() operations?",
                    options: [
                              "O(1)",
                              "O(N)",
                              "O(log N)",
                              "O(N^2)"
                    ],
                    correctIndex: 0,
                    explanation: "Adding or removing from the top of the stack takes constant time O(1)."
          },
          {
                    id: "q3",
                    question: "Which algorithmic problem is classic for Stacks?",
                    options: [
                              "Balanced Parentheses validation and arithmetic expression evaluation (RPN)",
                              "Finding shortest path in road map",
                              "Sorting floating point numbers",
                              "Minimum spanning tree"
                    ],
                    correctIndex: 0,
                    explanation: "Bracket matching, call stack management, and Reverse Polish Notation evaluation natively rely on LIFO stacks."
          },
          {
                    id: "q4",
                    question: "What does a Monotonic Stack maintain?",
                    options: [
                              "Elements in strictly increasing or decreasing order for O(N) Next Greater Element queries",
                              "Only positive integers",
                              "Nodes in random tree order",
                              "Elements sorted by hash codes"
                    ],
                    correctIndex: 0,
                    explanation: "A monotonic stack keeps elements monotonically ordered to find next greater or previous smaller elements in O(N)."
          },
          {
                    id: "q5",
                    question: "What condition occurs when attempting to pop an element from an empty Stack?",
                    options: [
                              "Stack Overflow",
                              "Stack Underflow",
                              "Memory Segmentation Fault",
                              "Cycle Detection"
                    ],
                    correctIndex: 1,
                    explanation: "Stack Underflow happens when a pop or peek operation is requested on an empty stack."
          }
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
        xp: 100,
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
                    question: "Which ordering discipline governs a standard Queue?",
                    options: [
                              "LIFO (Last In First Out)",
                              "FIFO (First In First Out)",
                              "FILO (First In Last Out)",
                              "Random Order"
                    ],
                    correctIndex: 1,
                    explanation: "Queues follow First In, First Out (FIFO): elements are enqueued at the rear and dequeued from the front."
          },
          {
                    id: "q2",
                    question: "Which graph traversal algorithm fundamentally relies on a FIFO Queue?",
                    options: [
                              "Depth-First Search (DFS)",
                              "Breadth-First Search (BFS)",
                              "Prim's Algorithm",
                              "Binary Search"
                    ],
                    correctIndex: 1,
                    explanation: "BFS explores nodes level-by-level using a FIFO queue to visit immediate neighbors before moving deeper."
          },
          {
                    id: "q3",
                    question: "What is a Deque (Double-Ended Queue)?",
                    options: [
                              "A queue where insertions and deletions are permitted at both front and back in O(1)",
                              "A queue that holds only two elements",
                              "A priority heap queue",
                              "A recursive stack"
                    ],
                    correctIndex: 0,
                    explanation: "A Deque supports efficient O(1) push and pop operations at both the head and tail endpoints."
          },
          {
                    id: "q4",
                    question: "What problem does a Circular Queue solve in static array implementations?",
                    options: [
                              "Prevents memory waste by reusing vacated front positions via modulo indexing",
                              "Prevents duplicate keys",
                              "Automatically sorts numbers",
                              "Eliminates pointer overhead"
                    ],
                    correctIndex: 0,
                    explanation: "A circular queue wraps indices using (rear + 1) % capacity, reusing deallocated front slots."
          },
          {
                    id: "q5",
                    question: "In a Priority Queue backed by a binary heap, what is the time complexity to extract the highest priority element?",
                    options: [
                              "O(1)",
                              "O(log N)",
                              "O(N)",
                              "O(N log N)"
                    ],
                    correctIndex: 1,
                    explanation: "Extracting the root takes O(1), but restoring the heap invariant requires percolating down in O(log N) time."
          }
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
        xp: 100,
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
                    question: "What essential condition must every recursive function have to prevent infinite call recursion?",
                    options: [
                              "Base Case",
                              "Memoization Table",
                              "While loop",
                              "Global variable"
                    ],
                    correctIndex: 0,
                    explanation: "The base case terminates recursion and returns a direct result, preventing infinite recursion and stack overflow."
          },
          {
                    id: "q2",
                    question: "What happens to the program call stack when a recursive function lacks a valid base case?",
                    options: [
                              "Heap Out of Memory",
                              "Call Stack Overflow",
                              "CPU Cache Coherence Fault",
                              "Deadlock"
                    ],
                    correctIndex: 1,
                    explanation: "Repeated function calls continuously allocate stack frames until the OS-allocated stack limit is exceeded."
          },
          {
                    id: "q3",
                    question: "Which problem-solving paradigm systematically explores candidate solutions and abandons ('backtracks') non-viable paths?",
                    options: [
                              "Divide and Conquer",
                              "Backtracking",
                              "Greedy Algorithm",
                              "Dynamic Programming"
                    ],
                    correctIndex: 1,
                    explanation: "Backtracking builds candidates incrementally and abandons branches that fail problem constraints (e.g., N-Queens, Sudoku)."
          },
          {
                    id: "q4",
                    question: "What is Tail Recursion?",
                    options: [
                              "A recursive call that occurs as the very last statement in the function",
                              "A function that calls two subroutines",
                              "A function that has no return value",
                              "Recursion that uses heap memory"
                    ],
                    correctIndex: 0,
                    explanation: "In tail recursion, the recursive call is the final operation, allowing compilers to optimize stack frames into loops."
          },
          {
                    id: "q5",
                    question: "What is the time complexity of solving the classical Tower of Hanoi puzzle with N disks?",
                    options: [
                              "O(N)",
                              "O(N^2)",
                              "O(2^N)",
                              "O(N!)"
                    ],
                    correctIndex: 2,
                    explanation: "Tower of Hanoi requires 2^N - 1 minimum moves, which is O(2^N) exponential time complexity."
          }
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
        xp: 100,
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
                    question: "In a Binary Search Tree (BST), what property holds for the left subtree of any node with value X?",
                    options: [
                              "All node values in the left subtree are strictly less than X",
                              "All node values are greater than X",
                              "Left subtree must have equal height to right",
                              "Left child must be a leaf node"
                    ],
                    correctIndex: 0,
                    explanation: "In a BST, every key in the left subtree is less than the root, and every key in the right subtree is greater."
          },
          {
                    id: "q2",
                    question: "Which tree traversal order visits nodes in strictly ascending numerical order for a Binary Search Tree?",
                    options: [
                              "Pre-order (Root, Left, Right)",
                              "In-order (Left, Root, Right)",
                              "Post-order (Left, Right, Root)",
                              "Level-order (BFS)"
                    ],
                    correctIndex: 1,
                    explanation: "In-order traversal (Left -> Node -> Right) visits BST elements in sorted non-decreasing order."
          },
          {
                    id: "q3",
                    question: "What is the worst-case time complexity of searching in an unbalanced, skewed Binary Search Tree?",
                    options: [
                              "O(1)",
                              "O(log N)",
                              "O(N)",
                              "O(N log N)"
                    ],
                    correctIndex: 2,
                    explanation: "If elements are inserted in sorted order, an unbalancing BST degenerates into a linked list of height N, taking O(N) search time."
          },
          {
                    id: "q4",
                    question: "How do AVL trees maintain O(log N) worst-case search complexity?",
                    options: [
                              "By enforcing that height difference between left and right subtrees is at most 1 via tree rotations",
                              "By storing duplicates in separate chains",
                              "By capping tree height at 5",
                              "By sorting nodes into hash buckets"
                    ],
                    correctIndex: 0,
                    explanation: "AVL trees are self-balancing BSTs maintaining a balance factor in {-1, 0, +1} using single and double rotations."
          },
          {
                    id: "q5",
                    question: "What is the maximum number of nodes in a full binary tree of height H (where root is height 0)?",
                    options: [
                              "2^H",
                              "2^(H + 1) - 1",
                              "H^2",
                              "2H + 1"
                    ],
                    correctIndex: 1,
                    explanation: "A full binary tree has 1 + 2 + 4 + ... + 2^H = 2^(H+1) - 1 maximum nodes."
          }
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
        xp: 100,
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
                    question: "Which algorithm finds the single-source shortest path in a graph with non-negative edge weights?",
                    options: [
                              "Dijkstra's Algorithm",
                              "Kruskal's Algorithm",
                              "Floyd-Warshall",
                              "Tarjan's SCC Algorithm"
                    ],
                    correctIndex: 0,
                    explanation: "Dijkstra's algorithm uses a min-priority queue to find optimal shortest paths from a source in O((V + E) log V)."
          },
          {
                    id: "q2",
                    question: "What graph representation is most space-efficient for sparse graphs where |E| << |V|^2?",
                    options: [
                              "Adjacency Matrix",
                              "Adjacency List",
                              "Incidence Matrix",
                              "Complete Matrix"
                    ],
                    correctIndex: 1,
                    explanation: "Adjacency Lists use O(V + E) space, which is far more efficient than an O(V^2) Adjacency Matrix for sparse graphs."
          },
          {
                    id: "q3",
                    question: "Which algorithm is used to compute the Minimum Spanning Tree (MST) using edge sorting and Union-Find?",
                    options: [
                              "Kruskal's Algorithm",
                              "Bellman-Ford Algorithm",
                              "Dijkstra's Algorithm",
                              "Breadth-First Search"
                    ],
                    correctIndex: 0,
                    explanation: "Kruskal's greedy algorithm sorts edges by weight and adds them to the MST if they do not create cycles using Disjoint Set Union."
          },
          {
                    id: "q4",
                    question: "Topological Sorting can only be performed on which class of graphs?",
                    options: [
                              "Directed Acyclic Graphs (DAG)",
                              "Undirected Bipartite Graphs",
                              "Complete Connected Graphs",
                              "Cyclic Directed Graphs"
                    ],
                    correctIndex: 0,
                    explanation: "Topological ordering orders vertices such that for every directed edge u -> v, u comes before v; cycles make this impossible."
          },
          {
                    id: "q5",
                    question: "Which algorithm detects negative weight cycles and finds shortest paths in graphs with negative edges?",
                    options: [
                              "Bellman-Ford Algorithm",
                              "Dijkstra's Algorithm",
                              "Prim's Algorithm",
                              "BFS"
                    ],
                    correctIndex: 0,
                    explanation: "Bellman-Ford relaxes all edges V-1 times and detects negative cycles in O(V * E) time."
          }
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
        xp: 100,
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
                    question: "What is the average and worst-case time complexity of Merge Sort?",
                    options: [
                              "Average: O(N log N), Worst: O(N log N)",
                              "Average: O(N log N), Worst: O(N^2)",
                              "Average: O(N^2), Worst: O(N^2)",
                              "Average: O(N), Worst: O(N log N)"
                    ],
                    correctIndex: 0,
                    explanation: "Merge Sort consistently divides the input in half and merges sorted sub-arrays, guaranteeing O(N log N) in all cases."
          },
          {
                    id: "q2",
                    question: "What is the worst-case time complexity of Quick Sort (e.g. when pivot is chosen poorly)?",
                    options: [
                              "O(N log N)",
                              "O(N)",
                              "O(N^2)",
                              "O(2^N)"
                    ],
                    correctIndex: 2,
                    explanation: "If the smallest or largest element is consistently picked as the pivot on sorted data, Quick Sort degrades to O(N^2)."
          },
          {
                    id: "q3",
                    question: "What does it mean for a sorting algorithm to be 'Stable'?",
                    options: [
                              "It runs in O(N log N) time without crashing",
                              "It preserves the relative input order of elements with equal keys",
                              "It uses O(1) extra space",
                              "It does not use recursion"
                    ],
                    correctIndex: 1,
                    explanation: "A stable sort preserves the initial relative order of equal keys (e.g. Merge Sort, Insertion Sort)."
          },
          {
                    id: "q4",
                    question: "Which non-comparison sorting algorithm runs in O(N + K) linear time for bounded integer ranges?",
                    options: [
                              "Counting Sort",
                              "Heap Sort",
                              "Quick Sort",
                              "Selection Sort"
                    ],
                    correctIndex: 0,
                    explanation: "Counting Sort tallies frequencies of keys in range [0, K], executing in O(N + K) without pairwise comparisons."
          },
          {
                    id: "q5",
                    question: "Which in-place comparison sorting algorithm guarantees O(N log N) worst-case time without recursion?",
                    options: [
                              "Heap Sort",
                              "Bubble Sort",
                              "Insertion Sort",
                              "Counting Sort"
                    ],
                    correctIndex: 0,
                    explanation: "Heap Sort builds a max heap in O(N) and repeatedly extracts the root in O(log N), taking O(N log N) in-place."
          }
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
        xp: 100,
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
                    question: "What prerequisite condition must be met before performing Binary Search on an array?",
                    options: [
                              "Array must be sorted in monotonic order",
                              "Array must contain only unique values",
                              "Array size must be a power of 2",
                              "Array must be allocated dynamically"
                    ],
                    correctIndex: 0,
                    explanation: "Binary search relies on sorted ordering to eliminate half of the remaining elements at each comparison."
          },
          {
                    id: "q2",
                    question: "What is the worst-case number of comparisons in Binary Search on an array of size N?",
                    options: [
                              "O(log2 N)",
                              "O(N)",
                              "O(N/2)",
                              "O(1)"
                    ],
                    correctIndex: 0,
                    explanation: "Binary search halves the search space each step, requiring at most floor(log2 N) + 1 comparisons."
          },
          {
                    id: "q3",
                    question: "Which variation of Binary Search finds the first element that is greater than or equal to a target value?",
                    options: [
                              "Lower Bound (std::lower_bound)",
                              "Upper Bound",
                              "Exact Match",
                              "Linear Scan"
                    ],
                    correctIndex: 0,
                    explanation: "Lower bound returns an iterator/index to the first element that is not less than (i.e. >=) the target."
          },
          {
                    id: "q4",
                    question: "How should mid be calculated in binary search to prevent 32-bit integer overflow?",
                    options: [
                              "mid = (low + high) / 2",
                              "mid = low + (high - low) / 2",
                              "mid = (low * high) / 2",
                              "mid = (high + 1) / 2"
                    ],
                    correctIndex: 1,
                    explanation: "low + (high - low) / 2 avoids the arithmetic overflow that occurs when (low + high) exceeds 2^31 - 1."
          },
          {
                    id: "q5",
                    question: "Binary Search can also be used on continuous monotonic answer spaces. This technique is known as:",
                    options: [
                              "Binary Search on Answer",
                              "Interpolation Sort",
                              "Dynamic Divide",
                              "Sliding Search"
                    ],
                    correctIndex: 0,
                    explanation: "Binary Search on Answer tests whether a candidate answer is feasible and adjusts bounds accordingly."
          }
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
        xp: 100,
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
                    question: "What two properties must a problem exhibit to be solvable via Dynamic Programming?",
                    options: [
                              "Optimal Substructure and Overlapping Subproblems",
                              "Greedy Choice and Binary Splitting",
                              "Linear Memory and Static Bounds",
                              "NP-Complete and Divide-and-Conquer"
                    ],
                    correctIndex: 0,
                    explanation: "DP applies when an optimal solution contains optimal sub-solutions and subproblems are repeatedly computed."
          },
          {
                    id: "q2",
                    question: "How does Memoization differ from Tabulation in Dynamic Programming?",
                    options: [
                              "Memoization is top-down recursive caching; Tabulation is bottom-up iterative table filling",
                              "Memoization uses O(1) space while Tabulation is exponential",
                              "Tabulation cannot solve knapsack problems",
                              "Memoization avoids recursion"
                    ],
                    correctIndex: 0,
                    explanation: "Top-down memoization caches recursive results on demand; bottom-up tabulation iteratively builds base cases upwards."
          },
          {
                    id: "q3",
                    question: "What is the time complexity of solving the 0/1 Knapsack problem with N items and maximum capacity W?",
                    options: [
                              "O(N * W)",
                              "O(2^N)",
                              "O(N + W)",
                              "O(N log W)"
                    ],
                    correctIndex: 0,
                    explanation: "The pseudo-polynomial DP approach fills an N x W matrix, requiring O(N * W) time and space."
          },
          {
                    id: "q4",
                    question: "In the Longest Common Subsequence (LCS) problem for strings of length N and M, what is the DP state transition when characters match (A[i] == B[j])?",
                    options: [
                              "dp[i][j] = dp[i-1][j-1] + 1",
                              "dp[i][j] = max(dp[i-1][j], dp[i][j-1])",
                              "dp[i][j] = dp[i-1][j] + dp[i][j-1]",
                              "dp[i][j] = 0"
                    ],
                    correctIndex: 0,
                    explanation: "When current characters match, LCS extends the optimal subsequence of previous prefixes: dp[i-1][j-1] + 1."
          },
          {
                    id: "q5",
                    question: "Which technique optimizes DP space complexity when the current state only depends on the immediately preceding row?",
                    options: [
                              "State Space Compression (Rolling Array)",
                              "Binary Lifting",
                              "Memoization Flush",
                              "Matrix Inversion"
                    ],
                    correctIndex: 0,
                    explanation: "Using a rolling array of 2 rows (or 1D array) reduces space from O(N * W) down to O(W)."
          }
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
        xp: 100,
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
                    question: "What is the primary purpose of Dual-Mode operation (User Mode vs Kernel Mode) in modern CPUs?",
                    options: [
                              "Prevent user applications from executing privileged instructions that could compromise OS integrity",
                              "Speed up clock speed",
                              "Enable multi-threading",
                              "Reduce RAM power consumption"
                    ],
                    correctIndex: 0,
                    explanation: "Dual-mode hardware separates user space from kernel space, protecting memory, I/O devices, and CPU registers."
          },
          {
                    id: "q2",
                    question: "Which mechanism transitions CPU execution from User Mode into Kernel Mode?",
                    options: [
                              "System Call / Software Interrupt (Trap)",
                              "Arithmetic overflow",
                              "Thread context switch",
                              "Pointer dereference"
                    ],
                    correctIndex: 0,
                    explanation: "A System Call uses a software trap interrupt to switch the CPU mode bit to kernel mode to perform OS services."
          },
          {
                    id: "q3",
                    question: "What distinguishes a Microkernel architecture from a Monolithic kernel architecture?",
                    options: [
                              "Microkernels run device drivers and file systems in user space, keeping only IPC and scheduling in kernel",
                              "Monolithic kernels cannot handle file I/O",
                              "Microkernels are always written in assembly",
                              "Monolithic kernels do not support virtual memory"
                    ],
                    correctIndex: 0,
                    explanation: "Microkernels minimize kernel code by moving non-essential components (drivers, file systems) to user space services."
          },
          {
                    id: "q4",
                    question: "Which instruction is considered a privileged CPU instruction restricted strictly to Kernel Mode?",
                    options: [
                              "Add two registers",
                              "Disable CPU hardware interrupts (CLI)",
                              "Jump to subroutine (CALL)",
                              "Compare integers"
                    ],
                    correctIndex: 1,
                    explanation: "Disabling hardware interrupts, altering page tables, and direct I/O port writes are privileged kernel instructions."
          },
          {
                    id: "q5",
                    question: "What is the role of the OS Interrupt Vector Table (IVT)?",
                    options: [
                              "Maps interrupt numbers to specific interrupt service routine (ISR) handler memory addresses",
                              "Stores process priority scores",
                              "Tracks open file descriptors",
                              "Allocates virtual swap blocks"
                    ],
                    correctIndex: 0,
                    explanation: "The Interrupt Vector Table maps hardware and software interrupt codes directly to their corresponding kernel ISR routines."
          }
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
        xp: 100,
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
                    question: "What core data structure maintains all state and control information for an active process in the OS kernel?",
                    options: [
                              "Process Control Block (PCB)",
                              "Inode Table",
                              "Translation Lookaside Buffer (TLB)",
                              "File Descriptor Map"
                    ],
                    correctIndex: 0,
                    explanation: "The PCB stores PID, program counter, CPU registers, process state, memory limits, and open I/O handles."
          },
          {
                    id: "q2",
                    question: "When a process is waiting for I/O completion, what state is it placed in?",
                    options: [
                              "Ready",
                              "Running",
                              "Blocked / Waiting",
                              "Terminated"
                    ],
                    correctIndex: 2,
                    explanation: "A process waiting for an external event or I/O operation enters the Blocked/Waiting state and yields the CPU."
          },
          {
                    id: "q3",
                    question: "What system call creates a duplicate child process in UNIX/Linux systems?",
                    options: [
                              "fork()",
                              "exec()",
                              "pthread_create()",
                              "wait()"
                    ],
                    correctIndex: 0,
                    explanation: "fork() creates an exact copy of the calling parent process with a distinct Process ID (PID)."
          },
          {
                    id: "q4",
                    question: "What is a 'Zombie Process' in operating systems?",
                    options: [
                              "A process that has completed execution but still has an entry in the process table because parent has not called wait()",
                              "A process running infinite loops",
                              "A process consuming 100% CPU",
                              "A background daemon"
                    ],
                    correctIndex: 0,
                    explanation: "A zombie process has exited, but retains its PCB entry until its parent reads its exit status using wait()."
          },
          {
                    id: "q5",
                    question: "What is an 'Orphan Process'?",
                    options: [
                              "A child process whose parent process terminated before it did",
                              "A process with no PID",
                              "A process with multiple threads",
                              "A process that cannot access RAM"
                    ],
                    correctIndex: 0,
                    explanation: "When a parent exits before its child, the child becomes an orphan and is adopted by the init/systemd (PID 1) process."
          }
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
        xp: 100,
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
                    question: "What resources are shared among all threads belonging to the same process?",
                    options: [
                              "Address space, code segment, data segment, and open files",
                              "CPU registers and Program Counter",
                              "Stack memory frames",
                              "Thread ID"
                    ],
                    correctIndex: 0,
                    explanation: "Threads of the same process share heap memory, global variables, code, and files, but each has its own stack and registers."
          },
          {
                    id: "q2",
                    question: "Why is context switching between threads faster than context switching between separate processes?",
                    options: [
                              "Threads do not require changing the virtual address space (CR3 register) or flushing the TLB cache",
                              "Threads do not use CPU registers",
                              "Threads do not use RAM",
                              "Threads bypass the kernel scheduler"
                    ],
                    correctIndex: 0,
                    explanation: "Thread switching maintains the same memory map and page tables, avoiding expensive TLB cache flushes."
          },
          {
                    id: "q3",
                    question: "What issue arises when multiple threads access shared mutable data without proper synchronization?",
                    options: [
                              "Race Condition",
                              "Paging Fault",
                              "Cache Thrashing",
                              "Page Inversion"
                    ],
                    correctIndex: 0,
                    explanation: "A race condition occurs when concurrent threads access shared data and the final outcome depends on execution timing."
          },
          {
                    id: "q4",
                    question: "What is a major advantage of Kernel-Level Threads (KLT) over User-Level Threads (ULT)?",
                    options: [
                              "If one thread blocks on I/O, other threads in the process can continue executing on other CPU cores",
                              "Context switching is done entirely in user space",
                              "They use zero kernel memory",
                              "They do not require system calls to create"
                    ],
                    correctIndex: 0,
                    explanation: "The OS kernel manages KLTs natively, scheduling independent threads across multiple physical CPU cores simultaneously."
          },
          {
                    id: "q5",
                    question: "What synchronization primitive provides mutual exclusion by allowing only one thread into a critical section?",
                    options: [
                              "Mutex (Mutual Exclusion Lock)",
                              "Spinlock barrier",
                              "Round robin flag",
                              "Condition signal"
                    ],
                    correctIndex: 0,
                    explanation: "A Mutex lock ensures exclusive access so that only one thread can execute within the critical section at a time."
          }
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
        xp: 100,
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
                    question: "Which CPU scheduling algorithm is prone to the 'Convoy Effect', where short jobs get stuck behind a long job?",
                    options: [
                              "First-Come, First-Served (FCFS)",
                              "Shortest Job First (SJF)",
                              "Round Robin (RR)",
                              "Priority Preemptive"
                    ],
                    correctIndex: 0,
                    explanation: "FCFS executes processes in arrival order; a long CPU-bound process at the front forces all shorter processes to wait."
          },
          {
                    id: "q2",
                    question: "Which scheduling algorithm provides the provably minimum average waiting time for a given set of stationary processes?",
                    options: [
                              "Shortest Job First (SJF)",
                              "First-Come, First-Served",
                              "Round Robin",
                              "Multilevel Feedback Queue"
                    ],
                    correctIndex: 0,
                    explanation: "SJF schedules the process with the shortest CPU burst next, mathematically minimizing average waiting time."
          },
          {
                    id: "q3",
                    question: "What parameter primarily governs the performance and responsiveness of Round Robin (RR) scheduling?",
                    options: [
                              "Time Quantum (Time Slice)",
                              "Disk rotational latency",
                              "RAM bus speed",
                              "Thread stack size"
                    ],
                    correctIndex: 0,
                    explanation: "If the time quantum is too large, RR behaves like FCFS; if too small, excessive context switching overhead degrades throughput."
          },
          {
                    id: "q4",
                    question: "What technique prevents Starvation of low-priority processes in priority scheduling systems?",
                    options: [
                              "Aging (gradually increasing process priority the longer it waits in ready queue)",
                              "Paging",
                              "Thread Pooling",
                              "Priority Inversion"
                    ],
                    correctIndex: 0,
                    explanation: "Aging gradually increases a waiting process's priority over time, guaranteeing it will eventually execute."
          },
          {
                    id: "q5",
                    question: "Which scheduler allows processes to move between queues based on their past CPU burst characteristics?",
                    options: [
                              "Multilevel Feedback Queue (MLFQ)",
                              "First-In First-Out",
                              "Lottery Scheduler",
                              "Shortest Remaining Time First"
                    ],
                    correctIndex: 0,
                    explanation: "MLFQ demotes CPU-intensive jobs to lower priority queues and keeps interactive I/O jobs in high-priority queues."
          }
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
        xp: 100,
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
                    question: "What three requirements must any valid solution to the Critical Section problem satisfy?",
                    options: [
                              "Mutual Exclusion, Progress, and Bounded Waiting",
                              "Atomicity, Durability, and Consistency",
                              "Paging, Swapping, and Segmentation",
                              "First-in, First-out, and Round-robin"
                    ],
                    correctIndex: 0,
                    explanation: "A critical section solution must ensure Mutual Exclusion, Progress (no deadlock), and Bounded Waiting (no starvation)."
          },
          {
                    id: "q2",
                    question: "What is the key difference between a Counting Semaphore and a Binary Semaphore?",
                    options: [
                              "A Counting Semaphore integer value can range across any non-negative integer to control finite resource instances",
                              "Counting semaphores cannot block threads",
                              "Binary semaphores are implemented in hardware only",
                              "Counting semaphores only work on 64-bit CPUs"
                    ],
                    correctIndex: 0,
                    explanation: "Counting semaphores control access to a pool of N identical resources; binary semaphores are restricted to 0 and 1."
          },
          {
                    id: "q3",
                    question: "What atomic hardware instruction is commonly used to implement spinlocks and mutex primitives?",
                    options: [
                              "Test-and-Set (or Compare-And-Swap)",
                              "Shift Logical Left",
                              "Move String",
                              "Return from Interrupt"
                    ],
                    correctIndex: 0,
                    explanation: "Test-and-Set and Compare-And-Swap (CAS) execute atomically in hardware, enabling lock acquisition without race conditions."
          },
          {
                    id: "q4",
                    question: "What is Priority Inversion in concurrent systems?",
                    options: [
                              "A high-priority process is indirectly preempted by a low-priority process holding a needed lock",
                              "A process changing its own priority",
                              "All processes assigned priority 0",
                              "Inverting CPU run queues"
                    ],
                    correctIndex: 0,
                    explanation: "Priority Inversion occurs when a high-priority task waits on a lock held by a lower-priority task, solved via Priority Inheritance."
          },
          {
                    id: "q5",
                    question: "What classical synchronization problem models resource sharing between producer and consumer threads using a shared buffer?",
                    options: [
                              "Bounded-Buffer (Producer-Consumer) Problem",
                              "Dining Philosophers",
                              "Sleeping Barber",
                              "Readers-Writers Problem"
                    ],
                    correctIndex: 0,
                    explanation: "The Bounded-Buffer problem synchronizes producers adding items and consumers removing items using semaphores and mutexes."
          }
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
        xp: 100,
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
                    question: "What are the four Coffman conditions necessary for a Deadlock to occur?",
                    options: [
                              "Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait",
                              "Atomicity, Consistency, Isolation, Durability",
                              "Paging, Segmentation, Swapping, Thrashing",
                              "First-in, Last-in, Round-robin, Aging"
                    ],
                    correctIndex: 0,
                    explanation: "Deadlock can only occur if Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait all hold simultaneously."
          },
          {
                    id: "q2",
                    question: "Which algorithm dynamically evaluates resource requests to avoid entering an 'Unsafe State' that could lead to deadlock?",
                    options: [
                              "Banker's Algorithm",
                              "Dijkstra's Algorithm",
                              "Peterson's Algorithm",
                              "Kruskal's Algorithm"
                    ],
                    correctIndex: 0,
                    explanation: "Banker's algorithm simulates resource allocations to verify that at least one safe execution sequence exists before granting requests."
          },
          {
                    id: "q3",
                    question: "How can the 'Circular Wait' condition be systematically prevented in an OS?",
                    options: [
                              "Impose a strict global numerical ordering on all resources and require processes to request resources in increasing order",
                              "Eliminate all mutual exclusion locks",
                              "Allow unlimited memory allocation",
                              "Kill every process after 5 minutes"
                    ],
                    correctIndex: 0,
                    explanation: "Enforcing that all resources are acquired strictly according to a global linear numbering scheme makes circular waiting impossible."
          },
          {
                    id: "q4",
                    question: "In a Resource Allocation Graph (RAG), if every resource type has exactly one single instance, what does a cycle indicate?",
                    options: [
                              "A deadlock definitely exists",
                              "A deadlock may exist depending on runtime",
                              "The system is running optimally",
                              "Resources are exhausted"
                    ],
                    correctIndex: 0,
                    explanation: "For single-instance resource types, a cycle in the Resource Allocation Graph is both necessary and sufficient for deadlock."
          },
          {
                    id: "q5",
                    question: "What strategy does the 'Ostrich Algorithm' adopt toward deadlocks?",
                    options: [
                              "Ignore the problem entirely because deadlocks occur rarely and prevention overhead is too high",
                              "Reboot immediately on every lock acquisition",
                              "Prevent all multi-threading",
                              "Use formal verification on all software"
                    ],
                    correctIndex: 0,
                    explanation: "The Ostrich algorithm assumes deadlocks are sufficiently rare that handling costs outweigh potential benefits (used in most general OSes)."
          }
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
        xp: 100,
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
                    question: "What hardware component translates Virtual Memory addresses to Physical RAM addresses?",
                    options: [
                              "Memory Management Unit (MMU)",
                              "Direct Memory Access (DMA) Controller",
                              "Arithmetic Logic Unit (ALU)",
                              "Translation Lookaside Buffer only"
                    ],
                    correctIndex: 0,
                    explanation: "The MMU hardware intercepts CPU memory references and translates virtual addresses to physical frames using page tables."
          },
          {
                    id: "q2",
                    question: "What is the primary role of the Translation Lookaside Buffer (TLB)?",
                    options: [
                              "A fast associative hardware cache storing recent virtual-to-physical address mappings",
                              "A swap partition on disk",
                              "A heap garbage collector",
                              "A register file for floating point numbers"
                    ],
                    correctIndex: 0,
                    explanation: "The TLB caches recent page table lookups, reducing memory access latency from multiple DRAM lookups to a single cycle."
          },
          {
                    id: "q3",
                    question: "What type of fragmentation occurs when allocated memory blocks have unused space inside the allocated boundary?",
                    options: [
                              "Internal Fragmentation",
                              "External Fragmentation",
                              "Segment Fragmentation",
                              "Dynamic Fragmentation"
                    ],
                    correctIndex: 0,
                    explanation: "Internal fragmentation happens when a process is allocated a fixed-size page larger than its actual data requirement."
          },
          {
                    id: "q4",
                    question: "What is External Fragmentation in memory management?",
                    options: [
                              "Total free memory exists to satisfy a request, but it is split into non-contiguous scattered holes",
                              "Page faults occurring too frequently",
                              "Stack memory exceeding limits",
                              "Heap overflow into kernel space"
                    ],
                    correctIndex: 0,
                    explanation: "External fragmentation occurs when free memory is divided into small scattered chunks, none of which is large enough alone."
          },
          {
                    id: "q5",
                    question: "In standard Paging, how is a Virtual Address logically partitioned by the MMU?",
                    options: [
                              "Page Number (p) and Page Offset (d)",
                              "Process ID and Segment Number",
                              "Physical Frame and Base Register",
                              "File Inode and Block Index"
                    ],
                    correctIndex: 0,
                    explanation: "Virtual addresses consist of a higher-order Page Number (indexing the page table) and lower-order Offset within the page."
          }
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
        xp: 100,
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
                    question: "What event is triggered by the MMU hardware when a program attempts to access a page marked invalid (not currently in physical RAM)?",
                    options: [
                              "Page Fault Interrupt",
                              "Segmentation Violation",
                              "General Protection Fault",
                              "TLB Overflow"
                    ],
                    correctIndex: 0,
                    explanation: "A Page Fault traps to the OS kernel, which fetches the required page from disk swap space into an available physical RAM frame."
          },
          {
                    id: "q2",
                    question: "Which theoretical page replacement algorithm has the lowest possible page fault rate?",
                    options: [
                              "Belady's Optimal Page Replacement (OPT)",
                              "Least Recently Used (LRU)",
                              "First-In First-Out (FIFO)",
                              "Least Frequently Used (LFU)"
                    ],
                    correctIndex: 0,
                    explanation: "Optimal replacement replaces the page that will not be used for the longest period of future time."
          },
          {
                    id: "q3",
                    question: "What is Belady's Anomaly in page replacement algorithms?",
                    options: [
                              "Allocating more physical frames can paradoxically increase the number of page faults in FIFO",
                              "A CPU executing faster than memory",
                              "Memory leaks in kernel drivers",
                              "TLB cache misses causing crashes"
                    ],
                    correctIndex: 0,
                    explanation: "Belady's Anomaly shows that for certain reference strings under FIFO, increasing frame count causes more page faults."
          },
          {
                    id: "q4",
                    question: "What is 'Thrashing' in an operating system?",
                    options: [
                              "The system spends more time swapping pages in and out of disk than executing actual user instructions",
                              "CPU cores overheating",
                              "File system directory corruption",
                              "Deadlock on thread spinlocks"
                    ],
                    correctIndex: 0,
                    explanation: "Thrashing occurs when total memory demand exceeds physical RAM capacity, causing continuous page fault handling."
          },
          {
                    id: "q5",
                    question: "How does the Clock (Second Chance) algorithm approximate Least Recently Used (LRU) efficiently?",
                    options: [
                              "Using a circular queue and checking a reference bit per page frame",
                              "Timing every instruction with hardware clocks",
                              "Sorting pages by timestamp every millisecond",
                              "Swapping random pages"
                    ],
                    correctIndex: 0,
                    explanation: "The Clock algorithm rotates through pages; if the reference bit is 1, it sets it to 0 and moves forward, replacing the first with 0."
          }
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
        xp: 100,
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
                    question: "In UNIX-like file systems, what data structure stores metadata, permissions, timestamps, and block pointers for a file?",
                    options: [
                              "Inode (Index Node)",
                              "Directory Entry (Dentry)",
                              "File Allocation Table (FAT)",
                              "Superblock"
                    ],
                    correctIndex: 0,
                    explanation: "An Inode stores file size, owner UID, permissions, timestamps, and direct/indirect data block pointers (excluding the file name)."
          },
          {
                    id: "q2",
                    question: "Where is the human-readable filename actually stored in a UNIX file system?",
                    options: [
                              "Inside the directory file's data blocks as a name-to-inode mapping",
                              "Inside the file's own Inode",
                              "In the partition Master Boot Record",
                              "In the CPU cache"
                    ],
                    correctIndex: 0,
                    explanation: "Directories are special files containing lists of (filename, inode_number) pairs, linking names to underlying inodes."
          },
          {
                    id: "q3",
                    question: "What happens when a Hard Link is created in a file system?",
                    options: [
                              "A new directory entry points directly to the existing Inode, incrementing its link count",
                              "A new file with duplicate content is copied",
                              "A special shortcut file containing the file path is created",
                              "A symbolic pointer to the partition root is set"
                    ],
                    correctIndex: 0,
                    explanation: "A hard link creates another directory entry referencing the same inode, incrementing the inode's link counter."
          },
          {
                    id: "q4",
                    question: "What is a 'Journaling File System' designed to protect against?",
                    options: [
                              "File system corruption and prolonged fsck checks following sudden power loss or system crashes",
                              "Unauthorized network intrusions",
                              "Memory leaks in application heaps",
                              "Physical disk platter head wear"
                    ],
                    correctIndex: 0,
                    explanation: "Journaling logs metadata modifications to a circular journal before applying them, allowing instant recovery after crashes."
          },
          {
                    id: "q5",
                    question: "What special block in a disk partition contains critical filesystem geometry, block count, and inode table boundaries?",
                    options: [
                              "Superblock",
                              "Boot sector",
                              "Free list block",
                              "Partition descriptor"
                    ],
                    correctIndex: 0,
                    explanation: "The Superblock records core filesystem metadata, including block size, total blocks, free inodes, and filesystem state."
          }
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
        xp: 100,
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
                    question: "Which disk scheduling algorithm services requests in order of track proximity, moving in one direction before reversing?",
                    options: [
                              "SCAN (Elevator Algorithm)",
                              "First-Come, First-Served",
                              "Shortest Seek Time First (SSTF)",
                              "Circular SCAN (C-SCAN)"
                    ],
                    correctIndex: 0,
                    explanation: "The SCAN elevator algorithm moves disk heads in one direction servicing requests until reaching the end, then reverses."
          },
          {
                    id: "q2",
                    question: "What is Direct Memory Access (DMA)?",
                    options: [
                              "Special hardware that transfers data directly between I/O devices and RAM without continuous CPU intervention",
                              "Reading disk blocks into CPU registers",
                              "Direct pointer arithmetic in C",
                              "A high-speed CPU cache"
                    ],
                    correctIndex: 0,
                    explanation: "DMA offloads high-volume data transfers between peripheral controllers and RAM from the CPU, generating an interrupt only upon completion."
          },
          {
                    id: "q3",
                    question: "How does C-SCAN differ from standard SCAN disk scheduling?",
                    options: [
                              "When it reaches the end of the disk, it immediately returns to the beginning without servicing requests on the return trip",
                              "It reverses direction randomly",
                              "It only services even tracks",
                              "It prioritizes small file requests"
                    ],
                    correctIndex: 0,
                    explanation: "C-SCAN provides more uniform wait times by treating the cylinders as a circular list, returning to cylinder 0 without serving requests."
          },
          {
                    id: "q4",
                    question: "What is the primary latency component when reading data from a mechanical hard drive (HDD)?",
                    options: [
                              "Seek Time (moving read/write head arm to the target track)",
                              "Bus transfer time",
                              "RAM allocation time",
                              "CPU cache read"
                    ],
                    correctIndex: 0,
                    explanation: "Seek time (mechanical arm movement to the cylinder) accounts for the largest delay in disk I/O operations."
          },
          {
                    id: "q5",
                    question: "Why do Solid State Drives (SSDs) not require traditional disk head scheduling algorithms like SCAN?",
                    options: [
                              "SSDs have no moving mechanical arms and offer uniform electrical flash memory access latency across all blocks",
                              "SSDs do not have blocks",
                              "SSDs run directly in CPU cache",
                              "SSDs are read-only devices"
                    ],
                    correctIndex: 0,
                    explanation: "SSDs use flash memory with zero mechanical seek time, making rotational track scheduling algorithms unnecessary."
          }
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
        xp: 100,
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
                    question: "In UNIX file permissions represented as 754 in octal, what permissions are granted to the 'group'?",
                    options: [
                              "Read and Execute (5 = r-x)",
                              "Read, Write, and Execute (7 = rwx)",
                              "Read only (4 = r--)",
                              "Write and Execute (3 = -wx)"
                    ],
                    correctIndex: 0,
                    explanation: "Octal permissions map to User (7=rwx), Group (5=r-x), and Others (4=r--); 5 corresponds to read (4) + execute (1)."
          },
          {
                    id: "q2",
                    question: "What does the Principle of Least Privilege dictate in computer security?",
                    options: [
                              "Every program and user should operate using the minimal set of privileges necessary to complete its function",
                              "All users must have administrator rights",
                              "Passwords must be reset hourly",
                              "Network traffic should be unencrypted"
                    ],
                    correctIndex: 0,
                    explanation: "Least privilege limits user and process capabilities to reduce damage caused by security breaches or bugs."
          },
          {
                    id: "q3",
                    question: "What is an Access Control List (ACL) in operating system protection?",
                    options: [
                              "A list attached to an object specifying which users or groups have what permissions on that object",
                              "A list of CPU instructions",
                              "A network routing table",
                              "A list of active swap blocks"
                    ],
                    correctIndex: 0,
                    explanation: "An ACL defines specific access rights (read, write, execute, delete) granted to distinct users and security principles."
          },
          {
                    id: "q4",
                    question: "What is the purpose of the SetUID (SUID) bit on an executable file in UNIX?",
                    options: [
                              "Executes the binary with the permissions of the file owner (e.g. root) rather than the executing user",
                              "Prevents deletion of the file",
                              "Enables multithreading",
                              "Encrypts the binary code"
                    ],
                    correctIndex: 0,
                    explanation: "SetUID allows standard users to run programs like passwd with temporary root privileges to modify protected system files."
          },
          {
                    id: "q5",
                    question: "Which security model provides Mandatory Access Control (MAC) in enterprise Linux systems?",
                    options: [
                              "SELinux (Security-Enhanced Linux)",
                              "Standard DAC file permissions",
                              "BASH shell alias rules",
                              "Cron daemon scheduler"
                    ],
                    correctIndex: 0,
                    explanation: "SELinux enforces mandatory access control policies that confine programs and daemons even if root privileges are obtained."
          }
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
        xp: 100,
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
                    question: "What metric measures the maximum theoretical data transfer rate of a communication channel in bits per second?",
                    options: [
                              "Bandwidth",
                              "Latency",
                              "Jitter",
                              "Propagation Delay"
                    ],
                    correctIndex: 0,
                    explanation: "Bandwidth quantifies the capacity of a transmission medium to transfer data per unit time (e.g. Gbps)."
          },
          {
                    id: "q2",
                    question: "What is Round-Trip Time (RTT) in computer networks?",
                    options: [
                              "The time taken for a data packet to travel from sender to destination and for the ACK confirmation to return",
                              "The time to boot a network router",
                              "The duration of an active TCP connection",
                              "The packet serialization delay"
                    ],
                    correctIndex: 0,
                    explanation: "RTT measures the total elapsed time between sending a request and receiving the receiver's acknowledgment."
          },
          {
                    id: "q3",
                    question: "What network topology connects all nodes directly to a central hub or switch?",
                    options: [
                              "Star Topology",
                              "Ring Topology",
                              "Bus Topology",
                              "Mesh Topology"
                    ],
                    correctIndex: 0,
                    explanation: "In a Star topology, all endpoints connect via dedicated point-to-point links to a central switch or hub."
          },
          {
                    id: "q4",
                    question: "What is the difference between Half-Duplex and Full-Duplex communication?",
                    options: [
                              "Full-Duplex allows simultaneous two-way transmission; Half-Duplex permits transmission in only one direction at a time",
                              "Half-Duplex is twice as fast as Full-Duplex",
                              "Full-Duplex requires fiber optic cables",
                              "Half-Duplex does not use packets"
                    ],
                    correctIndex: 0,
                    explanation: "In Full-Duplex (e.g. modern Ethernet), data flows in both directions simultaneously; in Half-Duplex, channels alternate."
          },
          {
                    id: "q5",
                    question: "Which component of network delay represents the time needed to push all bits of a packet onto the physical wire?",
                    options: [
                              "Transmission Delay",
                              "Propagation Delay",
                              "Queuing Delay",
                              "Processing Delay"
                    ],
                    correctIndex: 0,
                    explanation: "Transmission Delay = Packet Length (L) / Transmission Rate (R), measuring the time required to emit the packet onto the link."
          }
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
        xp: 100,
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
                    question: "How many layers are defined in the classical ISO/OSI Reference Model?",
                    options: [
                              "7 Layers",
                              "4 Layers",
                              "5 Layers",
                              "6 Layers"
                    ],
                    correctIndex: 0,
                    explanation: "OSI defines 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application."
          },
          {
                    id: "q2",
                    question: "Which OSI layer is responsible for end-to-end process-to-process communication, reliability, and flow control?",
                    options: [
                              "Transport Layer (Layer 4)",
                              "Network Layer (Layer 3)",
                              "Data Link Layer (Layer 2)",
                              "Session Layer (Layer 5)"
                    ],
                    correctIndex: 0,
                    explanation: "The Transport Layer (TCP, UDP) manages segment delivery, port multiplexing, and end-to-end flow control."
          },
          {
                    id: "q3",
                    question: "What is the Protocol Data Unit (PDU) at the Network Layer (Layer 3) called?",
                    options: [
                              "Packet",
                              "Frame",
                              "Segment",
                              "Bit"
                    ],
                    correctIndex: 0,
                    explanation: "The Layer 3 PDU is a Packet (or Datagram); Layer 2 is a Frame; Layer 4 is a Segment."
          },
          {
                    id: "q4",
                    question: "Which layer in the TCP/IP suite corresponds to the combination of OSI Session, Presentation, and Application layers?",
                    options: [
                              "Application Layer",
                              "Transport Layer",
                              "Internet Layer",
                              "Network Access Layer"
                    ],
                    correctIndex: 0,
                    explanation: "The 4-layer TCP/IP model combines OSI layers 5, 6, and 7 into a single top-level Application layer."
          },
          {
                    id: "q5",
                    question: "What process encapsulates user data by prepending protocol headers as it travels down the network stack?",
                    options: [
                              "Data Encapsulation",
                              "De-multiplexing",
                              "Data Serialization",
                              "Packet fragmentation"
                    ],
                    correctIndex: 0,
                    explanation: "Encapsulation adds headers (and trailers) sequentially at each layer before transmission over the physical medium."
          }
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
        xp: 100,
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
                    question: "What is the primary identifier used to deliver frames at the Data Link Layer (Layer 2)?",
                    options: [
                              "MAC Address (Media Access Control)",
                              "IPv4 Address",
                              "Port Number",
                              "Domain Name"
                    ],
                    correctIndex: 0,
                    explanation: "Layer 2 frames use 48-bit hardware MAC addresses burned into Network Interface Cards (NICs)."
          },
          {
                    id: "q2",
                    question: "Which protocol maps a known Layer 3 IP address to an unknown Layer 2 physical MAC address on a local network?",
                    options: [
                              "Address Resolution Protocol (ARP)",
                              "Dynamic Host Configuration Protocol (DHCP)",
                              "Domain Name System (DNS)",
                              "ICMP"
                    ],
                    correctIndex: 0,
                    explanation: "ARP broadcasts a query on the local subnet to resolve the MAC address matching a destination IP."
          },
          {
                    id: "q3",
                    question: "What error-detection technique uses polynomial division to verify frame integrity in Ethernet networks?",
                    options: [
                              "Cyclic Redundancy Check (CRC)",
                              "One's Complement Checksum",
                              "Parity Bit",
                              "Hamming Distance"
                    ],
                    correctIndex: 0,
                    explanation: "Ethernet frames include a 32-bit Frame Check Sequence (FCS) calculated using CRC to detect bit transmission errors."
          },
          {
                    id: "q4",
                    question: "What media access control protocol was historically used by legacy Ethernet to arbitrate collisions on shared bus cables?",
                    options: [
                              "CSMA/CD (Carrier Sense Multiple Access with Collision Detection)",
                              "Token Ring",
                              "CSMA/CA",
                              "TDMA"
                    ],
                    correctIndex: 0,
                    explanation: "CSMA/CD listens before transmitting, detects electrical collisions, and executes exponential backoff before retrying."
          },
          {
                    id: "q5",
                    question: "What is the standard maximum transmission unit (MTU) payload size for a standard Ethernet frame?",
                    options: [
                              "1500 Bytes",
                              "64 Bytes",
                              "4096 Bytes",
                              "9000 Bytes"
                    ],
                    correctIndex: 0,
                    explanation: "Standard Ethernet specifies a maximum IP packet payload size (MTU) of 1500 bytes per frame."
          }
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
        xp: 100,
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
                    question: "How many bits are in an IPv4 address and an IPv6 address, respectively?",
                    options: [
                              "IPv4: 32 bits, IPv6: 128 bits",
                              "IPv4: 64 bits, IPv6: 256 bits",
                              "IPv4: 16 bits, IPv6: 64 bits",
                              "IPv4: 48 bits, IPv6: 128 bits"
                    ],
                    correctIndex: 0,
                    explanation: "IPv4 uses 32-bit addresses (dotted-decimal notation), while IPv6 expands to 128-bit addresses (hexadecimal notation)."
          },
          {
                    id: "q2",
                    question: "In an IPv4 subnet configured with CIDR /24 (subnet mask 255.255.255.0), how many usable host addresses are available?",
                    options: [
                              "254 usable hosts",
                              "256 usable hosts",
                              "128 usable hosts",
                              "512 usable hosts"
                    ],
                    correctIndex: 0,
                    explanation: "2^(32 - 24) = 256 addresses; subtracting network (all 0s) and broadcast (all 1s) yields 254 usable host IPs."
          },
          {
                    id: "q3",
                    question: "Which of the following IPv4 ranges is designated for Private Non-Routable Networks under RFC 1918?",
                    options: [
                              "192.168.0.0/16 and 10.0.0.0/8",
                              "8.8.8.0/24",
                              "127.0.0.0/8",
                              "224.0.0.0/4"
                    ],
                    correctIndex: 0,
                    explanation: "RFC 1918 reserves 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16 for private internal LAN routing."
          },
          {
                    id: "q4",
                    question: "What does Network Address Translation (NAT) accomplish in modern routers?",
                    options: [
                              "Translates private local IP addresses into a shared public IP address for internet traffic",
                              "Encodes packets with AES",
                              "Converts IPv4 into MAC addresses",
                              "Speeds up DNS queries"
                    ],
                    correctIndex: 0,
                    explanation: "NAT enables multiple devices on a private LAN to share one or more public IP addresses by rewriting packet headers."
          },
          {
                    id: "q5",
                    question: "What protocol automatically leases IP addresses, default gateways, and DNS server IPs to connecting network hosts?",
                    options: [
                              "DHCP (Dynamic Host Configuration Protocol)",
                              "BGP",
                              "SNMP",
                              "ARP"
                    ],
                    correctIndex: 0,
                    explanation: "DHCP uses DORA (Discover, Offer, Request, Acknowledge) to configure network clients automatically upon connection."
          }
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
        xp: 100,
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
                    question: "Which interior gateway routing protocol uses Dijkstra's shortest path algorithm and floods Link-State Advertisements (LSAs)?",
                    options: [
                              "OSPF (Open Shortest Path First)",
                              "RIP (Routing Information Protocol)",
                              "BGP (Border Gateway Protocol)",
                              "EGP"
                    ],
                    correctIndex: 0,
                    explanation: "OSPF is a link-state protocol where all routers maintain a synchronized topology map and run Dijkstra's algorithm."
          },
          {
                    id: "q2",
                    question: "What de facto standard protocol handles Inter-Domain Routing across Autonomous Systems (AS) on the global Internet?",
                    options: [
                              "BGP (Border Gateway Protocol)",
                              "OSPF",
                              "RIPv2",
                              "IS-IS"
                    ],
                    correctIndex: 0,
                    explanation: "BGP is a Path Vector exterior gateway protocol that manages route exchanges between large Internet service providers."
          },
          {
                    id: "q3",
                    question: "What metric does the Routing Information Protocol (RIP) use to determine the best route to a destination?",
                    options: [
                              "Hop Count (maximum 15 hops)",
                              "Link Bandwidth and Delay",
                              "Autonomous System path length",
                              "Cost based on 100Mbps reference"
                    ],
                    correctIndex: 0,
                    explanation: "RIP is a distance-vector protocol using simple hop counts, with 16 hops defined as infinity/unreachable."
          },
          {
                    id: "q4",
                    question: "What field in the IPv4 packet header prevents packets from endlessly looping in routing loops?",
                    options: [
                              "Time to Live (TTL)",
                              "Header Checksum",
                              "Identification",
                              "Differentiated Services (DiffServ)"
                    ],
                    correctIndex: 0,
                    explanation: "Every router decrements the TTL field by 1; when TTL reaches 0, the router drops the packet and sends an ICMP Time Exceeded message."
          },
          {
                    id: "q5",
                    question: "What is the primary role of the ICMP (Internet Control Message Protocol)?",
                    options: [
                              "Reporting network error conditions and operational diagnostics (e.g., ping and traceroute)",
                              "Transferring web files securely",
                              "Assigning dynamic IP addresses",
                              "Translating domain names"
                    ],
                    correctIndex: 0,
                    explanation: "ICMP generates error reporting (destination unreachable, TTL expired) and diagnostics (echo request/reply used in ping)."
          }
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
        xp: 100,
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
                    question: "What networking device forwards traffic based on Layer 2 MAC addresses and maintains a MAC Address Learning Table (CAM table)?",
                    options: [
                              "Network Switch",
                              "Passive Hub",
                              "Network Router",
                              "Modem"
                    ],
                    correctIndex: 0,
                    explanation: "Switches inspect source MAC addresses to learn port mappings and forward frames directly to target destination ports."
          },
          {
                    id: "q2",
                    question: "What is a Virtual Local Area Network (VLAN)?",
                    options: [
                              "A logical partition of a physical switch into isolated broadcast domains (IEEE 802.1Q)",
                              "A VPN tunnel across public internet",
                              "A wireless hotspot network",
                              "A proxy server"
                    ],
                    correctIndex: 0,
                    explanation: "VLANs logically segment switch ports into distinct broadcast domains, tagging frames with 802.1Q VLAN IDs."
          },
          {
                    id: "q3",
                    question: "Which protocol prevents catastrophic broadcast storms and bridging loops in redundant switched networks?",
                    options: [
                              "Spanning Tree Protocol (STP / IEEE 802.1D)",
                              "BGP",
                              "OSPF",
                              "ARP"
                    ],
                    correctIndex: 0,
                    explanation: "STP calculates a loop-free logical tree topology, blocking redundant switch ports to prevent infinite frame circulation."
          },
          {
                    id: "q4",
                    question: "What is the difference between a Collision Domain and a Broadcast Domain?",
                    options: [
                              "Switch ports isolate collision domains to each port, while a VLAN defines the boundary of a broadcast domain",
                              "Routers create collision domains",
                              "Hubs create multiple broadcast domains",
                              "They are identical"
                    ],
                    correctIndex: 0,
                    explanation: "Each switch port forms its own collision domain; all ports in the same subnet/VLAN share one broadcast domain."
          },
          {
                    id: "q5",
                    question: "What happens when a switch receives a frame whose destination MAC address is not yet in its MAC address table?",
                    options: [
                              "Floods the frame out of all ports except the port on which it was received (Unknown Unicast Flooding)",
                              "Drops the frame immediately",
                              "Sends an ICMP error packet",
                              "Reboots the switch"
                    ],
                    correctIndex: 0,
                    explanation: "The switch broadcasts (floods) unknown unicast frames to all other active ports on the VLAN to locate the recipient."
          }
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
        xp: 100,
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
                    question: "What are the three packets exchanged during the TCP Three-Way Handshake connection establishment?",
                    options: [
                              "SYN -> SYN-ACK -> ACK",
                              "ACK -> SYN -> ACK",
                              "FIN -> ACK -> FIN-ACK",
                              "REQ -> RESP -> READY"
                    ],
                    correctIndex: 0,
                    explanation: "TCP establishes a reliable connection using SYN (client), SYN-ACK (server), and final ACK (client)."
          },
          {
                    id: "q2",
                    question: "Why is UDP (User Datagram Protocol) chosen over TCP for real-time video streaming and gaming?",
                    options: [
                              "Lower latency with zero connection setup overhead and no retransmission delays for lost packets",
                              "UDP guarantees in-order packet delivery",
                              "UDP encrypts data packets automatically",
                              "UDP has a 64-byte header"
                    ],
                    correctIndex: 0,
                    explanation: "UDP is connectionless and lightweight; avoiding acknowledgments and retransmissions provides minimal latency."
          },
          {
                    id: "q3",
                    question: "How does TCP achieve Flow Control to prevent overwhelming a slow receiving host?",
                    options: [
                              "Sliding Receive Window (rwnd) announced in TCP segment headers",
                              "Dropping packets silently",
                              "Switching dynamically to UDP",
                              "Using DNS throttling"
                    ],
                    correctIndex: 0,
                    explanation: "The receiver advertises its available buffer space in the Receive Window (rwnd) field, pacing the sender."
          },
          {
                    id: "q4",
                    question: "Which TCP congestion control algorithms regulate transmission rate in response to packet loss?",
                    options: [
                              "Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery",
                              "Dijkstra and Bellman-Ford",
                              "CRC polynomial checks",
                              "Stop-and-Wait and Token Bucket"
                    ],
                    correctIndex: 0,
                    explanation: "TCP uses Slow Start (exponential window growth) followed by linear Congestion Avoidance and Fast Recovery on packet loss."
          },
          {
                    id: "q5",
                    question: "What flag in the TCP header is used to gracefully terminate an established connection?",
                    options: [
                              "FIN (Finish)",
                              "RST (Reset)",
                              "SYN (Synchronize)",
                              "URG (Urgent)"
                    ],
                    correctIndex: 0,
                    explanation: "The FIN flag signals that the sender has finished transmitting data and initiates connection teardown."
          }
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
        xp: 100,
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
                    question: "What is the primary function of the Domain Name System (DNS)?",
                    options: [
                              "Translates human-readable domain names (e.g. google.com) into machine-routable IP addresses",
                              "Assigns MAC addresses to network interfaces",
                              "Encrypts web passwords",
                              "Balances server electrical power"
                    ],
                    correctIndex: 0,
                    explanation: "DNS acts as the phonebook of the Internet, resolving domain names into IP addresses (A/AAAA records)."
          },
          {
                    id: "q2",
                    question: "Which DNS record type maps a hostname specifically to an IPv4 address?",
                    options: [
                              "A Record",
                              "AAAA Record",
                              "CNAME Record",
                              "MX Record"
                    ],
                    correctIndex: 0,
                    explanation: "An 'A' (Address) record maps a hostname to a 32-bit IPv4 address; 'AAAA' maps to a 128-bit IPv6 address."
          },
          {
                    id: "q3",
                    question: "What standard transport port and protocol does standard DNS primarily use for client name queries?",
                    options: [
                              "Port 53 over UDP",
                              "Port 80 over TCP",
                              "Port 443 over UDP",
                              "Port 22 over SSH"
                    ],
                    correctIndex: 0,
                    explanation: "Standard DNS client queries use UDP port 53 for fast, lightweight request/response resolution."
          },
          {
                    id: "q4",
                    question: "What is a DNS CNAME (Canonical Name) record used for?",
                    options: [
                              "Aliasing one domain name to another canonical domain name",
                              "Specifying mail exchange mail servers",
                              "Defining authoritative name servers",
                              "Reverse IP lookup"
                    ],
                    correctIndex: 0,
                    explanation: "A CNAME record maps an alias hostname (e.g., www.example.com) to a canonical target name (example.com)."
          },
          {
                    id: "q5",
                    question: "What DNS security extension prevents DNS spoofing and cache poisoning by cryptographically signing records?",
                    options: [
                              "DNSSEC (DNS Security Extensions)",
                              "HTTPS / TLS",
                              "DHCP Snooping",
                              "BGP Origin Validation"
                    ],
                    correctIndex: 0,
                    explanation: "DNSSEC provides cryptographic authentication of DNS data to ensure responses originated from authoritative servers."
          }
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
        xp: 100,
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
                    question: "Which HTTP status code indicates that a requested web resource was successfully retrieved?",
                    options: [
                              "200 OK",
                              "301 Moved Permanently",
                              "404 Not Found",
                              "500 Internal Server Error"
                    ],
                    correctIndex: 0,
                    explanation: "200 OK is the standard HTTP response indicating that the request succeeded and the payload was returned."
          },
          {
                    id: "q2",
                    question: "What major performance improvement was introduced in HTTP/2 compared to HTTP/1.1?",
                    options: [
                              "Multiplexing multiple requests and responses concurrently over a single TCP connection",
                              "Elimination of TCP handshake",
                              "Removal of headers",
                              "Plaintext caching"
                    ],
                    correctIndex: 0,
                    explanation: "HTTP/2 uses binary framing and multiplexing to interleave requests/responses over a single connection, eliminating head-of-line blocking."
          },
          {
                    id: "q3",
                    question: "What underlying protocol secures HTTPS communication by encrypting web application data?",
                    options: [
                              "TLS (Transport Layer Security)",
                              "IPsec",
                              "SSH Tunnel",
                              "WPA3"
                    ],
                    correctIndex: 0,
                    explanation: "HTTPS encrypts normal HTTP communication using TLS (the successor to SSL) over default TCP port 443."
          },
          {
                    id: "q4",
                    question: "What distinguishes an Idempotent HTTP method (such as GET or PUT)?",
                    options: [
                              "Making multiple identical requests produces the exact same server state as a single request",
                              "It cannot be cached by proxies",
                              "It does not return response bodies",
                              "It requires authentication tokens"
                    ],
                    correctIndex: 0,
                    explanation: "An HTTP method is idempotent if executing it multiple times leaves the system in the identical state as executing it once."
          },
          {
                    id: "q5",
                    question: "What transport protocol does HTTP/3 utilize instead of standard TCP to eliminate transport head-of-line blocking?",
                    options: [
                              "QUIC (built on UDP)",
                              "SCTP",
                              "Raw IP Datagrams",
                              "ICMP Tunneling"
                    ],
                    correctIndex: 0,
                    explanation: "HTTP/3 runs over QUIC, a multiplexed transport protocol layered on top of UDP with integrated TLS 1.3 encryption."
          }
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
        xp: 100,
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
                    question: "What type of firewall inspects IP addresses, TCP/UDP port numbers, and connection state flags (SYN, ACK) dynamically?",
                    options: [
                              "Stateful Packet Inspection (SPI) Firewall",
                              "Stateless Packet Filter",
                              "Proxy Server",
                              "Application Gateway"
                    ],
                    correctIndex: 0,
                    explanation: "A stateful firewall monitors the state of active network connections and allows return traffic matching established sessions."
          },
          {
                    id: "q2",
                    question: "What type of cyberattack floods a target server with massive volumes of traffic from compromised distributed botnets?",
                    options: [
                              "Distributed Denial of Service (DDoS)",
                              "Cross-Site Scripting (XSS)",
                              "SQL Injection",
                              "Man-in-the-Middle (MitM)"
                    ],
                    correctIndex: 0,
                    explanation: "DDoS attacks saturate network bandwidth or server processing capacity using thousands of coordinated botnet hosts."
          },
          {
                    id: "q3",
                    question: "In public-key cryptography (Asymmetric Cryptography), which key is used to decrypt a message encrypted with a recipient's Public Key?",
                    options: [
                              "The recipient's Private Key",
                              "The sender's Public Key",
                              "A shared symmetric master key",
                              "The Certificate Authority key"
                    ],
                    correctIndex: 0,
                    explanation: "Data encrypted with a public key can only be decrypted by the corresponding unique private key held by the recipient."
          },
          {
                    id: "q4",
                    question: "What is the function of a Digital Certificate issued by a trusted Certificate Authority (CA)?",
                    options: [
                              "Binds a public cryptographic key to an organization's identity/domain name",
                              "Stores the private key on public servers",
                              "Increases network link speed",
                              "Routes BGP traffic"
                    ],
                    correctIndex: 0,
                    explanation: "A digital certificate verifies that a given public key belongs to the legitimate owner of the domain name."
          },
          {
                    id: "q5",
                    question: "What security system monitors network traffic for suspicious signatures and generates alerts (or blocks active attacks)?",
                    options: [
                              "IDS / IPS (Intrusion Detection / Prevention System)",
                              "DHCP Relay",
                              "Spanning Tree Protocol",
                              "ARP Cache"
                    ],
                    correctIndex: 0,
                    explanation: "An IDS detects malicious traffic signatures and alerts administrators, while an IPS actively terminates offending packets."
          }
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
        xp: 100,
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
                    question: "Which IEEE standard specifies Wireless Local Area Networks (Wi-Fi)?",
                    options: [
                              "IEEE 802.11",
                              "IEEE 802.3",
                              "IEEE 802.15",
                              "IEEE 802.1Q"
                    ],
                    correctIndex: 0,
                    explanation: "IEEE 802.11 is the governing wireless family of specifications (802.11a/b/g/n/ac/ax) for Wi-Fi communication."
          },
          {
                    id: "q2",
                    question: "Why do Wi-Fi networks use CSMA/CA (Collision Avoidance) instead of CSMA/CD (Collision Detection)?",
                    options: [
                              "Wireless transceivers cannot transmit and listen for weak collision signals simultaneously on the same channel",
                              "Collision avoidance is slower",
                              "Wi-Fi does not use radio frequencies",
                              "Wireless routers do not have MAC addresses"
                    ],
                    correctIndex: 0,
                    explanation: "Because the transmitted radio signal drowns out any incoming signals, Wi-Fi nodes cannot reliably detect collisions while transmitting."
          },
          {
                    id: "q3",
                    question: "What is the 'Hidden Node Problem' in wireless local networks?",
                    options: [
                              "Two stations can communicate with the access point but cannot detect each other's transmissions",
                              "Routers hiding their SSID",
                              "Nodes with disabled antennas",
                              "Encrypted Wi-Fi packets"
                    ],
                    correctIndex: 0,
                    explanation: "Hidden nodes are out of radio range of each other but within range of the AP, causing simultaneous collisions at the AP."
          },
          {
                    id: "q4",
                    question: "What RTS/CTS handshake mechanism mitigates the Hidden Node Problem in 802.11 wireless networks?",
                    options: [
                              "Request to Send / Clear to Send frames",
                              "Ready to Serve / Client to Server",
                              "Radio Time Sync / Channel Time Slot",
                              "Route Tracking System"
                    ],
                    correctIndex: 0,
                    explanation: "A station sends an RTS frame to the AP; the AP broadcasts a CTS frame reserving the radio channel for that station's duration."
          },
          {
                    id: "q5",
                    question: "Which wireless security protocol provides contemporary robust encryption for modern Wi-Fi networks (Wi-Fi 6)?",
                    options: [
                              "WPA3 (Simultaneous Authentication of Equals)",
                              "WEP (Wired Equivalent Privacy)",
                              "WPA (TKIP)",
                              "Cleartext HTTP"
                    ],
                    correctIndex: 0,
                    explanation: "WPA3 replaces vulnerable WPA2 handshakes with SAE (Dragonfly handshake) to resist offline dictionary attacks."
          }
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

export const freshUserProgress: UserProgressState = {
  completedTopicIds: {
    dbms: [],
    dsa: [],
    os: [],
    cn: [],
  },
  currentMissionTopicId: {
    dbms: "dbms-1",
    dsa: "dsa-1",
    os: "os-1",
    cn: "cn-1",
  },
  subjectXP: {
    dbms: 0,
    dsa: 0,
    os: 0,
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

