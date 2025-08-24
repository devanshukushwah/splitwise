import { AppConstants } from "@/common/AppConstants";
import { addHistory } from "@/lib/historyService";
import clientPromise from "@/lib/mongodb";
import { withAuth } from "@/lib/withAuth";
import { ObjectId } from "mongodb";

export const GET = withAuth(async (request, { params }) => {
  const client = await clientPromise;
  const db = client.db(); // default DB from connection string
  const peopleCollection = db.collection(AppConstants.PEOPLE);
  const userCollection = db.collection(AppConstants.USERS);

  const { entry_id: entryId } = await params;

  let people = await peopleCollection
    .find({ entryId: new ObjectId(entryId) })
    .sort({ created_at: 1 })
    .toArray();

  if (people) {
    const peopleUserIds = people.map((person) => new ObjectId(person.userId));
    const users = await userCollection
      .find(
        { _id: { $in: peopleUserIds } },
        { projection: { firstName: 1, lastName: 1, email: 1 } }
      )
      .toArray();

    // Group by email (one user per email)
    const groupedByUserId = users.reduce((acc, user) => {
      acc[user._id] = user;
      return acc;
    }, {});

    // Map people to include user details
    people = people.map((person) => {
      return {
        ...person,
        user: groupedByUserId[person.userId],
      };
    });
  }

  return new Response(JSON.stringify({ success: true, data: { people } }), {
    headers: { "Content-Type": "application/json" },
  });
});

/**
 *
 * @param {string} entry_id spend entry id
 * @param {string} email new person email address in spend entry
 * @param {*} user this is a login user object
 * @returns
 */
export const createPeople = async (entry_id, email, user) => {
  const client = await clientPromise;
  const db = client.db(); // default DB from connection string
  const peopleCollection = db.collection(AppConstants.PEOPLE);
  const userCollection = db.collection(AppConstants.USERS);
  const entryCollection = db.collection(AppConstants.ENTRIES);

  if (!email || !entry_id) {
    return new Response(JSON.stringify({ error: "invalid data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const emailLower = email.toLowerCase();

  const peopleUser = await userCollection.findOne(
    { email: emailLower },
    { projection: { firstName: 1, lastName: 1, email: 1 } }
  );

  if (!peopleUser) {
    return new Response(
      JSON.stringify({
        success: false,
        guestRequired: true,
        error: "User not found",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Check if the person already exists
  const existingPerson = await peopleCollection.findOne({
    userId: new ObjectId(peopleUser._id),
    entryId: new ObjectId(entry_id),
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
    userId: peopleUser._id,
    entryId: new ObjectId(entry_id),
    created_at: new Date(),
    created_by: new ObjectId(user._id),
  };
  const result = await peopleCollection.insertOne(newPerson);

  newPerson._id = result.insertedId;
  newPerson.user = peopleUser;

  if (result.insertedId) {
    // Add to entry shares for collaboration
    const newShare = {
      userId: peopleUser._id,
      created_at: new Date(),
      created_by: new ObjectId(user._id),
    };

    const entryResult = await entryCollection.updateOne(
      { _id: new ObjectId(entry_id) },
      { $push: { shares: newShare } }
    );

    addHistory(
      entry_id,
      null,
      { userId: newPerson.userId.toString() },
      AppConstants.POST,
      AppConstants.PEOPLE,
      user
    );
  }

  return new Response(
    JSON.stringify({ success: true, data: { person: newPerson } }),
    {
      headers: { "Content-Type": "application/json" },
      status: 201,
    }
  );
};

export const POST = withAuth(async (request, { params }) => {
  const { email } = await request.json();
  const user = request.user;
  const { entry_id } = await params;

  return await createPeople(entry_id, email, user);
});
