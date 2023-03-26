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
  handleClickAbsent: (student: IStudentAttendance) => void;
  handleClickPresent: (student: IStudentAttendance) => void;
}

const GridView: React.FC<Props> = ({
  today,
  students,
  handleClickAbsent,
  handleClickPresent,
}) => {
  return (
    <div className={styles.gridContainer}>
      {students.map((student, index) => (
        <div
          key={index}
          className={clsx(
            styles.gridViewCard,
            student.attendance?.[getToday12AMDatetime()] === "Absent"
              ? styles.absent
              : student.attendance?.[getToday12AMDatetime()] === "Present"
              ? styles.present
              : ""
          )}
          onClick={() => {
            if (student.attendance?.[getToday12AMDatetime()] === "Present") {
              handleClickAbsent(student);
            } else if (
              student.attendance?.[getToday12AMDatetime()] === "Absent"
            ) {
              handleClickPresent(student);
            } else {
              handleClickPresent(student);
            }
          }}
        >
          <span
            className={clsx(
              styles.statusIndicator,
              student.attendance?.[getToday12AMDatetime()] === "Absent"
                ? styles.absent
                : student.attendance?.[getToday12AMDatetime()] === "Present"
                ? styles.present
                : ""
            )}
          ></span>
          <div className={clsx(styles.flexRow, styles.studentInfoContainer)}>
            <div className={styles.studentInfo}>
              <h3>{student.name}</h3>
              <p>{student.rollID}</p>
              {student.attendance?.[getToday12AMDatetime()] && (
                <Tag
                  style={{ marginTop: "0.5rem" }}
                  color={
                    student.attendance?.[getToday12AMDatetime()] === "Absent"
                      ? "red"
                      : student.attendance?.[getToday12AMDatetime()] ===
                        "Present"
                      ? "green"
                      : ""
                  }
                >
                  {student.attendance?.[getToday12AMDatetime()]}
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
