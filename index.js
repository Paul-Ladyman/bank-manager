const csv = require("csvtojson");
const fs = require('fs');
const statementUtils = require('./statementUtils');
const breakdownUtils = require('./breakdownUtils');
const { spendingLimit } = require('./config');
const statementsFolder = './statements/';

function ingestData(file) {
  csv()
  .fromFile(`${statementsFolder}${file}`)
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

    const data = breakdowns.map(({month, breakdown}) => {
      const { balanceBeforeWage, transportTotal, billsTotal, utilitiesTotal } = breakdown;
      return { month, balanceBeforeWage, transportTotal, billsTotal, utilitiesTotal };
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

fs.readdir(statementsFolder, (err, files) => {
  files.forEach(file => {
    ingestData(file);
  });
  const statementsJs = `var statements = ${JSON.stringify(files)}`;
  fs.writeFileSync(`./public/data/statements.js`, statementsJs);
});
