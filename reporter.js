const breakdownUtils = require('./breakdownUtils');

function reportByMonth(statementsByMonth) {
  const months = Object.keys(statementsByMonth);

  months.forEach((month) => {
    console.log(`${month}`);
    const breakdown = breakdownUtils.getMonthBreakdown(statementsByMonth[month]);
    const largestDebit = breakdown.largestDebit;
    
    if (breakdown.wage) {
      console.log(`\tWage: ${breakdown.wage}`);
    }

    if (breakdown.rent) {
      console.log(`\tRent: ${breakdown.rent}`);
    }

    console.log(`\tLargest debit: ${largestDebit['Transaction Description']} - ${largestDebit['Debit Amount']}`);

    if (breakdown.credits.length > 0) {
      console.log('\tCredits:');
      breakdown.credits.forEach((credit) => {
        console.log(`\t\t${credit['Transaction Description']} - ${credit['Credit Amount']}`);
      });
    }

    if (breakdown.bills.length > 0) {
      console.log('\tBills:');
      breakdown.bills.forEach((bill) => {
        console.log(`\t\t${bill['Transaction Description']} - ${bill['Debit Amount']}`);
      });
    }
  })
}

module.exports = {
  reportByMonth: reportByMonth
};
