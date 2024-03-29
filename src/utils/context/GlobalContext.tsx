import {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  studentServices,
  constantsServices,
  facultiesServices,
} from "../api/services";
import {
  AcademicSession,
  IBranch,
  IClass,
  ICurrentClassInfo,
  IFaculty,
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
  setCurrentClassInfo: React.Dispatch<SetStateAction<ICurrentClassInfo>>;
  branches: Array<IBranch>;
  academicYear: string;
  allFaculties: Array<IFaculty>;
  setAllFaculties: React.Dispatch<SetStateAction<Array<IFaculty>>>;
  fetchAcademicSessions: () => void;
  allAcademicSessions: Array<AcademicSession>;
  setAllAcademicSessions: React.Dispatch<
    SetStateAction<Array<AcademicSession>>
  >;
  fetchFaculties: () => void;
  classes: Array<IClass>;
  setClasses: React.Dispatch<SetStateAction<Array<IClass>>>;
  fetchClasses: () => void;
  academicSession: string;
  setAcademicSession: React.Dispatch<SetStateAction<string>>;
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
  const [currentClassInfo, setCurrentClassInfo] = useState<ICurrentClassInfo>(
    {} as ICurrentClassInfo
  );
  const [branches, setBranches] = useState<Array<IBranch>>([]);
  const [allAcademicSessions, setAllAcademicSessions] = useState<
    Array<AcademicSession>
  >([]);
  const [academicYear, setAcademicYear] = useState<string>("2022_2023");
  const [allFaculties, setAllFaculties] = useState<Array<IFaculty>>([]);
  const [classes, setClasses] = useState<Array<IClass>>([]);
  const [academicSession, setAcademicSession] = useState<string>("");

  useEffect(() => {
    async function getBranches() {
      const { data } = await constantsServices.getAllBranches();
      // console.log({ data });
      setBranches(Object.values(data.data));
    }
    getBranches();
  }, []);

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

    if (currentClassInfo?.id) {
      fetchStudents();
    }
  }, [currentClassInfo]);

  useEffect(() => {
    if (branches) {
      let tempSubjects: Array<ISubject> = [];
      branches?.forEach((branch: IBranch) => {
        tempSubjects = [
          ...tempSubjects,
          ...Object.values(branch.subjects)?.map((sub) => ({
            ...sub,
            branchID: branch.branchID,
          })),
        ];
      });
      setSubjects(tempSubjects);
    }
  }, [branches]);

  async function fetchAcademicSessions() {
    try {
      const { data } = await constantsServices.getAllAcademicSession();
      setAllAcademicSessions(data?.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchFaculties() {
    try {
      const { data } = await facultiesServices.getAllFaculties();
      setAllFaculties(data?.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchClasses() {
    try {
      const { data } = await constantsServices.getAllClasses();
      setClasses(data?.data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <GlobalContext.Provider
      value={{
        students,
        studentsAttendance,
        setStudentsAttendance,
        subjects,
        currentSubject,
        currentClassInfo,
        setCurrentClassInfo,
        branches,
        academicYear,
        fetchAcademicSessions,
        allAcademicSessions,
        setAllAcademicSessions,
        allFaculties,
        setAllFaculties,
        fetchFaculties,
        classes,
        setClasses,
        fetchClasses,
        academicSession,
        setAcademicSession,
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
