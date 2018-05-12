function reportByMonth(month, breakdown) {
  console.log(`${month}`);
  const largestDebit = breakdown.largestDebit;
  
  if (breakdown.wage) {
    console.log(`\tWage: £${breakdown.wage}`);
  }

  if (breakdown.rent) {
    console.log(`\tRent: £${breakdown.rent}`);
  }

  console.log(`\tLargest debit: ${largestDebit['Transaction Description']} - £${largestDebit['Debit Amount']}`);

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
}

module.exports = {
  reportByMonth: reportByMonth
};
