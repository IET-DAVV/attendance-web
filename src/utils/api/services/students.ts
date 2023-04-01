import API from "../config";

async function getAllStudentsByYear(year: number) {
  return await API.get("/students", { params: { year } });
}

async function getAllStudentsByYearAndBranch(
  year: number,
  branch: string,
  section?: string
) {
  return await API.get("/students/branch", {
    params: { year, branch, section },
  });
}

async function addNewStudent(data: any) {
  return await API.post("/students/add-new", [data]);
}

async function addNewStudentsMultiple(data: any) {
  return await API.post("/students/add-new", data);
}

const studentServices = {
  getAllStudentsByYear,
  addNewStudentsMultiple,
  addNewStudent,
  getAllStudentsByYearAndBranch,
};

export default studentServices;
