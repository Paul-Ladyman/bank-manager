const config = require('./config');

function reportByMonth(month, breakdown) {
  console.log(`${month}`);

  if (breakdown.balanceBeforeWage) {
    console.log(`\tBalance Before Wage: £${breakdown.balanceBeforeWage}`);
  }

  if (breakdown.wage) {
    console.log(`\tWage: £${breakdown.wage}`);
  }

  if (breakdown.credits.length > 0) {
    console.log('\tOther Credits:');
    breakdown.credits.forEach((credit) => {
      console.log(`\t\t${credit['Transaction Description']} - £${credit['Credit Amount']}`);
    });
  }

  if (breakdown.rent) {
    console.log(`\tRent: £${breakdown.rent}`);
  }

  if (breakdown.utilities.length > 0) {
    console.log('\tUtilities:');
    breakdown.utilities.forEach((utility) => {
      console.log(`\t\t${utility['Transaction Description']} - £${utility['Debit Amount']}`);
    });
    console.log(`\t\tTotal - £${breakdown.utilitiesTotal.toFixed(2)}`);
  }

  if (breakdown.bills.length > 0) {
    console.log('\tOther Bills:');
    breakdown.bills.forEach((bill) => {
      console.log(`\t\t${bill['Transaction Description']} - £${bill['Debit Amount']}`);
    });
    console.log(`\t\tTotal - £${breakdown.billsTotal.toFixed(2)}`);
  }

  if (breakdown.spendingWarnings.length > 0) {
    console.log(`\tSpending Warnings (> £${parseFloat(config.spendingLimit)}):`);
    breakdown.spendingWarnings.forEach((warning) => {
      console.log(`\t\t${warning['Transaction Description']} - £${warning['Debit Amount']}`);
    });
  }

  console.log(`\tLargest Debit (excl. rent):\n\t\t${breakdown.largestDebit['Transaction Description']} - £${breakdown.largestDebit['Debit Amount']}`);

  console.log(`\tFinal Balance: £${breakdown.finalBalance}`);
}

module.exports = {
  reportByMonth: reportByMonth
};
