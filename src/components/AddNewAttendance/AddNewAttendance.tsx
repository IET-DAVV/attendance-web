import { useGlobalContext } from "@/utils/context/GlobalContext";
import { getDateDayMonthYear, getToday12AMDatetime } from "@/utils/functions";
import { IStudentAttendance } from "@/utils/interfaces";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Button, Card, Drawer, Space, Tag } from "antd";
import clsx from "clsx";
import { useEffect, useState } from "react";
import styles from "./AddNewAttendance.module.scss";

const AddNewAttendance: React.FC<{
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}> = ({ open, onClose, children }) => {
  const today = getDateDayMonthYear(new Date());
  const [currentStudentIndex, setCurrentStudentIndex] = useState<number>(0);
  const [currentStudent, setCurrentStudent] =
    useState<IStudentAttendance | null>(null);

  const { studentsAttendance, setStudentsAttendance } = useGlobalContext();

  function handleClickAbsent() {
    let newIndex = (currentStudentIndex + 1) % (studentsAttendance.length - 1);
    console.log({ currentStudentIndex, newIndex });
    setCurrentStudentIndex(newIndex);
    setStudentsAttendance((prev) => {
      const newStudentsAttendance: any = [...prev];
      let absoluteTime = getToday12AMDatetime();
      if (!newStudentsAttendance[currentStudentIndex].attendance) {
        newStudentsAttendance[currentStudentIndex].attendance = {};
      }
      newStudentsAttendance[currentStudentIndex].attendance[
        absoluteTime.toString()
      ] = "Absent";
      return newStudentsAttendance;
    });
  }

  function handleClickPresent() {
    let newIndex = currentStudentIndex + 1;
    if (newIndex >= studentsAttendance.length) {
      newIndex = 0;
    }
    setCurrentStudentIndex(newIndex);
    setStudentsAttendance((prev) => {
      const newStudentsAttendance: any = [...prev];
      let absoluteTime = getToday12AMDatetime();
      if (!newStudentsAttendance[currentStudentIndex].attendance) {
        newStudentsAttendance[currentStudentIndex].attendance = {};
      }
      newStudentsAttendance[currentStudentIndex].attendance[
        absoluteTime.toString()
      ] = "Present";
      return newStudentsAttendance;
    });
  }

  function handleClickNavigate(direction: "prev" | "next") {
    if (direction === "prev") {
      let newIndex = currentStudentIndex - 1;
      if (newIndex < 0) {
        newIndex = studentsAttendance.length - 1;
      }
      setCurrentStudentIndex(newIndex);
    } else {
      let newIndex = currentStudentIndex + 1;
      if (newIndex >= studentsAttendance.length) {
        newIndex = 0;
      }
      setCurrentStudentIndex(newIndex);
    }
  }

  useEffect(() => {
    setCurrentStudent(studentsAttendance[currentStudentIndex]);
  }, [currentStudentIndex, studentsAttendance]);

  return (
    <section
      className={clsx(styles.container, open ? styles.open : styles.close)}
      onClick={onClose}
    >
      <Card className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={clsx(styles.flexRow, styles.studentInfoContainer)}>
          <div className={styles.studentInfo}>
            <Tag>{`${today.day}, ${today.date} ${today.month}`}</Tag>
            <h3>{currentStudent?.name}</h3>
            <p>{currentStudent?.rollID}</p>
          </div>
          <div className={styles.flexRow}>
            <Button
              shape="circle"
              icon={<ArrowLeftOutlined />}
              onClick={() => {
                handleClickNavigate("prev");
              }}
            />
            <Button
              shape="circle"
              icon={<ArrowRightOutlined />}
              onClick={() => {
                handleClickNavigate("next");
              }}
            />
          </div>
        </div>
        <div className={styles.actionBtns}>
          <Button
            type="default"
            onClick={handleClickAbsent}
            icon={<CloseOutlined />}
          >
            Absent
          </Button>
          <Button
            type="default"
            onClick={handleClickPresent}
            icon={<CheckOutlined />}
          >
            Present
          </Button>
        </div>
      </Card>
    </section>
  );
};

export default AddNewAttendance;
