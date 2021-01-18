import PointEditView from '../view/point-edit';
import {Render, Random} from '../utils';
import {RenderPosition, UserAction, UpdateType} from '../const';

export default class PointNewPresenter {
  constructor(listContainer, changeData) {
    this._listContainer = listContainer;
    this._changeData = changeData;

    this._pointEditComponent = null;
    this._newButtonComponent = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
  }

  init(newButtonComponent) {
    if (this._pointEditComponent !== null) {
      return;
    }

    this._newButtonComponent = newButtonComponent;
    this._pointEditComponent = new PointEditView();

    this._pointEditComponent.setSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setDeleteHandler(this._handleDeleteClick);

    Render.render(this._listContainer, this._pointEditComponent, RenderPosition.AFTERBEGIN);
    this._setBtnMode();

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._pointEditComponent === null) {
      return;
    }

    Render.remove(this._pointEditComponent);
    this._pointEditComponent = null;
    this._setBtnMode();
    this._newButtonComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _setBtnMode() {
    this._newButtonComponent.getElement().disabled = this._pointEditComponent !== null;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _handleFormSubmit(point) {
    this._changeData(UserAction.ADD_POINT, UpdateType.MAJOR, Object.assign({
      id: Random.generateId()
    }, point));

    this.destroy();
  }
}
