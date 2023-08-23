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
  setDoc,
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

export async function getAllFaculties() {
  const collectionRef = collection(database, FIREBASE_COLLECTIONS.CONSTANTS);
  const docRef = doc(collectionRef, "faculties");
  const faculties = [];
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    for (const key in data) {
      faculties.push(data[key]);
    }
  }
  return faculties;
}
async function deleteFaculty(id: string): Promise<boolean> {
  const collectionRef = collection(database, FIREBASE_COLLECTIONS.CONSTANTS);
  const docRef = doc(collectionRef, "faculties");
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return false;
  }
  const data = docSnap.data();
  if (!data[id]) {
    return false;
  }
  let allFaculties = data;
  delete allFaculties[id];
  await setDoc(docRef, allFaculties);
  return true;
}

async function updateFaculty(
  id: string,
  data: Partial<IFaculty>
): Promise<boolean> {
  const collectionRef = collection(database, FIREBASE_COLLECTIONS.CONSTANTS);
  const docRef = doc(collectionRef, "faculties");
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return false;
  }
  const allFaculties = docSnap.data();
  if (!allFaculties[id]) {
    return false;
  }
  allFaculties[id] = {
    ...allFaculties[id],
    ...data,
    modifiedAt: Date.now(),
  };
  await updateDoc(docRef, allFaculties);
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
  } catch (error: any) {
    console.log("ERR_FETCH_FACULTIES", error);
    return res.status(500).json({
      status: "error",
      error,
    });
  }
}
