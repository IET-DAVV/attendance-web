import { ITimeTableData } from "@/utils/interfaces";
import API from "../config";

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
  createTimeTable,
};

export default timeTableServices;
