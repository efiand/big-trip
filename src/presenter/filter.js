import FilterView from '../view/filter';
import {Render} from '../utils';
import {UpdateType} from '../const';

export default class FilterPresenter {
  constructor(filterContainer, filterModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;

    this._filterComponent = null;

    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(this._currentFilter);
    this._filterComponent.setChangeFilterTypeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      Render.render(this._filterContainer, this._filterComponent);
      return;
    }

    Render.replace(this._filterComponent, prevFilterComponent);
    Render.remove(prevFilterComponent);
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _handleModelEvent() {
    this.init();
  }
}
