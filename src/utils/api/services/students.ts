import API from "../config";

async function getAllStudentsByYear(year: string) {
  return await API.get("/students", { params: { year } });
}

const studentServices = {
  getAllStudentsByYear,
};

export default studentServices;
