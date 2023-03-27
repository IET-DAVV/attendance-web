import API from "../config";

//added classId
async function getDetainedStudents(
  academicYear: string,
  subjectCode: string,
  classId: string
) {
  return await API.get("/detained", {
    params: { academicYear, subjectCode, classId },
  });
}

async function detainStudentFromExam(
  academicYear: string,
  subjectCode: string,
  exam: string,
  studentId: string
) {
  return await API.post("/detained", {
    academicYear,
    subjectCode,
    exam,
    studentId,
  });
}

//added classId
async function getAttendanceBySubjectAndDate(
  academicYear: string,
  subjectCode: string,
  attendanceDate: string,
  classId: string
) {
  return await API.get("/attendance", {
    params: { subjectCode, attendanceDate, academicYear, classId },
  });
}

//added classID
async function markStudentAttendance(
  academicYear: string,
  subjectCode: string,
  attendanceDate: string,
  studentId: string,
  status: "present" | "absent",
  classId: string
) {
  return await API.post("/attendance", {
    subjectCode,
    attendanceDate,
    studentId,
    status,
    academicYear,
    classId,
  });
}

//added classID
async function markStudentAttendanceMultiple(
  academicYear: string,
  subjectCode: string,
  attendanceDate: string,
  studentIds: string[],
  status: "present" | "absent",
  classId: string
) {
  return await API.post("/attendance", {
    subjectCode,
    attendanceDate,
    studentIds,
    status,
    academicYear,
    classId,
  });
}

async function getStudentAttendanceByMonth(
  academicYear: string,
  subjectCode: string,
  studentId: string,
  month: number
) {
  return await API.get("/attendance/student", {
    params: { academicYear, subjectCode, studentId, month },
  });
}

//added classId
async function getStudentAttendanceOnDate(
  academicYear: string,
  attendanceDate: string,
  studentId: string,
  classID: string,
  subjectCode?: string
) {
  return await API.get("/attendance/date", {
    params: { attendanceDate, studentId, subjectCode, academicYear, classID },
  });
}

async function getStudentDetainedInSubjects(
  academicYear: string,
  studentId: string
) {
  return await API.get("/detained/student", {
    params: { academicYear, studentId },
  });
}

async function getIsStudentDetainedInSubject(
  academicYear: string,
  subjectCode: string,
  exam: string,
  studentId: string
) {
  return await API.get("/detained/student", {
    params: { academicYear, subjectCode, exam, studentId },
  });
}

async function getStudentsAttendanceInDateRange(
  academicYear: string,
  dateRange: {
    startDate: number;
    endDate: number;
  },
  subjectCode: string,
  classId: string,
  studentId?: string
) {
  if (!dateRange.startDate || !dateRange.endDate)
    throw new Error("Invalid date range");
  return await API.get("/attendance/date/range", {
    params: { academicYear, ...dateRange, subjectCode, studentId, classId },
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
