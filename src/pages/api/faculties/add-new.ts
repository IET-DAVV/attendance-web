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
import { FIREBASE_COLLECTIONS } from "@/utils/constants";

type Response = {
  status: "success" | "error";
  data?: Data | Data[];
  error?: string;
  message?: string;
};

type Data = {
  branchID: string;
  email: string;
  designation: string;
  name: string;
  facultyType: string;
};

async function createFacultyMultiple(data: Array<any>) {
  const collectionRef = collection(database, FIREBASE_COLLECTIONS.FACULTIES);
  const batch = writeBatch(database);
  data.forEach((branchDoc, i) => {
    let docId = `FAC_${branchDoc.branchID}_${
      branchDoc.name?.slice(0, 3).toUpperCase() +
      Date.now().toString().slice(-4) +
      i
    }`;
    const documentRef = doc(collectionRef, docId);
    batch.set(documentRef, {
      id: docId,
      ...branchDoc,
    });
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
        await createFacultyMultiple(data);
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
