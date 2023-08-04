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

async function deleteFaculty(id: string) {
  const response = await API.delete<IResponse>(`/faculties`, {
    params: {
      id,
    },
  });
  return response.data;
}

async function updateFaculty(id: string, data: any) {
  const response = await API.put<IResponse>(`/faculties/`, data, {
    params: {
      id,
    },
  });
  return response.data;
}

const facultiesServices = {
  getAllFaculties,
  addNewFacultyMultiple,
  addNewFaculty,
  deleteFaculty,
  updateFaculty,
};

export default facultiesServices;
