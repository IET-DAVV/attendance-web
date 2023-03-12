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
}> = ({ open, onClose }) => {
  const today = getDateDayMonthYear(new Date());
  const [currentStudentIndex, setCurrentStudentIndex] = useState<number>(0);
  const [currentStudent, setCurrentStudent] =
    useState<IStudentAttendance | null>(null);

  const { studentsAttendance, setStudentsAttendance } = useGlobalContext();

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

  function handleClickAbsent() {
    setCurrentStudentIndex(getNewIndex("next"));
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
    setCurrentStudentIndex(getNewIndex("next"));
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
    setCurrentStudentIndex(getNewIndex(direction));
  }

  function currentStudentAtteandanceStatus() {
    return currentStudent?.attendance?.[getToday12AMDatetime()];
  }

  useEffect(() => {
    setCurrentStudent(studentsAttendance[currentStudentIndex]);
  }, [currentStudentIndex, studentsAttendance]);

  return (
    <section
      className={clsx(styles.container, open ? styles.open : styles.close)}
      onClick={onClose}
    >
      <div
        className={clsx(
          styles.card,
          currentStudentAtteandanceStatus() === "Absent"
            ? styles.absent
            : currentStudentAtteandanceStatus() === "Present"
            ? styles.present
            : ""
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <span
          className={clsx(
            styles.statusIndicator,
            currentStudentAtteandanceStatus() === "Absent"
              ? styles.absent
              : currentStudentAtteandanceStatus() === "Present"
              ? styles.present
              : ""
          )}
        ></span>
        <div className={clsx(styles.flexRow, styles.studentInfoContainer)}>
          <div className={styles.studentInfo}>
            <Tag>{`${today.day}, ${today.date} ${today.month}`}</Tag>
            <h3>{currentStudent?.name}</h3>
            <p>{currentStudent?.rollID}</p>
            {currentStudentAtteandanceStatus() && (
              <Tag
                style={{ marginTop: "0.5rem" }}
                color={
                  currentStudentAtteandanceStatus() === "Absent"
                    ? "red"
                    : currentStudentAtteandanceStatus() === "Present"
                    ? "green"
                    : ""
                }
              >
                {currentStudentAtteandanceStatus()}
              </Tag>
            )}
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
        <div
          className={clsx(
            styles.actionBtns,
            currentStudent?.attendance?.[getToday12AMDatetime()] === "Absent"
              ? styles.absent
              : currentStudent?.attendance?.[getToday12AMDatetime()] ===
                "Present"
              ? styles.present
              : ""
          )}
        >
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
      </div>
    </section>
  );
};

export default AddNewAttendance;
