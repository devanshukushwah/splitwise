function findTotalSpentBy(spents) {
  let totalSpentBy = {};

  for (let { amount, spender } of spents) {
    if (totalSpentBy[spender.id] === undefined) {
      totalSpentBy[spender.id] = 0;
    }
    totalSpentBy[spender.id] = amount + totalSpentBy[spender.id];
  }

  let result = [];

  for (let obj in totalSpentBy) {
    result.push({
      id: obj,
      amount: totalSpentBy[obj],
    });
  }

  return result;
}

function findName(id, persons) {
  for (let obj of persons) {
    if (obj.id == id) {
      return obj.personName;
    }
  }
}

function main(spents, persons) {
  // console.log("spents", spents);
  const totalSpentBy = findTotalSpentBy(spents);

  // console.log("totalSpentBy", totalSpentBy);

  let result = [];

  if (totalSpentBy.length == 1) {
    const name = findName(totalSpentBy[0].id, persons);
    const amount = totalSpentBy[0].amount / persons.length;
    console.log("All", "\t-> ", name, " \tamount: ", amount, "RS/-");
    result.push({
      from: "All",
      to: name,
      amount: amount,
    });
  } else {
    for (let i in totalSpentBy) {
      for (let j in totalSpentBy) {
        if (i == j) continue;
        const aAmount = totalSpentBy[i].amount / persons.length;
        const bAmount = totalSpentBy[j].amount / persons.length;
        if (aAmount > bAmount) {
          const aName = findName(totalSpentBy[i].id, persons);
          const bName = findName(totalSpentBy[j].id, persons);

          // console.log(
          //   bName,
          //   "\t-> ",
          //   aName,
          //   " \tamount: ",
          //   // Math.floor(aAmount - bAmount),
          //   aAmount - bAmount,
          //   "RS/-"
          // );
          result.push({
            from: bName,
            to: aName,
            amount: aAmount - bAmount,
          });
        }
      }
    }
  }

  return result;
}

export default function GenerateSpendReport(totalSpends, people) {
  totalSpends = totalSpends.map((spend) => ({
    amount: parseFloat(spend.amount),
    spender: spend.spender,
  }));
  return main(totalSpends, people);
}
