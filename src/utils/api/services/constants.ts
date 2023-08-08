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
async function addNewAcademicSession(data: any) {
  return await API.post("/constants/add-academicSession", {
    session: data,
  });
}
async function deleteAcademicSession(data: any) {
  return await API.delete("/constants/academicSession/", {
    params: {
      session: data,
    },
  });
}
async function updateAcademicSession(data: any) {
  return await API.put("/constants/academicSession/", {
    oldData: data.oldData,
    data: data.newData,
  });
}

const constantsServices = {
  addNewAcademicSession,
  getAllAcademicSession,
  addNewBranchMultiple,
  getAllBranches,
  deleteAcademicSession,
  updateAcademicSession,
};

export default constantsServices;
