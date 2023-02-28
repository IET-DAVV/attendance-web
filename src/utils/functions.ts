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
  today.setHours(0, 0, 0, 0);
  return today.getTime();
}
