import dayjs from 'dayjs';
import {createElement} from '../utils';

const createInfoTemplate = (events) => {
  const cities = Array.from(new Set(events.map((eventData) => {
    return eventData.destination.city;
  })));
  const startDate = dayjs(events[0].startTime);
  const finishDate = dayjs(events[events.length - 1].finishTime);
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

export default class InfoView {
  constructor(events) {
    this._events = events;
  }

  getTemplate() {
    return createInfoTemplate(this._events);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
