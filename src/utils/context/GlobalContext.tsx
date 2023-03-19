import {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { studentServices } from "../api/services";
import {
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
    fetchStudents();
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
