const transactionTypes = {
  BGC: 'Bank Giro Credit',
  BNS: 'Bonus',
  BP: 'Bill Payment',
  CHG: 'Charge',
  CHQ: 'Cheque',
  COM: 'Commission',
  COR: 'Correction',
  CPT: 'Cashpoint',
  CSH: 'Cash',
  CSQ: 'Cash/Cheque',
  DD: 'Direct Debit',
  DEB: 'Debit Card',
  DEP: 'Deposit',
  EFT: 'EFTPOS - electronic funds transfer at point of sale',
  EUR: 'Euro Cheque',
  FE: 'Foreign Exchange',
  FEE: 'Fixed Service Charge',
  FPC: 'Faster Payment charge',
  FPI: 'Faster Payment incoming',
  FPO: 'Faster Payment outgoing',
  IB: 'Internet Banking',
  INT: 'Interest',
  MPI: 'Mobile Payment incoming',
  MPO: 'Mobile Payment outgoing',
  MTG: 'Mortgage',
  NS: 'National Savings Dividend',
  NSC: 'National Savings Certificates',
  OTH: 'Other',
  PAY: 'Payment',
  PSB: 'Premium Savings Bonds',
  PSV: 'Paysave',
  SAL: 'Salary',
  SPB: 'Cashpoint',
  SO: 'Standing Order',
  STK: 'Stocks/Shares',
  TD: 'Dep Term Dec',
  TDG: 'Term Deposit Gross Interest',
  TDI: 'Dep Term Inc',
  TDN: 'Term Deposit Net Interest',
  TFR: 'Transfer',
  UT: 'Unit Trust',
  SUR: 'Excess Reject',
  UN: 'UNKNOWN'
};

function getStatements(breakdowns, spendingLimit) {
  var statements = {};

  function statementsByMonth(month, breakdown) {
    function addToStatements(addition) {
      if (statements[month]) {
        statements[month] += addition;
      } else {
        statements[month] = addition;
      }
    }

    addToStatements(`<h2>${month}</h2>`);

    addToStatements('<table><tr>' +
      '<th>Date</th><th>Description</th><th>Type</th><th>In</th><th>Out</th><th>Balance</th>' +
      '</tr>'
    );

    breakdown.statements.forEach((statement) => {
      const date = statement['Transaction Date'];
      const description = statement['Transaction Description'];
      const typeKey = statement['Transaction Type'];
      const type = transactionTypes[typeKey];
      const credit = statement['Credit Amount'];
      const creditToRender = credit ? `£${credit}` : '';
      const debit = statement['Debit Amount'];
      const debitToRender = debit ? `£${debit}` : '';
      const balance = statement['Balance'];
      addToStatements('<tr>' +
        `<td>${date}</td><td>${description}</td><td>${type} (${typeKey})</td><td>${creditToRender}</td><td>${debitToRender}</td><td>£${balance}</td>` +
        '</tr>'
      );
    });

    addToStatements('</table>');

    return statements;
  }

  breakdowns.forEach(({month, breakdown}) => statementsByMonth(month, breakdown, spendingLimit));
  return statements;
}

function generateStatements(breakdownString) {
  const breakdown = JSON.parse(breakdownString);
  const breakdowns = breakdown.breakdowns;
  const headerElement = document.getElementById('statements-header');
  const statementsElement = document.getElementById('statements-body');

  headerElement.innerHTML = '';

  const statements = getStatements(breakdowns);

  const statementsTabs = breakdowns.reverse().map(({month}) => {
    const tab = document.createElement('div');
    tab.classList = 'header-item header-item__tab';
    tab.innerText = month.slice(0, 3);
    return { month, tab };
  });

  const statementsTabSwitcher = (month, selectedTab, allTabs) => {
    allTabs.forEach(({tab}) => tab.classList.remove('active'))
    selectedTab.classList.add('active');
    statementsElement.innerHTML = statements[month];
  };

  statementsTabs.forEach(({month, tab}, i) => {
    tab.onclick = () => statementsTabSwitcher(month, tab, statementsTabs);
    headerElement.appendChild(tab);
    if (i === 0) {
      tab.click();
    }
  });
}
