import API from "../config";

//added classId
async function getDetainedStudents(
  academicSession: string,
  subjectCode: string,
  classId: string
) {
  return await API.get("/detained", {
    params: { academicSession, subjectCode, classId },
  });
}

async function detainStudentFromExam(
  academicSession: string,
  subjectCode: string,
  classId: string,
  exam: string,
  studentId: string
) {
  return await API.post("/detained", {
    academicSession,
    subjectCode,
    classId,
    exam,
    studentId,
  });
}

async function detainStudentFromExamMultiple(
  academicSession: string,
  subjectCode: string,
  classId: string,
  exam: string,
  studentIds: string[]
) {
  return await API.post("/detained", {
    academicSession,
    subjectCode,
    classId,
    exam,
    studentIds,
  });
}

//added classId
async function getAttendanceBySubjectAndDate(
  academicSession: string,
  subjectCode: string,
  attendanceDate: string,
  classId: string
) {
  return await API.get("/attendance", {
    params: { subjectCode, attendanceDate, academicSession, classId },
  });
}

//added classID
async function markStudentAttendance(
  academicSession: string,
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
    academicSession,
    classId,
  });
}

//added classID
async function markStudentAttendanceMultiple(
  academicSession: string,
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
    academicSession,
    classId,
  });
}

async function getStudentAttendanceByMonth(
  academicSession: string,
  subjectCode: string,
  studentId: string,
  month: number
) {
  return await API.get("/attendance/student", {
    params: { academicSession, subjectCode, studentId, month },
  });
}

//added classId
async function getStudentAttendanceOnDate(
  academicSession: string,
  attendanceDate: string,
  studentId: string,
  classID: string,
  subjectCode?: string
) {
  return await API.get("/attendance/date", {
    params: {
      attendanceDate,
      studentId,
      subjectCode,
      academicSession,
      classID,
    },
  });
}

async function getStudentDetainedInSubjects(
  academicSession: string,
  studentId: string
) {
  return await API.get("/detained/student", {
    params: { academicSession, studentId },
  });
}

async function getIsStudentDetainedInSubject(
  academicSession: string,
  subjectCode: string,
  exam: string,
  studentId: string
) {
  return await API.get("/detained/student", {
    params: { academicSession, subjectCode, exam, studentId },
  });
}

async function getStudentsAttendanceInDateRange(
  academicSession: string,
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
    params: { academicSession, ...dateRange, subjectCode, studentId, classId },
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
  detainStudentFromExamMultiple,
};

export default attendanceServices;
