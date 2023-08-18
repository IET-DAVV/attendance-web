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
  setDoc,
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

function getFacultyId(branchID: string, name: string) {
  return `FAC_${branchID}_${name.slice(0, 3).toUpperCase() + Date.now()}`;
}

async function createFacultyMultiple(faculties: Array<Data>) {
  const collectionRef = collection(database, FIREBASE_COLLECTIONS.CONSTANTS);
  const docRef = doc(collectionRef, "faculties");
  const newData = faculties.map((faculty) => ({
    ...faculty,
    id: getFacultyId(faculty.branchID, faculty.name),
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  }));
  const finalFaculties: {
    [key: string]: Data;
  } = {};
  newData.forEach((faculty) => {
    finalFaculties[faculty.id] = faculty;
  });
  await updateDoc(docRef, finalFaculties);
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
  } catch (error: any) {
    console.log("ERR_FETCH_DETAINED", error);
    return res.status(500).json({
      status: "error",
      error: error.message as string,
    });
  }
}
