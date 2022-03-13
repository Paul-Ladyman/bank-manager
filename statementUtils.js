const config = require('./config');

function getStatementsByMonth(statements, statementsByMonth) {
  if (statements.length === 0) {
    return statementsByMonth;
  }

  const statement = statements[0];
  const month = getStatementMonth(statement);
  const StatementDate = getStatementDate(statement);
  const newStatement = { ...statement, StatementDate };
  const newStatements = statements.slice(1);
  const newMonth = {};

  if (!statementsByMonth[month]) {
    newMonth[month] = [newStatement];
  }
  else {
    newMonth[month] = statementsByMonth[month].concat([newStatement]);
  }

  const newStatementsByMonth = Object.assign({}, statementsByMonth, newMonth);
  return getStatementsByMonth(newStatements, newStatementsByMonth);
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function statementIsRent(statement) {
  return config.rent.findIndex((rent) => (statement['Transaction Description'].includes(rent))) > -1;
}

function statementIsWage(statement) {
  return config.wage.findIndex((wage) => (statement['Transaction Description'].includes(wage))) > -1;
}

function statementIsTransport(statement) {
  return config.transport.findIndex((bill) => (statement['Transaction Description'].includes(bill))) > -1;
}

function statementIsSavings(statement) {
  return config.savings.findIndex((bill) => (statement['Transaction Description'].includes(bill))) > -1;
}

function statementIfBill(statement) {
  const bill = config.bills.find((bill) => (statement['Transaction Description'].includes(bill)));
  if (!bill) {
    return undefined;
  }
  return {...statement, 'Transaction Description': bill};
}

function statementIfUtility(statement) {
  const utility = config.utilities.find((utility) => (statement['Transaction Description'].includes(utility)));
  if (!utility) {
    return undefined;
  }
  return {...statement, 'Transaction Description': utility};
}

function statementIsInSpendingBlacklist(statement) {
  return config.spendingBlacklist.findIndex((item) => (statement['Transaction Description'].includes(item))) > -1;
}

function getStatementMonth(statement) {
  const dateParts = statement['Transaction Date'].split('/')
  const rawDate = `${dateParts[1]}/${dateParts[0]}/${dateParts[2]} 01:00:00`;
  const date = new Date(rawDate);
  return months[date.getMonth()];
}

function getStatementDate(statement) {
  const dateParts = statement['Transaction Date'].split('/')
  return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
}

function debitAmountExceeds(statement, limit) {
  return parseFloat(statement['Debit Amount']) > parseFloat(limit);
}

module.exports = {
  getStatementsByMonth,
  statementIsRent,
  statementIsWage,
  statementIfBill,
  statementIfUtility,
  statementIsInSpendingBlacklist,
  debitAmountExceeds,
  statementIsTransport,
  statementIsSavings
};
