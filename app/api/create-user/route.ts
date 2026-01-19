import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongo";
import { User } from "@/models/user";

export async function POST() {
  await connectDB();

  const hashed = await bcrypt.hash("YOUR_PASSWORD", 10);

  await User.create({
    username: "user",
    password: hashed,
  });

  return Response.json({ message: "User created" });
}
