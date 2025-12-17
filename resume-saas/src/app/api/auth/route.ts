import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  await connectDB();

  const { email, password, type } = await req.json();

  if (type === "signup") {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: "User created" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET!
  );

  return NextResponse.json({ token });
}
