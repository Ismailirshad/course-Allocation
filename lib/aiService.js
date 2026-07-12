import { GoogleGenerativeAI } from "@google/generative-ai";
import { getDashboard } from "@/lib/allocationService";

function answerFromAnalytics(question, dashboard) {
  const query = question.toLowerCase();

  if (query.includes("allocated") && query.includes("course")) {
    return dashboard.courseStatistics.map((course) => `${course.course}: ${course.allocated} students`).join("\n");
  }

  if (query.includes("first preference")) {
    if (!dashboard.firstPreferenceMisses.length) {
      return "All allocated students received their first preference.";
    }

    return dashboard.firstPreferenceMisses
      .map((student) => `${student.name} received ${student.course} as preference ${student.allocatedPreference}`)
      .join("\n");
  }

  if (query.includes("highest rejection")) {
    const highest = [...dashboard.courseStatistics].sort((a, b) => b.rejectionRate - a.rejectionRate)[0];
    return highest ? `${highest.course} had the highest rejection rate at ${highest.rejectionRate}%.` : "No data found.";
  }

  if (query.includes("category")) {
    return dashboard.categoryWiseAllocation.map((item) => `${item.category}: ${item.count} students`).join("\n");
  }

  return null;
}

export async function askAssistant(question) {
  const dashboard = await getDashboard();
  const analyticsAnswer = answerFromAnalytics(question, dashboard);

  if (analyticsAnswer) {
    return { answer: analyticsAnswer, source: "analytics" };
  }

  if (!process.env.GEMINI_API_KEY) {
    return {
      answer: "Gemini key is not configured. Add GEMINI_API_KEY in .env.local for AI fallback answers.",
      source: "system",
    };
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(`
You are an allocation analytics assistant.
Answer only from this JSON.

Question: ${question}

Data:
${JSON.stringify(dashboard, null, 2)}
`);

  return { answer: result.response.text(), source: "gemini" };
}

