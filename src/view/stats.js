import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart';
import {Dates} from '../utils';

const BAR_HEIGHT = 55;

const Theme = {
  BACKGROUND: `#ffffff`,
  TEXT: `#000000`
};

const ChartName = {
  MONEY: `MONEY`,
  TYPE: `TYPE`,
  TIME: `TIME-SPEND`
};

const renderChart = ({ctx, labels, text, formatter, data}) => {
  ctx.height = BAR_HEIGHT * labels.length;

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: labels.map((label) => label.toUpperCase()),
      datasets: [{
        data,
        backgroundColor: Theme.BACKGROUND,
        hoverBackgroundColor: Theme.BACKGROUND,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: Theme.TEXT,
          anchor: `end`,
          align: `start`,
          formatter
        }
      },
      title: {
        display: true,
        text,
        fontColor: Theme.TEXT,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: Theme.TEXT,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          dataset: {
            barThickness: 44
          }
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          dataset: {
            minBarLength: 120
          }
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const statsTemplate = () => {
  return `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart statistics__chart--money" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart statistics__chart--transport" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart statistics__chart--time" width="900"></canvas>
    </div>
  </section>`;
};

export default class StatsView extends SmartView {
  constructor() {
    super();

    this._data = {};
  }

  getTemplate() {
    return statsTemplate();
  }

  removeElement() {
    super.removeElement();

    this._moneyChart = null;
    this._typeChart = null;
    this._timeChart = null;
  }

  updateData(data) {
    super.updateData(data);

    this.hide();
    this._setCharts();
  }

  restoreHandlers() {}

  _setCharts() {
    const {points} = this._data;

    const labels = [...new Set(points.map(({pointType}) => pointType.type))];

    this._moneyChart = renderChart({
      ctx: this.getElement().querySelector(`.statistics__chart--money`),
      labels,
      text: ChartName.MONEY,
      formatter: (val) => `€ ${val}`,
      data: labels.map((label) => {
        return points.filter(({pointType}) => pointType.type === label).reduce((count, point) => {
          return count + parseInt(point.basePrice, 10);
        }, 0);
      })
    });
    this._typeChart = renderChart({
      ctx: this.getElement().querySelector(`.statistics__chart--transport`),
      labels,
      text: ChartName.TYPE,
      formatter: (val) => `${val}x`,
      data: labels.map((label) => {
        return points.filter(({pointType}) => pointType.type === label).length;
      })
    });
    this._timeChart = renderChart({
      ctx: this.getElement().querySelector(`.statistics__chart--time`),
      labels,
      text: ChartName.TIME,
      formatter: (val) => `${val}D`,
      data: labels.map((label) => {
        const filteredPoints = points.filter(({pointType}) => pointType.type === label);
        const commonDuration = filteredPoints.reduce((value, point) => {
          return value + Dates.getDiff(point.endTime, point.startTime);
        }, 0);
        return Dates.getDaysFromMs(commonDuration);
      })
    });
  }
}
