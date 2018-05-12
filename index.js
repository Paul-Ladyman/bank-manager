const csv = require("csvtojson");
const reporter = require('./reporter');
const statementUtils = require('./statementUtils');
const breakdownUtils = require('./breakdownUtils');

csv()
  .fromFile('./statement.csv')
  .on("end_parsed", function(statements) { 
    const statementsByMonth = statementUtils.getStatementsByMonth(statements, {});
    const months = Object.keys(statementsByMonth);

    months.forEach((month) => {
      const breakdown = breakdownUtils.getMonthBreakdown(statementsByMonth[month]);
      reporter.reportByMonth(month, breakdown);
    });
  })
