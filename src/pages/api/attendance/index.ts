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
  FieldPath,
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
  academicYear: string;
  subjectCode: string; // CER4C2
  classId: string;
  attendanceDate: number; // 19_02_2023 (DD_MM_YYYY)
  studentId?: string; // DE19XXX
  studentIds?: string[]; // [DE191XX, DE192XX]
  status?: "present" | "absent";
};

// /attendance/2022_2023/subjects/CER4C3/classes/2021_CS_A.dates.65432165404
async function getAttendance(
  academicYear: string,
  attendanceDate: number,
  subjectCode: string,
  classId: string
) {
  const collectionRef = collection(
    database,
    "attendance",
    academicYear,
    "subjects",
    subjectCode,
    "classes"
  );
  const docRef = doc(collectionRef, classId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    console.log("No such document!");
    return { presentStudentsList: [], absentStudentsList: [] };
  }
  const attendanceData = snapshot.data().dates[attendanceDate];
  if (!attendanceData) {
    return { presentStudentsList: [], absentStudentsList: [] };
  }
  const { presentStudentsList, absentStudentsList } = attendanceData;

  return { presentStudentsList, absentStudentsList };
}

async function markAttendance(
  academicYear: string,
  attendanceDate: number,
  subjectCode: string,
  classId: string,
  studentId: string,
  status: "present" | "absent"
) {
  await checkAndCreateParentDocument(academicYear, subjectCode, classId);

  const collectionRef = collection(
    database,
    "attendance",
    academicYear,
    "subjects",
    subjectCode,
    "classes"
  );
  const docRef = doc(collectionRef, classId);

  let updateObj: any = {};

  if (status === "present") {
    updateObj = {
      [attendanceDate]: {
        absentStudentsList: arrayRemove(studentId),
        presentStudentsList: arrayUnion(studentId),
        attendanceDate: attendanceDate,
      },
    };
  } else {
    updateObj = {
      [attendanceDate]: {
        absentStudentsList: arrayUnion(studentId),
        presentStudentsList: arrayRemove(studentId),
        attendanceDate: attendanceDate,
      },
    };
  }

  await setDoc(
    docRef,
    {
      dates: updateObj,
    },
    { merge: true }
  );
}

async function markAttendanceMultiple(
  academicYear: string,
  attendanceDate: number,
  subjectCode: string,
  classId: string,
  studentIds: string[],
  status: "present" | "absent"
) {
  await checkAndCreateParentDocument(academicYear, subjectCode, classId);

  const collectionRef = collection(
    database,
    "attendance",
    academicYear,
    "subjects",
    subjectCode,
    "classes"
  );
  // check if parent document exists

  const docRef = doc(collectionRef, classId);
  // const presentFieldPath = new FieldPath("dates", attendanceDate.toString(), "presentStudentsList");
  // const absentFieldPath = new FieldPath("dates", attendanceDate.toString(), "absentStudentsList");

  let updateObj = {};

  if (status === "present") {
    updateObj = {
      [attendanceDate]: {
        absentStudentsList: arrayRemove(...studentIds),
        presentStudentsList: arrayUnion(...studentIds),
        attendanceDate: attendanceDate,
      },
    };
  } else {
    updateObj = {
      [attendanceDate]: {
        absentStudentsList: arrayUnion(...studentIds),
        presentStudentsList: arrayRemove(...studentIds),
        attendanceDate: attendanceDate,
      },
    };
  }

  await setDoc(
    docRef,
    {
      dates: updateObj,
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
      const { academicYear, subjectCode, attendanceDate, classId } =
        req.query as unknown as RequestData;
      const { presentStudentsList, absentStudentsList } = await getAttendance(
        academicYear,
        Number(attendanceDate),
        subjectCode,
        classId
      );
      res.status(200).json({
        status: "success",
        data: { presentStudentsList, absentStudentsList },
      });
    }
    if (req.method === "POST") {
      const {
        academicYear,
        subjectCode,
        studentId,
        studentIds,
        status,
        attendanceDate,
        classId,
      } = req.body as RequestData;
      if (studentId) {
        await markAttendance(
          academicYear,
          Number(attendanceDate),
          subjectCode,
          classId,
          studentId,
          status as any
        );
      } else if (studentIds) {
        await markAttendanceMultiple(
          academicYear,
          Number(attendanceDate),
          subjectCode,
          classId,
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
