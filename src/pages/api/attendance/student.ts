import type { NextApiRequest, NextApiResponse } from "next";
import { database } from "@/utils/auth/firebase";
import {
  collection,
  getDoc,
  doc,
  query,
  getDocs,
  where,
} from "firebase/firestore";

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
  studentId?: string; // DE19XXX
  studentIds?: string[]; // [DE191XX, DE192XX]
  status?: "present" | "absent";
};

async function getStudentAttendanceByMonth(
  year: string,
  subjectCode: string,
  studentId: string,
  month: number
) {
  const collectionRef = collection(database, "attendance", year, subjectCode);
  const monthStart = new Date(Number(year), month, 1);
  const monthEnd = new Date(Number(year), month + 1, 1);
  const q = query(
    collectionRef,
    where("attendanceDate", ">=", monthStart.getMilliseconds()),
    where("attendanceDate", "<", monthEnd.getMilliseconds()),
    where("present", "array-contains", studentId)
  );
  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map((doc) => doc.data());
  return data;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    if (req.method !== "GET") {
      res.status(405).json({ status: "error", error: "Method not allowed" });
    }
    const { year, subjectCode, studentId, month } = req.query;

    const data = await getStudentAttendanceByMonth(
      year as string,
      subjectCode as string,
      studentId as string,
      Number(month)
    );
    res.status(200).json({ status: "success", data });
  } catch (error: any) {
    console.log("ERROR_IN_ATTENDANCE", error);
    res.status(500).json({ status: "error", error: error.message });
  }
}
