function getReport(breakdowns, spendingLimit) {
  var report = {};

  function reportByMonth(month, breakdown, spendingLimit) {
    function addToReport(addition) {
      if (report[month]) {
        report[month] += addition;
      } else {
        report[month] = addition;
      }
    }
  
    function indentClass(indent) {
      return indent ? 'report-item__indented' : '';
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

    addToReport(`<h2>${month}</h2>`);

    if (breakdown.balanceBeforeWage) {
      logBalance(`Balance Before Wage: £${breakdown.balanceBeforeWage}`);
    }

    if (breakdown.savingsTotal) {
      logCredit(`Savings: £${breakdown.savingsTotal}`);
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

    logDebit(`Largest Debit (excl. rent and savings):`);
    logDebit(`${breakdown.largestDebit['Transaction Description']} - £${breakdown.largestDebit['Debit Amount']}`, true);

    logBalance(`Final Balance: £${breakdown.finalBalance}`);
  }

  breakdowns.forEach(({month, breakdown}) => reportByMonth(month, breakdown, spendingLimit));
  return report;
}

function generateReport(breakdownString) {
  const breakdown = JSON.parse(breakdownString);
  const breakdowns = breakdown.breakdowns;
  const spendingLimit = breakdown.spendingLimit;
  const headerElement = document.getElementById('report-header');
  const reportElement = document.getElementById('report-body');

  headerElement.innerHTML = '';

  const report = getReport(breakdowns, spendingLimit);

  const reportTabs = breakdowns.reverse().map(({month}) => {
    const tab = document.createElement('div');
    tab.classList = 'header-item header-item__tab';
    tab.innerText = month.slice(0, 3);
    return { month, tab };
  });

  const reportTabSwitcher = (month, selectedTab, allTabs) => {
    allTabs.forEach(({tab}) => tab.classList.remove('active'))
    selectedTab.classList.add('active');
    reportElement.innerHTML = report[month];
  };

  reportTabs.forEach(({month, tab}, i) => {
    tab.onclick = () => reportTabSwitcher(month, tab, reportTabs);
    headerElement.appendChild(tab);
    if (i === 0) {
      tab.click();
    }
  });
}
