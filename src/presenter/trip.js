import SortingsView from '../view/sort';
import PointsListView from '../view/points-list';
import NoPointsView from '../view/no-points';
import PointPresenter from '../presenter/point';
import {Render} from '../utils';

export default class TripPresenter {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;

    this._sortingsComponent = new SortingsView();
    this._pointsListComponent = new PointsListView();
    this._noPointsComponent = new NoPointsView();

    this._points = [];
    this._pointPresenters = {};
  }

  init(points) {
    this._points = points.slice();

    this._renderTrip();
  }

  _renderSortings() {
    Render.render(this._tripContainer, this._sortingsComponent);
  }

  _renderPoint(pointData) {
    const pointPresenter = new PointPresenter(this._pointsListComponent.getElement());
    pointPresenter.init(pointData);
    this._pointPresenters[pointData.id] = pointPresenter;
  }

  _renderPointsList() {
    Render.render(this._tripContainer, this._pointsListComponent);

    this._points.forEach((pointData) => {
      this._renderPoint(pointData);
    });
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
      this._renderSortings();
      this._renderPointsList();
    } else {
      this._renderNoPoints();
    }
  }
}
