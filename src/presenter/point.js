import PointView from '../view/point';
import PointEditView from '../view/point-edit';
import {Render, Dates} from '../utils';
import {UserAction, UpdateType} from '../const';

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
    this._point = {};
    this._mode = Mode.DEFAULT;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFavClick = this._handleFavClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointView(point);
    this._pointEditComponent = new PointEditView(point);

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
    } else if (this._mode === Mode.EDITING) {
      Render.replace(this._pointEditComponent, prevPointEditComponent);
    }

    Render.remove(prevPointComponent);
    Render.remove(prevPointEditComponent);
  }

  destroy() {
    Render.remove(this._pointComponent);
    Render.remove(this._pointEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._switchToView();
    }
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
    this._changeData(UserAction.DELETE_POINT, UpdateType.MAJOR, this._point);
  }

  _handleEditClick() {
    this._switchToEdit();
  }

  _handleFavClick() {
    const updatedPoint = Object.assign({}, this._point, {isFavorite: !this._point.isFavorite});
    this._changeData(UserAction.UPDATE_POINT, UpdateType.PATCH, updatedPoint);
  }

  _handleFormSubmit(update) {
    // Проверяем, изменились ли данные, которые попадают под фильтрацию
    const isUpdatedDateFrom = !Dates.isEqual(this._point.dateFrom, update.dateFrom);
    const isUpdatedDateTo = !Dates.isEqual(this._point.dateFrom, update.dateTo);
    const updateType = isUpdatedDateFrom || isUpdatedDateTo ? UpdateType.MINOR : UpdateType.PATCH;

    this._changeData(UserAction.UPDATE_POINT, updateType, update);
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
}
