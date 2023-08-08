import API from "../config";

async function addNewBranchMultiple(data: any) {
  return await API.post("/constants/add-branch", data);
}

async function getAllBranches() {
  return await API.get("/constants/branches");
}
async function getAllAcademicSession() {
  return await API.get("/constants/academicSession");
}
async function addNewAcademicSession(session: string) {
  return await API.post("/constants/add-academicSession", {
    session,
  });
}
async function deleteAcademicSession(session: string) {
  return await API.delete("/constants/academicSession/", {
    params: {
      session,
    },
  });
}
async function updateAcademicSession(data: any) {
  return await API.put("/constants/academicSession/", {
    id: data.academicSession,
    data: data,
  });
}
async function addNewClass(data: any) {
  return await API.post("/constants/add-class", data);
}
async function getAllClasses() {
  return await API.get("/constants/classes");
}

const constantsServices = {
  addNewAcademicSession,
  getAllAcademicSession,
  addNewBranchMultiple,
  getAllBranches,
  deleteAcademicSession,
  updateAcademicSession,
  addNewClass,
  getAllClasses,
};

export default constantsServices;
