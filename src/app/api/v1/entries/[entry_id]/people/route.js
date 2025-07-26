import { AppConstants } from "@/common/AppConstants";
import clientPromise from "@/lib/mongodb";
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async (request, { params }) => {
  const client = await clientPromise;
  const db = client.db(); // default DB from connection string
  const peopleCollection = db.collection(AppConstants.PEOPLE);
  const userCollection = db.collection(AppConstants.USERS);

  const { entry_id } = await params;

  let people = await peopleCollection
    .find({ entry_id })
    .sort({ created_at: 1 })
    .toArray();

  if (people) {
    const peopleEmails = people.map((person) => person.email);
    const users = await userCollection
      .find(
        { email: { $in: peopleEmails } },
        { projection: { firstName: 1, lastName: 1, email: 1 } }
      )
      .toArray();

    // Group by email (one user per email)
    const groupedByEmail = users.reduce((acc, user) => {
      acc[user.email] = user;
      return acc;
    }, {});

    // Map people to include user details
    people = people.map((person) => {
      return {
        ...person,
        user: groupedByEmail[person.email],
      };
    });
  }

  return new Response(JSON.stringify({ success: true, data: { people } }), {
    headers: { "Content-Type": "application/json" },
  });
});

export const POST = withAuth(async (request, { params }) => {
  const client = await clientPromise;
  const db = client.db(); // default DB from connection string
  const peopleCollection = db.collection(AppConstants.PEOPLE);
  const userCollection = db.collection(AppConstants.USERS);

  const data = await request.json();
  const { email } = data;
  const { email: loggedInEmail } = request.user;
  const { entry_id } = await params;

  if (!email || !entry_id) {
    return new Response(JSON.stringify({ error: "invalid data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Check if the person already exists
  const existingPerson = await peopleCollection.findOne({
    email,
    entry_id,
  });

  if (existingPerson) {
    return new Response(
      JSON.stringify({ success: false, error: "Person already exists" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  let newPerson = {
    email,
    entry_id,
    created_at: new Date(),
    created_by: loggedInEmail,
  };
  const result = await peopleCollection.insertOne(newPerson);

  newPerson._id = result.insertedId;

  if (result.insertedId) {
    const user = await userCollection.findOne(
      { email },
      { projection: { firstName: 1, lastName: 1, email: 1 } }
    );
    newPerson.user = user;
  }

  return new Response(
    JSON.stringify({ success: true, data: { person: newPerson } }),
    {
      headers: { "Content-Type": "application/json" },
      status: 201,
    }
  );
});
