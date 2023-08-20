import { getTableFilters } from "./functions";

export const FIREBASE_COLLECTIONS = {
  STUDENTS: "students",
  ATTENDANCE: "attendance",
  CONSTANTS: "constants",
  BRANCHES: "branches",
  SEMESTERS: "semesters",
  SUBJECTS: "subjects",
  TIME_TABLE: "timetable",
};

export const BRANCHES = ["IT", "CS", "EI", "ME", "AS", "ETC", "CIV"];

export const BRANCH_TABLE_FILTER: any = getTableFilters(
  BRANCHES?.map((branch) => ({
    text: branch,
    value: branch,
  })),
  "branchID"
);
export const EXAM_TABLE_FILTER: any = getTableFilters(
  ["MST1", "MST2", "MST3", "ENDSEM"].map((exam) => ({
    text: exam,
    value: exam,
  })),
  "detainedIn"
);
export const DESIGNATION_TABLE_FILTER: any = getTableFilters(
  ["Lecturer", "Professor"].map((des) => ({
    text: des,
    value: des,
  })),
  "designation"
);
export const FACULTY_TYPE_TABLE_FILTER: any = getTableFilters(
  ["Regular", "Guest"].map((des) => ({
    text: des,
    value: des,
  })),
  "facultyType"
);

export const SECTION_TABLE_FILTER: any = getTableFilters(
  ["A", "B"].map((section) => ({
    text: section,
    value: section,
  })),
  "section"
);
