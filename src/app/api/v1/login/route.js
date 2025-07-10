import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { AppConstants } from "@/common/AppConstants";
import clientPromise from "@/lib/mongodb";

const SECRET = process.env.JWT_SECRET || "secret-nahi-hai";

export async function POST(req) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ error: "invalid data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const client = await clientPromise;
  const db = client.db(); // default DB from connection string
  const collection = db.collection(AppConstants.USERS);
  const user = await collection.findOne({ email: email.toLowerCase() });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json(
      { error: "Invalid credentials", success: false },
      { status: 401 }
    );
  }

  const token = jwt.sign({ email }, SECRET);

  return NextResponse.json({ token, success: true });
}
