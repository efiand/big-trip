import PointView from '../view/point';
import PointEditView from '../view/point-edit';
import {Render} from '../utils';
import {pointTypes} from '../mock/point-types';
import {destinations} from '../mock/destinations';
import {CITY_NAMES} from '../mock/const';

export default class PointPresenter {
  constructor(pointsListContainer) {
    this._pointsListContainer = pointsListContainer;

    this._pointComponent = null;
    this._pointEditComponent = null;
    this._pointData = {};

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._switchToEdit = this._switchToEdit.bind(this);
    this._switchToView = this._switchToView.bind(this);
  }

  init(pointData) {
    this._pointData = pointData;

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

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

    if (prevPointComponent === null || prevPointEditComponent) {
      Render.render(this._pointsListContainer, this._pointComponent);
      return;
    }

    // Проверка на наличие в DOM - чтобы не заменять то, что не было отрисовано
    if (this._pointsListContainer.getElement().contains(prevPointComponent.getElement())) {
      Render.replace(this._pointsListContainer, prevPointComponent);
    }
    if (this._pointsListContainer.getElement().contains(prevPointEditComponent.getElement())) {
      Render.replace(this._pointsListContainer, prevPointEditComponent);
    }

    Render.remove(prevPointComponent);
    Render.remove(prevPointEditComponent);
  }

  _destroy() {
    Render.remove(this._pointComponent);
    Render.remove(this._pointEditComponent);
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
