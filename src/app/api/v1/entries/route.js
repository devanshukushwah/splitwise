import { AppConstants } from "@/common/AppConstants";
import clientPromise from "@/lib/mongodb";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async (request) => {
  const client = await clientPromise;
  const db = client.db(); // default DB from connection string
  const collection = db.collection(AppConstants.ENTRIES);

  const { email } = request.user;

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit"), 10);
  const skip = parseInt(searchParams.get("skip"), 0);

  const entries = await collection
    .find({
      $or: [{ created_by: email }, { "shares.email": email }],
    })
    .sort({ created_at: -1 })
    .limit(limit)
    .skip(skip)
    .toArray();

  return new Response(JSON.stringify({ entries }), {
    headers: { "Content-Type": "application/json" },
  });
});

export const POST = withAuth(async (request) => {
  const client = await clientPromise;
  const db = client.db(); // default DB from connection string
  const collection = db.collection(AppConstants.ENTRIES);

  const data = await request.json();
  const { title } = data;
  const { email } = request.user;

  if (!title) {
    return new Response(JSON.stringify({ error: "invalid data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const newEntry = { title, created_by: email, created_at: new Date() };
  const result = await collection.insertOne(newEntry);

  return new Response(
    JSON.stringify({
      success: true,
      entry_id: result.insertedId,
      message: "Entry created successfully",
    }),
    {
      headers: { "Content-Type": "application/json" },
      status: 201,
    }
  );
});
