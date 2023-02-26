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
  year: string | number,
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
  year: string,
  subjectCode: string,
  attendanceDate: string
) {
  return await API.get("/attendance", {
    params: { year, subjectCode, attendanceDate },
  });
}
