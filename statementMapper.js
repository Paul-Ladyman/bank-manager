function isCaisseDepargne(file) {
  return file.includes('caissedepargne');
}

function isOldCaisseDepargne(file) {
  return file.includes('caissedepargne.old');
}

function sortCaisseDepargneStatementsOld(statements) {
  return statements.sort((statement1, statement2) => {
    const [_, year1, month1, day1] = statement1.match(/.*?:(\d\d\d\d)-(\d\d)-(\d\d):/);
    const [__, year2, month2, day2] = statement2.match(/.*?:(\d\d\d\d)-(\d\d)-(\d\d):/);
    const dateObj1 = new Date(`${month1}/${day1}/${year1}`);
    const dateObj2 = new Date(`${month2}/${day2}/${year2}`);
    if (dateObj1 > dateObj2) {
      return -1;
    }

    if (dateObj1 < dateObj2) {
      return 1;
    }

    return 0;
  });
}

function mapCaisseDepargneStatementsOld(originalStatements, balance, mappedStatements = []) {
  if (originalStatements.length === 0) {
    return mappedStatements;
  }

  const [statement, ...otherStatements] = originalStatements;
  const [
    _,
    date,
    category,
    label1,
    label2,
    amount
  ] = statement.match(/.*?:(.*?):(.*?):.*?:(.*?):(.*?):.*?:(.*?):/);
  const balanceNumber = parseFloat(balance);
  const amountNumber = parseFloat(amount);
  const newBalance = balanceNumber - amountNumber;
  const absoluteDebitAmount = amount.includes('-') ? amount.replace('-', '') : '';
  const absoluteCreditAmount = amount.includes('+') ? amount.replace('+', '') : '';

  const [___, year, month, day] = date.match(/(\d\d\d\d)-(\d\d)-(\d\d)/);
  const standardDate = `${day}/${month}/${year}`;

  const finalLabel = label1 === label2 ? label1 : `${label1} / ${label2}`;
  const escapedCategory = category.replace(/,/g, '&#44;');

  const mappedStatement = `${standardDate},${escapedCategory},${finalLabel},${absoluteDebitAmount},${absoluteCreditAmount},${balanceNumber.toFixed(2)}`;
  const newMappedStatements = [
    ...mappedStatements,
    mappedStatement
  ];
  return mapCaisseDepargneStatementsOld(otherStatements, newBalance, newMappedStatements);
}

function mapCaisseDepargneOld(rawStatements) {
  const lines = rawStatements.split('\n');
  const finalBalance = lines[0];
  const originalStatements = lines.slice(2, lines.length - 1);
  const sortedStatements = sortCaisseDepargneStatementsOld(originalStatements);
  const mappedStatements = mapCaisseDepargneStatementsOld(sortedStatements, finalBalance);
  const header = 'Transaction Date,Transaction Type,Transaction Description,Debit Amount,Credit Amount,Balance\n';
  return `${header}${mappedStatements.join('\n')}`;
}

function sortCaisseDepargneStatements(statements) {
  return statements.sort((statement1, statement2) => {
    const [_, year1, month1, day1] = statement1.match(/^(\d\d\d\d)\/(\d\d)\/(\d\d):/);
    const [__, year2, month2, day2] = statement2.match(/^(\d\d\d\d)\/(\d\d)\/(\d\d):/);
    const dateObj1 = new Date(`${month1}/${day1}/${year1}`);
    const dateObj2 = new Date(`${month2}/${day2}/${year2}`);
    if (dateObj1 > dateObj2) {
      return -1;
    }

    if (dateObj1 < dateObj2) {
      return 1;
    }

    return 0;
  });
}

function mapCaisseDepargneStatements(originalStatements, balance, mappedStatements = []) {
  if (originalStatements.length === 0) {
    return mappedStatements;
  }

  const [statement, ...otherStatements] = originalStatements;
  const [
    _,
    date,
    simpleLabel,
    category,
    debit,
    credit
  ] = statement.match(/^(.*?):(.*?):.*?:.*?:.*?:.*?:.*?:(.*?):(.*?):(.*?):/);

  const balanceNumber = parseFloat(balance);
  const debitNumber = debit ? parseFloat(debit) : 0.0;
  const creditNumber = credit ? parseFloat(credit) : 0.0;
  const newBalance = balanceNumber - debitNumber - creditNumber;
  const absoluteDebit = debit.replace('-', '');
  const absoluteCredit = credit.replace('+', '');

  const [___, year, month, day] = date.match(/(\d\d\d\d)\/(\d\d)\/(\d\d)/);
  const standardDate = `${day}/${month}/${year}`;

  const escapedCategory = category.replace(/,/g, '&#44;');

  const mappedStatement = `${standardDate},${escapedCategory},${simpleLabel},${absoluteDebit},${absoluteCredit},${balanceNumber.toFixed(2)}`;
  const newMappedStatements = [
    ...mappedStatements,
    mappedStatement
  ];
  return mapCaisseDepargneStatements(otherStatements, newBalance, newMappedStatements);
}

function mapCaisseDepargne(rawStatements) {
  const lines = rawStatements.split('\n');
  const finalBalance = lines[0];
  const originalStatements = lines.slice(2, lines.length - 1);
  const sortedStatements = sortCaisseDepargneStatements(originalStatements);
  const mappedStatements = mapCaisseDepargneStatements(sortedStatements, finalBalance);
  const header = 'Transaction Date,Transaction Type,Transaction Description,Debit Amount,Credit Amount,Balance\n';
  return `${header}${mappedStatements.join('\n')}`;
}

function mapStatements(file, rawStatements) {
  if (isOldCaisseDepargne(file)) {
    return mapCaisseDepargneOld(rawStatements);
  }

  if (isCaisseDepargne(file)) {
    return mapCaisseDepargne(rawStatements);
  }

  return rawStatements;
}

module.exports = mapStatements;