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
  data?: Data | Data[];
  error?: string;
  message?: string;
};

type Data = {
  branchID: string;
  email: string;
  enrollmentID: string;
  enrollmentYear: number;
  name: string;
  phone: string;
  rollID: string;
  section: string | null;
  uid: string;
};

type RequestData = {
  year?: string; // 2023
  branch?: string; // CS
  section?: string; // A | B
};

async function getAllStudentsByYearAndBranch(
  year: number,
  branch: string,
  section?: string
) {
  const collectionRef = collection(database, "students");
  let docId = `${year}_${branch}`;
  if (section) docId += `_${section}`;
  console.log("docId", docId);
  const documentRef = doc(collectionRef, docId);
  const snapshot = await getDoc(documentRef);
  const studentsData = snapshot.data();
  if (!studentsData) return [];
  const students = Object.values(studentsData.students) || [];
  const studentsSortedByRno = students.sort((a: any, b: any) => {
    const aRno = Number(a.rollID.slice(4));
    const bRno = Number(b.rollID.slice(4));
    return aRno - bRno;
  });
  return studentsSortedByRno;
}

async function getAllStudentsByBranch(branch: string) {
  const collectionRef = collection(database, "students");
  const q = query(
    collectionRef,
    where("branchID", "==", branch?.toUpperCase())
  );
  const snapshot = await getDocs(q);
  const students = snapshot.docs.map((doc) => doc.data());
  return students;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    switch (req.method) {
      case "GET": {
        const { year, branch, section } = req.query as unknown as RequestData;
        if (!branch && !year)
          return res.status(400).json({
            status: "error",
            message: "Invalid Parameters",
          });
        if (!year) {
          const students = await getAllStudentsByBranch(branch as string);
          return res.status(200).json({
            data: students as Data[],
            status: "success",
          });
        }
        const students = await getAllStudentsByYearAndBranch(
          Number(year),
          branch as string,
          section as string
        );
        return res.status(200).json({
          data: students as Data[],
          status: "success",
        });
      }
      default:
        return res.status(405).end();
    }
  } catch (error) {
    console.log("ERR_FETCH_DETAINED", error);
  }
}
