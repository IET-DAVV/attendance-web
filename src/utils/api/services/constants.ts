import API from "../config";

async function addNewBranchMultiple(data: any) {
  return await API.post("/constants/add-branch", data);
}

async function getAllBranches() {
  return await API.get("/constants/branches");
}

const constantsServices = {
  addNewBranchMultiple,
  getAllBranches,
};

export default constantsServices;
