import { AppConstants } from "@/common/AppConstants";
import clientPromise from "@/lib/mongodb";
import { withAuth } from "@/lib/withAuth";
import { ObjectId } from "mongodb";

export const GET = withAuth(async (request, { params }) => {
  const client = await clientPromise;
  const db = client.db(); // default DB from connection string
  const spendCollection = db.collection(AppConstants.SPENDS);
  const entryCollection = db.collection(AppConstants.ENTRIES);

  const { email } = request.user;
  const { entry_id } = await params;

  const entry = await entryCollection.findOne(
    { _id: new ObjectId(entry_id) },
    {
      projection: { shares: 1, created_by: 1, title: 1 },
    }
  );

  // Check if logged in email matches created_by or any shares.email
  const isCreatorOrShared =
    entry.created_by === email ||
    entry.shares.some((share) => share.email === email);

  if (!isCreatorOrShared) {
    return new Response(
      JSON.stringify({
        success: false,
        isAppError: true,
        error: "No owner or collaborators found",
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      }
    );
  }

  const spends = await spendCollection
    .find({ entry_id })
    .sort({ created_at: 1 })
    .toArray();

  return new Response(
    JSON.stringify({
      success: true,
      data: { spends, entry: { title: entry.title } },
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
});

export const POST = withAuth(async (request, { params }) => {
  const client = await clientPromise;
  const db = client.db(); // default DB from connection string
  const collection = db.collection(AppConstants.SPENDS);

  const data = await request.json();
  const { title, amount, spend_by, spend_for } = data;
  const { email } = request.user;
  const { entry_id } = await params;

  if (!title || !amount) {
    return new Response(JSON.stringify({ error: "invalid data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const newSpend = {
    title,
    amount,
    created_by: email,
    entry_id,
    spend_by,
    spend_for,
    created_at: new Date(),
  };
  const result = await collection.insertOne(newSpend);

  return new Response(
    JSON.stringify({ success: true, data: { spend_id: result.insertedId } }),
    {
      headers: { "Content-Type": "application/json" },
      status: 201,
    }
  );
});
