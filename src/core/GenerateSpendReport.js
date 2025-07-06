export default function GenerateSpendReport(totalSpends, people) {
  // Ensure totalSpends is an array of objects with spender and amount in float properties

  const newTotalSpends = totalSpends.map((spend) => ({
    ...spend,
    person_id: spend.spend_by,
    amount: parseFloat(spend.amount),
  }));

  return main(newTotalSpends, people);
}

const findTransactions = (spends) => {
  let transactions = [];

  for (let { spend_for, amount, person_id } of spends) {
    const dividedAmount = amount / spend_for?.length;

    for (let spend_id of spend_for) {
      if (spend_id != person_id) {
        const transaction = {
          from_person_id: spend_id,
          to_person_id: person_id,
          amount: dividedAmount,
        };
        transactions.push(transaction);
      }
    }
  }

  return transactions;
};

const findAccumulateTransactions = (transactions) => {
  const transactionMap = new Map();

  // Iterate over each transaction
  transactions.forEach((transaction) => {
    const key = `${transaction.from_person_id}-${transaction.to_person_id}`;
    if (transactionMap.has(key)) {
      transactionMap.get(key).amount += transaction.amount;
    } else {
      transactionMap.set(key, { ...transaction });
    }
  });

  // Convert the map back to an array of transactions
  return Array.from(transactionMap.values());
};

const findOptimizeTransactions4 = (transactions) => {
  let transactionMap = new Map();

  transactions.forEach((transaction) => {
    const { from_person_id, to_person_id } = transaction;
    const key = `${from_person_id}-${to_person_id}`;
    const reverseKey = `${to_person_id}-${from_person_id}`;

    if (transactionMap.has(reverseKey)) {
      const existingTransaction = transactionMap.get(reverseKey);
      if (transaction.amount > existingTransaction.amount) {
        transactionMap.set(key, {
          amount: transaction.amount - existingTransaction.amount,
          from_person_id: transaction.from_person_id,
          to_person_id: transaction.to_person_id,
        });
      } else if (transaction.amount < existingTransaction.amount) {
        existingTransaction.amount -= transaction.amount;
        transactionMap.set(key, existingTransaction);
      }

      transactionMap.delete(reverseKey);
    } else {
      transactionMap.set(key, { ...transaction });
    }
  });

  // Convert the map back to an array of transactions
  return Array.from(transactionMap.values());
};

const main = (spends, people) => {
  let transactions = findTransactions(spends);

  const accumulateTransactions = findAccumulateTransactions(transactions);

  const optimizedTransactions = findOptimizeTransactions4(
    accumulateTransactions
  );

  return { transactions, optimizedTransactions };
};
