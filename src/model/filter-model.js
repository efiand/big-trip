import {Observer} from '../utils';
import {FilterType} from '../const';

export default class FilterModel extends Observer {
  constructor() {
    super();

    this._currentFilter = FilterType.DEFAULT;
    this._count = {
      [FilterType.DEFAULT]: 0,
      [FilterType.FUTURE]: 0,
      [FilterType.PAST]: 0
    };
  }

  get count() {
    return this._count;
  }

  set count(countPoints) {
    this._count = countPoints;
  }

  getFilter() {
    return this._currentFilter;
  }

  setFilter(updateType, filter) {
    this._currentFilter = filter;
    this._notify(updateType, filter);
  }
}
