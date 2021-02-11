function singleValue(statement, title, field, fieldTitle) {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    title,
    description: 'Historical view of account balance before wage.',
    data: {url: `data/${statement}/data.json`},
    layer: [
      {
        mark: 'bar',
        encoding: {
          x: {field: 'month', type: 'ordinal', sort: 'month', axis: { title: 'Month' }},
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

function generateGraphs(statement) {
  vegaEmbed(
    '#graphs-balance',
    singleValue(statement, 'Balance Before Wage', 'balanceBeforeWage', 'Balance (£)')
  );

  vegaEmbed(
    '#graphs-savings',
    singleValue(statement, 'Savings', 'savingsTotal', 'Saved (£)')
  );

  vegaEmbed(
    '#graphs-transport',
    singleValue(statement, 'Transport Costs', 'transportTotal', 'Cost (£)')
  );

  vegaEmbed(
    '#graphs-bills',
    transactionSet(statement, 'Bills', 'bills', 'Payment (£)')
  );

  vegaEmbed(
    '#graphs-bills-total',
    singleValue(statement, 'Total bill payments', 'billsTotal', 'Payments (£)')
  );

  vegaEmbed(
    '#graphs-utilities',
    transactionSet(statement, 'Utilities', 'utilities', 'Payment (£)')
  );

  vegaEmbed(
    '#graphs-utilities-total',
    singleValue(statement, 'Total utility payments', 'utilitiesTotal', 'Payments (£)')
  );
}