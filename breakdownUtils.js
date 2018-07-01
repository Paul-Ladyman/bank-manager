const statementUtils = require('./statementUtils');
const config = require('./config');

function getLargestDebit(statement, breakdown) {
  if (statementUtils.statementIsRent(statement)) {
    return breakdown.largestDebit;
  }

  const statementDebitAmount = parseFloat(statement['Debit Amount']);
  const largestDebitAmount = breakdown.largestDebit ?
    parseFloat(breakdown.largestDebit['Debit Amount']) :
    0.0;

  return statementDebitAmount > largestDebitAmount ? statement : breakdown.largestDebit;
}

function getCredits(statement, breakdown) {
  if (!statementUtils.statementIsWage(statement) && statement['Credit Amount'] !== '') {
    return breakdown.credits.concat([statement])
  }
  return breakdown.credits;
}

function getBills(statement, breakdown) {
  if (statementUtils.statementIsBill(statement)) {
    return breakdown.bills.concat([statement]);
  }
  return breakdown.bills;
}

function sumBills(statement, breakdown) {
  if (statementUtils.statementIsBill(statement)) {
    return breakdown.billsTotal + parseFloat(statement['Debit Amount']);
  }
  return breakdown.billsTotal;
}

function getUtilities(statement, breakdown) {
  if (statementUtils.statementIsUtility(statement)) {
    return breakdown.utilities.concat([statement]);
  }
  return breakdown.utilities;
}

function sumUtilities(statement, breakdown) {
  if (statementUtils.statementIsUtility(statement)) {
    return breakdown.utilitiesTotal + parseFloat(statement['Debit Amount']);
  }
  return breakdown.utilitiesTotal;
}

function sumTransport(statement, breakdown) {
  if (statementUtils.statementIsTransport(statement)) {
    return breakdown.transportTotal + parseFloat(statement['Debit Amount']);
  }
  return breakdown.transportTotal;
}

function getWage(statement, breakdown) {
  if (statementUtils.statementIsWage(statement)) {
    return statement['Credit Amount'];
  }
  return breakdown.wage;
}

function getRent(statement, breakdown) {
  if (statementUtils.statementIsRent(statement)) {
    return statement['Debit Amount'];
  }
  return breakdown.rent;
}

function getBalanceBeforeWage(statements, breakdown) {
  if (statements.length > 1 && statementUtils.statementIsWage(statements[0])) {
    return statements[1]['Balance'];
  }
  return breakdown.balanceBeforeWage;
}

function getFinalBalance(statement, breakdown) {
  return breakdown.finalBalance || statement['Balance'];
}

function getSpendingWarnings(statement, breakdown) {
  const spendingWarning =
    !statementUtils.statementIsUtility(statement) &&
    !statementUtils.statementIsBill(statement) &&
    !statementUtils.statementIsRent(statement) &&
    !statementUtils.statementIsInSpendingBlacklist(statement) &&
    statementUtils.debitAmountExceeds(statement, config.spendingLimit);

  if (spendingWarning) {
    return breakdown.spendingWarnings.concat([statement]);
  }
  return breakdown.spendingWarnings;
}

function getMonthBreakdown(statements, breakdown) {
  if (!breakdown) {
    breakdown = {
      credits: [],
      bills: [],
      billsTotal: 0.00,
      utilitiesTotal: 0.00,
      utilities: [],
      transportTotal: 0.00,
      spendingWarnings: []
    };
  }

  if (statements.length === 0) {
    return breakdown;
  }

  const statement = statements[0];
  const newStatements = statements.slice(1);
  const newBreakdown = Object.assign({}, breakdown, {
    finalBalance: getFinalBalance(statement, breakdown), 
    largestDebit: getLargestDebit(statement, breakdown),
    credits: getCredits(statement, breakdown),
    balanceBeforeWage: getBalanceBeforeWage(statements, breakdown),
    wage: getWage(statement, breakdown),
    rent: getRent(statement, breakdown),
    bills: getBills(statement, breakdown),
    billsTotal: sumBills(statement, breakdown),
    utilities: getUtilities(statement, breakdown),
    utilitiesTotal: sumUtilities(statement, breakdown),
    transportTotal: sumTransport(statement, breakdown),
    spendingWarnings: getSpendingWarnings(statement, breakdown)
  });
  return getMonthBreakdown(newStatements, newBreakdown);
}

module.exports = {
  getMonthBreakdown: getMonthBreakdown
};
