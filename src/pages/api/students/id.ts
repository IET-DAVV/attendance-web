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
  studentId?: string;
  rollID?: string;
};

async function getStudentByEnrollmentID(id: string) {
  const docRef = doc(database, "students", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return null;
  }
  return docSnap.data();
}

async function getStudentByRollID(id: string) {
  const collectionRef = collection(database, "students");
  const q = query(collectionRef, where("rollID", "==", id));
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => doc.data());
  if (data.length === 0) return null;
  return data[0];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    switch (req.method) {
      case "GET": {
        const { studentId, rollID } = req.query as unknown as RequestData;
        if (!studentId && !rollID) {
          return res.status(400).json({
            status: "error",
            message: "Invalid Parameters",
          });
        }

        if (studentId) {
          const student = await getStudentByEnrollmentID(studentId as string);

          if (!student) {
            return res.status(404).json({
              status: "error",
              message: "Student not found",
            });
          }
          return res.status(200).json({
            data: student as Data,
            status: "success",
          });
        }

        if (rollID) {
          const student = await getStudentByRollID(rollID as string);
          if (!student) {
            return res.status(404).json({
              status: "error",
              message: "Student not found",
            });
          }
          return res.status(200).json({
            data: student as Data,
            status: "success",
          });
        }
      }
      default:
        return res.status(405).end();
    }
  } catch (error) {
    console.log("ERR_FETCH_DETAINED", error);
  }
}
