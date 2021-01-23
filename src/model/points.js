import {Observer} from '../utils';

export default class PointsModel extends Observer {
  constructor() {
    super();

    this._points = [];
  }

  get _notice() {
    return {
      points: this._points
    };
  }

  addPoint(updateType, update) {
    this._points = [update, ...this._points];

    this._notify(updateType, update, this._notice);
  }

  deletePoint(updateType, update) {
    const i = this._findUpdateIndex(update, `delete`);

    this._points = [
      ...this._points.slice(0, i),
      ...this._points.slice(i + 1)
    ];

    this._notify(updateType, update, this._notice);
  }

  getPoints() {
    return this._points;
  }

  setPoints(points) {
    this._points = points.slice();
  }

  updatePoint(updateType, update) {
    const i = this._findUpdateIndex(update);

    this._points = [
      ...this._points.slice(0, i),
      update,
      ...this._points.slice(i + 1)
    ];

    this._notify(updateType, update, this._notice);
  }

  _findUpdateIndex(update, mode = `update`) {
    const i = this._points.findIndex((point) => point.id === update.id);

    if (i === -1) {
      throw new Error(`Can't ${mode} unexisting point`);
    }

    return i;
  }
}
