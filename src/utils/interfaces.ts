export interface IResponse {
  status: string;
  data?: any;
  message?: string;
}

export interface IUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  disabled: boolean;
}

export interface IStudent {
  branchID: string;
  email: string;
  enrollmentID: string;
  enrollmentYear: number;
  name: string;
  phone?: string;
  rollID: string;
  section: string | null;
}

export interface IStudentAttendance extends IStudent {
  attendance: {
    [key: string]: "Present" | "Absent" | "NA";
  };
}

export interface ISubject {
  subjectCode: string;
  subjectName: string;
  sem: number;
  course?: string;
  branchID?: string;
}

export interface ICurrentClassInfo {
  id: string;
  year: number;
  branch: string;
  section: string;
  sem: number;
  subjectCode: string;
}

export interface IBranch {
  branchID: string;
  branchName: string;
  course: string;
  subjects: {
    [key: string]: ISubject;
  };
}

export interface IFaculty {
  id: string;
  branchID: string;
  designation: string;
  email: string;
  facultyType: string;
  name: string;
}

export interface AcademicSession {
  id: string;
  academicSession: string;
  createdAt: number;
  modifiedAt: number;
}

export interface IClass {
  id: string;
  createdAt: number;
  modifiedAt: number;
}
