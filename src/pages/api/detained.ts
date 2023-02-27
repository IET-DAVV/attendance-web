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
  year: string; // 2023
  subjectCode: string; // CER4C2
};

async function getDetained(year: string, subjectCode: string) {
  const collectionRef = collection(database, "attendance");
  const docRef = doc(collectionRef, year);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    console.log("No such document!");
    return { mst1: [], mst2: [], mst3: [], endSem: [] };
  }
  const detained = await snapshot.data().detained;

  if (!detained?.[subjectCode]) {
    return { mst1: [], mst2: [], mst3: [], endSem: [] };
  }
  const {
    mst1 = [],
    mst2 = [],
    mst3 = [],
    endSem = [],
  } = detained[subjectCode];

  return { mst1, mst2, mst3, endSem };
}

async function markAsDetained(
  year: string,
  subjectCode: string,
  exam: string,
  studentId: string
) {
  const collectionRef = collection(database, "attendance");
  const docRef = doc(collectionRef, String(year));
  const snapshot = await getDoc(docRef);

  let allDetained: {
    [subjectCode: string]: {
      [key: string]: string[];
    };
  } = {};
  const detained = await snapshot.data()?.detained;
  if (detained) {
    allDetained = detained;
  }
  if (!allDetained[subjectCode]) {
    allDetained[subjectCode] = {
      mst1: [],
      mst2: [],
      mst3: [],
      endSem: [],
    };
  }

  if (!allDetained[subjectCode][exam]) {
    allDetained[subjectCode][exam] = [];
  }

  if (allDetained[subjectCode][exam].includes(studentId)) {
    return;
  }

  allDetained[subjectCode] = {
    ...allDetained[subjectCode],
    [exam]: [...allDetained[subjectCode][exam], studentId],
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
        const { year, subjectCode } = req.query as RequestData;
        const detained = await getDetained(year, subjectCode);
        return res.status(200).json({ data: detained, status: "success" });
      }
      case "POST": {
        const { year, subjectCode, exam, studentId } = req.body;
        const isMarked = await markAsDetained(
          year,
          subjectCode,
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
