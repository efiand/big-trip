import PointView from '../view/point';
import PointEditView from '../view/point-edit';
import {Render} from '../utils';

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class PointPresenter {
  constructor(pointsListContainer, changeData, changeMode) {
    this._pointsListContainer = pointsListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._pointEditComponent = null;
    this._pointData = {};
    this._mode = Mode.DEFAULT;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFavClick = this._handleFavClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(pointData) {
    this._pointData = pointData;

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointView(pointData);
    this._pointEditComponent = new PointEditView(pointData);

    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._pointComponent.setFavClickHandler(this._handleFavClick);
    this._pointEditComponent.setSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setDeleteHandler(this._handleDeleteClick);
    this._pointEditComponent.setCloseHandler(this._handleCloseClick);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      Render.render(this._pointsListContainer, this._pointComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      Render.replace(this._pointComponent, prevPointComponent);
    }
    if (this._mode === Mode.EDITING) {
      Render.replace(this._pointEditComponent, prevPointEditComponent);
    }

    Render.remove(prevPointComponent);
    Render.remove(prevPointEditComponent);
  }

  destroy() {
    Render.remove(this._pointComponent);
    Render.remove(this._pointEditComponent);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._switchToView();
    }
  }

  _handleCloseClick() {
    this._switchToView();
  }

  _handleDeleteClick() {
    this._switchToView();
  }

  _handleEditClick() {
    this._switchToEdit();
  }

  _handleFavClick() {
    this._changeData(Object.assign({}, this._pointData, {isFavorite: !this._pointData.isFavorite}));
  }

  _handleFormSubmit(pointData) {
    this._changeData(pointData);
    this._switchToView();
  }

  _handleDeleteClick() {
    this._switchToView();
  }

  _switchToEdit() {
    Render.replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _switchToView() {
    Render.replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._switchToView();
    }
  }
}
