import AbstractView from '../view/abstract';
import {Dates} from '../utils';

const createInfoTemplate = (points) => {
  const cities = Array.from(new Set(points.map((pointData) => {
    return pointData.destination.name;
  })));
  const displayedCities = cities.length > 3 ? [cities[0], `...`, cities[cities.length - 1]] : cities;
  const datesRange = Dates.getFormattedRange(points[0].startTime, points[points.length - 1].endTime);
  const cost = points.reduce((total, {basePrice, pointType: {offers}}) => {
    return total + parseInt(basePrice, 10) + offers.reduce((offersTotal, offer) => {
      return offersTotal + (offer.isChecked ? offer.price : 0);
    }, 0);
  }, 0);

  return `
    <section class="trip-main__trip-info trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">
          ${displayedCities.join(` &mdash; `)}
        </h1>
        <p class="trip-info__dates">
          ${datesRange.start}&nbsp;&mdash;&nbsp;${datesRange.end}
        </p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
      </p>
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
