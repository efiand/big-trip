import PointView from '../view/point';
import PointEditView from '../view/point-edit';
import {Render} from '../utils';
import {pointTypes} from '../mock/point-types';
import {destinations} from '../mock/destinations';
import {CITY_NAMES} from '../mock/const';

export default class PointPresenter {
  constructor(pointsListComponent) {
    this._pointsListComponent = pointsListComponent;

    this._pointComponent = null;
    this._pointEditComponent = null;
    this._pointData = {};

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._switchToEdit = this._switchToEdit.bind(this);
    this._switchToView = this._switchToView.bind(this);
  }

  init(pointData) {
    this._pointData = pointData;

    this._pointComponent = new PointView(pointData);
    this._pointEditComponent = new PointEditView({
      pointData,
      pointTypes,
      destinations,
      cities: CITY_NAMES
    });

    this._pointComponent.setClickHandler(this._switchToEdit);
    this._pointEditComponent.setSubmitHandler(() => {
      this._switchToView();
    });
    this._pointEditComponent.setResetHandler(() => {
      this._switchToView();
    });
    this._pointEditComponent.setCloseHandler(this._switchToView);

    Render.render(this._pointsListComponent, this._pointComponent);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._switchToView();
    }
  }

  _handleEditClick() {
    this._replaceCardToForm();
  }

  _handleFormSubmit() {
    this._replaceFormToCard();
  }

  _switchToEdit() {
    Render.replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _switchToView() {
    Render.replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }
}
