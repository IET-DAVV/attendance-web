import type { NextApiRequest, NextApiResponse } from "next";
import { database } from "@/utils/auth/firebase";
import { collection, getDoc, doc, updateDoc, setDoc } from "firebase/firestore";
import { FIREBASE_COLLECTIONS } from "@/utils/constants";
import { ITimeTableData } from "@/utils/interfaces";

type Response = {
  status: "success" | "error";
  error?: string;
  message?: string;
};

export type RequestData = {
  academicSession: string; // 2024_2025_1
  classID: string; // 2021_CS_A
  timeTable: ITimeTableData;
};

async function createTimeTable(data: RequestData) {
  const { academicSession, classID, timeTable } = data;
  const collectionRef = collection(database, FIREBASE_COLLECTIONS.TIME_TABLE);
  const docRef = doc(collectionRef, academicSession);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    await setDoc(docRef, {
      academicSession,
    });
  }
  const innerCollectionRef = collection(docRef, "classes");
  const innerDocRef = doc(innerCollectionRef, classID);
  await setDoc(innerDocRef, {
    academicSession,
    classID,
    timeTable,
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    switch (req.method) {
      case "POST": {
        const data = req.body as RequestData;
        await createTimeTable(data);
        return res.status(200).json({
          status: "success",
        });
      }
      default:
        return res.status(405).end();
    }
  } catch (error: any) {
    console.log("ERR_CREATE_TIME_TABLE", error);
    return res.status(500).json({
      status: "error",
      error,
    });
  }
}
