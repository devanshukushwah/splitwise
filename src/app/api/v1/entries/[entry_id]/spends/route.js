import { AppConstants } from "@/common/AppConstants";
import clientPromise from "@/lib/mongodb";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async (request, { params }) => {
  const client = await clientPromise;
  const db = client.db(); // default DB from connection string
  const collection = db.collection(AppConstants.SPENDS);

  const { email } = request.user;

  const { entry_id } = await params;

  const spends = await collection
    .find({ entry_id })
    .sort({ created_at: 1 })
    .toArray();

  return new Response(JSON.stringify({ success: true, data: { spends } }), {
    headers: { "Content-Type": "application/json" },
  });
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
