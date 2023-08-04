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
  deleteDoc,
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
async function deleteFaculty(id: string): Promise<boolean> {
  const docRef = doc(database, FIREBASE_COLLECTIONS.FACULTIES, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return false;
  }
  await deleteDoc(docRef);
  return true;
}

async function updateFaculty(
  id: string,
  data: Partial<IFaculty>
): Promise<boolean> {
  console.log("data", data, id);
  const docRef = doc(database, FIREBASE_COLLECTIONS.FACULTIES, id);
  console.log("docRef", docRef);
  const docSnap = await getDoc(docRef);
  console.log("docSnap", docSnap);
  if (!docSnap.exists()) {
    return false;
  }
  await updateDoc(docRef, data);
  return true;
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
      case "DELETE": {
        const { id } = req.query;
        const success = await deleteFaculty(id as string);
        if (success) {
          return res.status(200).json({
            status: "success",
            message: "Faculty deleted successfully",
          });
        } else {
          return res.status(404).json({
            status: "error",
            message: "Faculty not found",
          });
        }
      }
      case "PUT": {
        const { id } = req.query;
        const data = req.body;
        const success = await updateFaculty(id as string, data);
        if (success) {
          return res.status(200).json({
            status: "success",
            message: "Faculty updated successfully",
          });
        } else {
          return res.status(404).json({
            status: "error",
            message: "Faculty not found",
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
