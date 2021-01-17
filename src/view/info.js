import AbstractView from '../view/abstract';
import {Dates} from '../utils';

const createInfoTemplate = (points) => {
  const cities = Array.from(new Set(points.map((pointData) => {
    return pointData.destination.city;
  })));
  const datesRange = Dates.getFormattedRange(points[0].startTime, points[points.length - 1].endTime);

  return `
    <section class="trip-main__trip-info trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${cities.join(` &mdash; `)}</h1>
        <p class="trip-info__dates">
          ${datesRange.start}&nbsp;&mdash;&nbsp;${datesRange.end}
        </p>
      </div>
    </section>
  `;
};

export default class InfoView extends AbstractView {
  constructor(points) {
    super();

    this._points = points;
  }

  getTemplate() {
    return createInfoTemplate(this._points);
  }
}
