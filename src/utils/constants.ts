import { getTableFilters } from "./functions";

export const FIREBASE_COLLECTIONS = {
  FACULTIES: "faculties",
  STUDENTS: "students",
  ATTENDANCE: "attendance",
  CONSTANTS: "constants",
  BRANCHES: "branches",
  SEMESTERS: "semesters",
  SUBJECTS: "subjects",
};

export const BRANCHES = ["IT", "CS", "EI", "ME", "AS", "ETC", "CIV"];

export const BRANCH_TABLE_FILTER: any = getTableFilters(
  BRANCHES?.map((branch) => ({
    text: branch,
    value: branch,
  })),
  "branchID"
);

export const SECTION_TABLE_FILTER: any = getTableFilters(
  ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].map((section) => ({
    text: section,
    value: section,
  })),
  "section"
);
