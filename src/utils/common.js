import {NUMERAL_SYSTEM_BASE} from '../const';

export default class Utils {
  // Делает первую букву заглавной
  static capitalize(str) {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
  }

  // Выводит число с ведущим нулём
  static formatWithLead0(num) {
    return `${num < NUMERAL_SYSTEM_BASE ? 0 : ``}${num}`;
  }

  static cloneDeep(data) {
    return JSON.parse(JSON.stringify(data));
  }
}
