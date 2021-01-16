import dayjs from 'dayjs';
import SortView from '../view/sort';
import PointsListView from '../view/points-list';
import NoPointsView from '../view/no-points';
import PointPresenter from '../presenter/point';
import {Render, Utils} from '../utils';

const DEFAULT_SORT_TYPE = `DEFAULT`;

const sortPoints = {
  DEFAULT(pointA, pointB) {
    return dayjs(pointA.startTime).diff(pointB.startTime);
  },
  DURATION(pointA, pointB) {
    const durationA = dayjs(pointA.finishTime).unix() - dayjs(pointA.startTime).unix();
    const durationB = dayjs(pointB.finishTime).unix() - dayjs(pointB.startTime).unix();

    return durationA - durationB;
  },
  PRICE(pointA, pointB) {
    return pointA.price - pointB.price;
  }
};

export default class TripPresenter {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;

    this._sortComponent = new SortView();
    this._pointsListComponent = new PointsListView();
    this._noPointsComponent = new NoPointsView();

    this._points = [];
    this._pointPresenters = {};
    this._currentSortType = DEFAULT_SORT_TYPE;

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(points) {
    this._points = points.slice().sort(sortPoints[this._currentSortType]);

    this._renderTrip();
  }

  _handleModeChange() {
    Object.values(this._pointPresenters).forEach((presenter) => presenter.resetView());
  }

  _handlePointChange(updatedPoint) {
    this._points = Utils.updateItem(this._points, updatedPoint);
    this._pointPresenters[updatedPoint.id].init(updatedPoint);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortPoints(sortType);
  }

  _sortPoints(sortType) {
    this._currentSortType = sortType;
    this._points.sort(sortPoints[sortType]);

    this._clearPointsList();
    this._renderPoints();
  }

  _renderSort() {
    Render.render(this._tripContainer, this._sortComponent);
    this._sortComponent.setSortTypeHandlers(this._handleSortTypeChange);
  }

  _renderPoint(pointData) {
    const pointPresenter = new PointPresenter(this._pointsListComponent, this._handlePointChange, this._handleModeChange);
    pointPresenter.init(pointData);
    this._pointPresenters[pointData.id] = pointPresenter;
  }

  _renderPoints() {
    this._points.forEach((pointData) => {
      this._renderPoint(pointData);
    });
  }

  _renderPointsList() {
    Render.render(this._tripContainer, this._pointsListComponent);

    this._renderPoints();
  }

  _clearPointsList() {
    Object.values(this._pointPresenters).forEach((presenter) => presenter.destroy());
    this._pointPresenters = {};
  }

  _renderNoPoints() {
    Render.render(this._tripContainer, this._noPointsComponent);
  }

  _renderTrip() {
    if (this._points.length) {
      this._renderSort();
      this._renderPointsList();
    } else {
      this._renderNoPoints();
    }
  }
}
