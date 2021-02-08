function generateReport(breakdownString) {
  var breakdown = JSON.parse(breakdownString);
  var breakdowns = breakdown.breakdowns;
  var spendingLimit = breakdown.spendingLimit;
  var report = '';
  var reportElement = document.getElementById('report');

  function addToReport(addition) {
    report += addition;
  }

  function indentClass(indent) {
    return indent ? 'report-item__indented' : '';
  }

  function logMonth(month) {
    addToReport(`<h2>${month}</h2>`);
  }

  function logCredit(credit, indent) {
    addToReport(`<div class="report-item report-item__credit ${indentClass(indent)}">${credit}</div>`);
  }

  function logDebit(debit, indent) {
    addToReport(`<div class="report-item report-item__debit ${indentClass(indent)}">${debit}</div>`);
  }

  function logBalance(balance) {
    addToReport(`<div class="report-item report-item__balance">${balance}</div>`);
  }

  function logWarning(warning, indent) {
    addToReport(`<div class="report-item report-item__warning ${indentClass(indent)}">${warning}</div>`);
  }

  function reportByMonth(month, breakdown, spendingLimit) {
    logMonth(`${month}`);

    if (breakdown.balanceBeforeWage) {
      logBalance(`Balance Before Wage: £${breakdown.balanceBeforeWage}`);
    }

    if (breakdown.wage) {
      logCredit(`Wage: £${breakdown.wage}`);
    }

    if (breakdown.credits.length > 0) {
      logCredit('Other Credits:');
      breakdown.credits.forEach((credit) => {
        logCredit(`${credit['Transaction Description']} - £${credit['Credit Amount']}`, true);
      });
    }

    if (breakdown.rent) {
      logDebit(`Rent: £${breakdown.rent}`);
    }

    if (breakdown.transportTotal) {
      logDebit(`Transport: £${breakdown.transportTotal.toFixed(2)}`);
    }

    if (breakdown.utilities.length > 0) {
      logDebit('Utilities:');
      breakdown.utilities.forEach((utility) => {
        logDebit(`${utility['Transaction Description']} - £${utility['Debit Amount']}`, true);
      });
      logDebit(`Total - £${breakdown.utilitiesTotal.toFixed(2)}`, true);
    }

    if (breakdown.bills.length > 0) {
      logDebit('Other Bills:');
      breakdown.bills.forEach((bill) => {
        logDebit(`${bill['Transaction Description']} - £${bill['Debit Amount']}`, true);
      });
      logDebit(`Total - £${breakdown.billsTotal.toFixed(2)}`, true);
    }

    if (breakdown.spendingWarnings.length > 0) {
      logWarning(`Spending Warnings (> £${parseFloat(spendingLimit)}):`);
      breakdown.spendingWarnings.forEach((warning) => {
        logWarning(`${warning['Transaction Description']} - £${warning['Debit Amount']}`, true);
      });
    }

    logDebit(`Largest Debit (excl. rent):`);
    logDebit(`${breakdown.largestDebit['Transaction Description']} - £${breakdown.largestDebit['Debit Amount']}`, true);

    logBalance(`Final Balance: £${breakdown.finalBalance}`);
  }

  reportElement.innerHTML = '';
  breakdowns.forEach(({month, breakdown}) => reportByMonth(month, breakdown, spendingLimit));
  reportElement.innerHTML = report;
}
