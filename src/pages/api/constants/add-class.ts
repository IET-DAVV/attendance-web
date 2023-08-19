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
  arrayUnion,
} from "firebase/firestore";
import { FIREBASE_COLLECTIONS } from "@/utils/constants";

type Response = {
  status: "success" | "error";
  data?: Data | Data[];
  error?: string;
  message?: string;
};

type Data = {
  id: string;
  createdAt: number;
  modifiedAt: number;
};

type RequestData = {
  year?: string; // 2023
  branch?: string; // 2023
};

async function createNewClass(data: any) {
  const collectionRef = collection(database, FIREBASE_COLLECTIONS.CONSTANTS);
  const docRef = doc(collectionRef, "classes");
  updateDoc(docRef, {
    [data.id]: {
      id: data.id,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    },
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    switch (req.method) {
      case "POST": {
        const data = req.body;
        await createNewClass(data);
        return res.status(200).json({
          status: "success",
        });
      }
      default:
        return res.status(405).end();
    }
  } catch (error) {
    console.log("ERR_CREATE_CLASS", error);
  }
}
