import dayjs from 'dayjs';
import {capitalize, formatWithLead0} from '../utils/common';
import AbstractView from '../view/abstract';

const formatDuration = (startInstance, finishInstance) => {
  const minutes = finishInstance.diff(startInstance, `minute`);
  const minuteStr = `${formatWithLead0(minutes % 60)}M`;

  if (minutes < 60) {
    return minuteStr;
  }

  const hours = finishInstance.diff(startInstance, `hour`);
  const hourStr = `${hours % 24}H`;
  if (hours < 24) {
    return `${hourStr} ${minuteStr}`;
  }

  const days = finishInstance.diff(startInstance, `day`);
  return `${days}D ${hourStr} ${minuteStr}`;
};

const createOfferItem = (template, offer) => {
  return `
    ${template}
    <li class="event__offer">
      <span class="event__offer-title">${offer.name}</span>
      &nbsp;&plus;&euro;&nbsp;&nbsp;<span class="event__offer-price">${offer.price} </span>
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

export const createEventTemplate = ({
  type,
  destination,
  startTime,
  finishTime,
  price,
  isFavorite
}) => {
  const startDate = dayjs(startTime);
  const finishDate = dayjs(finishTime);
  const {offers} = type;

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${startDate.format(`YYYY-MM-DD`)}">
          ${startDate.format(`MMM DD`)}
        </time>
        <div class="event__type">
          <img
            class="event__type-icon"
            width="42"
            height="42"
            src="img/icons/${type.name}.png"
            alt="Event type icon"
          />
        </div>
        <h3 class="event__title">${capitalize(type.name)} ${destination.city}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startDate.format()}">
              ${startDate.format(`HH:mm`)}
            </time>
            &mdash;
            <time class="event__end-time" datetime="${finishDate.format()}">
              ${finishDate.format(`HH:mm`)}
            </time>
          </p>
          <p class="event__duration">${formatDuration(startDate, finishDate)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
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

export default class EventView extends AbstractView {
  constructor(eventData) {
    super();

    this._event = eventData;
    this._clickHandler = this._clickHandler.bind(this);
  }

  get _switchControl() {
    return this.getElement().querySelector(`.event__rollup-btn`);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  getTemplate() {
    return createEventTemplate(this._event);
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this._switchControl.addEventListener(`click`, this._clickHandler);
  }
}
