import {Observer} from '../utils';
import {FilterType} from '../const';

export default class FilterModel extends Observer {
  constructor() {
    super();

    this._currentFilter = FilterType.DEFAULT;
  }

  getFilter() {
    return this._currentFilter;
  }

  setFilter(updateType, filter) {
    this._currentFilter = filter;
    this._notify(updateType, filter);
  }
}
