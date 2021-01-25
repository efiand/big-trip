import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import SmartView from './smart';
import {pointTypes} from '../mock/point-types';
import {destinations} from '../mock/destinations';
import {CITY_NAMES} from '../mock/const';
import {Dates, Utils} from '../utils';

const KEY_24_HR = `time_24hr`;
const DATEPICKER_DEFAULTS = {
  dateFormat: `d/m/y H:i`,
  enableTime: true,
  [KEY_24_HR]: true
};

const getDefaultData = () => {
  const [{type, offers}] = pointTypes;
  const [destination] = destinations;
  const dateFrom = Dates.getInst();

  return {
    type,
    destination,
    dateFrom,
    dateTo: dateFrom,
    basePrice: ``,
    offers
  };
};

const createPointTypes = (typeName) => pointTypes.reduce((template, {type}) => {
  const checkedAttr = type === typeName ? `checked` : ``;
  return `
    ${template}
    <div class="event__type-item">
      <input
        id="event-type-${type}"
        class="event__type-input visually-hidden"
        type="radio"
        name="event-type"
        value="${type}"
        ${checkedAttr}
      />
      <label class="event__type-label event__type-label--${type}" for="event-type-${type}">
        ${Utils.capitalize(type)}
      </label>
    </div>
  `;
}, ``);

const createCitiesList = () => CITY_NAMES.reduce((template, cityName) => {
  return `${template}<option value="${cityName}"></option>`;
}, ``);

const createOffersList = (offers) => offers.reduce((template, offer, i) => {
  const {title, price: offerPrice, isChecked} = offer;
  const checkedAttr = isChecked ? `checked` : ``;

  return `
    ${template}
    <div class="event__offer-selector">
      <input
        class="event__offer-checkbox visually-hidden"
        id="event-offer-${i}"
        type="checkbox"
        name="event-offer-${i}"
        data-offer-id="${i}"
        ${checkedAttr}
      />
      <label class="event__offer-label" for="event-offer-${i}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offerPrice}</span>
      </label>
    </div>
  `;
}, ``);

const createPhotosList = (pictures) => pictures.reduce((template, {src, description}) => {
  return `${template}<img class="event__photo" src="${src}" alt="${description}">`;
}, ``);

const createPointEditTemplate = ({
  id = `new`,
  isNewPoint,
  type,
  destination,
  dateFrom,
  dateTo,
  basePrice,
  offers
}) => {
  const {name: city, description, pictures} = destination;
  const isSubmitDisabled = !city || !dateFrom || !dateTo || !basePrice;

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
                src="img/icons/${type}.png"
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
              ${Utils.capitalize(type)}
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
              value="${dateFrom}"
            />
            &mdash;
            <label class="visually-hidden" for="event-end-time-${id}">To</label>
            <input
              class="event__input event__input--time"
              id="event-end-time-${id}"
              type="text"
              name="event-end-time"
              value="${dateTo}"
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
              name="event-price" value="${basePrice}"
            />
          </div>

          <button
            class="event__save-btn btn btn--blue"
            type="submit"
            ${isSubmitDisabled ? `disabled` : ``}
          >Save</button>
          <button class="event__reset-btn" type="reset">
            ${isNewPoint ? `Cancel` : `Delete`}
          </button>
          ${isNewPoint ? `` : `
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

          ${description && pictures ? `<section class="event__section event__section--destination">
            <h3 class="event__section-title event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">${createPhotosList(pictures)}</div>
            </div>
          </section>` : ``}
        </section>
      </form>
    </li>
  `;
};

export default class PointEditView extends SmartView {
  constructor(point = getDefaultData()) {
    super();

    this._data = PointEditView.parsePointToData(point);
    this._datepickerFrom = null;
    this._datepickerTo = null;

    this._changeDestinationHandler = this._changeDestinationHandler.bind(this);
    this._changeDateToHandler = this._changeDateToHandler.bind(this);
    this._changeOfferHandler = this._changeOfferHandler.bind(this);
    this._changePointTypeHandler = this._changePointTypeHandler.bind(this);
    this._changeDateFromHandler = this._changeDateFromHandler.bind(this);
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._deleteHandler = this._deleteHandler.bind(this);
    this._inputDestinationHandler = this._inputDestinationHandler.bind(this);
    this._inputPriceHandler = this._inputPriceHandler.bind(this);
    this._submitHandler = this._submitHandler.bind(this);

    this._setInnerHandlers();
  }

  get _closeControl() {
    return this._form.querySelector(`.event__rollup-btn`);
  }

  get _dateToField() {
    return this._form.querySelector(`[name="event-end-time"]`);
  }

  get _dateFromField() {
    return this._form.querySelector(`[name="event-start-time"]`);
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

  get _submitControl() {
    return this._form.querySelector(`[type="submit"]`);
  }

  get _typeRadioBtns() {
    return this._form.querySelectorAll(`[name="event-type"]`);
  }

  getTemplate() {
    return createPointEditTemplate(this._data);
  }

  removeElement() {
    // переопределяем метод родительского класса, чтобы удалялись ненужные календари
    super.removeElement();

    if (this._datepickerFrom) {
      this._datepickerFrom.destroy();
      this._datepickerFrom = null;
    }

    if (this._datepickerTo) {
      this._datepickerTo.destroy();
      this._datepickerTo = null;
    }
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setCloseHandler(this._callback.close);
    this.setDeleteHandler(this._callback.delete);
    this.setSubmitHandler(this._callback.submit);
  }

  setCloseHandler(callback) {
    if (this._data.isNewPoint) {
      return;
    }

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

  _changeDestinationHandler(evt) {
    evt.preventDefault();

    const destination = PointEditView.getDestination(evt.target.value);

    if (!destination.name) {
      evt.target.value = ``;
    }

    this.updateData({
      destination
    });
  }

  _changeDateToHandler([userDate]) {
    this.updateData({
      dateTo: Dates.humanize(userDate)
    }, null);
  }

  _changeOfferHandler(evt) {
    evt.preventDefault();
    const {offerId} = evt.target.dataset;
    const offers = this._data.offers.slice();
    offers[offerId].isChecked = evt.target.checked;

    this.updateData({offers}, null);
  }

  _changePointTypeHandler(evt) {
    evt.preventDefault();

    const {type: typeName, offers} = pointTypes.find(({type}) => type === evt.target.value);
    this.updateData({
      type: typeName,
      offers: offers.slice()
    });
  }

  _changeDateFromHandler([userDate]) {
    this.updateData({
      dateFrom: Dates.humanize(userDate)
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

  _inputPriceHandler(evt) {
    evt.preventDefault();

    const value = parseInt(evt.target.value.trim(), 10);
    this._currentPrice = isNaN(value) || !value ? `` : value.toString();
    evt.target.value = this._currentPrice;

    this.updateData({
      basePrice: this._currentPrice
    }, () => {
      this._submitControl.disabled = !this._currentPrice;
    });
  }

  _setDatepickerTo() {
    if (this._datepickerTo) {
      // при обновлении удаляем вспомогательные элементы, создаваемые при инициализации
      this._datepickerTo.destroy();
      this._datepickerTo = null;
    }

    this._datepickerTo = flatpickr(this._dateToField, Object.assign({}, DATEPICKER_DEFAULTS, {
      defaultDate: this._data.dateTo,
      onChange: this._changeDateToHandler
    }));
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
    this._priceField.addEventListener(`input`, this._inputPriceHandler);

    this._setDatepickerFrom();
    this._setDatepickerTo();
  }

  _setDatepickerFrom() {
    if (this._datepickerFrom) {
      // при обновлении удаляем вспомогательные элементы, создаваемые при инициализации
      this._datepickerFrom.destroy();
      this._datepickerFrom = null;
    }

    this._datepickerFrom = flatpickr(this._dateFromField, Object.assign({}, DATEPICKER_DEFAULTS, {
      defaultDate: this._data.dateFrom,
      onChange: this._changeDateFromHandler
    }));
  }

  _submitHandler(evt) {
    evt.preventDefault();

    if (!this._data.destination.name || !this._data.basePrice) {
      return;
    }

    this._callback.submit(PointEditView.parseDataToPoint(this._data));
  }

  static getDestination(city) {
    city = city.trim();
    const destination = destinations.find(({name}) => name === city) || {
      name: ``,
      description: null,
      pictures: null
    };

    return destination;
  }

  static parseDataToPoint(data) {
    delete data.isNewPoint;

    return Object.assign({}, data, {
      dateFrom: Dates.getInst(data.dateFrom, true),
      dateTo: Dates.getInst(data.dateTo, true)
    });
  }

  static parsePointToData(point) {
    return Object.assign({}, point, {
      dateFrom: Dates.humanize(point.dateFrom),
      dateTo: Dates.humanize(point.dateTo),
      isNewPoint: !point.id
    });
  }
}
