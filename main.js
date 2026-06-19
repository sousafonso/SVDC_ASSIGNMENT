// main.js

// ----------------------------
// Classe EnergyMixChart
// ----------------------------
class EnergyMixChart {
  constructor(_config) {
    this.config = {
      parentElement: '#energy-mix-chart',
      containerWidth: 960,
      containerHeight: 500,
      margin: { top: 36, right: 120, bottom: 72, left: 80 },
      ..._config,
    };

    this.data = this.config.data || [];
    this.selectedYear = null; // definido de fora
    this.initVis();
  }

  initVis() {
    const vis = this;

    vis.width =
      vis.config.containerWidth -
      vis.config.margin.left -
      vis.config.margin.right;
    vis.height =
      vis.config.containerHeight -
      vis.config.margin.top -
      vis.config.margin.bottom;

    vis.svg = d3
      .select(vis.config.parentElement)
      .append('svg')
      .attr('width', vis.config.containerWidth)
      .attr('height', vis.config.containerHeight);

    vis.chart = vis.svg
      .append('g')
      .attr(
        'transform',
        `translate(${vis.config.margin.left},${vis.config.margin.top})`,
      );

    // Escalas
    vis.xScale = d3.scaleBand().range([0, vis.width]).paddingInner(0.2);
    vis.yScale = d3.scaleLinear().range([vis.height, 0]);
    vis.colorScale = d3
      .scaleOrdinal()
      .domain(['Renováveis', 'Nuclear', 'Fóssil'])
      .range(['#38a169', '#805ad5', '#e53e3e']);

    // Eixos
    vis.xAxis = d3.axisBottom(vis.xScale);
    vis.yAxis = d3
      .axisLeft(vis.yScale)
      .ticks(6)
      .tickFormat(d => d + '%')
      .tickSizeOuter(0);

    vis.xAxisGroup = vis.chart
      .append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0, ${vis.height})`);

    vis.yAxisGroup = vis.chart
      .append('g')
      .attr('class', 'axis y-axis');

    // Labels
    vis.chart
      .append('text')
      .attr('class', 'axis-label')
      .attr('x', vis.width / 2)
      .attr('y', vis.height + vis.config.margin.bottom - 10)
      .attr('text-anchor', 'middle')
      .text('País');

    vis.chart
      .append('text')
      .attr('class', 'axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', -vis.height / 2)
      .attr('y', -vis.config.margin.left + 16)
      .attr('text-anchor', 'middle')
      .text('% energia por fonte');

    // Legenda
    vis.legend = vis.chart
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${vis.width + 24}, 8)`);

    const legendItems = vis.colorScale.domain().map(key => ({
      key,
      color: vis.colorScale(key),
    }));

    const legend = vis.legend
      .selectAll('.legend-item')
      .data(legendItems)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 18})`);

    legend
      .append('rect')
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', d => d.color);

    legend
      .append('text')
      .attr('x', 18)
      .attr('y', 10)
      .text(d => d.key);

    // Tooltip
    vis.tooltip = d3.select('#tooltip');
  }

  updateVis() {
    const vis = this;

    // Filtra dados do ano selecionado
    vis.filteredData = vis.data.filter(d => d.year === vis.selectedYear);

    // Países a mostrar: Portugal, Alemanha, França, Espanha + eventualmente UE
    const focusCountries = new Set([
      'Portugal',
      'Germany',
      'France',
      'Spain',
    ]);

    // Se quiseres adicionar a UE agregada, podes fazê-lo na preparação dos dados.
    // Para já, usaremos só países individuais, filtrando pela lista.
    vis.displayData = vis.filteredData.filter(d =>
      focusCountries.has(d.country),
    );

    // Ordenar países para uma ordem consistente
    vis.displayData.sort((a, b) => a.country.localeCompare(b.country));

    vis.xScale.domain(vis.displayData.map(d => d.country));
    vis.yScale.domain([0, 100]); // percentagens

    vis.renderVis();
  }

  renderVis() {
    const vis = this;

    vis.xAxisGroup.call(vis.xAxis);
    vis.yAxisGroup.call(vis.yAxis);

    // Preparar dados para stacked bars
    const keys = ['Renováveis', 'Nuclear', 'Fóssil'];

    const stack = d3
      .stack()
      .keys(keys)
      .value((d, key) => d[key]);

    const stackedSeries = stack(vis.displayData);

    // Data-join: uma <g> por país
    const groups = vis.chart
      .selectAll('.country-group')
      .data(vis.displayData, d => d.country);

    const groupsEnter = groups
      .enter()
      .append('g')
      .attr('class', 'country-group')
      .attr('transform', d => `translate(${vis.xScale(d.country)},0)`);

    groupsEnter.merge(groups).attr('transform', d => {
      const x = vis.xScale(d.country);
      return `translate(${x},0)`;
    });

    groups.exit().remove();

    // Data-join dos rects empilhados dentro de cada país
    const series = vis.chart
      .selectAll('.series')
      .data(stackedSeries, d => d.key);

    const seriesEnter = series
      .enter()
      .append('g')
      .attr('class', 'series')
      .attr('fill', d => vis.colorScale(d.key));

    const seriesMerged = seriesEnter.merge(series);

    seriesMerged.each(function (serie) {
      const serieGroup = d3.select(this);

      const rects = serieGroup
        .selectAll('rect')
        .data(serie, d => d.data.country);

      rects
        .enter()
        .append('rect')
        .merge(rects)
        .attr('x', d => vis.xScale(d.data.country) || 0)
        .attr('width', vis.xScale.bandwidth())
        .attr('y', d => vis.yScale(d[1]))
        .attr('height', d => vis.yScale(d[0]) - vis.yScale(d[1]))
        .on('mouseenter', (event, d) => {
          const country = d.data.country;
          const valueRenew = d.data.Renováveis;
          const valueNuclear = d.data.Nuclear;
          const valueFóssil = d.data.Fóssil;
          const stackKey = serie.key;

          let value;
          if (stackKey === 'Renováveis') value = valueRenew;
          else if (stackKey === 'Nuclear') value = valueNuclear;
          else value = valueFóssil;

          vis.tooltip
            .style('opacity', 1)
            .html(
              `<strong>${country}</strong><br/>
               Fonte: ${stackKey}<br/>
               ${value.toFixed(1)}%`,
            )
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY + 10 + 'px');
        })
        .on('mousemove', event => {
          vis.tooltip
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY + 10 + 'px');
        })
        .on('mouseleave', () => {
          vis.tooltip.style('opacity', 0);
        });

      rects.exit().remove();
    });

    series.exit().remove();
  }
}

// ----------------------------
// Carregamento e preparação dos dados
// ----------------------------

Promise.all([d3.csv('owid-energy-data.csv')])
  .then(([energyData]) => {
    // Preparar dados: percentagens de mix por país/ano
    // Assumimos que o CSV tem colunas:
    // 'country', 'year', 'Renováveis_share_energy', 'nuclear_share_energy'
    // Se os nomes forem diferentes, ajusta aqui.

    const parsed = energyData
      .map(row => {
        const year = +row.year;
        const country = row.country;

        const Renováveis = +row.Renováveis_share_energy;
        const nuclear = Number.isFinite(+row.nuclear_share_energy)
          ? +row.nuclear_share_energy
          : 0;

        if (!Number.isFinite(year) || !country) return null;
        if (!Number.isFinite(Renováveis)) return null;

        // Garante que tudo está entre 0 e 100 e calcula fósseis como resto.
        const renewClamped = Math.max(0, Math.min(100, Renováveis));
        const nuclearClamped = Math.max(0, Math.min(100, nuclear));

        let Fóssil = 100 - renewClamped - nuclearClamped;
        if (Fóssil < 0) Fóssil = 0;

        return {
          country,
          year,
          Renováveis: renewClamped,
          Nuclear: nuclearClamped,
          Fóssil: Fóssil,
        };
      })
      .filter(d => d !== null);

    const validYears = [...new Set(parsed.map(d => d.year))].sort(
      (a, b) => a - b,
    );
    const initialYear = validYears.includes(2010)
      ? 2010
      : validYears[0];

    const chart = new EnergyMixChart({
      parentElement: '#energy-mix-chart',
      data: parsed,
    });

    chart.selectedYear = initialYear;
    chart.updateVis();

    d3.select('#year-slider')
      .attr('min', d3.min(validYears))
      .attr('max', d3.max(validYears))
      .attr('step', 1)
      .attr('value', initialYear)
      .on('input', function () {
        const year = +this.value;
        chart.selectedYear = year;
        chart.updateVis();
        d3.select('#year-value').text(year);
      });

    d3.select('#year-value').text(initialYear);
  })
  .catch(error => {
    console.error('Erro ao carregar dados de energia:', error);
  });