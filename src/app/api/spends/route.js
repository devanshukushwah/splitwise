import { AppConstants } from "@/common/AppConstants";
import clientPromise from "@/lib/mongodb";

export async function GET(request) {
  const client = await clientPromise;
  const db = client.db(); // default DB from connection string
  const collection = db.collection(AppConstants.SPENDS);

  const notes = await collection.find({}).toArray();

  return new Response(JSON.stringify(notes), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request) {
  const client = await clientPromise;
  const db = client.db(); // default DB from connection string
  const collection = db.collection(AppConstants.SPENDS);

  const data = await request.json();
  const { title, content } = data;

  if (!title || !content) {
    return new Response(
      JSON.stringify({ error: "Title and content are required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const newNote = { title, content, createdAt: new Date() };
  const result = await collection.insertOne(newNote);

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
    status: 201,
  });
}
