import type { NextApiRequest, NextApiResponse } from "next";
import { database } from "@/utils/auth/firebase";
import {
  collection,
  getDoc,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

type Response = {
  status: "success" | "error";
  data?: Data;
  error?: string;
  message?: string;
};

type Data = {
  detainedSubjects?: Array<{
    subjectCode: string;
    exams: string[];
  }>;
  studentId?: string;
  subjectCode?: string;
  isDetained?: boolean;
  exam?: string;
};

type RequestData = {
  year: string; // 2023
  studentId: string; // DE19XXX
  subjectCode: string; // CER4C2
  exam?: string; // mst1, mst2, mst3, endSem
};

async function getStudentDetainedSubjects(studentId: string, year: string) {
  const collectionRef = collection(database, "attendance", year, "subjects");
  const q1 = query(
    collectionRef,
    where("detained.mst1", "array-contains", studentId)
  );
  const q2 = query(
    collectionRef,
    where("detained.mst2", "array-contains", studentId)
  );

  const q3 = query(
    collectionRef,
    where("detained.mst3", "array-contains", studentId)
  );

  const q4 = query(
    collectionRef,
    where("detained.endSem", "array-contains", studentId)
  );

  const snapshots = await Promise.all([
    getDocs(q1),
    getDocs(q2),
    getDocs(q3),
    getDocs(q4),
  ]);
  const subjects = snapshots
    .map((snapshot) => {
      const subject = snapshot.docs.map((doc) => doc.data());
      return subject;
    })
    .filter((subject) => subject.length > 0);
  const mergedSubjects = subjects.flat();
  return {
    status: "success",
    data: mergedSubjects as any,
  };
}

async function isStudentDetainedInExam(
  year: string,
  subjectCode: string,
  exam: string,
  studentId: string
) {
  const collectionRef = collection(database, "attendance", year, "subjects");
  const docRef = doc(collectionRef, subjectCode);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) {
    return false;
  }
  const detained = await snapshot.data()?.detained;
  if (!detained) {
    return false;
  }
  const { mst1 = [], mst2 = [], mst3 = [], endSem = [] } = detained;
  switch (exam) {
    case "mst1":
      return mst1.includes(studentId);
    case "mst2":
      return mst2.includes(studentId);
    case "mst3":
      return mst3.includes(studentId);
    case "endSem":
      return endSem.includes(studentId);
    default:
      return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    switch (req.method) {
      case "GET": {
        const { studentId, year, exam, subjectCode } =
          req.query as unknown as RequestData;
        if (!studentId || !year) {
          return res.status(400).json({
            status: "error",
            error: "Bad Request",
            message: "Missing query parameters",
          });
        }
        if (!exam) {
          const subjectsData = await getStudentDetainedSubjects(
            studentId as string,
            year as string
          );
          console.log(subjectsData.data);
          return res.status(200).json({
            status: subjectsData.status as "success" | "error",
            data: {
              detainedSubjects: subjectsData.data.map((subject: any) => ({
                exams: Object.keys(subject.detained).filter((exam) =>
                  subject.detained[exam].includes(studentId)
                ),
                subjectCode: subject.subjectCode,
              })),
              studentId,
            },
          });
        }
        const isDetained = await isStudentDetainedInExam(
          year as string,
          studentId as string,
          exam as string,
          studentId as string
        );
        return res.status(200).json({
          status: "success",
          data: {
            isDetained,
            studentId,
            subjectCode,
            exam,
          },
        });
      }
      default:
        return res.status(405).end();
    }
  } catch (error) {
    console.log("ERR_FETCH_DETAINED", error);
  }
}
