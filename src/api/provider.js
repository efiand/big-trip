import PointsModel from '../model/points-model';
import {Utils} from '../utils';

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isNotSync = false;
  }

  get isNotSync() {
    return this._isNotSync;
  }

  addPoint(point) {
    if (Utils.isOnline()) {
      return this._api.addPoint(point)
        .then((newPoint) => {
          this._store.setItem(newPoint.id, PointsModel.adaptToServer(newPoint));
          return newPoint;
        });
    }

    return Promise.reject(new Error(`Add point failed`));
  }

  deletePoint(point) {
    if (Utils.isOnline()) {
      return this._api.deletePoint(point)
        .then(() => this._store.removeItem(point.id));
    }

    return Promise.reject(new Error(`Delete point failed`));
  }

  getAssets() {
    if (Utils.isOnline()) {
      return this._api.getAssets()
        .then((assets) => {
          if (assets.pointTypes) {
            this._store.setItems(assets);
          }
          return assets;
        });
    }

    const {pointTypes, destinations} = this._store.getItems();
    return Promise.resolve({pointTypes, destinations});
  }

  getPoints() {
    if (Utils.isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const items = this._createStoreStructure(points.map((point) => {
            return PointsModel.adaptToServer(point);
          }));
          this._store.setItems(items);
          return points;
        });
    }

    const storePoints = Object.values(this._store.getPoints());
    const {pointTypes} = this._store.getItems();

    return Promise.resolve(storePoints.map((point) => {
      return PointsModel.adaptToClient(point, pointTypes);
    }));
  }

  sync() {
    if (Utils.isOnline()) {
      const storePoints = Object.values(this._store.getPoints());

      return this._api.sync(storePoints)
        .then((response) => {
          const items = this._createStoreStructure([
            ...Provider.getSyncedPoints(response.created),
            ...Provider.getSyncedPoints(response.updated)
          ]);

          this._store.setItems(items);
          this._isNotSync = false;
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  updatePoint(point) {
    if (Utils.isOnline()) {
      return this._api.updatePoint(point)
        .then((updatedPoint) => {
          this._store.setItem(updatedPoint.id, PointsModel.adaptToServer(updatedPoint));
          return updatedPoint;
        });
    }

    this._store.setItem(point.id, PointsModel.adaptToServer(Object.assign({}, point)));
    this._isNotSync = true;
    return Promise.resolve(point);
  }

  _createStoreStructure(items) {
    return items.reduce((acc, current) => {
      return Object.assign({}, acc, {
        [current.id]: current
      });
    }, this._store.getAssets());
  }

  static getSyncedPoints(items) {
    return items.filter(({success}) => success).map((item) => item.payload);
  }
}
