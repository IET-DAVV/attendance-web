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
  collectionGroup,
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

// /attendance/2022_2023/subjects/CER4C3/classes/2021_CS_A/dates/65432165404
async function createParentDocumentBase(
  academicYear: string,
  subjectCode: string,
  classID: string
) {
  const academicYearCollRef = collection(database, "attendance");
  const academicYearDocRef = doc(academicYearCollRef, academicYear);
  await setDoc(academicYearDocRef, {
    academicYear,
  });
  const subjectsCollRef = collection(academicYearDocRef, "subjects");
  const subjectsDocRef = doc(subjectsCollRef, subjectCode);
  await setDoc(subjectsDocRef, {
    subjectCode,
  });
  const classesCollRef = collection(subjectsDocRef, "classes");
  const classesDocRef = doc(classesCollRef, classID);
  await setDoc(classesDocRef, {
    classID,
    dates: {},
    detained: {
      mst1: [],
      mst2: [],
      mst3: [],
      endSem: [],
    },
  });
}

// /attendance/2022_2023/subjects/CER4C3/classes/2021_CS_A
export async function checkAndCreateParentDocument(
  academicYear: string,
  subjectCode: string,
  classID: string
) {
  const collectionRef = collection(
    database,
    "attendance",
    academicYear,
    "subjects"
  );
  const docRef = doc(collectionRef, subjectCode);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    await createParentDocumentBase(academicYear, subjectCode, classID);
  }
}

async function getStudentAttendanceByMonth(
  academicYear: string,
  subjectCode: string,
  studentId: string,
  classID: string,
  month: number
) {
  // /attendance/2022_2023/subjects/CER4C3/classes/2021_CS_A/dates
  const collectionRef = collection(
    database,
    "attendance",
    academicYear,
    "subjects",
    subjectCode,
    "classes"
  );
  const year = new Date().getFullYear();
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 1);

  // await checkAndCreateParentDocument(year, subjectCode, );

  const docRef = doc(collectionRef, classID);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) {
    return {
      status: "error",
      data: {
        subjectCode,
        studentId,
        month,
      },
      message: "No attendance data found for this month",
    };
  }

  const data = snapshot.data() as {
    classID: string;
    detained: {
      mst1: string[];
      mst2: string[];
      mst3: string[];
      endSem: string[];
    };
    dates: {
      [key: string]: Data;
    };
  };

  const dates = Object.keys(data.dates);
  const presentOnDates = dates
    .filter((d) => {
      const date = new Date(Number(d));
      return (
        date >= monthStart &&
        date < monthEnd &&
        data.dates[d].presentStudentsList?.includes(studentId)
      );
    })
    ?.map((d) => formDateDDMMYYYY(d));

  const absentOnDates = dates
    .filter((d) => {
      const date = new Date(Number(d));
      return (
        date >= monthStart &&
        date < monthEnd &&
        data.dates[d].absentStudentsList?.includes(studentId)
      );
    })
    ?.map((d) => formDateDDMMYYYY(d));

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
    const { year, subjectCode, studentId, month, classID } = req.query;

    const { data, status, message } = await getStudentAttendanceByMonth(
      year as string,
      subjectCode as string,
      studentId as string,
      classID as string,
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
