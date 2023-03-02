import Head from "next/head";
import { useEffect, useState } from "react";
import { attendanceServices, studentServices } from "@/utils/api/services";
const { getAllStudentsByYear } = studentServices;
import {
  getCurrentWeekDates,
  getDateDayMonthYear,
  getToday12AMDatetime,
  getTotalDaysCountInCurrentMonth,
} from "@/utils/functions";
import styles from "../styles/main.module.scss";
import { Button, DatePicker, Pagination, Select, Table, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import AddNewAttendance from "@/components/AddNewAttendance/AddNewAttendance";
const { RangePicker } = DatePicker;
const { Option } = Select;

// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  getCheckboxProps: (record: any) => ({
    disabled: record.name === "Disabled User", // Column configuration not to be checked
    name: record.name,
  }),
};

export default function Home() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [detainedStudents, setDetainedStudents] = useState([]);
  const [currentWeekAttendance, setCurrentWeekAttendance] = useState({});
  const [newAttendanceDrawer, setNewAttendanceDrawer] = useState(false);
  const [loading, setLoading] = useState(true);

  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setLoading(true);
    const fetchStudents = async () => {
      const { data } = await getAllStudentsByYear("2019");
      setStudents(data.data);
    };
    const fetchCurrentWeekAttendance = async () => {
      const dateRange = getCurrentWeekDates();
      const { data } =
        await attendanceServices.getStudentsAttendanceInDateRange(
          {
            startDate: dateRange[0].getTime(),
            endDate: dateRange[dateRange.length - 1].getTime(),
          },
          "CER4C3"
        );
      console.log(data.data);
      setCurrentWeekAttendance(data.data);
    };
    async function markAttendance() {
      await attendanceServices.markStudentAttendance(
        "CER4C3",
        getToday12AMDatetime().toString(),
        "DE19152",
        "present"
      );
    }
    fetchStudents();
    fetchCurrentWeekAttendance();
    setLoading(false);
    // markAttendance();
  }, []);

  useEffect(() => {
    let prevColumns = [
      {
        title: "Roll No.",
        dataIndex: "rollID",
        key: "rollID",
      },
      {
        title: "Enrollment No.",
        dataIndex: "uid",
        key: "uid",
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
    ];
    let newColumns: any = [
      ...prevColumns,
      ...getCurrentWeekDates().map((date) => {
        let ddmy = getDateDayMonthYear(date.getTime());
        let today = new Date().setHours(0, 0, 0, 0);
        return {
          title: `${ddmy.day} ${ddmy.date} ${ddmy.month}`,
          dataIndex: "attendance",
          key: "attendance",
          className: today === date.getTime() ? styles.today : "",
          render: (text: any) => {
            let attendanceStatus = text?.[date.getTime()];
            return (
              <span
                style={{
                  // backgroundColor:
                  //   today === date.getTime() ? "#d6e7ff" : "transparent",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Tag
                  color={
                    attendanceStatus === "Present"
                      ? "green"
                      : attendanceStatus === "Absent"
                      ? "red"
                      : "yellow"
                  }
                >
                  {text?.[date.getTime()] || "NA"}
                </Tag>
              </span>
            );
          },
        };
      }),
    ];
    setColumns(newColumns);
  }, []);

  console.log(columns);

  useEffect(() => {
    if (Object.values(currentWeekAttendance)?.length) {
      setStudents((prev: any) =>
        prev.map((student: any) => {
          let newAttendance = {};
          Object.values(currentWeekAttendance).forEach((attendance: any) => {
            if (attendance?.presentStudentsList?.includes(student.uid)) {
              newAttendance = {
                ...newAttendance,
                [attendance.attendanceDate]: "Present",
              };
            } else {
              newAttendance = {
                ...newAttendance,
                [attendance.attendanceDate]: "Absent",
              };
            }
          });
          return {
            ...student,
            attendance: newAttendance,
          };
        })
      );
    }
  }, [currentWeekAttendance]);

  useEffect(() => {
    console.log(students);
  }, [students]);

  return (
    <>
      <Head>
        <title>IET Attendance</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout className={styles.main}>
        <div className={styles.flexRow}>
          <h3>IET Attendance</h3>
          <div className={styles.actionBtns}>
            <div className={styles.datePicker}>
              <RangePicker format={"DD/MM/YYYY"} />
            </div>
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => setNewAttendanceDrawer(true)}
            >
              New Attendance
            </Button>
          </div>
        </div>
        <div className={styles.tableContainer}>
          <Table
            rowSelection={{
              type: "checkbox",
              ...rowSelection,
            }}
            columns={columns}
            dataSource={students}
          />
        </div>
        <AddNewAttendance
          open={newAttendanceDrawer}
          onClose={() => setNewAttendanceDrawer(false)}
        >
          <Table
            rowSelection={{
              type: "checkbox",
              ...rowSelection,
            }}
            columns={[
              ...columns?.filter((col: any) => col.title.includes("Name")),
              {
                title: "Attendance",
                dataIndex: "attendance",
                key: "attendance",
                render: (text: any) => {
                  return (
                    <Select defaultValue="Present">
                      <Option value="Present">Present</Option>
                      <Option value="Absent">Absent</Option>
                    </Select>
                  );
                },
              },
            ]}
            dataSource={students}
          />
        </AddNewAttendance>
      </MainLayout>
    </>
  );
}
