function isCaisseDepargne(file) {
  return file.includes('caissedepargne');
}

function mapCaisseDepargneStatements(originalStatements, balance, mappedStatements = []) {
  if (originalStatements.length === 0) {
    const header = 'Transaction Date,Transaction Type,Transaction Description,Debit Amount,Credit Amount,Balance\n';
    return `${header}${mappedStatements.join('\n')}`;
  }

  const [statement, ...otherStatements] = originalStatements;
  const [
    _,
    date,
    __,
    label,
    debit,
    credit
  ] = statement.match(/(.*?);(.*?);(.*?);(.*?);(.*?);(.*?);/);
  const debitAmount = debit.replace(',', '.');
  const creditAmount = credit.replace(',', '.');

  const balanceNumber = parseFloat(balance);
  const debitAmountNumber = debitAmount ? parseFloat(debitAmount) : 0;
  const creditAmountNumber = creditAmount ? parseFloat(creditAmount) : 0;
  const newBalance = balanceNumber - debitAmountNumber - creditAmountNumber;

  const absoluteDebitAmount = debitAmount.replace('-', '');
  const absoluteCreditAmount = creditAmount.replace('+', '');
  const mappedStatement = `${date},UN,${label},${absoluteDebitAmount},${absoluteCreditAmount},${balanceNumber.toFixed(2)}`;
  const newMappedStatements = [
    ...mappedStatements,
    mappedStatement
  ];
  return mapCaisseDepargneStatements(otherStatements, newBalance, newMappedStatements);
}

function mapCaisseDepargne(rawStatements) {
  const lines = rawStatements.split('\n');
  const finalBalanceLine = lines[3];
  const finalBalance = finalBalanceLine.replace(/.*?(\d*),(\d*)/, '$1.$2');
  const originalStatements = lines.slice(5, lines.length - 1);
  return mapCaisseDepargneStatements(originalStatements, finalBalance);
}

function mapStatements(file, rawStatements) {
  return isCaisseDepargne(file) ? mapCaisseDepargne(rawStatements) : rawStatements;
}

module.exports = mapStatements;