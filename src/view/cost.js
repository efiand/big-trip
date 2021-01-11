import {createElement} from '../utils/render';

const createCostTemplate = (events) => {
  const cost = events.reduce((total, {price, type: {offers}}) => {
    return total + price + offers.reduce((offersTotal, offer) => {
      return offersTotal + (offer.isChecked ? offer.price : 0);
    }, 0);
  }, 0);

  return `
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>
  `;
};

export default class CostView {
  constructor(events) {
    this._events = events;
  }

  getTemplate() {
    return createCostTemplate(this._events);
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
