import API from "../config";

async function getDetainedStudents(year: string | number, subjectCode: string) {
  return await API.get("/detained", {
    params: { year, subjectCode },
  });
}

async function detainStudentFromExam(
  year: string,
  subjectCode: string,
  exam: string,
  studentId: string
) {
  return await API.post("/detained", {
    year,
    subjectCode,
    exam,
    studentId,
  });
}

async function getAttendanceBySubjectAndDate(
  subjectCode: string,
  attendanceDate: string
) {
  return await API.get("/attendance", {
    params: { subjectCode, attendanceDate },
  });
}

async function markStudentAttendance(
  subjectCode: string,
  attendanceDate: string,
  studentId: string,
  status: "present" | "absent"
) {
  return await API.post("/attendance", {
    subjectCode,
    attendanceDate,
    studentId,
    status,
  });
}

async function markStudentAttendanceMultiple(
  subjectCode: string,
  attendanceDate: string,
  studentIds: string[],
  status: "present" | "absent"
) {
  return await API.post("/attendance", {
    subjectCode,
    attendanceDate,
    studentIds,
    status,
  });
}

async function getStudentAttendanceByMonth(
  year: string,
  subjectCode: string,
  studentId: string,
  month: number
) {
  return await API.get("/attendance/student", {
    params: { year, subjectCode, studentId, month },
  });
}

async function getStudentAttendanceOnDate(
  attendanceDate: string,
  studentId: string,
  subjectCode?: string
) {
  return await API.get("/attendance/date", {
    params: { attendanceDate, studentId, subjectCode },
  });
}

async function getStudentDetainedInSubjects(year: string, studentId: string) {
  return await API.get("/detained/student", {
    params: { year, studentId },
  });
}

async function getIsStudentDetainedInSubject(
  year: string,
  subjectCode: string,
  exam: string,
  studentId: string
) {
  return await API.get("/detained/student", {
    params: { year, subjectCode, exam, studentId },
  });
}

async function getStudentsAttendanceInDateRange(
  dateRange: {
    startDate: number;
    endDate: number;
  },
  subjectCode: string,
  studentId?: string
) {
  if (!dateRange.startDate || !dateRange.endDate)
    throw new Error("Invalid date range");
  return await API.get("/attendance/date/range", {
    params: { ...dateRange, subjectCode, studentId },
  });
}

const attendanceServices = {
  getDetainedStudents,
  detainStudentFromExam,
  getAttendanceBySubjectAndDate,
  markStudentAttendance,
  markStudentAttendanceMultiple,
  getStudentAttendanceByMonth,
  getStudentAttendanceOnDate,
  getStudentDetainedInSubjects,
  getIsStudentDetainedInSubject,
  getStudentsAttendanceInDateRange,
};

export default attendanceServices;
