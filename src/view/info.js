import dayjs from 'dayjs';
import AbstractView from '../view/abstract';

const createInfoTemplate = (points) => {
  const cities = Array.from(new Set(points.map((pointData) => {
    return pointData.destination.city;
  })));
  const startDate = dayjs(points[0].startTime);
  const finishDate = dayjs(points[points.length - 1].finishTime);
  const isEqualMonths = startDate.month() === finishDate.month();
  const startDateStr = startDate.format(`MMM DD`);
  const finishDateStr = finishDate.format(isEqualMonths ? `DD` : `MMM DD`);

  return `
    <section class="trip-main__trip-info trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${cities.join(` &mdash; `)}</h1>
        <p class="trip-info__dates">
          ${startDateStr}&nbsp;&mdash;&nbsp;${finishDateStr}
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
