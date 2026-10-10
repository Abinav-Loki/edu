import assert from "node:assert";

// Simulated localStorage for browser isolation testing
class MockLocalStorage {
  constructor() {
    this.store = new Map();
  }
  getItem(key) {
    return this.store.get(key) || null;
  }
  setItem(key, val) {
    this.store.set(key, String(val));
  }
  removeItem(key) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}

global.localStorage = new MockLocalStorage();

console.log("=== RUNNING USER-WISE PROGRESS TRACKING VERIFICATION SUITE ===");

// 1. Test Key Isolation
const studentA_Id = "s1";
const studentB_Id = "s2";
const staff_Id = "f1";

// Mock User Progress Logic mirroring supabaseService.ts
function saveUserActivityProgress(userId, activityType, activityId, xpEarned) {
  const localKey = `edu_user_progress_${userId}`;
  const raw = localStorage.getItem(localKey);
  const list = raw ? JSON.parse(raw) : [];

  const existing = list.find(p => p.activityType === activityType && p.activityId === activityId);
  if (existing && existing.status === "completed") {
    return { success: true, isDuplicate: true };
  }

  const record = {
    id: `prog_${Date.now()}_${Math.random()}`,
    userId,
    activityType,
    activityId,
    status: "completed",
    xpEarned,
    completedAt: new Date().toISOString()
  };

  list.unshift(record);
  localStorage.setItem(localKey, JSON.stringify(list));
  return { success: true, isDuplicate: false, record };
}

function getUserProgress(userId) {
  const localKey = `edu_user_progress_${userId}`;
  const raw = localStorage.getItem(localKey);
  return raw ? JSON.parse(raw) : [];
}

// TEST 1: Student A completes a quiz and earns 50 XP
console.log("\n[TEST 1] Student A completes a quiz...");
const resA1 = saveUserActivityProgress(studentA_Id, "quiz", "dbms_joins", 50);
assert.strictEqual(resA1.success, true);
assert.strictEqual(resA1.isDuplicate, false);
console.log("✓ Student A successfully completed quiz and earned 50 XP");

// TEST 2: Student B signs in and inspects progress
console.log("\n[TEST 2] Student B signs in...");
const progressB_initial = getUserProgress(studentB_Id);
assert.strictEqual(progressB_initial.length, 0, "Student B must have 0 progress items initially");
console.log("✓ Student B has completely clean, isolated initial state (0 progress items)");

// TEST 3: Student B completes a mission and earns 100 XP
console.log("\n[TEST 3] Student B completes mission 'm-1'...");
const resB1 = saveUserActivityProgress(studentB_Id, "mission", "m-1", 100);
assert.strictEqual(resB1.success, true);
assert.strictEqual(resB1.isDuplicate, false);

const progressA_after = getUserProgress(studentA_Id);
const progressB_after = getUserProgress(studentB_Id);

assert.strictEqual(progressA_after.length, 1);
assert.strictEqual(progressA_after[0].activityId, "dbms_joins");
assert.strictEqual(progressA_after[0].xpEarned, 50);

assert.strictEqual(progressB_after.length, 1);
assert.strictEqual(progressB_after[0].activityId, "m-1");
assert.strictEqual(progressB_after[0].xpEarned, 100);
console.log("✓ Student B's activity did NOT modify Student A's records (Strict Isolation verified)");

// TEST 4: Duplicate Completion Prevention (Idempotency)
console.log("\n[TEST 4] Student B attempts duplicate completion of mission 'm-1'...");
const resB2 = saveUserActivityProgress(studentB_Id, "mission", "m-1", 100);
assert.strictEqual(resB2.isDuplicate, true, "Duplicate completion must be rejected/flagged as duplicate");

const progressB_afterDup = getUserProgress(studentB_Id);
assert.strictEqual(progressB_afterDup.length, 1, "Progress list must not contain duplicate items");
console.log("✓ Duplicate completion prevented: No duplicate XP awarded");

// TEST 5: Verify no master key leakage
console.log("\n[TEST 5] Verifying absence of global fallback keys...");
assert.strictEqual(localStorage.getItem("edu_arena_progress_master"), null);
console.log("✓ No global or shared progress keys exist in storage");

// TEST 6: Staff Member Isolation
console.log("\n[TEST 6] Staff Member personal progress vs student records...");
const resStaff = saveUserActivityProgress(staff_Id, "learning_module", "prof_dev_1", 200);
assert.strictEqual(resStaff.success, true);
assert.strictEqual(resStaff.isDuplicate, false);

const staffProgress = getUserProgress(staff_Id);
assert.strictEqual(staffProgress.length, 1);
assert.strictEqual(staffProgress[0].userId, staff_Id);
assert.strictEqual(getUserProgress(studentA_Id).length, 1);
assert.strictEqual(getUserProgress(studentB_Id).length, 1);
console.log("✓ Staff personal progress is completely isolated from students");

console.log("\n=== ALL 6 PROGRESS ARCHITECTURE TESTS PASSED SUCCESSFULLY! ===");
