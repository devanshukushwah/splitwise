import { AppConstants } from "@/common/AppConstants";
import clientPromise from "@/lib/mongodb";

const methodTypes = {
  POST: "Added",
  PUT: "Updated",
  DELETE: "Deleted",
};

const getKeys = (obj) => {
  const notAllowedKeys = [
    "_id",
    "created_at",
    "created_by",
    "changed_at",
    "changed_by",
  ];
  return (
    Object.keys(obj).filter((item) => !notAllowedKeys.includes(item)) || []
  );
};

const createSpendChanges = (prevObj, newObj) => {};
const createEntryChanges = (prevObj, newObj) => {};

export async function addHistory(
  prevObj,
  newObj,
  methodType,
  collectionType,
  user
) {
  const client = await clientPromise;
  const db = client.db(); // default DB from connection string
  const historyCollection = db.collection(AppConstants.HISTORY);

  console.log(`Adding history....`);

  let history = {
    type: methodTypes[methodType] || "Unknown",
    created_by: new ObjectId(user._id),
    created_at: new Date(),
  };

  switch (collectionType) {
    case AppConstants.SPENDS: {
      history.changes = createSpendChanges(prevObj, newObj);
      break;
    }
    case AppConstants.ENTRIES: {
      history.changes = createEntryChanges(prevObj, newObj);
      break;
    }
    default: {
      throw new Error("Invalid collection type");
    }
  }
}
