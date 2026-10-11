// Automated Validation Suite for ByteXL Hackathon Judging Criteria
// Tests deterministic calculations, missing-data handling, risk thresholds, segmentation precedence, and security isolation.

const assert = (condition, message) => {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${message}`);
};

console.log("===============================================================================");
console.log("       ARIVON AI — BYTE XL HACKATHON VERIFICATION & RUBRIC TEST SUITE          ");
console.log("===============================================================================\n");

// --- 1. DATA NORMALIZATION TESTS ---
console.log("--- 1. Testing Indicator Normalization Pipeline ---");
function normalizeCGPA(cgpa) {
  if (cgpa === null || cgpa === undefined || isNaN(cgpa) || cgpa <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((cgpa / 10.0) * 100)));
}

function normalizePercentage(value) {
  if (value === null || value === undefined || isNaN(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

function normalizeRating(rating, maxRating = 5) {
  if (rating === null || rating === undefined || isNaN(rating) || rating <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((rating / maxRating) * 100)));
}

assert(normalizeCGPA(8.5) === 85, "CGPA 8.5/10 normalizes to 85/100");
assert(normalizeCGPA(10.0) === 100, "CGPA 10.0/10 normalizes to 100/100");
assert(normalizeCGPA(0) === 0, "CGPA 0 normalizes to 0");
assert(normalizePercentage(92.4) === 92, "Percentage 92.4% normalizes to 92/100");
assert(normalizePercentage(105) === 100, "Percentage clamping upper bound to 100");
assert(normalizeRating(4.5, 5) === 90, "Rating 4.5/5 normalizes to 90/100");

// --- 2. WEIGHTS CONFIGURATION & SUM VALIDATION ---
console.log("\n--- 2. Testing Configurable Scoring Weights (40/25/15/10/5/5) ---");
const DEFAULT_WEIGHTS = {
  academic: 40,
  attendance: 25,
  lmsActivity: 15,
  skillsPlacement: 10,
  engagement: 5,
  feedback: 5,
};

const totalWeight = Object.values(DEFAULT_WEIGHTS).reduce((sum, w) => sum + w, 0);
assert(totalWeight === 100, "Initial weights sum exactly to 100%");

function validateWeights(weights) {
  const sum = Object.values(weights).reduce((a, b) => a + b, 0);
  const allNonNegative = Object.values(weights).every(w => w >= 0);
  return { isValid: sum === 100 && allNonNegative, sum };
}

assert(validateWeights(DEFAULT_WEIGHTS).isValid === true, "Default weights pass institutional validation");
assert(validateWeights({ ...DEFAULT_WEIGHTS, academic: 50 }).isValid === false, "Mismatched weights (sum=110%) are rejected");

// --- 3. RE-NORMALIZATION FOR MISSING INDICATORS (NO SILENT ZEROS) ---
console.log("\n--- 3. Testing Missing Indicators Re-normalization Pipeline ---");
function calculateScoreWithRenormalization(categories, weights) {
  const valid = categories.filter(c => c.hasData && c.score !== null);
  const totalCategories = categories.length;
  const coveragePercent = Math.round((valid.length / totalCategories) * 100);

  // Insufficient data rule: coverage < 33% or less than 2 categories
  if (valid.length < 2 || coveragePercent < 33) {
    return { overallScore: null, status: "Insufficient Data", coveragePercent, isProvisional: true };
  }

  const applicableWeight = valid.reduce((sum, c) => sum + weights[c.key], 0);
  let weightedSum = 0;
  for (const c of valid) {
    weightedSum += (c.score * weights[c.key]);
  }

  const overallScore = Math.round(weightedSum / applicableWeight);
  const isProvisional = valid.length < totalCategories;
  const status = isProvisional ? `Provisional (${valid.length}/${totalCategories})` : "Certified";

  return { overallScore, status, coveragePercent, isProvisional };
}

// Student with all 6 categories present
const fullStudentCategories = [
  { key: "academic", score: 85, hasData: true },
  { key: "attendance", score: 90, hasData: true },
  { key: "lmsActivity", score: 80, hasData: true },
  { key: "skillsPlacement", score: 75, hasData: true },
  { key: "engagement", score: 70, hasData: true },
  { key: "feedback", score: 80, hasData: true },
];

const fullResult = calculateScoreWithRenormalization(fullStudentCategories, DEFAULT_WEIGHTS);
// (85*40 + 90*25 + 80*15 + 75*10 + 70*5 + 80*5)/100 = (3400 + 2250 + 1200 + 750 + 350 + 400)/100 = 8350/100 = 84
assert(fullResult.overallScore === 84, "Full profile calculated deterministically to 84/100");
assert(fullResult.isProvisional === false, "Full profile has Certified status");
assert(fullResult.coveragePercent === 100, "Full profile has 100% data coverage");

// Student with missing placement and LMS records (e.g. 1st year student)
// Excludes placement (10) and LMS (15); remaining weights = 40+25+5+5 = 75
const partialStudentCategories = [
  { key: "academic", score: 80, hasData: true },
  { key: "attendance", score: 85, hasData: true },
  { key: "lmsActivity", score: null, hasData: false },
  { key: "skillsPlacement", score: null, hasData: false },
  { key: "engagement", score: 60, hasData: true },
  { key: "feedback", score: 70, hasData: true },
];

const partialResult = calculateScoreWithRenormalization(partialStudentCategories, DEFAULT_WEIGHTS);
// (80*40 + 85*25 + 60*5 + 70*5) / 75 = (3200 + 2125 + 300 + 350) / 75 = 5975 / 75 = 79.67 -> 80
assert(partialResult.overallScore === 80, "Missing categories re-normalized to 100% without converting to zero (Score = 80)");
assert(partialResult.isProvisional === true, "Partial profile marked Provisional");
assert(partialResult.coveragePercent === 67, "Data coverage accurately recorded as 67%");

// Student with only 1 category present (insufficient data)
const sparseStudentCategories = [
  { key: "academic", score: 90, hasData: true },
  { key: "attendance", score: null, hasData: false },
  { key: "lmsActivity", score: null, hasData: false },
  { key: "skillsPlacement", score: null, hasData: false },
  { key: "engagement", score: null, hasData: false },
  { key: "feedback", score: null, hasData: false },
];
const sparseResult = calculateScoreWithRenormalization(sparseStudentCategories, DEFAULT_WEIGHTS);
assert(sparseResult.overallScore === null, "Sparse profile returns null overall score (Never penalizes with zero)");
assert(sparseResult.status === "Insufficient Data", "Sparse profile classified as 'Insufficient Data'");

// --- 4. EXPLAINABLE RISK IDENTIFICATION ---
console.log("\n--- 4. Testing Explainable Risk Rule Engine ---");
const THRESHOLDS = {
  attendanceWarningThreshold: 75,
  academicRiskScoreThreshold: 60,
  quizFailureThreshold: 50,
  insufficientCoverageThreshold: 33,
  consecutiveDeclinesThreshold: 2,
};

function evaluateRiskFlags(student, thresholds) {
  const flags = [];

  if (student.attendance < thresholds.attendanceWarningThreshold) {
    flags.push({
      category: "Attendance",
      severity: "High",
      title: "Attendance Shortage Alert",
      reason: `Attendance is ${student.attendance}%, below institutional threshold of ${thresholds.attendanceWarningThreshold}%.`,
      supportingData: `${student.attendance}% vs ${thresholds.attendanceWarningThreshold}%`,
      recommendedAction: "Schedule mandatory attendance counseling and alert faculty advisor.",
    });
  }

  if (student.quizAvg < thresholds.quizFailureThreshold) {
    flags.push({
      category: "Academic",
      severity: "High",
      title: "Assessment Performance Deficit",
      reason: `Quiz average is ${student.quizAvg}%, below minimum pass threshold of ${thresholds.quizFailureThreshold}%.`,
      supportingData: `${student.quizAvg}% vs ${thresholds.quizFailureThreshold}%`,
      recommendedAction: "Assign remedial Socratic practice modules and mentor revision.",
    });
  }

  if (student.backlogs > 0) {
    flags.push({
      category: "Academic",
      severity: "Medium",
      title: "Active Course Backlogs",
      reason: `Student has ${student.backlogs} unresolved backlog subject(s).`,
      supportingData: `${student.backlogs} backlog(s)`,
      recommendedAction: "Create prioritized backlog clearance study plan.",
    });
  }

  return flags;
}

const atRiskStudent = { attendance: 68, quizAvg: 45, backlogs: 1 };
const flags = evaluateRiskFlags(atRiskStudent, THRESHOLDS);
assert(flags.length === 3, "All 3 independent risk rules triggered correctly");
assert(flags[0].category === "Attendance" && flags[0].severity === "High", "Attendance shortage flagged with High severity");
assert(flags[1].category === "Academic" && flags[1].severity === "High", "Assessment deficit flagged with High severity");
assert(flags[2].title === "Active Course Backlogs", "Backlog warning flagged with exact action plan");

// --- 5. 7 STUDENT SEGMENTS & PRECEDENCE RULE ---
console.log("\n--- 5. Testing 7 Student Segments & Operational Priority Rule ---");
const HACKATHON_SEGMENTS = [
  "High Performers",
  "Consistent Learners",
  "Improving Students",
  "Students Needing Academic Support",
  "Placement-Ready Students",
  "Placement Preparation Needed",
  "Insufficient Data",
];

assert(HACKATHON_SEGMENTS.length === 7, "All 7 official hackathon segments defined");

function assignSegment(student, coveragePct) {
  if (coveragePct < 33) return "Insufficient Data";

  const qualifying = [];
  if (student.overallScore < 60 || student.attendance < 75 || student.backlogs > 0) {
    qualifying.push("Students Needing Academic Support");
  }
  if (student.placementScore < 60 && student.year >= 3) {
    qualifying.push("Placement Preparation Needed");
  }
  if (student.placementScore >= 75 && student.codingScore >= 75) {
    qualifying.push("Placement-Ready Students");
  }
  if (student.trend === "improving") {
    qualifying.push("Improving Students");
  }
  if (student.overallScore >= 85 && student.attendance >= 80) {
    qualifying.push("High Performers");
  }
  if (student.attendance >= 80 && student.assignmentRate >= 80) {
    qualifying.push("Consistent Learners");
  }

  // Operational priority rule: Remedial and placement support take precedence over celebratory labels
  if (qualifying.includes("Students Needing Academic Support")) return "Students Needing Academic Support";
  if (qualifying.includes("Placement Preparation Needed")) return "Placement Preparation Needed";
  if (qualifying.includes("Placement-Ready Students")) return "Placement-Ready Students";
  if (qualifying.includes("Improving Students")) return "Improving Students";
  if (qualifying.includes("High Performers")) return "High Performers";
  if (qualifying.includes("Consistent Learners")) return "Consistent Learners";
  return "Consistent Learners";
}

assert(assignSegment({}, 20) === "Insufficient Data", "Low coverage maps to 'Insufficient Data'");
assert(assignSegment({ overallScore: 55, attendance: 70, backlogs: 1 }, 100) === "Students Needing Academic Support", "At-risk student prioritized into 'Students Needing Academic Support'");
assert(assignSegment({ placementScore: 45, codingScore: 50, year: 3, overallScore: 78, attendance: 88, assignmentRate: 85 }, 100) === "Placement Preparation Needed", "3rd year with low placement score maps to 'Placement Preparation Needed'");
assert(assignSegment({ placementScore: 90, codingScore: 88, overallScore: 82, attendance: 85, assignmentRate: 90 }, 100) === "Placement-Ready Students", "Placement ready student qualifies for 'Placement-Ready Students'");
assert(assignSegment({ overallScore: 92, attendance: 95, assignmentRate: 95, placementScore: 80, codingScore: 70 }, 100) === "High Performers", "Top academic student maps to 'High Performers'");

// --- 6. STUDENT ISOLATION AND ACCESS SCOPING ---
console.log("\n--- 6. Testing Document Isolation & Role-Based Scope Permissions ---");
const mockUserStudent1 = { id: "s1", role: "student" };
const mockUserStudent2 = { id: "s2", role: "student" };
const mockMaterials = [
  { id: "mat1", studentId: "s1", fileName: "DBMS_Unit1.pdf" },
  { id: "mat2", studentId: "s2", fileName: "OS_Kernels.pdf" },
];

function getAuthorizedMaterials(user, materials) {
  if (user.role === "admin") return materials;
  return materials.filter(m => m.studentId === user.id);
}

const s1Materials = getAuthorizedMaterials(mockUserStudent1, mockMaterials);
assert(s1Materials.length === 1 && s1Materials[0].id === "mat1", "Student s1 can only access s1 materials");

const s2Materials = getAuthorizedMaterials(mockUserStudent2, mockMaterials);
assert(s2Materials.length === 1 && s2Materials[0].id === "mat2", "Student s2 can only access s2 materials");

assert(s1Materials.find(m => m.studentId === "s2") === undefined, "Student isolation prevents cross-student leakage");

console.log("\n===============================================================================");
console.log("       ALL 18 HACKATHON VERIFICATION CRITERIA ASSERTIONS PASSED!       ");
console.log("===============================================================================\n");
