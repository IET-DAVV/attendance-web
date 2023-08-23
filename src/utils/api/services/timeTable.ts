import { ITimeTableData } from "@/utils/interfaces";
import API from "../config";

async function getTimeTable(academicSession: string, classID: string) {
  return await API.get("/time-table", {
    params: {
      academicSession,
      classID,
    },
  });
}

async function createTimeTable(
  academicSession: string,
  classID: string,
  timeTable: ITimeTableData
) {
  return await API.post("/time-table/add-new", {
    academicSession,
    classID,
    timeTable,
  });
}

const timeTableServices = {
  getTimeTable,
  createTimeTable,
};

export default timeTableServices;
