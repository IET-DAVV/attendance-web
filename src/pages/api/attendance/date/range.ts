import type { NextApiRequest, NextApiResponse } from "next";
import { database } from "@/utils/auth/firebase";
import {
  collection,
  getDoc,
  doc,
  query,
  getDocs,
  where,
  collectionGroup,
} from "firebase/firestore";
import { getYear } from "@/utils/functions";

type Response = {
  status: "success" | "error";
  data?: Data;
  error?: string;
  message?: string;
};

type Data = {
  presentStudentsList?: string[]; // Student IDs (Enrollment No.s)
  absentStudentsList?: string[];
  presentInSubjects?: string[];
  absentInSubjects?: string[];
  attendanceStatus?: "present" | "absent" | null;
  studentId?: string;
  attendanceDate?: number | null;
};

async function getStudentsAttendanceInDateRange(
  dateRange: {
    startDate: number;
    endDate: number;
  },
  subjectCode: string,
  studentId?: string
) {
  const year = getYear(dateRange.startDate) as string;
  console.log(
    "getStudentsAttendanceInDateRange",
    year,
    typeof year,
    dateRange,
    subjectCode,
    studentId
  );
  const collectionRef = collection(
    database,
    "attendance",
    year.toString(),
    "subjects",
    subjectCode.toString(),
    "dates"
  );
  let q = query(collectionRef);
  if (studentId?.length) {
    q = query(
      collectionRef,
      where("attendanceDate", ">=", dateRange.startDate),
      where("attendanceDate", "<=", dateRange.endDate),
      where("presentStudentsList", "array-contains", studentId)
    );
  } else {
    q = query(
      collectionRef,
      where("attendanceDate", ">=", dateRange.startDate),
      where("attendanceDate", "<=", dateRange.endDate)
    );
  }
  const querySnapshot = await getDocs(q);
  const tempData = querySnapshot.docs.map((doc) => doc.data());
  let data: any = {};
  console.log("querySnapshot", querySnapshot.docs.length);
  tempData.forEach((doc) => {
    const { attendanceDate } = doc;
    data[attendanceDate.toString()] = doc;
  });

  return data;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    if (req.method !== "GET") {
      res.status(405).json({ status: "error", error: "Method not allowed" });
    }
    const { startDate, endDate, subjectCode, studentId } =
      req.query as unknown as any;

    if (!startDate || !endDate || !subjectCode) {
      return res.status(400).json({ status: "error", error: "Invalid data" });
    }

    const data = await getStudentsAttendanceInDateRange(
      {
        startDate: Number(startDate),
        endDate: Number(endDate),
      },
      subjectCode as string,
      studentId as string
    );
    res.status(200).json({ status: "success", data });
  } catch (error: any) {
    console.log("ERROR_IN_ATTENDANCE", error);
    res.status(500).json({ status: "error", error: error.message });
  }
}
