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
  academicSession: string,
  attendanceDate: number,
  studentId: string,
  subjectCode: string,
  classId: string
) {
  if (!academicSession)
    return {
      status: "error",
      message: "Invalid date",
      data: { attendanceStatus: null },
    };
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
    console.log("No such document!");
    return {
      status: "error",
      message: "No data found",
      data: { attendanceStatus: null },
    };
  }

  if (!snapshot.data().dates[attendanceDate]) {
    return {
      status: "error",
      message: "No data found",
      data: { attendanceStatus: null },
    };
  }

  const { presentStudentsList } = snapshot.data().dates[attendanceDate];

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
  academicSession: string,
  attendanceDate: number,
  studentId: string,
  classId: string,
  subjectCode?: string
) {
  if (!academicSession)
    return {
      status: "error",
      message: "Invalid Academic Year",
      data: {
        presentInSubjects: [],
        absentInSubjects: [],
        studentId,
        attendanceDate,
      },
    };
  if (!subjectCode) {
    const q = query(
      collectionGroup(database, "classes"),
      where("classId", "==", classId)
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

    const dateObjects = data.map((d) => ({
      ...d.dates,
      subjectCode: d.subjectCode,
    }));

    let presentInSubjects = data
      .filter((d) => d.presentStudentsList.includes(studentId))
      .map((d) => d.subjectCode);
    let absentInSubjects = data
      .filter((d) => d.absentStudentsList.includes(studentId))
      .map((d) => d.subjectCode);

    dateObjects?.forEach((dateObject) => {
      if (dateObject[attendanceDate]) {
        if (
          dateObject[attendanceDate].presentStudentsList.includes(studentId)
        ) {
          presentInSubjects.push(dateObject.subjectCode);
        } else if (
          dateObject[attendanceDate].absentStudentsList.includes(studentId)
        ) {
          absentInSubjects.push(dateObject.subjectCode);
        }
      }
    });

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
    academicSession,
    attendanceDate,
    studentId,
    subjectCode,
    classId
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
    const { academicSession, attendanceDate, subjectCode, studentId, classId } =
      req.query;

    if (!academicSession || !attendanceDate || !studentId || !classId) {
      console.log("INVALID_DATA", req.query);
      res.status(400).json({ status: "error", error: "Invalid data" });
    }

    const { status, data, message } = await getStudentAttendanceOnDate(
      academicSession as string,
      Number(attendanceDate),
      studentId as string,
      subjectCode as string,
      classId as string
    );
    let responseStatus = status as "success" | "error";
    res.status(200).json({ status: responseStatus, data, message });
  } catch (error: any) {
    console.log("ERROR_IN_ATTENDANCE", error);
    res.status(500).json({ status: "error", error: error.message });
  }
}
