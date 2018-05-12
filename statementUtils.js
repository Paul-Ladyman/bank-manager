const config = require('./config');

function getStatementsByMonth(statements, statementsByMonth) {
  if (statements.length === 0) {
    return statementsByMonth;
  }

  const statement = statements[0];
  const month = getStatementMonth(statement);
  const newStatements = statements.slice(1);
  const newMonth = {};

  if (!statementsByMonth[month]) {
    newMonth[month] = [statement];
  }
  else {
    newMonth[month] = statementsByMonth[month].concat([statement]);
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
  return statement['Transaction Description'] === config.rent;
}

function statementIsWage(statement) {
  return statement['Transaction Description'] === config.wage;
}

function statementIsBill(statement) {
  return config.bills.findIndex((bill) => (statement['Transaction Description'].includes(bill))) > -1;
}

function getStatementMonth(statement) {
  const dateParts = statement['Transaction Date'].split('/')
  const rawDate = `${dateParts[1]}/${dateParts[0]}/${dateParts[2]} 01:00:00`;
  const date = new Date(rawDate);
  return months[date.getMonth()];
}

module.exports = {
  getStatementsByMonth: getStatementsByMonth,
  statementIsRent: statementIsRent,
  statementIsWage: statementIsWage,
  statementIsBill: statementIsBill
};
