import {createElement} from '../utils';

const createEventsListTemplate = (eventsCount) => {
  if (eventsCount) {
    return `<ul class="trip-events__list"></ul>`;
  }
  return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
};

export default class EventsListView {
  constructor(eventsCount) {
    this._count = eventsCount;
  }

  getTemplate() {
    return createEventsListTemplate(this._count);
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
