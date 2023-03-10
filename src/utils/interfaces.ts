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
  branchCode?: string;
}

export interface ICurrentClassInfo {
  year: number;
  branch: string;
  section: string;
  sem: number;
  subjectCode: string;
}
