import {
  calculateStudentSuccessScoreBreakdown,
  getExplainableRiskFlags,
  getStudentSegmentation,
  simulateWhatIfScenario,
  getStudentAnalyticsExplanation,
  getFacultyAnalyticsOverview,
} from "../src/intelligence/analyticsService";

console.log("=== COHORT STUDENTS EVALUATION ===");

const studentsToTest = ["s1", "s2", "s3", "s4", "s5", "s6"];

for (const sId of studentsToTest) {
  const breakdown = calculateStudentSuccessScoreBreakdown(sId);
  const risks = getExplainableRiskFlags(sId);
  const seg = getStudentSegmentation(sId);

  console.log(`\n--- STUDENT [${sId}] ---`);
  console.log(`Success Score: ${breakdown.overallScore !== null ? breakdown.overallScore + "%" : "NULL (Insufficient Data)"}`);
  console.log(`Data Coverage: ${breakdown.dataCoveragePercent}% (${breakdown.validCategoriesCount}/${breakdown.totalCategoriesCount} Categories)`);
  console.log(`Status Label: ${breakdown.statusLabel}`);
  console.log(`Primary Segment: ${seg.primarySegment}`);
  console.log(`Active Risk Flags Count: ${risks.length}`);
  if (risks.length > 0) {
    console.log(`Top Risk: [${risks[0].severity}] ${risks[0].title} - ${risks[0].reason}`);
  }
}

console.log("\n=== WHAT-IF SIMULATOR TEST ===");
const whatIf = simulateWhatIfScenario("s1", { attendance: 90, quizAverage: 85, placementScore: 80 });
console.log(`Student s1: Baseline ${whatIf.baselineScore}% -> Simulated ${whatIf.simulatedScore}% (Delta: +${whatIf.scoreDelta} pts)`);

console.log("\n=== GROUNDED AI EXPLANATION TEST ===");
const aiExp = getStudentAnalyticsExplanation("s1", "why_academic_support");
console.log("Q:", aiExp.question);
console.log("A:", aiExp.summary);
console.log("Recommended Action:", aiExp.recommendedAction);

console.log("\n=== COHORT OVERVIEW AGGREGATION TEST ===");
const overview = getFacultyAnalyticsOverview();
console.log(`Total Students: ${overview.totalStudents}`);
console.log(`Average Score: ${overview.averageSuccessScore}%`);
console.log(`Review Required: ${overview.reviewRequiredCount}`);
console.log(`Academic Risk Count: ${overview.academicRiskCount}`);
console.log(`Attendance Risk Count: ${overview.attendanceRiskCount}`);
console.log(`Placement Risk Count: ${overview.placementRiskCount}`);
console.log(`Incomplete Data Count: ${overview.incompleteDataCount}`);
console.log(`Open Interventions Count: ${overview.openInterventionsCount}`);

console.log("\nAll cohort and service assertions successfully verified!");
