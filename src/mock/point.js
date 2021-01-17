import {Dates, Random} from '../utils';
import {POINT_TYPES, PRICE_RANGE, CITY_NAMES} from './const';
import {pointTypes} from './point-types';
import {destinations} from './destinations';

const DURATION_MIN = 10;
const DURATION_MAX = 60 * 24 * 6;
let tempTime = Dates.addMinutes(Random.getInt(-DURATION_MAX, DURATION_MAX));

export const generatePoint = () => {
  // Начало следующего мероприятия совпадает с окончанием ранее сгенерированного
  // Поэтому сохраняем значение из счетчика времени
  const startTime = tempTime.toISOString();

  // Добавляем к счетчику времени случайную продолжительность
  tempTime = Dates.addMinutes(Random.getInt(DURATION_MIN, DURATION_MAX), tempTime);

  const typeName = Random.getItem(POINT_TYPES);
  const cityName = Random.getItem(CITY_NAMES);
  const type = JSON.parse(JSON.stringify(pointTypes.find(({name}) => name === typeName)));
  type.offers.forEach((offer) => {
    offer.isChecked = Boolean(Random.getInt());
  });

  return {
    id: Random.generateId(),
    type,
    destination: destinations.find(({city}) => city === cityName),
    startTime,
    endTime: tempTime.toISOString(),
    isFavorite: Boolean(Random.getInt()),
    price: Random.getInt(...PRICE_RANGE)
  };
};
