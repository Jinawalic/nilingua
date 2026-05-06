export function getNextStep(score: number) {
    if (score >= 80) {
        return {
            level: "Advanced",
            feedback: "Excellent! You're ready for more challenging material.",
            action: "Next lesson unlocked: Advanced Vocabulary",
        };
    } else if (score >= 50) {
        return {
            level: "Intermediate",
            feedback: "Well done! Keep practicing to reach the next level.",
            action: "Recommended: Intermediate Grammar",
        };
    } else {
        return {
            level: "Beginner",
            feedback: "Keep trying! Practice makes perfect.",
            action: "Review: Basic Phrases",
        };
    }
}
