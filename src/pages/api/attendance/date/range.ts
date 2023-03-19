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
import { getYear, isBetweenDateRange } from "@/utils/functions";

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
  academicYear: string,
  dateRange: {
    startDate: number;
    endDate: number;
  },
  subjectCode: string,
  classId: string,
  studentId?: string
) {
  console.log(
    "getStudentsAttendanceInDateRange",
    academicYear,
    dateRange,
    subjectCode,
    studentId
  );
  const collectionRef = collection(
    database,
    "attendance",
    academicYear,
    "subjects",
    subjectCode,
    "classess"
  );
  const docRef = doc(collectionRef, classId);
  const snapshot = await getDoc(docRef);
  let data: any = {};
  const dates = Object.keys(snapshot.data()?.dates || {})?.filter((date) =>
    isBetweenDateRange(date, dateRange.startDate, dateRange.endDate)
  );
  if (studentId?.length) {
    // q = query(
    //   collectionRef,
    //   where("attendanceDate", ">=", dateRange.startDate),
    //   where("attendanceDate", "<=", dateRange.endDate),
    //   where("presentStudentsList", "array-contains", studentId)
    // );
    dates
      ?.filter((date) => data[date]?.presentStudentsList?.includes(studentId))
      .forEach((date) => {
        data[date] = date;
      });
  } else {
    // q = query(
    //   collectionRef,
    //   where("attendanceDate", ">=", dateRange.startDate),
    //   where("attendanceDate", "<=", dateRange.endDate)
    // );
    dates?.forEach((date) => {
      data[date] = date;
    });
  }

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
    const {
      academicYear,
      startDate,
      endDate,
      subjectCode,
      studentId,
      classId,
    } = req.query as unknown as any;

    if (!startDate || !endDate || !subjectCode) {
      return res.status(400).json({ status: "error", error: "Invalid data" });
    }

    const data = await getStudentsAttendanceInDateRange(
      academicYear,
      {
        startDate: Number(startDate),
        endDate: Number(endDate),
      },
      subjectCode as string,
      classId,
      studentId as string
    );
    res.status(200).json({ status: "success", data });
  } catch (error: any) {
    console.log("ERROR_IN_ATTENDANCE", error);
    res.status(500).json({ status: "error", error: error.message });
  }
}
