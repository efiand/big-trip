import {Utils} from '.';

export default class Random {
  static getInt(a = 0, b = 1) {
    const lower = Math.ceil(Math.min(a, b));
    const upper = Math.floor(Math.max(a, b));

    return Math.floor(lower + Math.random() * (upper - lower + 1));
  }

  static getItem(list) {
    const randomIndex = this.getInt(0, list.length - 1);

    return list[randomIndex];
  }

  static getItems(list, length = 0) {
    return Utils.shuffle(Array.from(list)).slice(0, length);
  }
}
