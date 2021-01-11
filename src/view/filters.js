import {capitalize} from '../utils/common';
import {createElement} from '../utils/render';
import {FILTERS} from '../const';

const defaultFilter = FILTERS[0];

const createListMarkup = (activeFilter) => FILTERS.reduce((markup, filter) => {
  const title = capitalize(filter);
  const isActive = filter === activeFilter;

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
      />
      <label class="trip-filters__filter-label" for="filter-${filter}">
        ${title}
      </label>
    </div>
  `;
}, ``);

const createFiltersTemplate = (activeFilter) => {
  return `
    <form class="trip-filters" action="#" method="get">
      ${createListMarkup(activeFilter)}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
};

export default class FiltersView {
  constructor(activeFilter = defaultFilter) {
    this._activeFilter = activeFilter;
  }

  getTemplate() {
    return createFiltersTemplate(this._activeFilter);
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
