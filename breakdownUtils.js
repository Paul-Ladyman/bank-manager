const statementUtils = require('./statementUtils');
const config = require('./config');

function getLargestDebit(statement, breakdown) {
  const ignoreStatement =
    statementUtils.statementIsRent(statement) ||
    statementUtils.statementIsSavings(statement)

  if (ignoreStatement) {
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
  const statementIfBill = statementUtils.statementIfBill(statement)
  if (statementIfBill) {
    return breakdown.bills.concat([statementIfBill]);
  }
  return breakdown.bills;
}

function sumBills(statement, breakdown) {
  if (statementUtils.statementIfBill(statement)) {
    return breakdown.billsTotal + parseFloat(statement['Debit Amount']);
  }
  return breakdown.billsTotal;
}

function getUtilities(statement, breakdown) {
  const statementIfUtility = statementUtils.statementIfUtility(statement)
  if (statementIfUtility) {
    return breakdown.utilities.concat([statementIfUtility]);
  }
  return breakdown.utilities;
}

function sumUtilities(statement, breakdown) {
  if (statementUtils.statementIfUtility(statement)) {
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

function sumSavings(statement, breakdown) {
  if (statementUtils.statementIsSavings(statement)) {
    return breakdown.savingsTotal + parseFloat(statement['Debit Amount']);
  }
  return breakdown.savingsTotal;
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
    !statementUtils.statementIfUtility(statement) &&
    !statementUtils.statementIfBill(statement) &&
    !statementUtils.statementIsRent(statement) &&
    !statementUtils.statementIsSavings(statement) &&
    !statementUtils.statementIsInSpendingBlacklist(statement) &&
    statementUtils.debitAmountExceeds(statement, config.spendingLimit);

  if (spendingWarning) {
    return breakdown.spendingWarnings.concat([statement]);
  }
  return breakdown.spendingWarnings;
}

function getDebits(statement, breakdown) {
  const rawAmount = statement['Debit Amount'];
  
  if (!rawAmount) {
    return breakdown.debits;
  }

  const description = statement['Transaction Description'];
  const existingDebitor = breakdown.debits[description];
  const amount = parseFloat(rawAmount);

  if (existingDebitor) {
    const { debits, totalDebitAmount } = existingDebitor;
    const newDebitAmount = totalDebitAmount + amount;
    const newDebits = debits + 1;
    breakdown.debits[description] = { debits: newDebits, totalDebitAmount: newDebitAmount };
  } else {
    breakdown.debits[description] = { debits: 1, totalDebitAmount: amount };
  }

  return breakdown.debits;
}

function getTotalIn(statement, breakdown) {
  const statementIsSavings = statementUtils.statementIsSavings(statement);
  const rawAmount = statement['Credit Amount'];
  
  if (statementIsSavings || !rawAmount) {
    return breakdown.totalIn;
  }

  return breakdown.totalIn + parseFloat(rawAmount);
}

function getTotalOut(statement, breakdown) {
  const statementIsSavings = statementUtils.statementIsSavings(statement);
  const rawAmount = statement['Debit Amount'];
  
  if (statementIsSavings || !rawAmount) {
    return breakdown.totalOut;
  }

  return breakdown.totalOut + parseFloat(rawAmount);
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
      savingsTotal: 0.00,
      spendingWarnings: [],
      debits: {},
      totalIn: 0.00,
      totalOut: 0.00
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
    savingsTotal: sumSavings(statement, breakdown),
    spendingWarnings: getSpendingWarnings(statement, breakdown),
    debits: getDebits(statement, breakdown),
    totalIn: getTotalIn(statement, breakdown),
    totalOut: getTotalOut(statement, breakdown),
  });
  return getMonthBreakdown(newStatements, newBreakdown);
}

module.exports = {
  getMonthBreakdown: getMonthBreakdown
};
