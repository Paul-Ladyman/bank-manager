const csv = require('csvtojson');
const fs = require('fs');
const statementUtils = require('./statementUtils');
const breakdownUtils = require('./breakdownUtils');
const { spendingLimit } = require('./config');
const statementsFolder = './statements/';

function ingestData(file, rawStatements) {
  csv()
  .fromString(rawStatements)
  .on("end_parsed", function(statements) {
    const statementsByMonth = statementUtils.getStatementsByMonth(statements, {});
    const months = Object.keys(statementsByMonth);

    const breakdowns = months.map((month) => {
      const breakdown = breakdownUtils.getMonthBreakdown(statementsByMonth[month]);
      return {month, breakdown};
    });

    const breakdownData = {breakdowns, spendingLimit};

    const dataDir = `./public/data/${file}/`;
    fs.mkdirSync(dataDir);

    fs.writeFileSync(`${dataDir}breakdown.json`, JSON.stringify(breakdownData, undefined, 2));

    const allStatements = months.flatMap((month) => statementsByMonth[month]);
    fs.writeFileSync(`${dataDir}statements.json`, JSON.stringify(allStatements, undefined, 2));

    const data = breakdowns.map(({month, breakdown}) => {
      const { balanceBeforeWage, transportTotal, billsTotal, utilitiesTotal, savingsTotal, totalIn, totalOut, totalSpending } = breakdown;
      return { month, balanceBeforeWage, transportTotal, billsTotal, utilitiesTotal, savingsTotal, totalIn, totalOut, totalSpending };
    }).reverse();

    fs.writeFileSync(`${dataDir}data.json`, JSON.stringify(data, undefined, 2));

    const bills = breakdowns.flatMap(({breakdown}) => {
      const { bills } = breakdown;
      return bills.map((bill) => ({...bill}));
    });

    fs.writeFileSync(`${dataDir}bills.json`, JSON.stringify(bills, undefined, 2));

    const utilities = breakdowns.flatMap(({breakdown}) => {
      const { utilities } = breakdown;
      return utilities.map((utility) => ({...utility}));
    });

    fs.writeFileSync(`${dataDir}utilities.json`, JSON.stringify(utilities, undefined, 2));
  });
}

function isCaisseDepargne(file) {
  return file.includes('caissedepargne');
}

function mapCaisseDepargne(rawStatements) {
  console.log('>>> mapping caisse depargne');
  const lines = rawStatements.split('\n');
  const finalBalanceLine = lines[3];
  const finalBalance = finalBalanceLine.replace(/.*?(\d*),(\d*)/, '$1.$2');
  const startBalanceLine = lines[lines.length - 1];
  const startBalance = startBalanceLine.replace(/.*?(\d*),(\d*)/, '$1.$2');
  const originalStatements = lines.slice(5, lines.length - 1);
  console.log('>>> final', finalBalanceLine);
  console.log('>>> finalBalance', finalBalance);
  console.log('>>> start', startBalanceLine);
  console.log('>>> startBalance', startBalance);

  const mappedStatements = originalStatements.map((statement) => {
    const [
      _,
      date,
      __,
      label,
      debit,
      credit
    ] = statement.match(/(.*?);(.*?);(.*?);(.*?);(.*?);(.*?);/);
    console.log(date, label, debit, credit);
    return `${date},${label}${debit}${credit}`;
  });
  const header = 'Transaction Date,Transaction Description,Debit Amount,Credit Amount,Balance\n';
  return `${header}${mappedStatements.join('\n')}`;
}

fs.readdir(statementsFolder, (err, files) => {
  files.forEach(file => {
    const rawStatements = fs.readFileSync(`${statementsFolder}${file}`).toString();
    const statementsToProcess = isCaisseDepargne(file) ? mapCaisseDepargne(rawStatements) : rawStatements;
    ingestData(file, statementsToProcess);
  });
  const statementsJs = `var statements = ${JSON.stringify(files)}`;
  fs.writeFileSync(`./public/data/statements.js`, statementsJs);
});
