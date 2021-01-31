import AbstractView from './abstract-view';
import {Utils} from '../utils';
import {FilterType} from '../const';

const createListMarkup = (currentFilter, count) => Object.values(FilterType).reduce((markup, filter) => {
  const title = Utils.capitalize(filter);
  const isActive = filter === currentFilter;

  return `
    ${markup}
    <div class="trip-filters__filter">
      <input
        id="filter-${filter}"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        value="${filter}"
        ${isActive ? `checked` : ``}
        ${!isActive && !count[filter] ? `disabled` : ``}
      />
      <label class="trip-filters__filter-label" for="filter-${filter}">
        ${title}
      </label>
    </div>
  `;
}, ``);

const createFiltersTemplate = (currentFilter, count) => {
  return `
    <form class="trip-filters" action="#" method="get">
      ${createListMarkup(currentFilter, count)}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
};

export default class FilterView extends AbstractView {
  constructor(currentFilter, count) {
    super();

    this._currentFilter = currentFilter;
    this._count = count;

    this._changeFilterTypeHandler = this._changeFilterTypeHandler.bind(this);
  }

  get _radioBtns() {
    return this.getElement().querySelectorAll(`[name="trip-filter"]`);
  }

  getTemplate() {
    return createFiltersTemplate(this._currentFilter, this._count);
  }

  setChangeFilterTypeHandler(callback) {
    this._callback.changeFilterType = callback;

    for (const radioBtn of this._radioBtns) {
      radioBtn.addEventListener(`change`, this._changeFilterTypeHandler);
    }
  }

  _changeFilterTypeHandler(evt) {
    evt.preventDefault();

    this._callback.changeFilterType(evt.target.value);
  }
}
