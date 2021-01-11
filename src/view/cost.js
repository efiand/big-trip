import AbstractView from '../view/abstract';

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

export default class CostView extends AbstractView {
  constructor(events) {
    super();

    this._events = events;
  }

  getTemplate() {
    return createCostTemplate(this._events);
  }
}
