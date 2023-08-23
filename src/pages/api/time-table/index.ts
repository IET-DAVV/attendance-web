import type { NextApiRequest, NextApiResponse } from "next";
import { database } from "@/utils/auth/firebase";
import { collection, getDoc, doc } from "firebase/firestore";
import { ITimeTable } from "@/utils/interfaces";
import { FIREBASE_COLLECTIONS } from "@/utils/constants";
import { getAllFaculties } from "../faculties";

type Response = {
  status: "success" | "error";
  data?: ITimeTable;
  error?: string;
  message?: string;
};

type RequestData = {
  academicSession: string;
  classID: string;
};

async function getTimeTable(academicSession: string, classID: string) {
  const collectionRef = collection(
    database,
    FIREBASE_COLLECTIONS.TIME_TABLE,
    academicSession,
    "classes"
  );
  const docRef = doc(collectionRef, classID);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return false;
  }
  /**
   * Right now we are fetching all faculties using the function
   * TODO: Fetch using an internal API call to /api/faculties
   */
  const facultiesList = await getAllFaculties();
  const docData = docSnap.data() as ITimeTable;
  const timeTable = docData.timeTable;
  for (const day in docData.timeTable) {
    const dayData = docData.timeTable[day];
    for (const time in dayData) {
      const timeSlot = dayData[time];
      timeSlot.faculty = facultiesList.find(
        (faculty) => faculty.id === timeSlot.faculty
      );
      timeTable[day][time] = timeSlot;
    }
  }

  return {
    ...docData,
    timeTable,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    switch (req.method) {
      case "GET": {
        const { academicSession, classID } = req.query as RequestData;
        const data = await getTimeTable(academicSession, classID);
        if (!data) {
          return res.status(404).json({
            status: "error",
            message: "Time-Table not found",
          });
        }
        return res.status(200).json({
          status: "success",
          data,
        });
      }
      default:
        return res.status(405).end();
    }
  } catch (error) {
    console.log("ERR_FETCH_DETAINED", error);
  }
}
