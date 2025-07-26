import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { AppConstants } from "@/common/AppConstants";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  const { email, password, firstName, lastName } = await req.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ error: "invalid data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const client = await clientPromise;
  const db = client.db(); // default DB from connection string
  const collection = db.collection(AppConstants.USERS);

  const dbUser = await collection.findOne({ email });

  if (dbUser) {
    return new Response(
      JSON.stringify({ success: false, error: "User already exists" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let user = {
    email: email.toLowerCase(),
    password: hashedPassword,
    firstName,
    lastName,
  };

  const result = await collection.insertOne(user);

  if (result.insertedId) {
    return NextResponse.json({
      message: "User registered",
      success: true,
      status: 201,
    });
  } else {
    return new Response(
      JSON.stringify({ success: false, error: "failed to register" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}
