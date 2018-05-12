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

function getSpendingWarnings(statement, breakdown) {
  const spendingWarning = !statementUtils.statementIsBill(statement) &&
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
      spendingWarnings: []
    };
  }

  if (statements.length === 0) {
    return breakdown;
  }

  const statement = statements[0];
  const newStatements = statements.slice(1);
  const newBreakdown = Object.assign({}, breakdown, {
    largestDebit: getLargestDebit(statement, breakdown),
    credits: getCredits(statement, breakdown),
    wage: getWage(statement, breakdown),
    rent: getRent(statement, breakdown),
    bills: getBills(statement, breakdown),
    spendingWarnings: getSpendingWarnings(statement, breakdown)
  });
  return getMonthBreakdown(newStatements, newBreakdown);
}

module.exports = {
  getMonthBreakdown: getMonthBreakdown
};
