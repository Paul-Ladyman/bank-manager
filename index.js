const csv = require("csvtojson");
const reporter = require('./reporter');
const statementUtils = require('./statementUtils');

csv()
  .fromFile('./statement.csv')
  .on("end_parsed", function(statements) { 
    const statementsByMonth = statementUtils.getStatementsByMonth(statements, {});
    reporter.reportByMonth(statementsByMonth);
  })
