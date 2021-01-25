import AbstractView from './abstract';
import {Dates, Utils} from '../utils';

const createOfferItem = (template, offer) => {
  return `
    ${template}
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &nbsp;&plus;&euro;&nbsp;&nbsp;<span class="event__offer-price">${offer.price}</span>
    </li>
  `;
};

const createOffersList = (offers) => {
  if (!offers.length) {
    return ``;
  }

  return `
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${offers.filter((offer) => offer.isChecked).reduce(createOfferItem, ``)}
    </ul>
  `;
};

export const createPointTemplate = ({
  pointType,
  destination,
  dateFrom,
  dateTo,
  basePrice,
  isFavorite
}) => {
  const {offers} = pointType;

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${Dates.getISODate(dateFrom)}">
          ${Dates.getHumanDate(dateFrom)}
        </time>
        <div class="event__type">
          <img
            class="event__type-icon"
            width="42"
            height="42"
            src="img/icons/${pointType.type}.png"
            alt="Event type icon"
          />
        </div>
        <h3 class="event__title">${Utils.capitalize(pointType.type)} ${destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${Dates.getISO(dateFrom)}">
              ${Dates.getTime(dateFrom)}
            </time>
            &mdash;
            <time class="event__end-time" datetime="${Dates.getISO(dateTo)}">
              ${Dates.getTime(dateTo)}
            </time>
          </p>
          <p class="event__duration">${Dates.getFormattedDuration(dateFrom, dateTo)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        ${createOffersList(offers)}
        <button class="event__favorite-btn ${isFavorite ? `event__favorite-btn--active` : ``}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `;
};

export default class PointView extends AbstractView {
  constructor(pointData) {
    super();

    this._point = pointData;

    this._editClickHandler = this._editClickHandler.bind(this);
    this._favClickHandler = this._favClickHandler.bind(this);
  }

  get _switchControl() {
    return this.getElement().querySelector(`.event__rollup-btn`);
  }

  get _favControl() {
    return this.getElement().querySelector(`.event__favorite-btn`);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  _favClickHandler(evt) {
    evt.preventDefault();
    this._callback.favClick();
  }

  getTemplate() {
    return createPointTemplate(this._point);
  }

  setEditClickHandler(editCallback) {
    this._callback.editClick = editCallback;
    this._switchControl.addEventListener(`click`, this._editClickHandler);
  }

  setFavClickHandler(favCallback) {
    this._callback.favClick = favCallback;
    this._favControl.addEventListener(`click`, this._favClickHandler);
  }
}
