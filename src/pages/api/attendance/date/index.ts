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

async function getStudentAttendanceUsingSubjectCode(
  year: string,
  attendanceDate: number,
  studentId: string,
  subjectCode: string
) {
  if (!year)
    return {
      status: "error",
      message: "Invalid date",
      data: { attendanceStatus: null },
    };
  const collectionRef = collection(
    database,
    "attendance",
    year as string,
    "subjects",
    subjectCode,
    "dates"
  );
  const docRef = doc(collectionRef, attendanceDate.toString());
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    console.log("No such document!");
    return {
      status: "error",
      message: "No data found",
      data: { attendanceStatus: null },
    };
  }
  const { presentStudentsList } = snapshot.data();

  return {
    status: "success",
    data: {
      attendanceStatus: presentStudentsList.includes(studentId)
        ? "present"
        : "absent",
    },
  };
}

async function getStudentAttendanceOnDate(
  attendanceDate: number,
  studentId: string,
  subjectCode?: string
) {
  const year = getYear(attendanceDate);
  if (!year)
    return {
      status: "error",
      message: "Invalid date",
      data: {
        presentInSubjects: [],
        absentInSubjects: [],
        studentId,
        attendanceDate,
      },
    };
  if (!subjectCode) {
    const q = query(
      collectionGroup(database, "dates"),
      where("attendanceDate", "==", attendanceDate)
    );

    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => doc.data());

    if (!data.length)
      return {
        status: "error",
        message: "No data found",
        data: {
          presentInSubjects: [],
          absentInSubjects: [],
          studentId,
          attendanceDate,
        },
      };

    const presentInSubjects = data
      .filter((d) => d.presentStudentsList.includes(studentId))
      .map((d) => d.subjectCode);
    const absentInSubjects = data
      .filter((d) => d.absentStudentsList.includes(studentId))
      .map((d) => d.subjectCode);

    return {
      status: "success",
      data: {
        presentInSubjects,
        absentInSubjects,
        studentId,
        attendanceDate,
      },
    };
  }

  const withSubjectCode = await getStudentAttendanceUsingSubjectCode(
    year as string,
    attendanceDate,
    studentId,
    subjectCode
  );
  return {
    ...withSubjectCode,
    data: {
      attendanceStatus: withSubjectCode.data?.attendanceStatus as
        | "present"
        | "absent"
        | null,
      studentId,
      attendanceDate,
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
    const { attendanceDate, subjectCode, studentId } = req.query;

    const { status, data, message } = await getStudentAttendanceOnDate(
      Number(attendanceDate),
      studentId as string,
      subjectCode as string
    );
    let responseStatus = status as "success" | "error";
    res.status(200).json({ status: responseStatus, data, message });
  } catch (error: any) {
    console.log("ERROR_IN_ATTENDANCE", error);
    res.status(500).json({ status: "error", error: error.message });
  }
}
