import SortView from '../view/sort';
import PointsListView from '../view/points-list';
import NoPointsView from '../view/no-points';
import PointPresenter from '../presenter/point';
import {Dates, Render} from '../utils';
import {UpdateType, UserAction} from '../const';

const DEFAULT_SORT_TYPE = `DEFAULT`;

const sortPoints = {
  DEFAULT(pointA, pointB) {
    return Dates.getDiff(pointA.startTime, pointB.startTime);
  },
  DURATION(pointA, pointB) {
    const durationA = Dates.getTimestampDuration(pointA.endTime, pointA.startTime);
    const durationB = Dates.getTimestampDuration(pointB.endTime, pointB.startTime);

    return durationA - durationB;
  },
  PRICE(pointA, pointB) {
    return pointA.price - pointB.price;
  }
};

export default class TripPresenter {
  constructor(tripContainer, pointsModel) {
    this._tripContainer = tripContainer;
    this._pointsModel = pointsModel;

    this._sortComponent = null;
    this._listComponent = new PointsListView();
    this._noPointsComponent = new NoPointsView();

    this._pointPresenters = {};
    this._currentSortType = DEFAULT_SORT_TYPE;

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderTrip();
  }

  _clearSort() {
    Render.remove(this._sortComponent);
  }

  _clearList() {
    Object.values(this._pointPresenters).forEach((presenter) => presenter.destroy());
    this._pointPresenters = {};
  }

  _clearTrip() {
    // тут будет еще что-то, по всей видимости
    this._clearSort();
    this._clearList();
  }

  _getPoints() {
    return this._pointsModel.getPoints().slice().sort(sortPoints[this._currentSortType]);
  }

  _handleModeChange() {
    Object.values(this._pointPresenters).forEach((presenter) => presenter.resetView());
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        // обновление одной точки маршрута
        this._pointPresenters[data.id].init(data);
        break;
      case UpdateType.MINOR:
        // обновление списка (при сортировке или фильтрации)
        this._clearList();
        this._renderPoints(this._getPoints().slice());
        break;
      case UpdateType.MAJOR:
        // обновление всего экрана (при добавлении или удалении точки)
        this._clearTrip();
        this._renderTrip();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearList();
    this._renderPoints(this._getPoints().slice());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _renderNoPoints() {
    Render.render(this._tripContainer, this._noPointsComponent);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._listComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenters[point.id] = pointPresenter;
  }

  _renderPoints(points) {
    points.forEach((point) => this._renderPoint(point));
  }

  _renderList() {
    Render.render(this._tripContainer, this._listComponent);
    this._renderPoints(this._getPoints().slice());
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeHandlers(this._handleSortTypeChange);

    Render.render(this._tripContainer, this._sortComponent);
  }

  _renderTrip() {
    if (!this._getPoints().length) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();
    this._renderList();
  }
}
