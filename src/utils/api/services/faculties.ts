import { IFaculty, IResponse } from "@/utils/interfaces";
import API from "../config";

async function getAllFaculties() {
  return await API.get<IResponse>("/faculties");
}

async function addNewFaculty(data: IFaculty) {
  return await API.post<IResponse>("/faculties/add-new", [data]);
}

async function addNewFacultyMultiple(data: Array<IFaculty>) {
  return await API.post<IResponse>("/faculties/add-new", data);
}

const facultiesServices = {
  getAllFaculties,
  addNewFacultyMultiple,
  addNewFaculty,
};

export default facultiesServices;
