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
  const collectionRef = collection(database, "students");
  const q = query(
    collectionRef,
    where(`students.${id}.enrollmentID`, "==", id)
  );
  const snapshot = await getDocs(q);
  if (snapshot.docs.length === 0) return null;
  const docSnap = snapshot.docs[0];
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
      }
      default:
        return res.status(405).end();
    }
  } catch (error) {
    console.log("ERR_FETCH_DETAINED", error);
  }
}
