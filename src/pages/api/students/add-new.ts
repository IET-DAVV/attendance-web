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
  let classes: any = {};
  data.forEach((branchDoc) => {
    let docId = `${branchDoc.enrollmentYear}_${branchDoc.branchID}`;
    if (branchDoc.section) {
      docId = `${docId}_${branchDoc.section}`;
    }
    if (branchDoc.section) {
      classes[docId] = {
        ...classes[docId],
        enrollmentYear: parseInt(branchDoc.enrollmentYear),
        section: branchDoc.section,
        branchID: branchDoc.branchID,
        students: [
          ...(classes[docId]?.students || []),
          {
            enrollmentID: branchDoc.enrollmentID,
            name: branchDoc.name,
            rollID: branchDoc.rollID,
            email: branchDoc.email,
            phone: branchDoc.phone || "",
          },
        ],
      };
    }
  });

  Object.keys(classes).forEach((docId) => {
    const docRef = doc(collectionRef, docId);
    batch.set(docRef, classes[docId], { merge: true });
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
        const data = req.body;
        await createStudentMultiple(data);
        return res.status(200).json({
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
