import type { NextApiRequest, NextApiResponse } from "next";
import { database } from "@/utils/auth/firebase";
import {
  collection,
  getDoc,
  doc,
  where,
  query,
  getDocs,
  or,
} from "firebase/firestore";
import { Day, ITimeTable } from "@/utils/interfaces";
import { FIREBASE_COLLECTIONS } from "@/utils/constants";
import { getAllFaculties } from "../faculties";

type Response = {
  status: "success" | "error";
  data?: any;
  error?: string;
  message?: string;
};

type RequestData = {
  academicSession: string;
  facultyId: string;
  day: Day;
};

async function getTimeTableForDay(
  academicSession: string,
  facultyId: string,
  day: Day
) {
  const collectionRef = collection(
    database,
    FIREBASE_COLLECTIONS.TIME_TABLE,
    academicSession,
    "classes"
  );
  const queryKeyList = [
    "7-8",
    "8-9",
    "9-10",
    "10-11",
    "11-12",
    "12-1",
    "1-2",
    "2-3",
    "3-4",
    "4-5",
    "5-6",
  ].map((time) => `timeTable.${day}.${time}.faculty`);
  console.log(queryKeyList, facultyId);
  // union of all the time slots
  const queryRef = query(
    collectionRef,
    or(...queryKeyList.map((key) => where(key, "==", facultyId)))
  );
  const querySnap = await getDocs(queryRef);
  const data = querySnap.docs.map((doc) => doc.data());
  let finalData = [...data];
  for (let i = 0; i < data.length; i++) {
    const docData = data[i];
    const timeTable = docData.timeTable;
    for (const currDay in docData.timeTable) {
      if (currDay !== day) {
        delete timeTable[currDay];
        continue;
      }
      const dayData = docData.timeTable[currDay];
      for (const time in dayData) {
        const timeSlot = dayData[time];
        if (timeSlot.type === "break") {
          delete dayData[time];
          continue;
        }
      }
    }
  }
  return finalData;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    switch (req.method) {
      case "GET": {
        const { academicSession, facultyId, day } = req.query as RequestData;
        const data = await getTimeTableForDay(academicSession, facultyId, day);
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
  } catch (error: any) {
    console.log("ERR_FETCH_DETAINED", error);
    return res.status(500).json({
      status: "error",
      error,
    });
  }
}
