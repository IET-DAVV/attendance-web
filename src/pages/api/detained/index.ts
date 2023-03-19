import type { NextApiRequest, NextApiResponse } from "next";
import { database } from "@/utils/auth/firebase";
import { collection, getDoc, doc, updateDoc } from "firebase/firestore";

type Response = {
  status: "success" | "error";
  data?: Data;
  error?: string;
  message?: string;
};

type Data = {
  mst1: string[]; // Student IDs (Enrollment No.s)
  mst2: string[];
  mst3: string[];
  endSem: string[];
};

type RequestData = {
  academicYear: string; // 2023
  subjectCode: string; // CER4C2
  classId: string;
};

async function getDetained(
  academicYear: string,
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
    return { mst1: [], mst2: [], mst3: [], endSem: [] };
  }
  const detained = await snapshot.data().detained;

  if (!detained) {
    return { mst1: [], mst2: [], mst3: [], endSem: [] };
  }
  const { mst1 = [], mst2 = [], mst3 = [], endSem = [] } = detained;

  return { mst1, mst2, mst3, endSem };
}

async function markAsDetained(
  year: string,
  subjectCode: string,
  classId: string,
  exam: string,
  studentId: string
) {
  const collectionRef = collection(
    database,
    "attendance",
    year,
    "subjects",
    subjectCode,
    "classes"
  );
  const docRef = doc(collectionRef, classId);
  const snapshot = await getDoc(docRef);

  let allDetained: {
    [key: string]: string[];
  } = {};
  const detained = await snapshot.data()?.detained;
  if (detained) {
    allDetained = detained;
  }

  if (!allDetained[exam]) {
    allDetained[exam] = [];
  }

  if (allDetained[exam].includes(studentId)) {
    return;
  }

  allDetained = {
    ...allDetained,
    [exam]: [...allDetained[exam], studentId],
  };
  await updateDoc(docRef, {
    detained: allDetained,
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    switch (req.method) {
      case "GET": {
        const { academicYear, subjectCode, classId } = req.query as RequestData;
        const detained = await getDetained(academicYear, subjectCode, classId);
        return res.status(200).json({ data: detained, status: "success" });
      }
      case "POST": {
        const { academicYear, subjectCode, exam, studentId, classId } =
          req.body;
        const isMarked = await markAsDetained(
          academicYear,
          subjectCode,
          classId,
          exam,
          studentId
        );
        if (!Boolean(isMarked)) {
          return res.status(200).json({
            status: "success",
            message: "Student already marked as detained",
          });
        }
        return res.status(200).json({
          status: "success",
          message: "Student marked as detained",
        });
      }
      default:
        return res.status(405).end();
    }
  } catch (error) {
    console.log("ERR_FETCH_DETAINED", error);
  }
}
