export function formDateDDMMYYYY(date: any) {
  const tempDate = new Date(date);
  console.log(tempDate, date);
  return `${tempDate.getDate()}_${
    tempDate.getMonth() + 1
  }_${tempDate.getFullYear()}`;
}

export function formatFirebaseDateDDMMYYYY(date: {
  nanoSeconds: number;
  seconds: number;
}) {
  const tempDate = new Date(date?.seconds * 1000);
  return `${tempDate.getDate()}_${
    tempDate.getMonth() + 1
  }_${tempDate.getFullYear()}`;
}

export function getYear(
  date: string | number | Date
): string | number | undefined {
  if (date instanceof Date) {
    return date.getFullYear();
  }
  if (typeof date === "string") {
    return date.split("_")[2];
  }
  if (typeof date === "number") {
    return new Date(date).getFullYear();
  }
}

export function getToday12AMDatetime() {
  const today = new Date();
  // reset time to 12am
  today.setHours(0, 0, 0, 0);
  return today.getTime();
}

export function getTotalDaysCountInCurrentMonth() {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
}

export function getCurrentWeekDates() {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  const currentWeekDates = [];
  for (let i = 1; i < 7; i++) {
    const date = new Date();
    // reset time to 12am
    date.setHours(0, 0, 0, 0);
    date.setDate(currentDate.getDate() - currentDay + i);
    currentWeekDates.push(date);
  }
  return currentWeekDates;
}

export function getDateDayMonthYear(date: Date | string | number) {
  const tempDate = new Date(date);
  return {
    date: tempDate.getDate(),
    day: tempDate.toLocaleString("default", { weekday: "short" }),
    month: tempDate.toLocaleString("default", { month: "short" }),
    year: tempDate.getFullYear(),
  };
}
