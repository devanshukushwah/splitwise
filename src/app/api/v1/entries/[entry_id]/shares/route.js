import { AppConstants } from "@/common/AppConstants";
import clientPromise from "@/lib/mongodb";
import { withAuth } from "@/lib/withAuth";
import { ObjectId } from "mongodb";

export const GET = withAuth(async (request, { params }) => {
  const client = await clientPromise;
  const db = client.db(); // default DB from connection string
  const collection = db.collection(AppConstants.ENTRIES);

  const { entry_id } = await params;

  const entry = await collection.findOne(
    { _id: new ObjectId(entry_id) },
    {
      projection: { shares: 1, _id: 0 },
    }
  );

  return new Response(
    JSON.stringify({ success: true, data: { shares: entry?.shares || [] } }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
});

export const POST = withAuth(async (request, { params }) => {
  const client = await clientPromise;
  const db = client.db(); // default DB from connection string
  const collection = db.collection(AppConstants.ENTRIES);

  const data = await request.json();
  const { email } = data;
  const loggedInUser = request.user;
  const { entry_id } = await params;

  if (!data?.email || !entry_id) {
    return new Response(JSON.stringify({ error: "invalid data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const newShare = {
    email: email.toLowerCase(),
    created_at: new Date(),
    created_by: loggedInUser.email,
  };
  const result = await collection.updateOne(
    { _id: new ObjectId(entry_id) },
    { $push: { shares: newShare } }
  );

  if (result.modifiedCount > 0) {
    return new Response(
      JSON.stringify({ success: true, message: "added to share" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 201,
      }
    );
  } else {
    return new Response(JSON.stringify({ error: "failed to add share" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

export const DELETE = withAuth(async (request, { params }) => {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection(AppConstants.ENTRIES);

  const data = await request.json();
  const { email } = data;
  const { entry_id } = params;

  if (!email || !entry_id) {
    return new Response(JSON.stringify({ error: "invalid data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = await collection.updateOne(
    { _id: new ObjectId(entry_id) },
    { $pull: { shares: { email: email.toLowerCase() } } }
  );

  if (result.modifiedCount > 0) {
    return new Response(
      JSON.stringify({ success: true, message: "share deleted" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } else {
    return new Response(JSON.stringify({ error: "failed to delete share" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
