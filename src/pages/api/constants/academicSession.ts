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
  name: string;
};

type RequestData = {
  year?: string; // 2023
  branch?: string; // 2023
};

async function getAllAcademicYears() {
  const collectionRef = collection(database, FIREBASE_COLLECTIONS.CONSTANTS);
  const docRef = doc(collectionRef, "academicYears");
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  if (!data) {
    return [];
  }
  return Object.values(data);
}
async function deleteAcademicYear(id: string): Promise<boolean> {
  const docRef = doc(database, FIREBASE_COLLECTIONS.CONSTANTS, "academicYears");
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return false;
  }
  let academicYears = { ...docSnap.data() };
  const curraAcademicYear = academicYears[id];
  if (!curraAcademicYear) {
    return false;
  }
  delete academicYears[id];
  await setDoc(docRef, { ...academicYears });
  return true;
}
async function updateAcademicYear(id: string, data: string): Promise<boolean> {
  const docRef = doc(database, FIREBASE_COLLECTIONS.CONSTANTS, "academicYears");
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return false;
  }
  const academicYearsList = docSnap.data();
  const currAcademicYear = academicYearsList[id];
  if (!currAcademicYear) {
    return false;
  }
  const updatedAcademicYear = {
    ...currAcademicYear,
    academicSession: data,
    modifiedAt: Date.now(),
  };
  const updatedAcademicYearsList = {
    ...academicYearsList,
    [id]: updatedAcademicYear,
  };
  await setDoc(docRef, updatedAcademicYearsList);
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
        const {
          data: { id, newData: data },
        } = req.body;
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
    console.log("ERR_FETCH_ACADEMIC_SESSION", error);
  }
}
