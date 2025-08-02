import { AppConstants } from "@/common/AppConstants";
import clientPromise from "@/lib/mongodb";
import { responseOk, responseOkWithData } from "./ResponseEntity";
import { ObjectId } from "mongodb";

const methodTypes = {
  POST: "Added",
  PUT: "Updated",
  DELETE: "Deleted",
};

const getKeys = (obj) => {
  if (!obj) {
    return [];
  }

  const notAllowedKeys = [
    "_id",
    "created_at",
    "created_by",
    "changed_at",
    "changed_by",
    "userId",
    "entry_id",
  ];
  return (
    Object.keys(obj).filter((item) => !notAllowedKeys.includes(item)) || []
  );
};

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

const createChanges = (prevObj, newObj) => {
  const changes = [];

  // If both are null or undefined, no changes
  if (!prevObj && !newObj) {
    return changes;
  }

  // If one is null, treat all keys as added or removed
  if (!prevObj) {
    getKeys(newObj).forEach((key) => {
      changes.push({
        key: key,
        new: newObj[key],
      });
    });
    return changes;
  }

  if (!newObj) {
    getKeys(prevObj).forEach((key) => {
      changes.push({
        key: key,
        prev: prevObj[key],
      });
    });
    return changes;
  }

  // Both objects exist, compare keys
  const keys = [...new Set([...getKeys(prevObj), ...getKeys(newObj)])];

  keys.forEach((key) => {
    if (
      !deepEqual(prevObj[key], newObj[key]) ||
      (prevObj[key] === undefined && newObj[key] !== undefined) ||
      (prevObj[key] !== undefined && newObj[key] === undefined)
    ) {
      changes.push({
        key: key,
        prev: prevObj[key],
        new: newObj[key],
      });
    }
  });

  return changes;
};

export async function addHistory(
  entryId,
  prevObj,
  newObj,
  methodType,
  collectionType,
  user
) {
  const client = await clientPromise;
  const db = client.db(); // default DB from connection string
  const historyCollection = db.collection(AppConstants.HISTORY);

  let history = {
    entryId: new ObjectId(entryId),
    type: methodTypes[methodType] || "Unknown",
    created_by: new ObjectId(user._id),
    created_at: new Date(),
  };

  switch (collectionType) {
    case AppConstants.SPENDS: {
      history.changes = createChanges(prevObj, newObj);
      break;
    }
    case AppConstants.ENTRIES: {
      history.changes = createChanges(prevObj, newObj);
      break;
    }
    case AppConstants.PEOPLE: {
      history.changes = createChanges(prevObj, newObj);
      break;
    }
    default: {
      throw new Error("Invalid collection type");
    }
  }

  const result = await historyCollection.insertOne(history);

  return responseOk();
}

export async function getHistory(entryId) {
  const client = await clientPromise;
  const db = client.db(); // default DB from connection string
  const historyCollection = db.collection(AppConstants.HISTORY);

  const history = await historyCollection
    .find({ entryId: new ObjectId(entryId) })
    .sort({ created_at: -1 })
    .toArray();

  return responseOkWithData({ history });
}
