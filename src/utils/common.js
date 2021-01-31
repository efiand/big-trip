import {NUMERAL_SYSTEM_BASE} from '../const';
import './toast.css';

const SHOW_TIME = 5000;

const toastContainer = document.createElement(`div`);
toastContainer.classList.add(`toast-container`);
document.body.append(toastContainer);

export default class Utils {
  // Делает первую букву заглавной
  static capitalize(str) {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
  }

  static cloneData(data) {
    return JSON.parse(JSON.stringify(data));
  }

  // Выводит число с ведущим нулём
  static formatWithLead0(num) {
    return `${num < NUMERAL_SYSTEM_BASE ? 0 : ``}${num}`;
  }

  static isOnline() {
    return window.navigator.onLine;
  }

  static toast(message) {
    const toastItem = document.createElement(`div`);
    toastItem.textContent = message;
    toastItem.classList.add(`toast-item`);

    toastContainer.append(toastItem);

    setTimeout(() => {
      toastItem.remove();
    }, SHOW_TIME);
  }
}
