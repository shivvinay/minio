import { connectDB } from "@/lib/mongo";
import { User } from "@/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  await connectDB();

  const user = await User.findOne({ username });
  if (!user) {
    return new Response("Invalid credentials", { status: 401 });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return new Response("Invalid credentials", { status: 401 });
  }

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

   /*cookies().set("token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });*/

  return Response.json({ success: true });
}
