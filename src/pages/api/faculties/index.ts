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
import { IFaculty } from "@/utils/interfaces";

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

async function getAllFaculties() {
  const collectionRef = collection(database, FIREBASE_COLLECTIONS.FACULTIES);
  const snapshot = await getDocs(collectionRef);
  const faculties = snapshot.docs.map((doc) => doc.data());
  return faculties;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    switch (req.method) {
      case "GET": {
        const data: Array<IFaculty> =
          (await getAllFaculties()) as Array<IFaculty>;
        return res.status(200).json({
          status: "success",
          data,
        });
      }
      default:
        return res.status(405).end();
    }
  } catch (error) {
    console.log("ERR_FETCH_DETAINED", error);
  }
}
