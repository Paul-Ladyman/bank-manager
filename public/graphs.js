function vegaConfig(statement, title, field, fieldTitle) {
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

function generateGraphs(statement) {
  vegaEmbed(
    '#graphs-balance',
    vegaConfig(statement, 'Balance Before Wage', 'balanceBeforeWage', 'Balance (£)')
  );

  vegaEmbed(
    '#graphs-transport',
    vegaConfig(statement, 'Transport Costs', 'transportTotal', 'Cost (£)')
  );

  vegaEmbed(
    '#graphs-bills',
    vegaConfig(statement, 'Total bill payments', 'billsTotal', 'Payments (£)')
  );

  vegaEmbed(
    '#graphs-utilities',
    vegaConfig(statement, 'Total utility payments', 'utilitiesTotal', 'Payments (£)')
  );
}