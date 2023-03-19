import {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { studentServices, constantsServices } from "../api/services";
import {
  IBranch,
  ICurrentClassInfo,
  IStudent,
  IStudentAttendance,
  ISubject,
} from "../interfaces";

interface IGlobalContext {
  students: Array<IStudent>;
  studentsAttendance: Array<IStudentAttendance>;
  setStudentsAttendance: React.Dispatch<SetStateAction<IStudentAttendance[]>>;
  subjects: Array<ISubject>;
  currentSubject: ISubject | null;
  currentClassInfo: ICurrentClassInfo;
  branches: Array<IBranch>;
}

const GlobalContext = createContext<IGlobalContext>({} as IGlobalContext);

interface GlobalContextProviderProps {
  children: React.ReactNode;
}

const GlobalContextProvider: React.FC<GlobalContextProviderProps> = ({
  children,
}) => {
  const [students, setStudents] = useState<Array<IStudent>>([]);
  const [studentsAttendance, setStudentsAttendance] = useState<
    Array<IStudentAttendance>
  >([]);
  const [subjects, setSubjects] = useState<Array<ISubject>>([]);
  const [currentSubject, setCurrentSubject] = useState<ISubject | null>(null);
  const [currentClassInfo, setCurrentClassInfo] = useState<ICurrentClassInfo>({
    year: 2021,
    branch: "CS",
    section: "A",
    sem: 4,
    subjectCode: "CER4C3",
  });
  const [branches, setBranches] = useState<Array<IBranch>>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const { data } = await studentServices.getAllStudentsByYearAndBranch(
        currentClassInfo.year,
        currentClassInfo.branch,
        currentClassInfo.section
      );
      setStudents(
        data.data?.map((student: any) => ({
          ...student,
          key: student.enrollmentID,
        }))
      );
      setStudentsAttendance(
        data.data?.map((student: any) => ({
          ...student,
          key: student.enrollmentID,
        }))
      );
    };

    async function getBranches() {
      const { data } = await constantsServices.getAllBranches();
      console.log({ data });
      setBranches(data.data);
    }

    fetchStudents();
    getBranches();
  }, [
    currentClassInfo.branch,
    currentClassInfo.year,
    currentClassInfo.section,
  ]);

  return (
    <GlobalContext.Provider
      value={{
        students,
        studentsAttendance,
        setStudentsAttendance,
        subjects,
        currentSubject,
        currentClassInfo,
        branches,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export default GlobalContextProvider;
