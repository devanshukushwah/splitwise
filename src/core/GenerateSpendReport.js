export default function GenerateSpendReport(totalSpends, people) {
  // Ensure totalSpends is an array of objects with spender and amount in float properties
  const newTotalSpends = totalSpends.map((spend) => ({
    ...spend,
    person_id: spend.spender.person_id,
    amount: parseFloat(spend.amount),
  }));

  return main(newTotalSpends, people);
}

const findTotalSpends = (spends, people) => {
  let totalSpends = {};
  for (let { person_id } of people) {
    totalSpends[person_id] = spends
      .filter((spend) => spend.person_id == person_id)
      .reduce((sum, { amount }) => sum + amount, 0);
  }
  return totalSpends;
};

const findTransactionForNormalize = (totalSpends, people) => {
  const peopleSize = Object.keys(people).length; // divided into these persons

  let transactions = [];

  for (let toPersonId in totalSpends) {
    const amount = totalSpends[toPersonId];
    const dividedAmount = amount / peopleSize;

    if (dividedAmount == 0) continue; // avoid zero currency transaction.

    for (let { person_id: fromPersonId } of people) {
      if (fromPersonId == toPersonId) continue; // don't push transaction for same person_id.
      transactions.push({
        from_person_id: fromPersonId,
        to_person_id: parseInt(toPersonId),
        amount: dividedAmount,
      });
    }
  }

  return transactions;
};

// Function to optimize transactions
function optimizeTransactions(transactions) {
  // Create a map to track net balances between pairs
  const balanceMap = new Map();

  // Calculate net balances
  transactions.forEach((transaction) => {
    const key = `${transaction.from_person_id}-${transaction.to_person_id}`;
    const reverseKey = `${transaction.to_person_id}-${transaction.from_person_id}`;

    if (balanceMap.has(reverseKey)) {
      // If there's a reverse transaction, adjust the balance
      const reverseAmount = balanceMap.get(reverseKey);
      if (reverseAmount > transaction.amount) {
        balanceMap.set(reverseKey, reverseAmount - transaction.amount);
      } else if (reverseAmount < transaction.amount) {
        balanceMap.delete(reverseKey);
        balanceMap.set(key, transaction.amount - reverseAmount);
      } else {
        balanceMap.delete(reverseKey);
      }
    } else {
      // Otherwise, add the transaction to the map
      balanceMap.set(key, transaction.amount);
    }
  });

  // Reconstruct the optimized list of transactions
  const optimizedTransactions = [];
  balanceMap.forEach((amount, key) => {
    const [from_person_id, to_person_id] = key.split("-").map(Number);
    optimizedTransactions.push({ from_person_id, to_person_id, amount });
  });

  return optimizedTransactions;
}

const main = (spends, people) => {
  const totalSpends = findTotalSpends(spends, people);
  const transactions = findTransactionForNormalize(totalSpends, people);
  const optimizedTransactions = optimizeTransactions(transactions);
  return { transactions, optimizedTransactions };
};
