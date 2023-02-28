import type { NextApiRequest, NextApiResponse } from "next";
import { database } from "@/utils/auth/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
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

async function getAllBranches() {
  const collectionRef = collection(database, "constants");
  const docRef = doc(collectionRef, "branches");
  const docSnap = await getDoc(docRef);
  return docSnap.data()?.branches;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    switch (req.method) {
      case "GET": {
        const branches = await getAllBranches();
        return res.status(200).json({
          data: branches as Data[],
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
