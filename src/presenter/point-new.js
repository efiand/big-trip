import PointEditView from '../view/point-edit';
import {Render} from '../utils';
import {RenderPosition, UserAction, UpdateType} from '../const';

export default class PointNewPresenter {
  constructor(listContainer, changeData, pointsModel) {
    this._listContainer = listContainer;
    this._changeData = changeData;
    this._pointsModel = pointsModel;
    this._pointEditComponent = null;
    this._destroyCallback = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
  }

  destroy() {
    if (this._pointEditComponent === null) {
      return;
    }

    Render.remove(this._pointEditComponent);
    this._pointEditComponent = null;

    if (this._destroyCallback) {
      this._destroyCallback(this._pointEditComponent);
    }

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  init(callback) {
    if (this._pointEditComponent !== null) {
      return;
    }

    const {getDefaultPoint, pointTypes, destinations} = this._pointsModel;
    this._pointEditComponent = new PointEditView(getDefaultPoint(), pointTypes, destinations);
    this._destroyCallback = callback;

    this._pointEditComponent.setSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setDeleteHandler(this._handleDeleteClick);

    Render.render(this._listContainer, this._pointEditComponent, RenderPosition.AFTERBEGIN);

    callback(this._pointEditComponent);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  setAborting() {
    const resetFormState = () => {
      this._pointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this._pointEditComponent.shake(resetFormState);
  }

  setSaving() {
    this._pointEditComponent.updateData({
      isDisabled: true,
      isSaving: true
    });
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
    this._changeData(UserAction.ADD_POINT, UpdateType.MAJOR, Object.assign({}, point));
  }
}
