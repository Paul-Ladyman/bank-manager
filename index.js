const csv = require("csvtojson");

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

function getStatementMonth(statement) {
  const dateParts = statement['Transaction Date'].split('/')
  const rawDate = `${dateParts[1]}/${dateParts[0]}/${dateParts[2]} 01:00:00`;
  const date = new Date(rawDate);
  return months[date.getMonth()];
}

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

function getLargestDebit(statements, largestDebit) {
  if (statements.length === 0) {
    return largestDebit;
  }

  const statement = statements[0];
  const statementDebitAmount = parseFloat(statement['Debit Amount']);
  const largestDebitAmount = largestDebit ? parseFloat(largestDebit['Debit Amount']) : 0.0;
  const newStatements = statements.slice(1);

  return statementDebitAmount > largestDebitAmount ?
    getLargestDebit(newStatements, statement) :
    getLargestDebit(newStatements, largestDebit);
}

function reportByMonth(statementsByMonth) {
  const months = Object.keys(statementsByMonth);

  months.forEach((month) => {
    console.log(`${month}`);
    const largestDebit = getLargestDebit(statementsByMonth[month]);
    console.log(`- Largest debit: ${largestDebit['Transaction Description']} - ${largestDebit['Debit Amount']}`);
  })
}

csv()
  .fromFile('./statement.csv')
  .on("end_parsed", function(statements) { 
    const statementsByMonth = getStatementsByMonth(statements, {});
    reportByMonth(statementsByMonth);
  })
