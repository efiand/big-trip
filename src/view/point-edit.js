import dayjs from 'dayjs';
import {Utils} from '../utils';
import AbstractView from '../view/abstract';

const currentTime = dayjs().toISOString();

const getDefaultData = (type, destination) => ({
  id: 0,
  type,
  destination,
  startTime: currentTime,
  finishTime: currentTime,
  price: ``
});

const createPointTypes = (pointTypes, typeName, id) => pointTypes.reduce((template, {name}) => {
  const checkedAttr = name === typeName ? `checked` : ``;
  return `
    ${template}
    <div class="event__type-item">
      <input
        id="event-type-${name}-${id}"
        class="event__type-input visually-hidden"
        type="radio"
        name="event-type"
        value="${name}"
        ${checkedAttr}
      />
      <label class="event__type-label event__type-label--${name}" for="event-type-${name}-${id}">
        ${Utils.capitalize(name)}
      </label>
    </div>
  `;
}, ``);

const createCitiesList = (cities) => cities.reduce((template, cityName) => {
  return `${template}<option value="${cityName}"></option>`;
}, ``);

const createOffersList = (offers) => offers.reduce((template, offer, i) => {
  const {name, alias, price: offerPrice, isChecked} = offer;
  const checkedAttr = isChecked ? `checked` : ``;

  return `
    ${template}
    <div class="event__offer-selector">
      <input
        class="event__offer-checkbox visually-hidden"
        id="event-offer-${alias}-${i + 1}"
        type="checkbox"
        name="event-offer-${alias}"
        ${checkedAttr}
      />
      <label class="event__offer-label" for="event-offer-${alias}-${i + 1}">
        <span class="event__offer-title">${name}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offerPrice}</span>
      </label>
    </div>
  `;
}, ``);

const createPhotosList = (photos) => photos.reduce((template, photo) => {
  return `${template}<img class="event__photo" src="${photo}" alt="Event photo">`;
}, ``);

const createPointEditTemplate = ({pointData = null, pointTypes, destinations, cities}) => {
  const addMode = !pointData;
  if (addMode) {
    pointData = getDefaultData(pointTypes[0], destinations[0]);
  }
  const {id, type, destination, startTime, finishTime, price} = pointData;
  const {offers, name: typeName} = type;
  const {city, description, photos} = destination;

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
              <span class="visually-hidden">Choose event type</span>
              <img
                class="event__type-icon"
                width="17"
                height="17"
                src="img/icons/${typeName}.png"
                alt="Event type icon"
              />
            </label>
            <input
              class="event__type-toggle visually-hidden"
              id="event-type-toggle-${id}"
              type="checkbox"
            />

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createPointTypes(pointTypes, type, id)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group event__field-group--destination">
            <label class="event__label event__type-output" for="event-destination-${id}">
              ${Utils.capitalize(typeName)}
            </label>
            <input
              class="event__input event__input--destination"
              id="event-destination-${id}"
              type="text"
              name="event-destination"
              value="${city}"
              list="destination-list-${id}"
            />
            <datalist id="destination-list-${id}">${createCitiesList(cities)}</datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${id}">From</label>
            <input
              class="event__input event__input--time"
              id="event-start-time-${id}"
              type="text"
              name="event-start-time"
              value="${dayjs(startTime).format(`DD/MM/YY HH:mm`)}"
            />
            &mdash;
            <label class="visually-hidden" for="event-end-time-${id}">To</label>
            <input
              class="event__input event__input--time"
              id="event-end-time-${id}"
              type="text"
              name="event-end-time"
              value="${dayjs(finishTime).format(`DD/MM/YY HH:mm`)}"
            />
          </div>

          <div class="event__field-group event__field-group--price">
            <label class="event__label" for="event-price-${id}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input event__input--price"
              id="event-price-${id}"
              type="text"
              name="event-price" value="${price}"
            />
          </div>

          <button class="event__save-btn btn btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">
            ${addMode ? `Cancel` : `Delete`}
          </button>
          ${addMode ? `` : `
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>
          `}
        </header>
        <section class="event__details">
          ${offers.length ? `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">${createOffersList(offers)}</div>
          </section>` : ``}

          <section class="event__section event__section--destination">
            <h3 class="event__section-title event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">${createPhotosList(photos)}</div>
            </div>
          </section>
        </section>
      </form>
    </li>
  `;
};

export default class EventEditView extends AbstractView {
  constructor(payload) {
    super();

    this._payload = payload;
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._resetHandler = this._resetHandler.bind(this);
    this._submitHandler = this._submitHandler.bind(this);
  }

  get _form() {
    return this.getElement().querySelector(`form`);
  }

  get _closeControl() {
    return this._form.querySelector(`.event__rollup-btn`);
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.close();
  }

  _resetHandler(evt) {
    evt.preventDefault();
    this._callback.formReset();
  }

  _submitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._payload.pointData);
  }

  getTemplate() {
    return createPointEditTemplate(this._payload);
  }

  setCloseHandler(callback) {
    this._callback.close = callback;
    this._closeControl.addEventListener(`click`, this._closeClickHandler);
  }

  setResetHandler(callback) {
    this._callback.formReset = callback;
    this._form.addEventListener(`reset`, this._resetHandler);
  }

  setSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this._form.addEventListener(`submit`, this._submitHandler);
  }
}
