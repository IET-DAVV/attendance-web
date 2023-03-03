import API from "../config";

async function getAllStudentsByYear(year: string) {
  return await API.get("/students", { params: { year } });
}

async function addNewStudentsMultiple(data: any) {
  return await API.post("/students/add-new", data);
}

const studentServices = {
  getAllStudentsByYear,
  addNewStudentsMultiple,
};

export default studentServices;
