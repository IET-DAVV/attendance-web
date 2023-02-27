import type { NextApiRequest, NextApiResponse } from "next";
import { database } from "@/utils/auth/firebase";
import {
  collection,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
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

async function getAttendance(subjectCode: string, attendanceDate: string) {
  const year = attendanceDate.split("_")[2];
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

async function markAttendance(
  subjectCode: string,
  attendanceDate: string,
  studentId: string,
  status: "present" | "absent"
) {
  const year = attendanceDate.split("_")[2];
  const collectionRef = collection(database, "attendance", year, subjectCode);
  const docRef = doc(collectionRef, attendanceDate);
  await updateDoc(docRef, {
    [status]: arrayUnion(studentId),
    [status === "present" ? "absent" : "present"]: arrayRemove(studentId),
  });
}

async function markAttendanceMultiple(
  subjectCode: string,
  attendanceDate: string,
  studentIds: string[],
  status: "present" | "absent"
) {
  const year = attendanceDate.split("_")[2];
  const collectionRef = collection(database, "attendance", year, subjectCode);
  const docRef = doc(collectionRef, attendanceDate);
  await updateDoc(docRef, {
    [status]: arrayUnion(...studentIds),
    [status === "present" ? "absent" : "present"]: arrayRemove(...studentIds),
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    if (req.method === "GET") {
      const { year, subjectCode } = req.query as RequestData;
      const { present, absent } = await getAttendance(year, subjectCode);
      res.status(200).json({ status: "success", data: { present, absent } });
    }
    if (req.method === "POST") {
      const { year, subjectCode, studentId, studentIds, status } =
        req.body as RequestData;
      if (studentId) {
        await markAttendance(year, subjectCode, studentId, status as any);
      } else if (studentIds) {
        await markAttendanceMultiple(
          year,
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
