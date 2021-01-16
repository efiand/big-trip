import {Utils} from '../utils';
import AbstractView from '../view/abstract';
import {SortType} from '../const';

const DISABLED_SORTINGS = [`POINT`, `OFFER`];

const createListMarkup = (activeSorting) => Object.keys(SortType).reduce((markup, sorting) => {
  const sortingVal = SortType[sorting]
  const title = Utils.capitalize(sortingVal);
  const isActive = sorting === activeSorting;
  const isDisabled = DISABLED_SORTINGS.indexOf(sorting) > -1;

  return `
    ${markup}
    <div class="trip-sort__item trip-sort__item--${sortingVal}">
      <input
        id="sort-${sortingVal}"
        class="trip-sort__input visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-${sortingVal}"
        data-sort-type="${sorting}"
        ${isActive ? `checked` : ``}
        ${isDisabled ? `disabled` : ``}
      />
      <label class="trip-sort__btn" for="sort-${sortingVal}">
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
