import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { getDashboardData } from "@/lib/getDashboardData";
import { ai } from "@/lib/gemini";

export async function POST(req) {
  try {
    await connectDB();

    const { question } = await req.json();

    const dashboard = await getDashboardData();

    const prompt = `
You are an AI Assistant for a College Course Allocation System.

You must answer ONLY using the dashboard data provided below.
Do not make up any information.
If the answer is not available in the data, reply:
"I couldn't find that information."

Dashboard Data:

${JSON.stringify(dashboard, null, 2)}

Question:
${question}

Answer in a friendly and concise way.
Use bullet points whenever appropriate.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return NextResponse.json({
      success: true,
      answer: response.text,
    });
  } catch (error) {
    console.log("Error in assistant controller", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}