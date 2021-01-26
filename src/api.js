import PointsModel from './model/points';
import {Utils} from './utils';

const Method = {
  GET: `GET`,
  POST: `POST`
};

const SuccessStatusRange = {
  MIN: 200,
  MAX: 299
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getData() {
    return Promise.all([
      this._load({url: `points`}),
      this._load({url: `offers`}),
      this._load({url: `destinations`})
    ])
      .then((responses) => Promise.all(responses.map(Api.toJSON)))
      .then(([points, offers, destinations]) => {
        const pointTypes = offers.map((pointType) => {
          pointType.offers.forEach((offer) => {
            offer.isChecked = false;
          });
          return pointType;
        });

        return {
          points: points.map((point) => PointsModel.adaptToClient(point, Utils.cloneDeep(pointTypes))),
          pointTypes,
          destinations
        };
      })
      .catch(Api.catchError);
  }

  updatePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(PointsModel.adaptToServer(point)),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(Api.toJSON)
      .then();
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
