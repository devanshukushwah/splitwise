import { AppConstants } from "@/common/AppConstants";
import clientPromise from "@/lib/mongodb";
import { withAuth } from "@/lib/withAuth";
import { ObjectId } from "mongodb";

export const DELETE = withAuth(async (request, { params }) => {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection(AppConstants.PEOPLE);

  const { person_id } = params;

  if (!person_id) {
    return new Response(JSON.stringify({ error: "invalid data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { email } = request.user;

  const result = await collection.updateOne(
    { _id: new ObjectId(person_id) },
    { $set: { isDeleted: true } }
  );

  if (result.deletedCount === 0) {
    return new Response(JSON.stringify({ error: "person not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({ success: true, message: "person deleted successfully" }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
});
