import Head from "next/head";
import { useEffect, useState } from "react";
import { attendanceServices, studentServices } from "@/utils/api/services";
import {
  getCurrentWeekDates,
  getDateDayMonthYear,
  getToday12AMDatetime,
  getTotalDaysCountInCurrentMonth,
} from "@/utils/functions";
import styles from "../styles/main.module.scss";
import {
  Button,
  DatePicker,
  Dropdown,
  MenuProps,
  Pagination,
  Select,
  Table,
  Tag,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  ExportOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import AddNewAttendance from "@/components/AddNewAttendance/AddNewAttendance";
import dayjs from "dayjs";
import { useGlobalContext } from "@/utils/context/GlobalContext";
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

const currentClassInfo = {
  year: "2021",
  branch: "CS",
  section: "B",
  semester: "4",
  subjectCode: "CER4C1",
};

export default function Home() {
  const [attendance, setAttendance] = useState([]);
  const [detainedStudents, setDetainedStudents] = useState([]);
  const [currentWeekAttendance, setCurrentWeekAttendance] = useState({});
  const [newAttendanceDrawer, setNewAttendanceDrawer] = useState(false);
  const [loading, setLoading] = useState(true);

  const [columns, setColumns] = useState([]);
  const { studentsAttendance, setStudentsAttendance } = useGlobalContext();

  useEffect(() => {
    setLoading(true);

    const fetchCurrentWeekAttendance = async () => {
      const dateRange = getCurrentWeekDates();
      const { data } =
        await attendanceServices.getStudentsAttendanceInDateRange(
          {
            startDate: dateRange[0].getTime(),
            endDate: dateRange[dateRange.length - 1].getTime(),
          },
          currentClassInfo.subjectCode
        );
      console.log(data.data);
      setCurrentWeekAttendance(data.data);
    };
    fetchCurrentWeekAttendance();
    setLoading(false);
    // markAttendance();
  }, []);

  async function markAttendanceMultiple() {
    await attendanceServices.markStudentAttendanceMultiple(
      currentClassInfo.subjectCode,
      getToday12AMDatetime().toString(),
      studentsAttendance?.map((student: any) => student.enrollmentID),
      "present"
    );
  }

  useEffect(() => {
    let prevColumns = [
      {
        title: "Roll No.",
        dataIndex: "rollID",
        key: "rollID",
      },
      {
        title: "Enroll No.",
        dataIndex: "enrollmentID",
        key: "enrollmentID",
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (text: string) => (
          <span
            style={{
              textTransform: "capitalize",
            }}
          >
            {text.toLowerCase()}
          </span>
        ),
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
                      : today === date.getTime()
                      ? "blue"
                      : ""
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
      setStudentsAttendance((prev: any) =>
        prev.map((student: any) => {
          let newAttendance = {};
          Object.values(currentWeekAttendance).forEach((attendance: any) => {
            if (
              attendance?.presentStudentsList?.includes(student.enrollmentID)
            ) {
              newAttendance = {
                ...newAttendance,
                [attendance.attendanceDate]: "Present",
              };
            } else if (
              attendance?.absentStudentsList?.includes(student.enrollmentID)
            ) {
              newAttendance = {
                ...newAttendance,
                [attendance.attendanceDate]: "Absent",
              };
            } else {
              newAttendance = {
                ...newAttendance,
                [attendance.attendanceDate]: "NA",
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

  const onMenuClick: MenuProps["onClick"] = (e) => {
    console.log("click", e);
  };

  // items arr for exporting and marking attendance
  const items = [
    {
      key: "1",
      label: "Export CSV",
      icon: <FileExcelOutlined />,
    },
    {
      key: "2",
      label: "Export PDF",
      icon: <FilePdfOutlined />,
    },
    {
      key: "3",
      label: "Mark Present",
      icon: <CheckOutlined />,
    },
    {
      key: "4",
      label: "Mark Absent",
      icon: <CloseOutlined />,
    },
  ];

  useEffect(() => {
    console.log({ studentsAttendance });
  }, [studentsAttendance]);

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
            <div>
              <Dropdown.Button menu={{ items, onClick: onMenuClick }}>
                Actions
              </Dropdown.Button>
            </div>
            <div className={styles.datePicker}>
              <RangePicker
                format={"DD/MM/YYYY"}
                defaultValue={[
                  dayjs(getCurrentWeekDates()[0]),
                  dayjs(getCurrentWeekDates()[6]),
                ]}
              />
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
            bordered
            rowSelection={{
              type: "checkbox",
              ...rowSelection,
            }}
            columns={columns}
            dataSource={studentsAttendance}
            scroll={{
              x: 1000,
              y: 500,
            }}
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
            dataSource={studentsAttendance}
          />
        </AddNewAttendance>
      </MainLayout>
    </>
  );
}
