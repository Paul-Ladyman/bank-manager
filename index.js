const csv = require("csvtojson");
const fs = require('fs');
const reporter = require('./reporter');
const statementUtils = require('./statementUtils');
const breakdownUtils = require('./breakdownUtils');

csv()
  .fromFile('./statement.csv')
  .on("end_parsed", function(statements) { 
    const statementsByMonth = statementUtils.getStatementsByMonth(statements, {});
    const months = Object.keys(statementsByMonth);

    const breakdowns = months.map((month) => {
      const breakdown = breakdownUtils.getMonthBreakdown(statementsByMonth[month]);
      return [month, breakdown];
    });

    breakdowns.forEach(([month, breakdown]) => reporter.reportByMonth(month, breakdown));

    const data = breakdowns.map(([month, breakdown]) => {
      const { balanceBeforeWage } = breakdown;
      return { month, balanceBeforeWage };
    });

    fs.writeFileSync('./data/data.json', JSON.stringify(data));
  })
