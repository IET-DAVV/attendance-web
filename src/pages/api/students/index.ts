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
  year: string; // 2023
  branch?: string; // 2023
};

async function getAllStudentsByYear(year: number) {
  const collectionRef = collection(database, "students");
  const q = query(collectionRef, where("enrollmentYear", "==", year));
  const snapshot = await getDocs(q);
  const students = snapshot.docs.map((doc) => doc.data());
  return students
    ?.map((studentObj) =>
      Object.values(studentObj.students)?.map((student: any) => ({
        ...student,
        enrollmentYear: studentObj.enrollmentYear,
        branchID: studentObj.branchID,
        section: studentObj.section,
      }))
    )
    .flat();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    switch (req.method) {
      case "GET": {
        const { year } = req.query as RequestData;
        const students = await getAllStudentsByYear(Number(year));
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
