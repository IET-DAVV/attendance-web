import type { NextApiRequest, NextApiResponse } from "next";
import { database } from "@/utils/auth/firebase";
import {
  collection,
  getDoc,
  doc,
  query,
  getDocs,
  where,
  setDoc,
} from "firebase/firestore";
import {
  formatFirebaseDateDDMMYYYY,
  formDateDDMMYYYY,
} from "@/utils/functions";

type Response = {
  status: "success" | "error";
  data?: any;
  error?: string;
  message?: string;
};

type Data = {
  presentStudentsList: string[]; // Student IDs (Enrollment No.s)
  absentStudentsList: string[];
};

type RequestData = {
  year: string; // 2023
  subjectCode: string; // CER4C2
  attendanceDate: string; // 19_02_2023 (DD_MM_YYYY)
  studentId?: string; // DE19XXX
  studentIds?: string[]; // [DE191XX, DE192XX]
  status?: "present" | "absent";
};

async function createParentDocumentBase(year: string, subjectCode: string) {
  const collectionRef = collection(database, "attendance", year, "subjects");
  const docRef = doc(collectionRef, subjectCode);
  await setDoc(docRef, {
    subjectCode,
    detained: {
      mst1: [],
      mst2: [],
      mst3: [],
      endSem: [],
    },
  });
}

export async function checkAndCreateParentDocument(
  year: string,
  subjectCode: string
) {
  const collectionRef = collection(
    database,
    "attendance",
    year.toString(),
    "subjects"
  );
  const docRef = doc(collectionRef, subjectCode);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    await createParentDocumentBase(year, subjectCode);
  }
}

async function getStudentAttendanceByMonth(
  year: string,
  subjectCode: string,
  studentId: string,
  month: number
) {
  const collectionRef = collection(
    database,
    "attendance",
    year.toString(),
    "subjects",
    subjectCode,
    "dates"
  );
  const monthStart = new Date(Number(year), month, 1);
  const monthEnd = new Date(Number(year), month + 1, 1);

  await checkAndCreateParentDocument(year, subjectCode);

  const q = query(
    collectionRef,
    where("attendanceDate", ">=", monthStart.getTime()),
    where("attendanceDate", "<", monthEnd.getTime())
  );
  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map((doc) => doc.data());
  if (!data.length) {
    return {
      data: {
        subjectCode,
        studentId,
        month,
      },
      status: "error",
      message: "No attendance data found for this month",
    };
  }
  const presentOnDates = data
    .filter((d) => d.presentStudentsList?.includes(studentId))
    .map((d) => formDateDDMMYYYY(Number(d.attendanceDate)));
  const absentOnDates = data
    .filter((d) => d.absentStudentsList?.includes(studentId))
    .map((d) => formDateDDMMYYYY(Number(d.attendanceDate)));
  const presentCount = presentOnDates.length;
  const absentCount = absentOnDates.length;
  const totalAttendanceCount = presentCount + absentCount;
  const attendancePercentage = (presentCount / totalAttendanceCount) * 100;
  return {
    status: "success",
    data: {
      subjectCode,
      studentId,
      month,
      presentOnDates,
      absentOnDates,
      totalAttendanceCount,
      attendancePercentage,
    },
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    if (req.method !== "GET") {
      res.status(405).json({ status: "error", error: "Method not allowed" });
    }
    const { year, subjectCode, studentId, month } = req.query;

    const { data, status, message } = await getStudentAttendanceByMonth(
      year as string,
      subjectCode as string,
      studentId as string,
      Number(month)
    );
    if (status === "error") {
      return res.status(404).json({ status, data, message });
    }
    res.status(200).json({ status: status as any, data });
  } catch (error: any) {
    console.log("ERROR_IN_ATTENDANCE", error);
    res.status(500).json({ status: "error", error: error.message });
  }
}
