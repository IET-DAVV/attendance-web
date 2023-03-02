import type { NextApiRequest, NextApiResponse } from "next";
import { database } from "@/utils/auth/firebase";
import {
  collection,
  getDoc,
  doc,
  updateDoc,
  setDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { getYear } from "@/utils/functions";
import { checkAndCreateParentDocument } from "./student";

type Response = {
  status: "success" | "error";
  data?: Data;
  error?: string;
  message?: string;
};

type Data = {
  presentStudentsList: string[]; // Student IDs (Enrollment No.s)
  absentStudentsList: string[];
};

type RequestData = {
  subjectCode: string; // CER4C2
  attendanceDate: number; // 19_02_2023 (DD_MM_YYYY)
  studentId?: string; // DE19XXX
  studentIds?: string[]; // [DE191XX, DE192XX]
  status?: "present" | "absent";
};

async function getAttendance(attendanceDate: number, subjectCode: string) {
  const year = getYear(attendanceDate) as string;
  const collectionRef = collection(
    database,
    "attendance",
    year,
    "subjects",
    subjectCode,
    "dates"
  );
  const docRef = doc(collectionRef, attendanceDate.toString());
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    console.log("No such document!");
    return { presentStudentsList: [], absentStudentsList: [] };
  }
  const { presentStudentsList, absentStudentsList } = snapshot.data();

  return { presentStudentsList, absentStudentsList };
}

async function markAttendance(
  attendanceDate: number,
  subjectCode: string,
  studentId: string,
  status: "present" | "absent"
) {
  const year = getYear(attendanceDate) as string;

  await checkAndCreateParentDocument(year.toString(), subjectCode);

  const collectionRef = collection(
    database,
    "attendance",
    year.toString(),
    "subjects",
    subjectCode,
    "dates"
  );
  const docRef = doc(collectionRef, attendanceDate.toString());
  await setDoc(
    docRef,
    {
      attendanceDate,
      [status === "present" ? "presentStudentsList" : "absentStudentsList"]:
        arrayUnion(studentId),
      [status === "present" ? "absentStudentsList" : "presentStudentsList"]:
        arrayRemove(studentId),
    },
    { merge: true }
  );
}

async function markAttendanceMultiple(
  attendanceDate: number,
  subjectCode: string,
  studentIds: string[],
  status: "present" | "absent"
) {
  const year = getYear(attendanceDate);

  await checkAndCreateParentDocument(year?.toString() as string, subjectCode);

  const collectionRef = collection(
    database,
    "attendance",
    year?.toString() as string,
    "subjects",
    subjectCode,
    "dates"
  );
  // check if parent document exists

  const docRef = doc(collectionRef, attendanceDate.toString());
  await setDoc(
    docRef,
    {
      [status === "present" ? "presentStudentsList" : "absentStudentsList"]:
        arrayUnion(...studentIds),
      [status === "present" ? "absentStudentsList" : "presentStudentsList"]:
        arrayRemove(...studentIds),
      attendanceDate,
    },
    { merge: true }
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    if (req.method === "GET") {
      const { subjectCode, attendanceDate } =
        req.query as unknown as RequestData;
      const { presentStudentsList, absentStudentsList } = await getAttendance(
        Number(attendanceDate),
        subjectCode
      );
      res.status(200).json({
        status: "success",
        data: { presentStudentsList, absentStudentsList },
      });
    }
    if (req.method === "POST") {
      const { subjectCode, studentId, studentIds, status, attendanceDate } =
        req.body as RequestData;
      if (studentId) {
        await markAttendance(
          Number(attendanceDate),
          subjectCode,
          studentId,
          status as any
        );
      } else if (studentIds) {
        await markAttendanceMultiple(
          Number(attendanceDate),
          subjectCode,
          studentIds,
          status as any
        );
      }
      res.status(200).json({ status: "success", message: "Attendance marked" });
    }
  } catch (error: any) {
    console.log("ERROR_IN_ATTENDANCE", error);
    res.status(500).json({ status: "error", error: error.message });
  }
}
