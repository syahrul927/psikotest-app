import moment from "moment";
import "moment/locale/id";

export function fromNow(date: Date) {
  const formatted = moment(date);
  formatted.locale("id");
  return formatted.fromNow();
}

const padDate = (str: string | number) => {
  return String(str).padStart(2, "0");
};
export function formatDate(element: Date) {
  return `${padDate(element.getDate())}/${padDate(element.getMonth() + 1)}/${element.getFullYear()}`;
}

export function formatHour(element: Date) {
  return `${padDate(element.getHours())}:${padDate(element.getMinutes())}`;
}

export function localDate(date: Date) {
  const formatted = moment(date);
  formatted.locale("id");
  return formatted.format("LLLL");
}
