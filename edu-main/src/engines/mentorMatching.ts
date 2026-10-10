import { Mentor } from "../data/centralData";

export interface MentorMatch {
  mentor: Mentor;
  score: number;
  reason: string;
}

export function calculateMentorMatch(
  mentors: Mentor[],
  studentWeakness: string,
  preferredTime?: string
): MentorMatch[] {
  return mentors
    .map((mentor) => {
      let score = 50; // base score
      let reasons = [];

      // Subject match
      const hasSubject = mentor.specialization.some((s) =>
        s.toLowerCase().includes(studentWeakness.toLowerCase()) ||
        studentWeakness.toLowerCase().includes(s.toLowerCase())
      );
      if (hasSubject) {
        score += 35;
        reasons.push("Specializes in your weak topic");
      }

      // Time match
      if (preferredTime) {
        const isAvailable = mentor.availability.some((a) => a.includes(preferredTime));
        if (isAvailable) {
          score += 15;
          reasons.push("Available at preferred time");
        }
      } else {
        // If no preferred time, just add a small bump if they have any availability
        if (mentor.availability.length > 0) {
          score += 10;
          reasons.push("Has open availability");
        }
      }

      return {
        mentor,
        score: Math.min(score, 100),
        reason: reasons.join(" • ") || "General Faculty",
      };
    })
    .sort((a, b) => b.score - a.score);
}
