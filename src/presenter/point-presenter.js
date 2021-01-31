import PointView from '../view/point-view';
import PointEditView from '../view/point-edit-view';
import {Dates, Render, Utils} from '../utils';
import {UserAction, UpdateType} from '../const';

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`
};

export default class PointPresenter {
  constructor(pointsListContainer, changeData, changeMode, pointsModel) {
    this._pointsListContainer = pointsListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._pointsModel = pointsModel;

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
    const {pointTypes, destinations} = this._pointsModel;

    this._pointComponent = new PointView(point);
    this._pointEditComponent = new PointEditView(point, pointTypes, destinations);

    this._pointComponent.setEditClickHandler(this._handleEditClick);
    this._pointComponent.setFavClickHandler(this._handleFavClick);
    this._pointEditComponent.setSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setDeleteHandler(this._handleDeleteClick);
    this._pointEditComponent.setCloseHandler(this._handleCloseClick);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      Render.render(this._pointsListContainer, this._pointComponent);
      return;
    }

    switch (this._mode) {
      case Mode.DEFAULT:
        Render.replace(this._pointComponent, prevPointComponent);
        break;
      case Mode.EDITING:
        Render.replace(this._pointComponent, prevPointEditComponent);
        this._mode = Mode.DEFAULT;
        break;
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

  setViewState(state) {
    const resetFormState = () => {
      this._pointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    switch (state) {
      case State.SAVING:
        this._pointEditComponent.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;
      case State.DELETING:
        this._pointEditComponent.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;
      case State.ABORTING:
        this._pointComponent.shake(resetFormState);
        this._pointEditComponent.shake(resetFormState);
        break;
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
    if (!Utils.isOnline()) {
      Utils.toast(`You can't delete point offline`);
      return;
    }

    this._changeData(UserAction.DELETE_POINT, UpdateType.MAJOR, this._point);
  }

  _handleEditClick() {
    if (!Utils.isOnline()) {
      Utils.toast(`You can't edit point offline`);
      return;
    }

    this._switchToEdit();
  }

  _handleFavClick() {
    const updatedPoint = Object.assign({}, this._point, {isFavorite: !this._point.isFavorite});
    this._changeData(UserAction.UPDATE_POINT, UpdateType.PATCH, updatedPoint);
  }

  _handleFormSubmit(update) {
    if (!Utils.isOnline()) {
      Utils.toast(`You can't save point offline`);
      return;
    }

    // Проверяем, изменились ли данные, которые попадают под фильтрацию
    const isUpdatedDateFrom = !Dates.isEqual(this._point.dateFrom, update.dateFrom);
    const isUpdatedDateTo = !Dates.isEqual(this._point.dateFrom, update.dateTo);
    const updateType = isUpdatedDateFrom || isUpdatedDateTo ? UpdateType.MINOR : UpdateType.PATCH;

    this._changeData(UserAction.UPDATE_POINT, updateType, update);
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
