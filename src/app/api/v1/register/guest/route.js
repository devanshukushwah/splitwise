import { AppConstants } from "@/common/AppConstants";
import { addHistory } from "@/lib/historyService";
import clientPromise from "@/lib/mongodb";
import { withAuth } from "@/lib/withAuth";
import { ObjectId } from "mongodb";
import { createPeople } from "@/app/api/v1/entries/[entry_id]/people/route";
import { validateArgs } from "@/utils/AppUtils";

export const POST = withAuth(async (request) => {
  const client = await clientPromise;
  const db = client.db(); // default DB from connection string
  const userCollection = db.collection(AppConstants.USERS);

  const { email, firstName, entryId } = await request.json();
  const user = request.user;

  const args = validateArgs(email, firstName, entryId);

  if (!args.isValid) {
    return new Response(JSON.stringify({ error: "invalid data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const emailLower = email.toLowerCase();

  const userExists = await userCollection.findOne({ email: emailLower });

  if (userExists) {
    return new Response(
      JSON.stringify({ success: false, error: "User already exists" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      }
    );
  }

  let newUser = {
    email: emailLower,
    firstName,
    isGuest: true,
    created_by: new ObjectId(user._id),
    created_at: new Date(),
  };
  const result = await userCollection.insertOne(newUser);

  newUser._id = result.insertedId;

  await createPeople(entryId, emailLower, user);

  return new Response(
    JSON.stringify({
      success: true,
      data: { user: newUser },
      message: "User created successfully",
    }),
    {
      headers: { "Content-Type": "application/json" },
      status: 201,
    }
  );
});
