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

async function getAllAcademicYears() {
  const collectionRef = collection(database, "constants");
  const docRef = doc(collectionRef, "globals");
  const docSnap = await getDoc(docRef);
  return docSnap.data()?.academicYears;
}
async function deleteAcademicYear(id: string): Promise<boolean> {
  const docRef = doc(database, "constants", "globals");
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return false;
  }
  const academicYears = docSnap.data()?.academicYears || [];
  const index = academicYears.findIndex((year: string) => year === id);
  if (index === -1) {
    return false;
  }
  academicYears.splice(index, 1);
  await updateDoc(docRef, { academicYears });
  return true;
}
async function updateAcademicYear(id: string, data: string): Promise<boolean> {
  const docRef = doc(database, "constants", "globals");
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return false;
  }
  const academicYears = docSnap.data()?.academicYears || [];
  const index = academicYears.findIndex((year: string) => year === id);
  if (index === -1) {
    return false;
  }
  academicYears[index] = data;
  await updateDoc(docRef, { academicYears });
  return true;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    switch (req.method) {
      case "GET": {
        const academicYears = await getAllAcademicYears();
        return res.status(200).json({
          data: academicYears as Data[],
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
        const deleted = await deleteAcademicYear(id as string);
        if (!deleted) {
          return res.status(404).json({
            status: "error",
            message: "Academic year not found",
          });
        }
        return res.status(200).json({
          status: "success",
          message: "Academic year deleted successfully",
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
        const updated = await updateAcademicYear(id as string, data);
        if (!updated) {
          return res.status(404).json({
            status: "error",
            message: "Academic year not found",
          });
        }
        return res.status(200).json({
          status: "success",
          message: "Academic year updated successfully",
        });
      }
      default:
        return res.status(405).end();
    }
  } catch (error) {
    console.log("ERR_FETCH_DETAINED", error);
  }
}
