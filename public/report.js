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

    function reportItems(title, items) {
      addToReport(`<div class="report--title">${title}:</div>`);
      items.forEach(({description, value, total}) => {
        const descriptionToRender = total
          ? `<b>${description}</b>`
          : description;
        const valueWithDefault = `£${value || ''}`;
        const valueToRender = total
          ? `<b>${valueWithDefault}</b>`
          : valueWithDefault;
        addToReport(`<div class="report-item"><div>${descriptionToRender}</div><div>${valueToRender}</div></div>`);
      });
    }

    function reportContainer(title, itemsModifier, items, total) {
      addToReport(`<div class="report-container"><div class="report-items ${itemsModifier}">`);
      const itemsToRender = total
        ? [
          ...items,
          { description: 'Total', value: total, total: true }
        ]
        : items
      reportItems(title, itemsToRender);
      addToReport('</div></div>');
    }

    function logHighlight(title, value, itemsModifier) {
      addToReport(`<div class="highlight  ${itemsModifier}"><div class="highlight--title">${title}:</div><div>£${value || ''}</div></div>`);
    }

    function reportHighlights(highlights, itemsModifier) {
      addToReport(`<div class="highlights">`);
      highlights.forEach(({description, value}) => logHighlight(description, value, itemsModifier))
      addToReport('</div>');
    }

    addToReport(`<h2>${month}</h2>`);

    addToReport('<div class="report-body--columns"><div class="report-body--left">');

    reportHighlights([
      { description: 'Total In (excl. savings)', value: breakdown.totalIn.toFixed(2) },
      { description: 'Total Out (excl. savings)', value: breakdown.totalOut.toFixed(2) },
      { description: 'Total Spending (excl. savings + rent)', value: breakdown.totalSpending.toFixed(2) },
      { description: 'Balance Before Wage', value: breakdown.balanceBeforeWage },
      { description: 'Savings', value: breakdown.savingsTotal },
      { description: 'Wage', value: breakdown.wage },
      { description: 'Final Balance', value: breakdown.finalBalance },
    ], 'report-items__credit');

    if (breakdown.credits.length > 0) {
      reportContainer('Credits', 'report-items__credit', breakdown.credits.map((credit) => ({
        description: credit['Transaction Description'],
        value: credit['Credit Amount']
      })));
    }

    reportHighlights([
      { description: 'Rent', value: breakdown.rent },
      { description: 'Transport', value: breakdown.transportTotal.toFixed(2) },
    ], 'report-items__debit');

    reportContainer(
      'Largest Debit (excl. rent and savings)',
      'report-items__debit',
      [{ description: breakdown.largestDebit['Transaction Description'], value: breakdown.largestDebit['Debit Amount'] }]
    );

    if (breakdown.utilities.length > 0) {
      reportContainer(
        'Utilities',
        'report-items__debit',
        breakdown.utilities.map((utility) => ({
          description: utility['Transaction Description'],
          value: utility['Debit Amount']
        })),
        breakdown.utilitiesTotal.toFixed(2)
      );
    }

    if (breakdown.bills.length > 0) {
      reportContainer(
        'Other Bills',
        'report-items__debit',
        breakdown.bills.map((utility) => ({
          description: utility['Transaction Description'],
          value: utility['Debit Amount']
        })),
        breakdown.billsTotal.toFixed(2)
      );
    }

    const debitors = Object.keys(breakdown.debits);
    if (debitors.length > 0) {
      const sortedDebitors = debitors.sort((debitorA, debitorB) => {
        const debitorAAmount = breakdown.debits[debitorA].debits;
        const debitorBAmount = breakdown.debits[debitorB].debits;
        return debitorBAmount - debitorAAmount;
      });
      reportContainer(
        'All debits',
        'report-items__debit',
        sortedDebitors.map((debitor) => ({
          description: `${debitor} (x${breakdown.debits[debitor].debits})`,
          value: breakdown.debits[debitor].totalDebitAmount.toFixed(2)
        }))
      );
    }

    addToReport('</div><div class="report-body--right">');

    if (breakdown.spendingWarnings.length > 0) {
      const warningsTitle = `Spending Warnings (> £${parseFloat(spendingLimit)}, excl. rent, bills, etc.)`;
      reportItems(warningsTitle, breakdown.spendingWarnings.map((warning) => ({
        description: warning['Transaction Description'],
        value: warning['Debit Amount']
      })));
    }

    addToReport('</div></div>');
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
