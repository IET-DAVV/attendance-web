import {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { studentServices } from "../api/services";
import { IStudent, IStudentAttendance, ISubject } from "../interfaces";

interface IGlobalContext {
  students: Array<IStudent>;
  studentsAttendance: Array<IStudentAttendance>;
  setStudentsAttendance: React.Dispatch<SetStateAction<IStudentAttendance[]>>;
  subjects: Array<ISubject>;
  currentSubject: ISubject | null;
}

const currentClassInfo = {
  year: "2021",
  branch: "CS",
  section: "B",
  semester: "4",
  subjectCode: "CER4C1",
};

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

  const fetchStudents = async () => {
    const { data } = await studentServices.getAllStudentsByYearAndBranch(
      currentClassInfo.year,
      currentClassInfo.branch
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

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        students,
        studentsAttendance,
        setStudentsAttendance,
        subjects,
        currentSubject,
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
