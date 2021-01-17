// Исходные данные для всего приложения, межкомпонентные

export const NUMERAL_SYSTEM_BASE = 10;

export const FilterType = {
  DEFAULT: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const SortType = {
  DEFAULT: `day`,
  POINT: `point`,
  DURATION: `time`,
  PRICE: `price`,
  OFFER: `offer`
};

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  AFTEREND: `afterend`,
  BEFOREBEGIN: `beforebegin`,
  BEFOREEND: `beforeend`
};

export const UserAction = {
  UPDATE_POINT: `UPDATE_POINT`,
  ADD_POINT: `ADD_POINT`,
  DELETE_POINT: `DELETE_POINT`
};

export const UpdateType = {
  PATCH: `PATCH`, // обновить часть списка, когда точка изменена
  MINOR: `MINOR`, // обновить список, когда точки отсортированы или отфильтрованы
  MAJOR: `MAJOR` // обновить весь экран - когда точка добавлена или удалена
};
