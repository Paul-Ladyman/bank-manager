const chalk = require('chalk');
const config = require('./config');

function logMonth(month) {
  console.log(chalk.magenta(month));
}

function logCredit(credit) {
  console.log(chalk.green(credit));
}

function logDebit(debit) {
  console.log(chalk.blue(debit));
}

function logBalance(balance) {
  console.log(chalk.bgGreen(chalk.black(balance)));
}

function logWarning(warning) {
  console.log(chalk.red(warning));
}

function reportByMonth(month, breakdown) {
  logMonth(`${month}`);

  if (breakdown.balanceBeforeWage) {
    process.stdout.write('\t');
    logBalance(`Balance Before Wage: £${breakdown.balanceBeforeWage}`);
  }

  if (breakdown.wage) {
    logCredit(`\tWage: £${breakdown.wage}`);
  }

  if (breakdown.credits.length > 0) {
    logCredit('\tOther Credits:');
    breakdown.credits.forEach((credit) => {
      logCredit(`\t\t${credit['Transaction Description']} - £${credit['Credit Amount']}`);
    });
  }

  if (breakdown.rent) {
    logDebit(`\tRent: £${breakdown.rent}`);
  }

  if (breakdown.transportTotal) {
    logDebit(`\tTransport: £${breakdown.transportTotal.toFixed(2)}`);
  }

  if (breakdown.utilities.length > 0) {
    logDebit('\tUtilities:');
    breakdown.utilities.forEach((utility) => {
      logDebit(`\t\t${utility['Transaction Description']} - £${utility['Debit Amount']}`);
    });
    logDebit(`\t\tTotal - £${breakdown.utilitiesTotal.toFixed(2)}`);
  }

  if (breakdown.bills.length > 0) {
    logDebit('\tOther Bills:');
    breakdown.bills.forEach((bill) => {
      logDebit(`\t\t${bill['Transaction Description']} - £${bill['Debit Amount']}`);
    });
    logDebit(`\t\tTotal - £${breakdown.billsTotal.toFixed(2)}`);
  }

  if (breakdown.spendingWarnings.length > 0) {
    logWarning(`\tSpending Warnings (> £${parseFloat(config.spendingLimit)}):`);
    breakdown.spendingWarnings.forEach((warning) => {
      logWarning(`\t\t${warning['Transaction Description']} - £${warning['Debit Amount']}`);
    });
  }

  logDebit(`\tLargest Debit (excl. rent):\n\t\t${breakdown.largestDebit['Transaction Description']} - £${breakdown.largestDebit['Debit Amount']}`);

  process.stdout.write('\t');
  logBalance(`Final Balance: £${breakdown.finalBalance}`);
}

module.exports = {
  reportByMonth: reportByMonth
};
