function reportByMonth(month, breakdown) {
  console.log(`${month}`);

  if (breakdown.balanceBeforeWage) {
    console.log(`\tBalance Before Wage: £${breakdown.balanceBeforeWage}`);
  }

  if (breakdown.wage) {
    console.log(`\tWage: £${breakdown.wage}`);
  }

  if (breakdown.rent) {
    console.log(`\tRent: £${breakdown.rent}`);
  }

  console.log(`\tLargest Debit (ex. rent):\n\t\t${breakdown.largestDebit['Transaction Description']} - £${breakdown.largestDebit['Debit Amount']}`);

  if (breakdown.credits.length > 0) {
    console.log('\tCredits:');
    breakdown.credits.forEach((credit) => {
      console.log(`\t\t${credit['Transaction Description']} - £${credit['Credit Amount']}`);
    });
  }

  if (breakdown.bills.length > 0) {
    console.log('\tBills:');
    breakdown.bills.forEach((bill) => {
      console.log(`\t\t${bill['Transaction Description']} - £${bill['Debit Amount']}`);
    });
  }

  if (breakdown.spendingWarnings.length > 0) {
    console.log('\tSpending Warnings:');
    breakdown.spendingWarnings.forEach((warning) => {
      console.log(`\t\t${warning['Transaction Description']} - £${warning['Debit Amount']}`);
    });
  }

  console.log(`\tFinal Balance: £${breakdown.finalBalance}`);
}

module.exports = {
  reportByMonth: reportByMonth
};
