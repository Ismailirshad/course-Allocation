import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

import { getDashboardData } from "@/lib/getDashboardData";

export async function GET() {
  try {
    await connectDB();

    const data = await getDashboardData();

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
