import type { NextApiRequest, NextApiResponse } from "next";
import { database } from "@/utils/auth/firebase";
import { collection, getDoc, doc, updateDoc } from "firebase/firestore";

type Response = {
  status: "success" | "error";
  data?: Data;
  error?: string;
  message?: string;
};

type Data = {
  present: string[]; // Student IDs (Enrollment No.s)
  absent: string[];
};

type RequestData = {
  year: string; // 2023
  subjectCode: string; // CER4C2
  attendanceDate: string; // 19_02_2023 (DD_MM_YYYY)
};

async function getAttendance(
  year: string,
  subjectCode: string,
  attendanceDate: string
) {
  const collectionRef = collection(database, "attendance", year, subjectCode);
  const docRef = doc(collectionRef, attendanceDate);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    console.log("No such document!");
    return { present: [], absent: [] };
  }
  const { present, absent } = snapshot.data();

  return { present, absent };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.method === "GET") {
    const { year, subjectCode, attendanceDate } = req.query as RequestData;
    const { present, absent } = await getAttendance(
      year,
      subjectCode,
      attendanceDate
    );
    res.status(200).json({ status: "success", data: { present, absent } });
  }
}
