import API from "../config";

async function getAllStudentsByYear(year: number) {
  return await API.get("/students", { params: { year } });
}

async function getAllStudentsByYearAndBranch(year: number, branch: string) {
  return await API.get("/students/branch", { params: { year, branch } });
}

async function addNewStudentsMultiple(data: any) {
  return await API.post("/students/add-new", data);
}

const studentServices = {
  getAllStudentsByYear,
  addNewStudentsMultiple,
  getAllStudentsByYearAndBranch,
};

export default studentServices;
