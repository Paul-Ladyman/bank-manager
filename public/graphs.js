var vegaConfig = {
  $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
  title: 'Balance Before Wage',
  description: 'Historical view of account balance before wage.',
  data: {url: 'data/data.json'},
  layer: [
    {
      mark: 'bar',
      encoding: {
        x: {field: 'month', type: 'ordinal', sort: 'month', axis: { title: 'Month' }},
        y: {field: 'balanceBeforeWage', type: 'quantitative', axis: { title: 'Balance' }},
        tooltip: {field: 'balanceBeforeWage', type: 'quantitative'},
      }
    },
    {
      mark: 'rule',
      encoding: {
        y: {
          aggregate: 'max',
          field: 'balanceBeforeWage',
          type: 'quantitative',
        },
        color: {value: 'green'},
        size: {value: 3},
        tooltip: {aggregate: 'max', field: 'balanceBeforeWage', type: 'quantitative'},
      }
    },
    {
      mark: 'rule',
      encoding: {
        y: {
          aggregate: 'mean',
          field: 'balanceBeforeWage',
          type: 'quantitative'
        },
        color: {value: 'orange'},
        size: {value: 3},
        tooltip: {aggregate: 'mean', field: 'balanceBeforeWage', type: 'quantitative'},
      }
    },
    {
      mark: 'rule',
      encoding: {
        y: {
          aggregate: 'min',
          field: 'balanceBeforeWage',
          type: 'quantitative'
        },
        color: {value: 'red'},
        size: {value: 3},
        tooltip: {aggregate: 'min', field: 'balanceBeforeWage', type: 'quantitative'},
      }
    }
  ]

}
vegaEmbed('#vega', vegaConfig);