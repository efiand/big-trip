import PointsModel from '../model/points-model';
import {Utils} from '../utils';

const Method = {
  DELETE: `DELETE`,
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`
};

const SuccessStatusRange = {
  MIN: 200,
  MAX: 299
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
    this._pointTypes = [];

    this.getPoints = this.getPoints.bind(this);
  }

  addPoint(point) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(PointsModel.adaptToServer(point, true)),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(Api.toJSON)
      .then((res) => PointsModel.adaptToClient(res, Utils.cloneData(this._pointTypes)))
      .catch(Api.catchError);
  }

  deletePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: Method.DELETE
    });
  }

  getAssets() {
    return Promise.all([
      this._load({url: `offers`}),
      this._load({url: `destinations`})
    ])
      .then((responses) => Promise.all(responses.map(Api.toJSON)))
      .then(([offers, destinations]) => {
        const pointTypes = offers.map((pointType) => {
          pointType.offers.forEach((offer) => {
            offer.isChecked = false;
          });
          return pointType;
        });
        this._pointTypes = Utils.cloneData(pointTypes);

        return {
          pointTypes: this._pointTypes,
          destinations
        };
      })
      .catch((err) => err);
  }

  getPoints() {
    return this._load({url: `points`})
      .then(Api.toJSON)
      .then((points) => {
        return points.map((point) => {
          return PointsModel.adaptToClient(point, Utils.cloneData(this._pointTypes));
        });
      })
      .catch(Api.catchError);
  }

  sync(data) {
    return this._load({
      url: `points/sync`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(Api.toJSON)
      .catch((err) => err);
  }

  updatePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(PointsModel.adaptToServer(point)),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(Api.toJSON)
      .then((res) => PointsModel.adaptToClient(res, Utils.cloneData(this._pointTypes)))
      .catch(Api.catchError);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(res) {
    const {status, statusText} = res;

    if (status < SuccessStatusRange.MIN || status > SuccessStatusRange.MAX) {
      throw new Error(`${status}: ${statusText}`);
    }

    return res;
  }

  static toJSON(res) {
    return res.json();
  }

  static catchError(err) {
    throw err;
  }
}
