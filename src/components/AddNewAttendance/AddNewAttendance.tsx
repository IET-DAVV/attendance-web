import { useGlobalContext } from "@/utils/context/GlobalContext";
import { getDateDayMonthYear, getToday12AMDatetime } from "@/utils/functions";
import { IStudentAttendance } from "@/utils/interfaces";
import {
  AppstoreOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
  CloseOutlined,
  OrderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Drawer,
  message,
  Space,
  Tabs,
  Tag,
} from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import attendanceServices from "@/utils/api/services/attendance";
import { useEffect, useState } from "react";
import styles from "./AddNewAttendance.module.scss";
import GridView from "./GridView";
import ListView from "./ListView";
import SingleView from "./SingleView";

const AddNewAttendance: React.FC<{
  open: boolean;
  onClose: () => void;
  submitAttendance: () => void;
}> = ({ open, onClose, submitAttendance }) => {
  const today = getDateDayMonthYear(new Date());
  const [activeKey, setActiveKey] = useState<string>("1");
  const [currentStudentIndex, setCurrentStudentIndex] = useState<number>(0);
  const [currentStudent, setCurrentStudent] =
    useState<IStudentAttendance | null>(null);

  const {
    studentsAttendance,
    setStudentsAttendance,
    currentClassInfo,
    currentSubject,
    academicYear,
  } = useGlobalContext();

  function getNewIndex(direction: "prev" | "next") {
    let newIndex = currentStudentIndex;
    if (direction === "prev") {
      newIndex = currentStudentIndex - 1;
      if (newIndex < 0) {
        newIndex = studentsAttendance.length - 1;
      }
    } else {
      newIndex = currentStudentIndex + 1;
      if (newIndex >= studentsAttendance.length) {
        newIndex = 0;
      }
    }
    return newIndex;
  }

  function handleClickAbsent(student?: IStudentAttendance) {
    if (!student?.rollID) {
      setCurrentStudentIndex(getNewIndex("next"));
    }
    setStudentsAttendance((prev) => {
      let newStudentsAttendance: any = [...prev];
      let absoluteTime = getToday12AMDatetime();
      let newCurrentStudentIndex = currentStudentIndex;
      if (student?.rollID) {
        newCurrentStudentIndex = newStudentsAttendance.findIndex(
          (s: IStudentAttendance) => s.rollID === student.rollID
        );
      }
      if (!newStudentsAttendance[newCurrentStudentIndex]?.attendance) {
        newStudentsAttendance[newCurrentStudentIndex].attendance = {};
      }
      newStudentsAttendance[newCurrentStudentIndex].attendance[
        absoluteTime.toString()
      ] = "Absent";
      return newStudentsAttendance;
    });
  }

  function handleClickPresent(student?: IStudentAttendance) {
    if (!student?.rollID) {
      setCurrentStudentIndex(getNewIndex("next"));
    }
    setStudentsAttendance((prev) => {
      const newStudentsAttendance: any = [...prev];
      let absoluteTime = getToday12AMDatetime();
      let newCurentStudentIndex = currentStudentIndex;
      if (student?.rollID) {
        newCurentStudentIndex = newStudentsAttendance.findIndex(
          (s: IStudentAttendance) => s.rollID === student.rollID
        );
      }
      if (!newStudentsAttendance[newCurentStudentIndex].attendance) {
        newStudentsAttendance[newCurentStudentIndex].attendance = {};
      }
      newStudentsAttendance[newCurentStudentIndex].attendance[
        absoluteTime.toString()
      ] = "Present";
      return newStudentsAttendance;
    });
  }

  function handleClickNavigate(direction: "prev" | "next") {
    setCurrentStudentIndex(getNewIndex(direction));
  }

  function currentStudentAtteandanceStatus() {
    return currentStudent?.attendance?.[getToday12AMDatetime()];
  }

  useEffect(() => {
    setCurrentStudent(studentsAttendance[currentStudentIndex]);
  }, [currentStudentIndex, studentsAttendance]);

  const tabOptions = [
    {
      label: (
        <span>
          <UserOutlined /> Single
        </span>
      ),
      key: "1",
      children: (
        <SingleView
          open={open}
          onClose={onClose}
          currentStudentAtteandanceStatus={currentStudentAtteandanceStatus}
          handleClickNavigate={handleClickNavigate}
          handleClickPresent={handleClickPresent}
          handleClickAbsent={handleClickAbsent}
          currentStudent={currentStudent}
          currentStudentIndex={currentStudentIndex}
          getNewIndex={getNewIndex}
          today={today}
        />
      ),
    },
    {
      label: (
        <span>
          <AppstoreOutlined />
          Grid
        </span>
      ),

      key: "2",
      children: (
        <GridView
          currentStudentAtteandanceStatus={currentStudentAtteandanceStatus}
          handleClickAbsent={handleClickAbsent}
          handleClickPresent={handleClickPresent}
          students={studentsAttendance}
          today={today}
        />
      ),
    },
    {
      label: (
        <span>
          <OrderedListOutlined />
          List
        </span>
      ),

      key: "3",
      children: (
        <ListView
          currentStudentAtteandanceStatus={currentStudentAtteandanceStatus}
          handleClickAbsent={handleClickAbsent}
          handleClickPresent={handleClickPresent}
          handleClickSelectAll={markAllAttendance}
          students={studentsAttendance}
          today={today}
        />
      ),
    },
  ];

  function markAllAttendance(status: "Present" | "Absent") {
    setStudentsAttendance((prev) => {
      let absoluteTime = getToday12AMDatetime();
      return prev.map((student: IStudentAttendance) => ({
        ...student,
        attendance: {
          ...student.attendance,
          [absoluteTime.toString()]: status,
        },
      }));
    });
  }

  function handleClickSelectAll(e: CheckboxChangeEvent) {
    markAllAttendance(e.target.checked ? "Present" : "Absent");
  }

  return (
    <Drawer
      title={
        "New Attendance for " + `${today.day}, ${today.date} ${today.month}`
      }
      placement="bottom"
      closable={true}
      onClose={onClose}
      open={open}
      key={"bottom"}
      className={styles.container}
      extra={
        <Space>
          <Button type="primary" onClick={submitAttendance}>
            Submit Attendance
          </Button>
        </Space>
      }
    >
      <Tabs
        className={styles.tabsContainer}
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key)}
        type="card"
        items={tabOptions}
        tabBarExtraContent={
          activeKey === "2" && (
            <Checkbox onChange={handleClickSelectAll}>Select All</Checkbox>
          )
        }
      />
    </Drawer>
  );
};

export default AddNewAttendance;
