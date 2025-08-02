import { AppConstants } from "@/common/AppConstants";
import { addHistory } from "@/lib/historyService";
import clientPromise from "@/lib/mongodb";
import { withAuth } from "@/lib/withAuth";
import { ObjectId } from "mongodb";

export const PUT = withAuth(async (request, { params }) => {
  const client = await clientPromise;
  const db = client.db();
  const spendCollection = db.collection(AppConstants.SPENDS);

  const { entry_id, spend_id } = await params;
  const data = await request.json();
  const { title, amount, spend_by, spend_for } = data;
  const { email } = request.user;

  if (!spend_id || !title || !amount || !spend_by || !spend_for) {
    return new Response(JSON.stringify({ error: "invalid data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const oldSpend = await spendCollection.findOne({
    _id: new ObjectId(spend_id),
    entry_id,
  });

  const updateFields = {
    title,
    amount,
    spend_by,
    spend_for,
    changed_at: new Date(),
    changed_by: email,
  };

  const result = await spendCollection.updateOne(
    { _id: new ObjectId(spend_id), entry_id },
    { $set: updateFields }
  );

  if (result.matchedCount === 0) {
    return new Response(JSON.stringify({ error: "spend not found" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  addHistory(
    entry_id,
    oldSpend,
    updateFields,
    AppConstants.PUT,
    AppConstants.SPENDS,
    request.user
  );

  return new Response(
    JSON.stringify({ success: true, message: "spend updated successfully" }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
});
