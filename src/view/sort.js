import AbstractView from './abstract';
import {Utils} from '../utils';
import {SortType} from '../const';

const DISABLED_SORTINGS = [`point`, `offer`];

const createListMarkup = (activeSorting) => Object.values(SortType).reduce((markup, sorting) => {
  const title = Utils.capitalize(sorting);
  const isActive = sorting === activeSorting;
  const isDisabled = DISABLED_SORTINGS.indexOf(sorting) > -1;

  return `
    ${markup}
    <div class="trip-sort__item trip-sort__item--${sorting}">
      <input
        id="sort-${sorting}"
        class="trip-sort__input visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-${sorting}"
        data-sort-type="${sorting}"
        ${isActive ? `checked` : ``}
        ${isDisabled ? `disabled` : ``}
      />
      <label class="trip-sort__btn" for="sort-${sorting}">
        ${title}
      </label>
    </div>
  `;
}, ``);

const createSortingsTemplate = (activeSorting) => {
  return `
    <form class="trip-events__trip-sort trip-sort" action="#" method="get">
      ${createListMarkup(activeSorting)}
    </form>
  `;
};

export default class SortView extends AbstractView {
  constructor(activeSorting = `DEFAULT`) {
    super();

    this._activeSorting = activeSorting;

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  get _radioBtns() {
    return this.getElement().querySelectorAll(`[name="trip-sort"]:not(:disabled)`);
  }

  getTemplate() {
    return createSortingsTemplate(this._activeSorting);
  }

  _sortTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeHandlers(callback) {
    this._callback.sortTypeChange = callback;

    for (const radioBtn of this._radioBtns) {
      radioBtn.addEventListener(`change`, this._sortTypeChangeHandler);
    }
  }
}
