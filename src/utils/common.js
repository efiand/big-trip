import {NUMERAL_SYSTEM_BASE} from '../const';

export default class Utils {
  // Делает первую букву заглавной
  static capitalize(str) {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
  }

  // Перемешивает массив по алгоритму Фишера—Йетса.
  static shuffle(array) {
    const resultArray = array.slice();
    for (let i = resultArray.length - 1; i > 0; i--) {
      const randomNumber = Math.floor(Math.random() * (i + 1));
      [resultArray[randomNumber], resultArray[i]] = [resultArray[i], resultArray[randomNumber]];
    }

    return resultArray;
  }

  // Выводит число с ведущим нулём
  static formatWithLead0(num) {
    return `${num < NUMERAL_SYSTEM_BASE ? 0 : ``}${num}`;
  }

  // Обновляет элемент массива
  static updateItem(list, update) {
    const i = list.findIndex((item) => item.id === update.id);

    if (i === -1) {
      return list;
    }

    return [...list.slice(0, i), update, ...list.slice(i + 1)];
  }
}
