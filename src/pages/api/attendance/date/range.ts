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
  setDoc,
  addDoc,
} from "firebase/firestore";
import { getYear, isBetweenDateRange } from "@/utils/functions";
import {
  checkAndCreateParentDocument,
  createParentDocumentBase,
} from "../student";

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

function generateDateRange(startDate: number, endDate: number) {
  const dates = [];
  for (let i = startDate; i <= endDate; i += 86400000) {
    dates.push(i);
  }
  return dates;
}

async function getStudentsAttendanceInDateRange(
  academicSession: string,
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
    academicSession,
    dateRange,
    subjectCode,
    studentId
  );
  const collectionRef = collection(
    database,
    "attendance",
    academicSession,
    "subjects",
    subjectCode,
    "classes"
  );
  const docRef = doc(collectionRef, classId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) {
    await checkAndCreateParentDocument(academicSession, subjectCode, classId);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      setDoc(docRef, {
        classId,
        dates: {},
        detained: {
          mst1: [],
          mst2: [],
          mst3: [],
          endSem: [],
        },
      });
    }
  }
  let data: any = {};
  const dates = generateDateRange(dateRange.startDate, dateRange.endDate);
  if (studentId?.length) {
    dates
      ?.filter((date) => data[date]?.presentStudentsList?.includes(studentId))
      .forEach((date) => {
        data[date] = date;
      });
  } else {
    dates?.forEach((date) => {
      if (snapshot.data()?.dates[date])
        data[date] = snapshot.data()?.dates[date];
      else
        data[date] = {
          presentStudentsList: [],
          absentStudentsList: [],
          attendanceDate: date,
        };
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
      academicSession,
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
      academicSession,
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
