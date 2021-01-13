import SortingsView from '../view/sort';
import PointsListView from '../view/points-list';
import NoPointsView from '../view/no-points';
import PointView from '../view/point';
import PointEditView from '../view/point-edit';
import {pointTypes} from '../mock/point-types';
import {destinations} from '../mock/destinations';
import {CITY_NAMES} from '../mock/const';
import {Render} from '../utils';

export default class TripPresenter {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;

    this._sortingsComponent = new SortingsView();
    this._pointsListComponent = new PointsListView();
    this._noPointsComponent = new NoPointsView();

    this._points = [];
  }

  init(points) {
    this._points = points.slice();

    this._renderTrip();
  }

  _renderSortings() {
    Render.render(this._tripContainer, this._sortingsComponent);
  }

  _renderPoint(pointData) {
    const pointComponent = new PointView(pointData);
    const pointEditComponent = new PointEditView({
      pointData,
      pointTypes,
      destinations,
      cities: CITY_NAMES
    });

    const switchToEdit = () => {
      Render.replace(pointEditComponent, pointComponent);
      document.addEventListener(`keydown`, escKeyDownHandler);
    };
    const switchToView = () => {
      Render.replace(pointComponent, pointEditComponent);
      document.removeEventListener(`keydown`, escKeyDownHandler);
    };

    const escKeyDownHandler = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        switchToView();
      }
    };

    pointComponent.setClickHandler(switchToEdit);

    pointEditComponent.setSubmitHandler(() => {
      switchToView();
    });
    pointEditComponent.setResetHandler(() => {
      switchToView();
    });
    pointEditComponent.setCloseHandler(switchToView);

    Render.render(this._pointsListComponent, pointComponent);
  }

  _renderPoints() {
    Render.render(this._tripContainer, this._pointsListComponent);

    this._points.forEach((pointData) => {
      this._renderPoint(pointData);
    });
  }

  _renderNoPoints() {
    Render.render(this._tripContainer, this._noPointsComponent);
  }

  _renderTrip() {
    if (this._points.length) {
      this._renderSortings();
      this._renderPoints();
    } else {
      this._renderNoPoints();
    }
  }
}
