import dayjs from "dayjs";
import { ICurrentClassInfo, IStudentAttendance } from "./interfaces";

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

export function isBetweenDateRange(
  date: Date | string | number,
  startDate: Date | string | number,
  endDate: Date | string | number
) {
  const tempDate = new Date(date);
  const tempStartDate = new Date(startDate);
  const tempEndDate = new Date(endDate);
  return tempDate >= tempStartDate && tempDate <= tempEndDate;
}

export function separateAttendance(
  studentsAttendance: IStudentAttendance[],
  currentClassInfo: ICurrentClassInfo
) {
  const absentStudents = studentsAttendance.filter(
    (student: IStudentAttendance) =>
      student.attendance?.[getToday12AMDatetime()] === "Absent"
  );
  const presentStudents = studentsAttendance.filter(
    (student: IStudentAttendance) =>
      student.attendance?.[getToday12AMDatetime()] === "Present"
  );
  const attendanceData = {
    date: getToday12AMDatetime(),
    absentStudents,
    presentStudents,
    subjectCode: currentClassInfo?.subjectCode,
    classID: currentClassInfo?.id,
  };
  return attendanceData;
}

export function mapAttendanceValues(students: IStudentAttendance[]): any[] {
  const attendanceMap: any[] = [];

  if (!students.length) return attendanceMap;

  for (const student of students) {
    if (!student.attendance) continue;
    const attendanceDates = Object.keys(student.attendance);
    const attendanceValues = Object.values(student.attendance);
    const attendanceObj: any = {};

    for (let i = 0; i < attendanceDates.length; i++) {
      const { date, month, year } = getDateDayMonthYear(
        parseInt(attendanceDates[i])
      );
      attendanceObj[`${date}/${month}/${year}`] =
        attendanceValues[i] === "Absent"
          ? "A"
          : attendanceValues[i] === "Present"
          ? "P"
          : "NA";
    }

    attendanceMap.push({
      rollID: student.rollID,
      name: student.name,
      ...attendanceObj,
    });
  }

  return attendanceMap;
}

export function getTableFilters<T extends Record<string, string>>(
  options: Array<{
    text: string;
    value: string;
  }>,
  dataIndex: keyof T
) {
  return {
    filters: options,
    onFilter: (value: string, record: T) =>
      record?.[dataIndex].indexOf(value) === 0,
  };
}

export function getTableSorter<T extends Record<string, string>>(
  dataIndex: keyof T
) {
  return {
    sorter: (a: T, b: T) => a?.[dataIndex].localeCompare(b?.[dataIndex]),
  };
}

export function getInitials(name: string) {
  const nameParts = name.split(" ");
  const initials = nameParts.map((part) => part.charAt(0).toUpperCase());
  return initials.join("");
}

export function disabledFutureDate(current: dayjs.Dayjs) {
  // Do not allow dates greater than today's date
  return current && current > dayjs().endOf("day");
}

export function uniqueDatesOnly(columns: Array<any>) {
  const uniqueDates = new Set();
  const uniqueColumns = columns.filter((item) => {
    if (uniqueDates.has(item.date)) return false;
    uniqueDates.add(item.date);
    return true;
  });
  return uniqueColumns;
}
