import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  await connectDB();

  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
  const user = await User.findById(decoded.id);

  if (!user || user.resumeCredits <= 0) {
    return NextResponse.json({ error: "Usage limit reached" }, { status: 403 });
  }

  // Dummy analysis for now
  const result = {
    score: 75,
    suggestions: ["Add projects", "Mention metrics"],
  };

  user.resumeCredits -= 1;
  await user.save();

  return NextResponse.json(result);
}
