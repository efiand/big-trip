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
  const dateFrom = tempTime.toISOString();

  // Добавляем к счетчику времени случайную продолжительность
  tempTime = Dates.addMinutes(Random.getInt(DURATION_MIN, DURATION_MAX), tempTime);

  const typeName = Random.getItem(POINT_TYPES);
  const cityName = Random.getItem(CITY_NAMES);
  const pointType = JSON.parse(JSON.stringify(pointTypes.find(({type}) => type === typeName)));
  pointType.offers.forEach((offer) => {
    offer.isChecked = Boolean(Random.getInt());
  });

  return {
    id: Random.generateId(),
    pointType,
    destination: destinations.find(({name}) => name === cityName),
    dateFrom,
    dateTo: tempTime.toISOString(),
    isFavorite: Boolean(Random.getInt()),
    basePrice: Random.getInt(...PRICE_RANGE)
  };
};
