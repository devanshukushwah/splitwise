import { AppConstants } from "@/common/AppConstants";
import { addHistory } from "@/lib/historyService";
import clientPromise from "@/lib/mongodb";
import { withAuth } from "@/lib/withAuth";
import { ObjectId } from "mongodb";

export const GET = withAuth(async (request) => {
  const client = await clientPromise;
  const db = client.db(); // default DB from connection string
  const collection = db.collection(AppConstants.ENTRIES);

  const user = request.user;

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit"), 10);
  const skip = parseInt(searchParams.get("skip"), 0);

  const entries = await collection
    .find(
      {
        $or: [
          { created_by: new ObjectId(user._id) },
          { "shares.email": new ObjectId(user._id) },
        ],
      },
      {
        projection: { shares: 0 },
      }
    )
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
  const user = request.user;

  if (!title) {
    return new Response(JSON.stringify({ error: "invalid data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let newEntry = {
    title,
    created_by: new ObjectId(user._id),
    created_at: new Date(),
  };
  const result = await collection.insertOne(newEntry);

  newEntry._id = result.insertedId;

  // addHistory(null, newEntry, AppConstants.ENTRIES, request.user);

  return new Response(
    JSON.stringify({
      success: true,
      data: { entry: newEntry },
      message: "Entry created successfully",
    }),
    {
      headers: { "Content-Type": "application/json" },
      status: 201,
    }
  );
});
