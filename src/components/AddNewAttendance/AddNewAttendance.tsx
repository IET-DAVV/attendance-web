import { useGlobalContext } from "@/utils/context/GlobalContext";
import { getDateDayMonthYear } from "@/utils/functions";
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
  const [currentStudent, setCurrentStudent] =
    useState<IStudentAttendance | null>(null);

  const { studentsAttendance } = useGlobalContext();

  useEffect(() => {
    if (studentsAttendance.length > 0) {
      setCurrentStudent(studentsAttendance[0]);
    }
  }, [studentsAttendance]);

  return (
    <section
      className={clsx(styles.container, open ? styles.open : styles.close)}
      onClick={onClose}
    >
      <Card className={styles.card}>
        <div className={clsx(styles.flexRow, styles.studentInfoContainer)}>
          <div className={styles.studentInfo}>
            <Tag>{`${today.day}, ${today.date} ${today.month}`}</Tag>
            <h3>{currentStudent?.name}</h3>
            <p>{currentStudent?.rollID}</p>
          </div>
          <div className={styles.flexRow}>
            <Button shape="circle" icon={<ArrowLeftOutlined />} />
            <Button shape="circle" icon={<ArrowRightOutlined />} />
          </div>
        </div>
        <div className={styles.actionBtns}>
          <Button type="default" onClick={onClose} icon={<CloseOutlined />}>
            Absent
          </Button>
          <Button type="default" onClick={onClose} icon={<CheckOutlined />}>
            Present
          </Button>
        </div>
      </Card>
    </section>
  );
};

export default AddNewAttendance;
