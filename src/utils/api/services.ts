import API from "./config";

export async function getUser(email: string) {
  return await API.get(`/users/${email}`);
}

export async function getDetainedStudents(
  year: string | number,
  subjectCode: string
) {
  return await API.get("/detained", {
    params: { year, subjectCode },
  });
}

export async function detainStudentFromExam(
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

export async function getAttendanceBySubjectAndDate(
  subjectCode: string,
  attendanceDate: string
) {
  return await API.get("/attendance", {
    params: { subjectCode, attendanceDate },
  });
}

export async function markStudentAttendance(
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

export async function markStudentAttendanceMultiple(
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

export async function getStudentAttendanceByMonth(
  year: string,
  subjectCode: string,
  studentId: string,
  month: number
) {
  return await API.get("/attendance/student", {
    params: { year, subjectCode, studentId, month },
  });
}

export async function getStudentAttendanceOnDate(
  attendanceDate: string,
  studentId: string,
  subjectCode?: string
) {
  return await API.get("/attendance/date", {
    params: { attendanceDate, studentId, subjectCode },
  });
}

export async function getStudentDetainedInSubjects(
  year: string,
  studentId: string
) {
  return await API.get("/detained/student", {
    params: { year, studentId },
  });
}

export async function getIsStudentDetainedInSubject(
  year: string,
  subjectCode: string,
  exam: string,
  studentId: string
) {
  return await API.get("/detained/student", {
    params: { year, subjectCode, exam, studentId },
  });
}
