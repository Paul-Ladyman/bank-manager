var yourVlSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
  description: 'A simple bar chart with embedded data.',
  data: {"url": "data/data.json"},
  mark: 'bar',
  encoding: {
    x: {field: 'month', type: 'ordinal'},
    y: {field: 'balanceBeforeWage', type: 'quantitative'}
  }
}
vegaEmbed('#vega', yourVlSpec);