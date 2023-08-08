import type { NextApiRequest, NextApiResponse } from "next";
import { database } from "@/utils/auth/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
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
  name: string;
};

type RequestData = {
  year?: string; // 2023
  branch?: string; // 2023
};

async function getAllClasses() {
  const collectionRef = collection(database, FIREBASE_COLLECTIONS.CONSTANTS);
  const docRef = doc(collectionRef, "classes");
  const docSnap = await getDoc(docRef);
  return docSnap.data()?.academicYearsList;
}
async function deleteClass(id: string): Promise<boolean> {
  const docRef = doc(database, FIREBASE_COLLECTIONS.CONSTANTS, "classes");
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return false;
  }
  const classesList = docSnap.data()?.classesList || [];
  const index = classesList.findIndex((year: string) => year === id);
  if (index === -1) {
    return false;
  }
  classesList.splice(index, 1);
  await updateDoc(docRef, { classesList });
  return true;
}
async function updateClass(id: string, data: string): Promise<boolean> {
  const docRef = doc(database, FIREBASE_COLLECTIONS.CONSTANTS, "classes");
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return false;
  }
  const classesList = docSnap.data()?.classesList || [];
  const index = classesList.findIndex((year: string) => year === id);
  if (index === -1) {
    return false;
  }
  classesList[index] = data;
  await updateDoc(docRef, { classesList });
  return true;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    switch (req.method) {
      case "GET": {
        const classes = await getAllClasses();
        return res.status(200).json({
          data: classes as Data[],
          status: "success",
        });
      }
      case "DELETE": {
        const { session: id } = req.query;

        if (!id) {
          return res.status(400).json({
            status: "error",
            message: "Missing id parameter",
          });
        }
        const deleted = await deleteClass(id as string);
        if (!deleted) {
          return res.status(404).json({
            status: "error",
            message: "Class not found",
          });
        }
        return res.status(200).json({
          status: "success",
          message: "Class deleted successfully",
        });
      }
      case "PUT": {
        const { oldData: id, data } = req.body;
        if (!id) {
          return res.status(400).json({
            status: "error",
            message: "Missing id parameter",
          });
        }
        const updated = await updateClass(id as string, data);
        if (!updated) {
          return res.status(404).json({
            status: "error",
            message: "Class not found",
          });
        }
        return res.status(200).json({
          status: "success",
          message: "Class updated successfully",
        });
      }
      default:
        return res.status(405).end();
    }
  } catch (error) {
    console.log("ERR_FETCH_CLASS", error);
  }
}
