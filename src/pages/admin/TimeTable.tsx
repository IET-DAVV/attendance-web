import React from "react";
import { Button, Table } from "antd";
import { ColumnType } from "antd/es/table";
import styles from "../../styles/admin.module.scss";
import { PlusOutlined } from "@ant-design/icons";

interface WeekdayRow {
  key: string;
  weekday: string;
  [timeSlot: string]: string;
}

const TimeTable: React.FC = () => {
  const dataSource: WeekdayRow[] = [
    { key: "Monday", weekday: "Monday" },
    { key: "Tuesday", weekday: "Tuesday" },
    { key: "Wednesday", weekday: "Wednesday" },
    { key: "Thursday", weekday: "Thursday" },
    { key: "Friday", weekday: "Friday" },
  ];

  const columns: ColumnType<WeekdayRow>[] = [
    {
      title: "Weekday",
      dataIndex: "weekday",
      key: "weekday",
      fixed: "left",
    },
  ];

  const timeSlots = Array.from({ length: 11 }, (_, i) => i + 7);
  timeSlots.forEach((time) => {
    const amPm = time >= 12 ? "PM" : "AM";
    const hour12 = time % 12 || 12;
    columns.push({
      title: `${hour12} - ${hour12 + 1} ${amPm}`,
      dataIndex: `${time}to${time + 1}`,
      key: `${time}to${time + 1}`,
    });
  });

  return (
    <div className={styles.main}>
      <div className={styles.flexRow}>
        <h3>Time Table</h3>
        <div className={styles.actionBtns}>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              //
            }}
          >
            Edit Time Table
          </Button>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <div className={styles.timeTable}>
          <Table
            bordered
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            scroll={{
              x: 1400,
              y: "100%",
            }}
            style={{
              height: "100%",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TimeTable;
