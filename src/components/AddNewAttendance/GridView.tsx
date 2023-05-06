import { getToday12AMDatetime } from "@/utils/functions";
import { IStudentAttendance } from "@/utils/interfaces";
import { Button, Tag } from "antd";
import clsx from "clsx";
import styles from "./AddNewAttendance.module.scss";

interface Props {
  currentStudentAtteandanceStatus: () =>
    | "Absent"
    | "Present"
    | "NA"
    | undefined;
  today: {
    day: string;
    date: number;
    month: string;
  };
  students: IStudentAttendance[];
  date?: Date;
  handleClickAbsent: (student: IStudentAttendance) => void;
  handleClickPresent: (student: IStudentAttendance) => void;
}

const GridView: React.FC<Props> = ({
  today,
  students,
  handleClickAbsent,
  handleClickPresent,
  date,
}) => {
  const today12AMDateTime = getToday12AMDatetime(date);

  return (
    <div className={styles.gridContainer}>
      {students.map((student, index) => (
        <div
          key={index}
          className={clsx(
            styles.gridViewCard,
            student.attendance?.[today12AMDateTime] === "Absent"
              ? styles.absent
              : student.attendance?.[today12AMDateTime] === "Present"
              ? styles.present
              : ""
          )}
          onClick={() => {
            if (student.attendance?.[today12AMDateTime] === "Present") {
              handleClickAbsent(student);
            } else if (student.attendance?.[today12AMDateTime] === "Absent") {
              handleClickPresent(student);
            } else {
              handleClickPresent(student);
            }
          }}
        >
          <span
            className={clsx(
              styles.statusIndicator,
              student.attendance?.[today12AMDateTime] === "Absent"
                ? styles.absent
                : student.attendance?.[today12AMDateTime] === "Present"
                ? styles.present
                : ""
            )}
          ></span>
          <div className={clsx(styles.flexRow, styles.studentInfoContainer)}>
            <div className={styles.studentInfo}>
              <h3>{student.name}</h3>
              <p>{student.rollID}</p>
              {student.attendance?.[today12AMDateTime] && (
                <Tag
                  style={{ marginTop: "0.5rem" }}
                  color={
                    student.attendance?.[today12AMDateTime] === "Absent"
                      ? "red"
                      : student.attendance?.[today12AMDateTime] === "Present"
                      ? "green"
                      : ""
                  }
                >
                  {student.attendance?.[today12AMDateTime]}
                </Tag>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GridView;
