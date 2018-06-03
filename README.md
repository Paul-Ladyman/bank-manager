# Bank Manager

A command line tool to provide an easily digestible view of your banking activities.

## Features

* Monthly report of key features of your banking statement including:
  * Balance before wage credit
  * Wage credit
  * Other credits
  * Rent debit
  * Bill debits
  * Largest debit
  * Final Balance
* Spending limit warnings. Warn on debit statements that exceed a configurable limit.
* CSV report output (TODO).

## Configuration

Provide a config file at `./config.js` with the following format:

```
module.exports = {
  rent: '<transaction-description>',
  wage: '<transaction-description>',
  utilities: [
    '<transaction-description>'
  ],
  bills: [
    '<transaction-description>'
  ],
  spendingLimit: 20,
  spendingBlacklist: [
    '<transaction-description>'
  ]
};
```

* `rent` - the transaction description for your rent statement, i.e. who you pay you rent to.
* `wage` - the transaction descripton for your wage statement, i.e. who pays your wage.
* `utilities` - a list of transaction descriptions for your utility bill statements, i.e. who do you pay your utility bills (water, gas/electricity etc) to.
* `bills` - a list of transaction descriptions for your other bill statements, i.e. who do you pay any other bills (streaming service subscriptions etc) to.
* `spendingLimit` - a value above which debit statements will be included in the report as warnings.
* `spendingBlacklist` - a list of transaction descriptions for payment destinations you trust enough not to include in the spending limit warnings. For example you may make regular transfers to a top-up debit card and not wish these to be treat as warnings.

## Usage

Provide a CSV export from your online banking service at `./statement.csv` then run `node index.js`.
