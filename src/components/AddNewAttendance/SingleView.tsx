import { getToday12AMDatetime } from "@/utils/functions";
import { IStudentAttendance } from "@/utils/interfaces";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Button, Tag } from "antd";
import clsx from "clsx";
import styles from "./AddNewAttendance.module.scss";

interface Props {
  open: boolean;
  onClose: () => void;
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
  currentStudent: IStudentAttendance | null;
  currentStudentIndex: number;
  handleClickAbsent: () => void;
  handleClickPresent: () => void;
  handleClickNavigate: (direction: "prev" | "next") => void;
  getNewIndex: (direction: "prev" | "next") => number;
}

const SingleView: React.FC<Props> = ({
  open,
  onClose,
  currentStudentAtteandanceStatus,
  today,
  currentStudent,
  currentStudentIndex,
  handleClickAbsent,
  handleClickPresent,
  handleClickNavigate,
  getNewIndex,
}) => {
  return (
    <div className={styles.singleViewContainer}>
      <div
        className={clsx(
          styles.card,
          currentStudentAtteandanceStatus() === "Absent"
            ? styles.absent
            : currentStudentAtteandanceStatus() === "Present"
            ? styles.present
            : ""
        )}
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
    </div>
  );
};

export default SingleView;
