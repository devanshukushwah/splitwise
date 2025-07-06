import { AppConstants } from "@/common/AppConstants";
import clientPromise from "@/lib/mongodb";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async (request, { params }) => {
  const client = await clientPromise;
  const db = client.db(); // default DB from connection string
  const collection = db.collection(AppConstants.PEOPLE);

  const { email } = request.user;

  const { entry_id } = await params;

  const people = await collection
    .find({ entry_id })
    .sort({ created_at: 1 })
    .toArray();

  return new Response(JSON.stringify({ success: true, data: { people } }), {
    headers: { "Content-Type": "application/json" },
  });
});

export const POST = withAuth(async (request, { params }) => {
  const client = await clientPromise;
  const db = client.db(); // default DB from connection string
  const collection = db.collection(AppConstants.PEOPLE);

  const data = await request.json();
  const { name } = data;
  const { email } = request.user;
  const { entry_id } = await params;

  if (!name || !entry_id) {
    return new Response(JSON.stringify({ error: "invalid data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const newPerson = {
    name,
    entry_id,
    created_at: new Date(),
    created_by: email,
  };
  const result = await collection.insertOne(newPerson);

  return new Response(
    JSON.stringify({ success: true, data: { person_id: result.insertedId } }),
    {
      headers: { "Content-Type": "application/json" },
      status: 201,
    }
  );
});
