import type { NextApiRequest, NextApiResponse } from "next";
import { database } from "@/utils/auth/firebase";
import { getDoc, doc, setDoc, updateDoc } from "firebase/firestore";
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
  enrollmentID: string;
  enrollmentYear: number;
  name: string;
  phone: string;
  rollID: string;
  section: string | null;
  uid: string;
};

type RequestData = {
  session: string;
};

//code for generating random id starts with ACS using time stamp
function generateRandomId(length: number) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let autoId = "";
  for (let i = 0; i < length; i++) {
    autoId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return "ACS" + autoId + Date.now();
}

async function createNewAcademicYears(session: string) {
  const docRef = doc(database, FIREBASE_COLLECTIONS.CONSTANTS, "academicYears");
  const exists = await getDoc(docRef);

  if (!exists.exists()) {
    let id = generateRandomId(3);
    setDoc(docRef, {
      [id]: {
        id,
        academicSession: session,
        createdAt: Date.now(),
        modifiedAt: Date.now(),
      },
    });
    return true;
  } else {
    let id = generateRandomId(3);
    const docData = exists.data();
    if (!docData?.[id]) {
      updateDoc(docRef, {
        [id]: {
          id,
          academicSession: session,
          createdAt: Date.now(),
          modifiedAt: Date.now(),
        },
      });
      return true;
    }
  }
  return false;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    switch (req.method) {
      case "POST": {
        const data = req.body as RequestData;
        const created = await createNewAcademicYears(data.session);
        if (!created) {
          return res.status(409).json({
            status: "error",
            message: "Academic session already exists",
          });
        }
        return res.status(200).json({
          status: "success",
        });
      }
      default:
        return res.status(405).end();
    }
  } catch (error) {
    console.log("ERR_CREATE_ACADEMIC_SESSION", error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
}
