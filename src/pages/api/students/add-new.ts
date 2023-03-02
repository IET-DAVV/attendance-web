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
  writeBatch,
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
  branch?: string; // 2023
};

async function createStudentMultiple(data: Array<any>) {
  const collectionRef = collection(database, "students");
  const batch = writeBatch(database);
  data.forEach((student) => {
    const documentRef = doc(
      collectionRef,
      `${student.enrollmentYear}_${student.branchID}}`
    );
    batch.set(documentRef, student);
  });
  await batch.commit();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    switch (req.method) {
      case "POST": {
        const { data } = req.body;
        await createStudentMultiple(data);
      }
      default:
        return res.status(405).end();
    }
  } catch (error) {
    console.log("ERR_FETCH_DETAINED", error);
  }
}
