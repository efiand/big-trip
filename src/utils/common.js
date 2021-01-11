import {NUMERAL_SYSTEM_BASE} from '../const';

// Делает первую букву заглавной
export const capitalize = (str) => str.slice(0, 1).toUpperCase() + str.slice(1);

// Перемешивает массив по алгоритму Фишера—Йетса.
export const shuffle = (array) => {
  const resultArray = array.slice();
  for (let i = resultArray.length - 1; i > 0; i--) {
    const randomNumber = Math.floor(Math.random() * (i + 1));
    [resultArray[randomNumber], resultArray[i]] = [resultArray[i], resultArray[randomNumber]];
  }

  return resultArray;
};

// Выводит число с ведущим нулём
export const formatWithLead0 = (num) => `${num < NUMERAL_SYSTEM_BASE ? 0 : ``}${num}`;
