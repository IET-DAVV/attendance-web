import API from "../config";

async function addNewBranchMultiple(data: any) {
  return await API.post("/constants/add-branch", data);
}

const studentServices = {
  addNewBranchMultiple,
};

export default studentServices;
