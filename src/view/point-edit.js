import {Dates, Utils} from '../utils';
import SmartView from '../view/smart';
import {pointTypes} from '../mock/point-types';
import {destinations} from '../mock/destinations';
import {CITY_NAMES} from '../mock/const';

const getDefaultData = (type, destination) => {
  const startTime = Dates.getISO(new Date());

  return {
    id: 0, // для постфикса связки лейбла и инпута
    type,
    destination,
    startTime,
    finishTime: startTime,
    price: ``
  };
};

const createPointTypes = (typeName) => pointTypes.reduce((template, {name}, i) => {
  const checkedAttr = name === typeName ? `checked` : ``;
  return `
    ${template}
    <div class="event__type-item">
      <input
        id="event-type-${name}-${i + 1}"
        class="event__type-input visually-hidden"
        type="radio"
        name="event-type"
        value="${name}"
        ${checkedAttr}
      />
      <label class="event__type-label event__type-label--${name}" for="event-type-${name}-${i + 1}">
        ${Utils.capitalize(name)}
      </label>
    </div>
  `;
}, ``);

const createCitiesList = () => CITY_NAMES.reduce((template, cityName) => {
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

const createPointEditTemplate = (pointData = null) => {
  const addMode = !pointData;
  if (addMode) {
    pointData = getDefaultData(pointTypes[0], destinations[0]);
  }
  const {id, type, destination, startTime, finishTime, price} = pointData;
  const {offers, name: typeName} = type;
  const {city, description, photos} = destination;
  const isSubmitDisabled = !city;

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
                ${createPointTypes(type)}
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
            <datalist id="destination-list-${id}">${createCitiesList()}</datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${id}">From</label>
            <input
              class="event__input event__input--time"
              id="event-start-time-${id}"
              type="text"
              name="event-start-time"
              value="${startTime}"
            />
            &mdash;
            <label class="visually-hidden" for="event-end-time-${id}">To</label>
            <input
              class="event__input event__input--time"
              id="event-end-time-${id}"
              type="text"
              name="event-end-time"
              value="${finishTime}"
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

          <button
            class="event__save-btn btn btn--blue"
            type="submit"
            ${isSubmitDisabled ? `disabled` : ``}
          >Save</button>
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

          ${description && photos ? `<section class="event__section event__section--destination">
            <h3 class="event__section-title event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">${createPhotosList(photos)}</div>
            </div>
          </section>` : ``}
        </section>
      </form>
    </li>
  `;
};

export default class PointEditView extends SmartView {
  constructor(point) {
    super();

    this._data = PointEditView.parsePointToData(point);

    this._changeDestinationHandler = this._changeDestinationHandler.bind(this);
    this._changeOfferHandler = this._changeOfferHandler.bind(this);
    this._changePriceHandler = this._changePriceHandler.bind(this);
    this._changePointTypeHandler = this._changePointTypeHandler.bind(this);
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._deleteHandler = this._deleteHandler.bind(this);
    this._inputDestinationHandler = this._inputDestinationHandler.bind(this);
    this._submitHandler = this._submitHandler.bind(this);

    this._setInnerHandlers();
  }

  get _closeControl() {
    return this._form.querySelector(`.event__rollup-btn`);
  }

  get _destinationField() {
    return this._form.querySelector(`[name="event-destination"]`);
  }

  get _form() {
    return this.getElement().querySelector(`form`);
  }

  get _offerCheckboxes() {
    return this._form.querySelectorAll(`.event__offer-checkbox`);
  }

  get _priceField() {
    return this._form.querySelector(`[name="event-price"]`);
  }

  get _typeRadioBtns() {
    return this._form.querySelectorAll(`[name="event-type"]`);
  }

  _changeDestinationHandler(evt) {
    evt.preventDefault();

    const destination = PointEditView.getDestination(evt.target.value);
    this.updateData({
      destination
    });
  }

  _changeOfferHandler(evt) {
    evt.preventDefault();
    const alias = evt.target.name.replace(`event-offer-`, ``);
    const {type} = this._data;
    const offers = type.offers.slice();
    const currentIndex = offers.findIndex((item) => item.alias === alias);
    offers[currentIndex].isChecked = evt.target.checked;

    this.updateData({
      type: Object.assign({}, type, {
        offers
      })
    }, null);
  }

  _changePointTypeHandler(evt) {
    evt.preventDefault();

    this.updateData({
      type: pointTypes.find((type) => type.name === evt.target.value)
    });
  }

  _changePriceHandler(evt) {
    evt.preventDefault();

    this.updateData({
      price: evt.target.value
    }, null);
  }

  _closeClickHandler(evt) {
    evt.preventDefault();
    this._callback.close();
  }

  _deleteHandler(evt) {
    evt.preventDefault();
    this._callback.delete();
  }

  _inputDestinationHandler(evt) {
    evt.preventDefault();

    const destination = PointEditView.getDestination(evt.target.value);
    this.updateData({
      destination
    }, destination.description ? this.updateELement : null);
  }

  _setInnerHandlers() {
    for (const radioBtn of this._typeRadioBtns) {
      radioBtn.addEventListener(`change`, this._changePointTypeHandler);
    }

    for (const checkbox of this._offerCheckboxes) {
      checkbox.addEventListener(`change`, this._changeOfferHandler);
    }

    this._destinationField.addEventListener(`input`, this._inputDestinationHandler);
    this._destinationField.addEventListener(`change`, this._changeDestinationHandler);
    this._priceField.addEventListener(`change`, this._changePriceHandler);
  }

  _submitHandler(evt) {
    evt.preventDefault();
    this._callback.submit(PointEditView.parseDataToPoint(this._data));
  }

  getTemplate() {
    return createPointEditTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setCloseHandler(this._callback.close);
    this.setDeleteHandler(this._callback.delete);
    this.setSubmitHandler(this._callback.submit);
  }

  setCloseHandler(callback) {
    this._callback.close = callback;
    this._closeControl.addEventListener(`click`, this._closeClickHandler);
  }

  setDeleteHandler(callback) {
    this._callback.delete = callback;
    this._form.addEventListener(`reset`, this._deleteHandler);
  }

  setSubmitHandler(callback) {
    this._callback.submit = callback;
    this._form.addEventListener(`submit`, this._submitHandler);
  }

  static getDestination(city) {
    city = city.trim();
    const destination = destinations.find((item) => item.city === city) || {
      city,
      description: null,
      photos: null
    };

    return destination;
  }

  static parsePointToData(point) {
    return Object.assign({}, point, {
      startTime: Dates.humanize(point.startTime),
      finishTime: Dates.humanize(point.finishTime),
      price: point.price.toString()
    });
  }

  static parseDataToPoint(data) {
    const price = parseInt(data.price.trim(), 10);

    return Object.assign({}, data, {
      startTime: Dates.unhumanize(data.startTime),
      finishTime: Dates.unhumanize(data.finishTime),
      price: isNaN(price) ? 0 : price
    });
  }
}
