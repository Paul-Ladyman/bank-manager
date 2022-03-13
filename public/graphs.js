function singleValue(statement, title, field, fieldTitle) {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    width: 300,
    height: 300,
    title,
    description: 'Historical view of account balance before wage.',
    data: {url: `data/${statement}/data.json`},
    layer: [
      {
        mark: 'bar',
        encoding: {
          x: {field: 'month', type: 'ordinal', sort: 'month', axis: { title: 'Month', labelExpr: 'slice(datum.label, 0, 3)' }},
          y: {field, type: 'quantitative', axis: { title: fieldTitle }},
          tooltip: {field, type: 'quantitative'},
        }
      },
      {
        mark: 'rule',
        encoding: {
          y: {
            aggregate: 'max',
            field,
            type: 'quantitative',
          },
          color: {value: 'green'},
          size: {value: 3},
          tooltip: {aggregate: 'max', field, type: 'quantitative'},
        }
      },
      {
        mark: 'rule',
        encoding: {
          y: {
            aggregate: 'mean',
            field,
            type: 'quantitative'
          },
          color: {value: 'orange'},
          size: {value: 3},
          tooltip: {aggregate: 'mean', field, type: 'quantitative'},
        }
      },
      {
        mark: 'rule',
        encoding: {
          y: {
            aggregate: 'min',
            field,
            type: 'quantitative'
          },
          color: {value: 'red'},
          size: {value: 3},
          tooltip: {aggregate: 'min', field, type: 'quantitative'},
        }
      }
    ]
  };
}

function transactionSet(statement, title, set, fieldTitle) {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    width: 300,
    height: 300,
    title,
    data: {url: `data/${statement}/${set}.json`},
    mark: {
      type: 'line',
      point: true
    },
    selection: {
      description: {
        type: 'multi', fields: ['Transaction Description'], bind: 'legend'
      }
    },
    encoding: {
      x: {
        field: 'StatementDate',
        type: 'temporal',
        timeUnit: 'month',
        axis: {
          labelAngle: '-90',
          title: 'Month'
        }
      },
      y: {aggregate: 'sum', field: 'Debit Amount', type: 'quantitative', axis: { title: fieldTitle }},
      color: {field: 'Transaction Description', type: 'nominal'},
      opacity: {
        condition: {selection: 'description', value: 1},
        value: 0.2
      },
      tooltip: {field: 'Debit Amount', type: 'quantitative', aggregate: 'sum'},
    }
  }
}

function balance(statement, title, aggregate) {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    width: 300,
    height: 300,
    title,
    data: {url: `data/${statement}/statements.json`},
    mark: {type: 'area', line: true, point: true},
    encoding: {
      x: {
        field: 'StatementDate',
        type: 'temporal',
        timeUnit: 'week',
        axis: {
          labelAngle: '-90',
          title: 'Week of Year'
        }
      },
      y: {aggregate, field: 'Balance', type: 'quantitative', axis: { title: 'Balance' }},
      tooltip: [
        {aggregate, field: 'Balance', type: 'quantitative', title: 'Balance'},
        {field: 'StatementDate', type: 'temporal', timeUnit: 'month', title: 'Month'},
        {field: 'StatementDate', type: 'temporal', timeUnit: 'week', title: 'Week'},
      ]
    }
  }
}

function generateGraphs(statement) {
  vegaEmbed(
    '#graphs-balance-max',
    balance(statement, 'Balance (Maximum weekly value)', 'max')
  );

  vegaEmbed(
    '#graphs-balance-min',
    balance(statement, 'Balance (Minimum weekly value)', 'min')
  );

  vegaEmbed(
    '#graphs-totalin',
    singleValue(statement, 'Total In (excl. savings)', 'totalIn', 'Amount')
  );

  vegaEmbed(
    '#graphs-totalout',
    singleValue(statement, 'Total Out (excl. savings)', 'totalOut', 'Amount')
  );

  vegaEmbed(
    '#graphs-totalspending',
    singleValue(statement, 'Total Spending (excl. savings + rent)', 'totalSpending', 'Amount')
  );

  vegaEmbed(
    '#graphs-balance-before-wage',
    singleValue(statement, 'Balance Before Wage', 'balanceBeforeWage', 'Balance')
  );

  vegaEmbed(
    '#graphs-savings',
    singleValue(statement, 'Savings', 'savingsTotal', 'Saved')
  );

  vegaEmbed(
    '#graphs-transport',
    singleValue(statement, 'Transport Costs', 'transportTotal', 'Cost')
  );

  vegaEmbed(
    '#graphs-bills',
    transactionSet(statement, 'Bills', 'bills', 'Payment')
  );

  vegaEmbed(
    '#graphs-bills-total',
    singleValue(statement, 'Total bill payments', 'billsTotal', 'Payments')
  );

  vegaEmbed(
    '#graphs-utilities',
    transactionSet(statement, 'Utilities', 'utilities', 'Payment')
  );

  vegaEmbed(
    '#graphs-utilities-total',
    singleValue(statement, 'Total utility payments', 'utilitiesTotal', 'Payments')
  );
}