import SortView from '../view/sort';
import PointsListView from '../view/points-list';
import NoPointsView from '../view/no-points';
import PointPresenter from './point';
import PointNewPresenter from './point-new';
import {Dates, Render} from '../utils';
import {FilterType, RenderPosition, SortType, Tabs, UpdateType, UserAction} from '../const';

const sortPoints = {
  [SortType.DEFAULT](pointA, pointB) {
    return Dates.getDiff(pointA.dateFrom, pointB.dateFrom);
  },
  [SortType.DURATION](pointA, pointB) {
    const durationA = Dates.getTimestampDuration(pointA.dateTo, pointA.dateFrom);
    const durationB = Dates.getTimestampDuration(pointB.dateTo, pointB.dateFrom);

    return durationA - durationB;
  },
  [SortType.PRICE](pointA, pointB) {
    return pointA.basePrice - pointB.basePrice;
  }
};

const filterPoints = {
  [FilterType.FUTURE](point) {
    return Dates.getDiff(point.dateFrom) >= 0;
  },
  [FilterType.PAST](point) {
    return Dates.getDiff(point.dateTo) < 0;
  }
};

export default class TripPresenter {
  constructor(tripContainer, pointsModel, filterModel) {
    this._tripContainer = tripContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._sortComponent = null;
    this._newButtonComponent = null;
    this._tabsComponent = null;
    this._statsComponent = null;
    this._listComponent = new PointsListView();
    this._noPointsComponent = new NoPointsView();
    this._pointPresenters = {};
    this._currentSortType = SortType.DEFAULT;
    this._isDestroyed = true;

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleTabsClick = this._handleTabsClick.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);

    this._pointNewPresenter = new PointNewPresenter(this._listComponent, this._handleViewAction);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init(newButtonComponent, tabsComponent, statsComponent) {
    this._newButtonComponent = newButtonComponent;
    this._tabsComponent = tabsComponent;
    this._statsComponent = statsComponent;

    statsComponent.updateData({
      points: this._pointsModel.getPoints()
    });

    this._newButtonComponent.setClickHandler(() => {
      this._createPoint();
      this._tabsComponent.setDefault();
      if (this._isDestroyed) {
        this._create();
      }
    });

    this._create();

    this._tabsComponent.setClickHandler(this._handleTabsClick);
    Render.render(this._tripContainer, this._statsComponent, RenderPosition.AFTEREND);
  }

  _clearSort() {
    this._currentSortType = SortType.DEFAULT;
    Render.remove(this._sortComponent);
  }

  _clearList() {
    Object.values(this._pointPresenters).forEach((presenter) => presenter.destroy());
    this._pointPresenters = {};

    this._pointNewPresenter.destroy();
  }

  _clearNoPoints() {
    Render.remove(this._noPointsComponent);
  }

  _clearTrip() {
    this._clearSort();
    this._clearNoPoints();
    this._clearList();
  }

  _create() {
    if (!this._isDestroyed) {
      return;
    }

    this._renderTrip();

    this._statsComponent.hide();
    this._tabsComponent.setDefault();
    this._isDestroyed = false;
  }

  _createPoint() {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.DEFAULT);
    this._pointNewPresenter.init((pointNewComponent) => {
      this._newButtonComponent.getElement().disabled = pointNewComponent !== null;
      this._tabsComponent.setDefault();
    });
  }

  _destroy() {
    this._clearTrip();
    this._isDestroyed = true;
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();

    const filteredPoints = filterType === FilterType.DEFAULT ? points : points.filter(filterPoints[filterType]);

    return filteredPoints.sort(sortPoints[this._currentSortType]);
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();

    Object.values(this._pointPresenters).forEach((presenter) => presenter.resetView());
  }

  _handleModelEvent(updateType, data, notice) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenters[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearList();
        this._renderPoints(this._getPoints().slice());
        break;
      case UpdateType.MAJOR:
        this._destroy();
        this._create();
        break;
    }

    if (notice && notice.points) {
      this._statsComponent.updateData(notice);
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

  _handleTabsClick(activeTab) {
    switch (activeTab) {
      case Tabs.TABLE:
        this._create();
        break;
      case Tabs.STATS:
        this._destroy();
        this._statsComponent.show();
        break;
    }
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
